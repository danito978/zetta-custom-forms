import inputSchema from '../../../lib/input-schema.json';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateFormSchema = (schema: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if schema is an object
  if (!schema || typeof schema !== 'object') {
    errors.push('Schema must be an object');
    return { isValid: false, errors, warnings };
  }

  // Check if schema has fields property
  if (!schema.fields || typeof schema.fields !== 'object') {
    errors.push('Schema must have a "fields" object containing field definitions');
    return { isValid: false, errors, warnings };
  }

  // Validate each field against input schema
  const fields = schema.fields;
  const fieldNames = Object.keys(fields);

  if (fieldNames.length === 0) {
    warnings.push('Schema has no fields defined');
  }

  fieldNames.forEach(fieldName => {
    const field = fields[fieldName];
    const fieldErrors = validateField(field, fieldName);
    errors.push(...fieldErrors);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

const validateField = (field: any, fieldName: string): string[] => {
  const errors: string[] = [];

  // Check required properties (hardcoded since they're not in the JSON schema structure)
  const requiredProps = ['id', 'name', 'type'];
  requiredProps.forEach((prop: string) => {
    if (!field.hasOwnProperty(prop)) {
      errors.push(`Field "${fieldName}" is missing required property: ${prop}`);
    }
  });

  // Validate field type
  if (field.type) {
    const validTypes = (inputSchema.properties.type as any).enum;
    if (!validTypes.includes(field.type)) {
      errors.push(`Field "${fieldName}" has invalid type: ${field.type}. Valid types: ${validTypes.join(', ')}`);
    }
  }

  // Validate validation object if present
  if (field.validation && typeof field.validation === 'object') {
    const validationErrors = validateFieldValidation(field.validation, fieldName);
    errors.push(...validationErrors);
  }

  // Validate required fields have proper structure
  if (field.required !== undefined && typeof field.required !== 'boolean') {
    errors.push(`Field "${fieldName}" required property must be a boolean`);
  }

  if (field.disabled !== undefined && typeof field.disabled !== 'boolean') {
    errors.push(`Field "${fieldName}" disabled property must be a boolean`);
  }

  return errors;
};

const validateFieldValidation = (validation: any, fieldName: string): string[] => {
  const errors: string[] = [];
  const validationProps = (inputSchema.properties.validation as any).properties;

  Object.keys(validation).forEach((key: string) => {
    if (!validationProps.hasOwnProperty(key)) {
      errors.push(`Field "${fieldName}" has invalid validation property: ${key}`);
      return;
    }

    const value = validation[key];
    const propSchema = validationProps[key] as any;

    // Type checking based on schema
    if (key === 'min' || key === 'max' || key === 'minLength' || key === 'maxLength') {
      if (typeof value !== 'number') {
        errors.push(`Field "${fieldName}" validation.${key} must be a number`);
      }
    }

    if (key === 'pattern' || key === 'custom') {
      if (typeof value !== 'string') {
        errors.push(`Field "${fieldName}" validation.${key} must be a string`);
      }
    }

    if (key === 'format') {
      const validFormats = propSchema.enum as string[];
      if (!validFormats.includes(value)) {
        errors.push(`Field "${fieldName}" validation.format has invalid value: ${value}. Valid formats: ${validFormats.join(', ')}`);
      }
    }

    if (key === 'messages' && typeof value === 'object') {
      const messageProps = propSchema.properties as any;
      Object.keys(value).forEach((msgKey: string) => {
        if (!messageProps.hasOwnProperty(msgKey)) {
          errors.push(`Field "${fieldName}" validation.messages has invalid property: ${msgKey}`);
        } else if (typeof value[msgKey] !== 'string') {
          errors.push(`Field "${fieldName}" validation.messages.${msgKey} must be a string`);
        }
      });
    }
  });

  return errors;
};

export const isValidJSON = (text: string): { valid: boolean; error?: string } => {
  try {
    JSON.parse(text);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON format' 
    };
  }
};
