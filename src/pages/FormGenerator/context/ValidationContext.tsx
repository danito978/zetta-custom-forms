import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { InputField } from '../../../types/input';
import { validateFieldWithDynamicRules } from '../utils/dynamicValidationEvaluator';
import { getVisibleFields } from '../utils/visibilityEvaluator';

// Types
export interface ValidationError {
  message: string;
  type: 'required' | 'format' | 'length' | 'range' | 'pattern' | 'custom' | 'api';
  timestamp: number;
}

export interface ValidationContextType {
  // State
  errors: Record<string, ValidationError | null>;
  touched: Record<string, boolean>;
  isValidating: Record<string, boolean>;
  isFormValid: boolean;
  
  // Actions
  validateField: (fieldPath: string, value: any, field: InputField, formValues: Record<string, any>) => Promise<ValidationError | null>;
  setFieldTouched: (fieldPath: string, touched?: boolean) => void;
  setFieldError: (fieldPath: string, error: ValidationError | null) => void;
  clearFieldError: (fieldPath: string) => void;
  clearAllErrors: () => void;
  validateAllFields: (schema: Record<string, InputField>, formValues: Record<string, any>) => Promise<boolean>;
  
  // Utilities
  getFieldError: (fieldPath: string) => ValidationError | null;
  isFieldTouched: (fieldPath: string) => boolean;
  isFieldValidating: (fieldPath: string) => boolean;
  hasErrors: () => boolean;
}

// Create the context
const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

// Custom hook to use the ValidationContext
export const useValidationContext = (): ValidationContextType => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidationContext must be used within a ValidationProvider');
  }
  return context;
};

// Provider component props
interface ValidationProviderProps {
  children: ReactNode;
  onValidationChange?: (isValid: boolean, errors: Record<string, ValidationError | null>) => void;
  realTimeValidation?: boolean; // Enable real-time validation as user types
  debounceMs?: number; // Debounce delay for real-time validation
}

// Provider component
export const ValidationProvider: React.FC<ValidationProviderProps> = ({ 
  children, 
  onValidationChange,
  realTimeValidation = true,
  debounceMs = 300
}) => {
  const [errors, setErrors] = useState<Record<string, ValidationError | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({});
  const [debounceTimers, setDebounceTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Calculate if form is valid
  const isFormValid = Object.values(errors).every(error => error === null);

  // Notify parent of validation changes
  useEffect(() => {
    onValidationChange?.(isFormValid, errors);
  }, [isFormValid, errors, onValidationChange]);

  // Clear debounce timer for a field
  const clearDebounceTimer = useCallback((fieldPath: string) => {
    if (debounceTimers[fieldPath]) {
      clearTimeout(debounceTimers[fieldPath]);
      setDebounceTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[fieldPath];
        return newTimers;
      });
    }
  }, [debounceTimers]);

  // Validate a single field
  const validateField = useCallback(async (
    fieldPath: string, 
    value: any, 
    field: InputField, 
    formValues: Record<string, any>
  ): Promise<ValidationError | null> => {
    // Clear any existing debounce timer
    clearDebounceTimer(fieldPath);

    // Set validating state
    setIsValidating(prev => ({ ...prev, [fieldPath]: true }));

    try {
      // Use existing validation logic
      const errorMessage = validateFieldWithDynamicRules(value, field.validation, formValues, field.required);
      
      let validationError: ValidationError | null = null;
      
      if (errorMessage) {
        // Determine error type based on the message content
        let errorType: ValidationError['type'] = 'custom';
        
        if (errorMessage.toLowerCase().includes('required')) {
          errorType = 'required';
        } else if (errorMessage.toLowerCase().includes('format') || errorMessage.toLowerCase().includes('pattern')) {
          errorType = 'format';
        } else if (errorMessage.toLowerCase().includes('length') || errorMessage.toLowerCase().includes('characters')) {
          errorType = 'length';
        } else if (errorMessage.toLowerCase().includes('range') || errorMessage.toLowerCase().includes('between')) {
          errorType = 'range';
        }
        
        validationError = {
          message: errorMessage,
          type: errorType,
          timestamp: Date.now()
        };
      }

      // Update error state
      setErrors(prev => ({ ...prev, [fieldPath]: validationError }));
      
      return validationError;
    } catch (error) {
      const validationError: ValidationError = {
        message: 'Validation failed',
        type: 'custom',
        timestamp: Date.now()
      };
      
      setErrors(prev => ({ ...prev, [fieldPath]: validationError }));
      return validationError;
    } finally {
      // Clear validating state
      setIsValidating(prev => ({ ...prev, [fieldPath]: false }));
    }
  }, [clearDebounceTimer]);

  // Note: Debounced validation is handled directly in validateField with clearDebounceTimer

  // Set field as touched
  const setFieldTouched = useCallback((fieldPath: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [fieldPath]: isTouched }));
  }, []);

  // Set field error manually
  const setFieldError = useCallback((fieldPath: string, error: ValidationError | null) => {
    setErrors(prev => ({ ...prev, [fieldPath]: error }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((fieldPath: string) => {
    setErrors(prev => ({ ...prev, [fieldPath]: null }));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouched({});
    setIsValidating({});
    // Clear all debounce timers
    Object.values(debounceTimers).forEach(timer => clearTimeout(timer));
    setDebounceTimers({});
  }, [debounceTimers]);

  // Validate all fields in a schema
  const validateAllFields = useCallback(async (
    schema: Record<string, InputField>, 
    formValues: Record<string, any>
  ): Promise<boolean> => {
    // IMPORTANT: Only validate visible fields, just like the legacy validation
    const visibleFields = getVisibleFields(schema, formValues);
    
    const validationPromises: Promise<ValidationError | null>[] = [];
    const fieldPaths: string[] = [];

    // Recursively collect all field paths from VISIBLE fields only
    const collectFieldPaths = (fields: Record<string, InputField>, prefix: string = '') => {
      Object.entries(fields).forEach(([key, field]) => {
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        
        if (field.type === 'group' && field.fields) {
          collectFieldPaths(field.fields, fieldPath);
        } else {
          fieldPaths.push(fieldPath);
          
          // Get field value using dot notation
          const fieldValue = fieldPath.split('.').reduce((obj, path) => obj?.[path], formValues);
          
          validationPromises.push(validateField(fieldPath, fieldValue, field, formValues));
        }
      });
    };

    collectFieldPaths(visibleFields); // Use visibleFields instead of schema

    // Wait for all validations to complete
    const results = await Promise.all(validationPromises);
    
    // Mark all fields as touched
    fieldPaths.forEach(path => setFieldTouched(path, true));

    // Return true if no errors
    return results.every(error => error === null);
  }, [validateField, setFieldTouched]);

  // Utility functions
  const getFieldError = useCallback((fieldPath: string): ValidationError | null => {
    return errors[fieldPath] || null;
  }, [errors]);

  const isFieldTouched = useCallback((fieldPath: string): boolean => {
    return touched[fieldPath] || false;
  }, [touched]);

  const isFieldValidating = useCallback((fieldPath: string): boolean => {
    return isValidating[fieldPath] || false;
  }, [isValidating]);

  const hasErrors = useCallback((): boolean => {
    return Object.values(errors).some(error => error !== null);
  }, [errors]);

  const contextValue: ValidationContextType = {
    // State
    errors,
    touched,
    isValidating,
    isFormValid,
    
    // Actions
    validateField,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    validateAllFields,
    
    // Utilities
    getFieldError,
    isFieldTouched,
    isFieldValidating,
    hasErrors
  };

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  );
};

export default ValidationContext;
