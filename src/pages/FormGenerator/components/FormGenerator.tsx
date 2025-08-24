import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DynamicField from './DynamicField';
import { InputField } from '../../../types/input';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { getVisibleFields } from '../utils/visibilityEvaluator';
import { validateFieldWithDynamicRules } from '../utils/dynamicValidationEvaluator';

interface FormGeneratorProps {
  schema: any;
  onSubmit?: (values: Record<string, any>) => void;
}

const FormGenerator = ({ schema, onSubmit }: FormGeneratorProps) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Extract visible fields from schema based on current form values
  const visibleFields = useMemo(() => {
    if (!schema?.fields) return {};
    return getVisibleFields(schema.fields, formValues);
  }, [schema?.fields, formValues]);

  // Convert visible fields to array format for rendering
  const fields = useMemo(() => {
    return Object.entries(visibleFields).map(([key, fieldData]: [string, any]) => ({
      ...fieldData,
      id: fieldData.id || key,
      name: fieldData.name || key,
    }));
  }, [visibleFields]);

  // Reset form errors when schema changes and re-validate existing values
  useEffect(() => {
    if (!schema) return;
    
    // Clear all errors and touched states when schema changes
    setErrors({});
    setTouched({});
    
    // Create a timeout to re-validate after state updates
    const timeoutId = setTimeout(() => {
      const currentVisibleFields = getVisibleFields(schema.fields || {}, formValues);
      const currentFields = Object.entries(currentVisibleFields).map(([key, fieldData]: [string, any]) => ({
        ...fieldData,
        id: fieldData.id || key,
        name: fieldData.name || key,
      }));
      
      const newErrors: Record<string, string> = {};
      currentFields.forEach(field => {
        const currentValue = formValues[field.name];
        if (currentValue !== undefined && currentValue !== '') {
          // Inline validation to avoid dependency issues
          if (!field.validation) return;
          
          const validation = field.validation;
          let error: string | null = null;
          
          // Required validation
          if (field.required && (!currentValue || (typeof currentValue === 'string' && !currentValue.trim()))) {
            error = validation.messages?.required || `${field.label || field.name} is required`;
          }
          
          // String length validations
          if (!error && typeof currentValue === 'string' && currentValue.trim()) {
            if (validation.minLength && currentValue.length < validation.minLength) {
              error = validation.messages?.minLength || `Must be at least ${validation.minLength} characters`;
            }
            if (!error && validation.maxLength && currentValue.length > validation.maxLength) {
              error = validation.messages?.maxLength || `Cannot exceed ${validation.maxLength} characters`;
            }
            
            // Pattern validation
            if (!error && validation.pattern) {
              const regex = new RegExp(validation.pattern);
              if (!regex.test(currentValue)) {
                error = validation.messages?.pattern || 'Invalid format';
              }
            }
            
            // Format validation
            if (!error && validation.format) {
              let isValid = true;
              switch (validation.format) {
                case 'email':
                  isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValue);
                  break;
                case 'url':
                  try {
                    new URL(currentValue);
                  } catch {
                    isValid = false;
                  }
                  break;
                case 'phone':
                  isValid = /^[+]?[1-9][\d]{0,15}$/.test(currentValue.replace(/[\s\-()]/g, ''));
                  break;
                default:
                  break;
              }
              if (!isValid) {
                error = validation.messages?.format || `Invalid ${validation.format} format`;
              }
            }
          }
          
          if (error) {
            newErrors[field.name] = error;
          }
        }
      });
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [schema, formValues]); // Include formValues to re-validate when values change

  const validateField = useCallback((field: InputField, value: any): string | null => {
    // Create updated form values that include the current field's value for validation context
    const updatedFormValues = { ...formValues, [field.name]: value };
    
    // Use dynamic validation that considers conditional rules
    return validateFieldWithDynamicRules(value, field.validation, updatedFormValues, field.required);
  }, [formValues]);

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  }, [errors]);

  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, formValues[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
    }
  }, [fields, formValues, validateField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, formValues[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}));

    if (!hasErrors) {
      onSubmit?.(formValues);
    }
  };

  const handleReset = () => {
    setFormValues({});
    setErrors({});
    setTouched({});
  };

  // Handle auto-fill from API integration
  const handleAutoFill = useCallback((fieldUpdates: Record<string, any>) => {
    setFormValues(prevValues => {
      const newValues = { ...prevValues };
      
      // Apply field updates using dot notation for nested fields
      Object.entries(fieldUpdates).forEach(([fieldPath, value]) => {
        const pathParts = fieldPath.split('.');
        let current = newValues;
        
        // Navigate to the parent object
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
          }
          current = current[part];
        }
        
        // Set the final value
        const finalKey = pathParts[pathParts.length - 1];
        current[finalKey] = value;
      });
      
      return newValues;
    });
  }, []);

  if (!schema || !fields.length) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No valid form schema provided</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{schema.title || 'Generated Form'}</CardTitle>
        {schema.description && (
          <CardDescription>{schema.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <DynamicField
            key={field.id}
            field={field}
            value={formValues[field.name]}
            error={touched[field.name] ? errors[field.name] : undefined}
            onChange={(value: any) => handleFieldChange(field.name, value)}
            onBlur={() => handleFieldBlur(field.name)}
            formValues={formValues}
            onAutoFill={handleAutoFill}
          />
        ))}

        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <Button 
            type="submit" 
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-2 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submit Form
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="border-warning-300 text-warning-700 hover:bg-warning-50 hover:border-warning-400 font-medium px-6 py-2 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Form
          </Button>
        </div>
              </form>

        {/* Form Values Debug (optional) */}
        {Object.keys(formValues).length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg border">
            <h4 className="text-sm font-medium mb-2">Form Values:</h4>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {JSON.stringify(formValues, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormGenerator;
