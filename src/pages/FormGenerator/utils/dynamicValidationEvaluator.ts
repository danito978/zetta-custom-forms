import { InputValidation, ConditionalValidationRule, ValidationFormat } from '../../../types/input';
import { evaluateVisibilityCondition } from './visibilityEvaluator';

/**
 * Evaluates conditional validation rules and returns the merged validation object
 */
export const evaluateDynamicValidation = (
  baseValidation: InputValidation | undefined,
  formValues: Record<string, any>
): InputValidation => {
  // Start with base validation rules
  const mergedValidation: InputValidation = { ...baseValidation };

  // If no conditional rules, return base validation
  if (!baseValidation?.conditionalRules || baseValidation.conditionalRules.length === 0) {
    return mergedValidation;
  }

  // Evaluate each conditional rule
  baseValidation.conditionalRules.forEach(rule => {
    // Convert the condition to visibility condition format for reuse
    const visibilityCondition = {
      field: rule.condition.field,
      operator: rule.condition.operator,
      value: rule.condition.value
    };

    // Check if the condition is met
    const conditionMet = evaluateVisibilityCondition(visibilityCondition, formValues);

    if (conditionMet) {
      // Merge the conditional validation rules
      Object.assign(mergedValidation, rule.validation);
      
      // Merge messages if they exist
      if (rule.validation.messages) {
        mergedValidation.messages = {
          ...mergedValidation.messages,
          ...rule.validation.messages
        };
      }
    }
  });

  return mergedValidation;
};

/**
 * Validates a field value against dynamic validation rules
 */
export const validateFieldWithDynamicRules = (
  value: any,
  fieldValidation: InputValidation | undefined,
  formValues: Record<string, any>,
  isRequired: boolean = false
): string | null => {
  // Get the dynamic validation rules
  const validation = evaluateDynamicValidation(fieldValidation, formValues);

  // Check if field is required (base required or conditionally required)
  let fieldRequired = isRequired;
  
  // Check if any conditional rules make this field required
  if (fieldValidation?.conditionalRules) {
    fieldValidation.conditionalRules.forEach(rule => {
      const visibilityCondition = {
        field: rule.condition.field,
        operator: rule.condition.operator,
        value: rule.condition.value
      };
      
      const conditionMet = evaluateVisibilityCondition(visibilityCondition, formValues);
      if (conditionMet && rule.validation.required) {
        fieldRequired = true;
      }
    });
  }
  
  if (fieldRequired && (value === undefined || value === null || value === '')) {
    return validation.messages?.required || 'This field is required';
  }

  // Skip validation if field is empty and not required
  if (value === undefined || value === null || value === '') {
    return null;
  }

  // String length validations
  if (typeof value === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      return validation.messages?.minLength || `Must be at least ${validation.minLength} characters`;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return validation.messages?.maxLength || `Cannot exceed ${validation.maxLength} characters`;
    }
  }

  // Numeric validations
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
    const numValue = Number(value);
    if (validation.min !== undefined && numValue < validation.min) {
      return validation.messages?.min || `Must be at least ${validation.min}`;
    }
    if (validation.max !== undefined && numValue > validation.max) {
      return validation.messages?.max || `Cannot exceed ${validation.max}`;
    }
  }

  // Pattern validation
  if (validation.pattern && typeof value === 'string') {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(value)) {
      return validation.messages?.pattern || 'Invalid format';
    }
  }

  // Format validation
  if (validation.format && typeof value === 'string') {
    const formatError = validateFormat(value, validation.format);
    if (formatError) {
      return validation.messages?.format || formatError;
    }
  }

  // Custom validation (placeholder for future implementation)
  if (validation.custom) {
    // This could be extended to support custom validation functions
    console.warn('Custom validation not yet implemented:', validation.custom);
  }

  return null;
};

/**
 * Validates value against predefined formats
 */
const validateFormat = (value: string, format: ValidationFormat): string | null => {
  switch (format) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : 'Invalid email format';
    
    case 'url':
      try {
        new URL(value);
        return null;
      } catch {
        return 'Invalid URL format';
      }
    
    case 'phone':
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) ? null : 'Invalid phone number';
    
    case 'date':
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) return 'Invalid date format (YYYY-MM-DD)';
      const date = new Date(value);
      return date.toISOString().split('T')[0] === value ? null : 'Invalid date';
    
    case 'time':
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(value) ? null : 'Invalid time format (HH:MM)';
    
    case 'datetime':
      const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      return datetimeRegex.test(value) ? null : 'Invalid datetime format (YYYY-MM-DDTHH:MM)';
    
    case 'postal-code':
      // Generic postal code validation (can be extended for specific countries)
      const postalRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
      return postalRegex.test(value) ? null : 'Invalid postal code';
    
    case 'credit-card':
      // Basic credit card validation (Luhn algorithm could be added)
      const ccRegex = /^[0-9]{13,19}$/;
      const cleanValue = value.replace(/[\s\-]/g, '');
      return ccRegex.test(cleanValue) ? null : 'Invalid credit card number';
    
    default:
      return null;
  }
};

/**
 * Gets the effective validation rules for a field (including conditional rules)
 */
export const getEffectiveValidation = (
  fieldValidation: InputValidation | undefined,
  formValues: Record<string, any>
): InputValidation => {
  return evaluateDynamicValidation(fieldValidation, formValues);
};

/**
 * Checks if a field has any conditional validation rules
 */
export const hasConditionalValidation = (validation: InputValidation | undefined): boolean => {
  return !!(validation?.conditionalRules && validation.conditionalRules.length > 0);
};
