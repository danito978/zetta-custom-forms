import { VisibilityCondition, VisibilityConditionRule, VisibilityOperator } from '../../../types/input';

/**
 * Evaluates a single visibility condition rule
 */
const evaluateRule = (rule: VisibilityConditionRule, formValues: Record<string, any>): boolean => {
  const { field, operator, value } = rule;
  const fieldValue = getNestedValue(formValues, field);

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    
    case 'not_equals':
      return fieldValue !== value;
    
    case 'contains':
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        return fieldValue.includes(value);
      }
      if (Array.isArray(fieldValue) && value !== undefined) {
        return fieldValue.includes(value);
      }
      return false;
    
    case 'not_contains':
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        return !fieldValue.includes(value);
      }
      if (Array.isArray(fieldValue) && value !== undefined) {
        return !fieldValue.includes(value);
      }
      return true;
    
    case 'in':
      if (Array.isArray(value)) {
        return value.includes(fieldValue);
      }
      return false;
    
    case 'not_in':
      if (Array.isArray(value)) {
        return !value.includes(fieldValue);
      }
      return true;
    
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    
    case 'not_exists':
      return fieldValue === undefined || fieldValue === null || fieldValue === '';
    
    default:
      return false;
  }
};

/**
 * Gets a nested value from an object using dot notation
 * e.g., getNestedValue({user: {name: 'John'}}, 'user.name') returns 'John'
 */
const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Evaluates a visibility condition against form values
 */
export const evaluateVisibilityCondition = (
  condition: VisibilityCondition,
  formValues: Record<string, any>
): boolean => {
  // If no condition is provided, field is visible by default
  if (!condition) {
    return true;
  }

  // Handle single condition (legacy format)
  if (condition.field && condition.operator) {
    const rule: VisibilityConditionRule = {
      field: condition.field,
      operator: condition.operator,
      value: condition.value
    };
    return evaluateRule(rule, formValues);
  }

  // Handle multiple conditions
  if (condition.conditions && condition.conditions.length > 0) {
    const logic = condition.logic || 'and';
    const results = condition.conditions.map(rule => evaluateRule(rule, formValues));

    if (logic === 'or') {
      return results.some(result => result);
    } else {
      return results.every(result => result);
    }
  }

  // Default to visible if no valid condition
  return true;
};

/**
 * Evaluates visibility for all fields in a form schema
 * Returns a map of field names to their visibility status
 */
export const evaluateFormVisibility = (
  fields: Record<string, any>,
  formValues: Record<string, any>
): Record<string, boolean> => {
  const visibilityMap: Record<string, boolean> = {};

  const evaluateFieldsRecursively = (fieldsObj: Record<string, any>, prefix = '') => {
    Object.entries(fieldsObj).forEach(([fieldName, field]) => {
      const fullFieldName = prefix ? `${prefix}.${fieldName}` : fieldName;
      
      // Evaluate visibility for this field
      const isVisible = evaluateVisibilityCondition(field.visibilityCondition, formValues);
      visibilityMap[fullFieldName] = isVisible;

      // If this field is a group with nested fields, evaluate them recursively
      if (field.type === 'group' && field.fields) {
        evaluateFieldsRecursively(field.fields, fullFieldName);
      }
    });
  };

  evaluateFieldsRecursively(fields);
  return visibilityMap;
};

/**
 * Filters visible fields from a fields object based on current form values
 */
export const getVisibleFields = (
  fields: Record<string, any>,
  formValues: Record<string, any>
): Record<string, any> => {
  const visibleFields: Record<string, any> = {};

  Object.entries(fields).forEach(([fieldName, field]) => {
    const isVisible = evaluateVisibilityCondition(field.visibilityCondition, formValues);
    
    if (isVisible) {
      // If it's a group, recursively filter its nested fields
      if (field.type === 'group' && field.fields) {
        visibleFields[fieldName] = {
          ...field,
          fields: getVisibleFields(field.fields, formValues)
        };
      } else {
        visibleFields[fieldName] = field;
      }
    }
  });

  return visibleFields;
};
