import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface FormContextType {
  // State
  formValues: Record<string, any>;
  
  // Actions
  updateField: (path: string, value: any) => void;
  getFieldValue: (path: string) => any;
  resetForm: () => void;
  setFormValues: (values: Record<string, any>) => void;
  
  // Auto-fill support
  autoFillFields: (updates: Record<string, any>) => void;
}

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Custom hook to use the FormContext
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// Provider component props
interface FormProviderProps {
  children: ReactNode;
  initialValues?: Record<string, any>;
  onValuesChange?: (values: Record<string, any>) => void;
}

// Provider component
export const FormProvider: React.FC<FormProviderProps> = ({ 
  children, 
  initialValues = {},
  onValuesChange 
}) => {
  const [formValues, setFormValuesState] = useState<Record<string, any>>(initialValues);

  // Helper function to set nested values using dot notation
  const setNestedValue = (obj: Record<string, any>, path: string, value: any): Record<string, any> => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;

    // Navigate to the parent object
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      } else {
        current[key] = { ...current[key] };
      }
      current = current[key];
    }

    // Set the final value
    const finalKey = keys[keys.length - 1];
    current[finalKey] = value;

    return result;
  };

  // Helper function to get nested values using dot notation
  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = current[key];
    }

    return current;
  };

  // Update a field value by path
  const updateField = useCallback((path: string, value: any) => {
    setFormValuesState(prevValues => {
      const newValues = setNestedValue(prevValues, path, value);
      onValuesChange?.(newValues);
      return newValues;
    });
  }, [onValuesChange]);

  // Get a field value by path
  const getFieldValue = useCallback((path: string): any => {
    return getNestedValue(formValues, path);
  }, [formValues]);

  // Reset the form
  const resetForm = useCallback(() => {
    setFormValuesState(initialValues);
    onValuesChange?.(initialValues);
  }, [initialValues, onValuesChange]);

  // Set all form values at once
  const setFormValues = useCallback((values: Record<string, any>) => {
    setFormValuesState(values);
    onValuesChange?.(values);
  }, [onValuesChange]);

  // Auto-fill multiple fields
  const autoFillFields = useCallback((updates: Record<string, any>) => {
    setFormValuesState(prevValues => {
      let newValues = { ...prevValues };
      
      // Apply each update using dot notation
      Object.entries(updates).forEach(([fieldPath, value]) => {
        newValues = setNestedValue(newValues, fieldPath, value);
      });
      
      onValuesChange?.(newValues);
      return newValues;
    });
  }, [onValuesChange]);

  const contextValue: FormContextType = {
    formValues,
    updateField,
    getFieldValue,
    resetForm,
    setFormValues,
    autoFillFields
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
