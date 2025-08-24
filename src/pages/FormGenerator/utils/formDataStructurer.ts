import { InputField } from '../../../types/input';
import { getVisibleFields } from './visibilityEvaluator';

/**
 * Converts flat form values to structured JSON that mirrors the form schema hierarchy
 * Excludes hidden fields based on visibility conditions
 */
export const structureFormData = (
  schema: Record<string, InputField>,
  formValues: Record<string, any>
): Record<string, any> => {
  // Get only visible fields
  const visibleFields = getVisibleFields(schema, formValues);
  
  return buildStructuredData(visibleFields, formValues);
};

/**
 * Recursively builds structured data from visible fields
 */
const buildStructuredData = (
  fields: Record<string, InputField>,
  formValues: Record<string, any>,
  parentPath: string = ''
): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.entries(fields).forEach(([fieldName, field]) => {
    const currentPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
    
    if (field.type === 'group' && field.fields) {
      // For groups, recursively structure nested fields
      const groupValue = formValues[fieldName] || {};
      result[fieldName] = buildStructuredData(field.fields, groupValue, currentPath);
    } else {
      // For regular fields, get the value and preserve its type
      const value = formValues[fieldName];
      result[fieldName] = formatFieldValue(value, field);
    }
  });

  return result;
};

/**
 * Formats field value based on field type, preserving data types
 */
const formatFieldValue = (value: any, field: InputField): any => {
  // Return value as-is, preserving null, undefined, empty strings
  // Numbers stay as numbers, dates stay as input strings, etc.
  
  if (value === undefined) {
    return null;
  }
  
  // Special handling for specific field types if needed
  switch (field.type) {
    case 'number':
      // Keep numbers as numbers, but handle empty strings
      if (value === '' || value === null) return null;
      return typeof value === 'number' ? value : parseFloat(value) || null;
      
    case 'checkbox':
      // Handle checkbox arrays and single checkboxes
      if (field.options && Array.isArray(field.options)) {
        // Multiple checkboxes - return array
        return Array.isArray(value) ? value : [];
      } else {
        // Single checkbox - return boolean
        return Boolean(value);
      }
      
    default:
      // For text, email, select, radio, etc. - return as-is
      return value;
  }
};

/**
 * Validates that all required visible fields have values
 */
export const validateRequiredFields = (
  schema: Record<string, InputField>,
  formValues: Record<string, any>
): { isValid: boolean; missingFields: string[] } => {
  const visibleFields = getVisibleFields(schema, formValues);
  const missingFields: string[] = [];
  
  const checkRequiredFields = (
    fields: Record<string, InputField>,
    values: Record<string, any>,
    parentPath: string = ''
  ) => {
    Object.entries(fields).forEach(([fieldName, field]) => {
      const currentPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
      
      if (field.type === 'group' && field.fields) {
        // Check nested group fields
        const groupValue = values[fieldName] || {};
        checkRequiredFields(field.fields, groupValue, currentPath);
      } else if (field.required) {
        // Check if required field has a value
        const value = values[fieldName];
        if (value === null || value === undefined || value === '' || 
            (Array.isArray(value) && value.length === 0)) {
          missingFields.push(currentPath);
        }
      }
    });
  };
  
  checkRequiredFields(visibleFields, formValues);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
