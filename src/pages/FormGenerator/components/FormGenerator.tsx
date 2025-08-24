import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DynamicField from './DynamicField';
import { InputField } from '../../../types/input';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { getVisibleFields } from '../utils/visibilityEvaluator';
import { validateFieldWithDynamicRules } from '../utils/dynamicValidationEvaluator';
import { structureFormData, validateRequiredFields } from '../utils/formDataStructurer';
import { FormProvider, useFormContext } from '../context/FormContext';

interface FormGeneratorProps {
  schema: any;
  onSubmit?: (values: Record<string, any>) => void;
}

// Internal component that uses FormContext
const FormGeneratorInternal = ({ schema, onSubmit }: FormGeneratorProps) => {
  const { formValues, setFormValues, updateField, resetForm, autoFillFields } = useFormContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    updateField(fieldName, value);
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  }, [updateField, errors]);

  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, formValues[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
    }
  }, [fields, formValues, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset submission status
    setSubmitStatus('idle');
    setIsSubmitting(true);
    
    try {
      // Validate all visible fields
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

      // Check if all required fields are valid using the new validator
      const requiredValidation = validateRequiredFields(schema.fields || {}, formValues);
      
      if (!hasErrors && requiredValidation.isValid) {
        // Structure the form data to mirror schema hierarchy, excluding hidden fields
        const structuredData = structureFormData(schema.fields || {}, formValues);
        
        // Call onSubmit and handle potential async operations
        await onSubmit?.(structuredData);
        
        setSubmitStatus('success');
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSubmitStatus('idle'), 3000);
        
      } else if (!requiredValidation.isValid) {
        // Mark missing required fields as touched and show errors
        const missingFieldErrors: Record<string, string> = {};
        requiredValidation.missingFields.forEach(fieldPath => {
          missingFieldErrors[fieldPath] = 'This field is required';
        });
        
        setErrors(prev => ({ ...prev, ...missingFieldErrors }));
        
        // Mark missing fields as touched
        const touchedUpdates: Record<string, boolean> = {};
        requiredValidation.missingFields.forEach(fieldPath => {
          touchedUpdates[fieldPath] = true;
        });
        setTouched(prev => ({ ...prev, ...touchedUpdates }));
        
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    resetForm();
    setErrors({});
    setTouched({});
    setSubmitStatus('idle');
    setIsSubmitting(false);
  };

  // Handle auto-fill from API integration
  const handleAutoFill = useCallback((fieldUpdates: Record<string, any>) => {
    autoFillFields(fieldUpdates);
  }, [autoFillFields]);

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
            error={touched[field.name] ? errors[field.name] : undefined}
            onBlur={() => handleFieldBlur(field.name)}
            formValues={formValues}
            onAutoFill={handleAutoFill}
          />
        ))}

        {/* Submission Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-success-800 font-medium">Form submitted successfully!</p>
              <p className="text-success-700 text-sm">Your data has been processed and structured.</p>
            </div>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-error-800 font-medium">Please fix the errors below</p>
              <p className="text-error-700 text-sm">All required fields must be filled out correctly.</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-medium px-6 py-2 transition-colors duration-200 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Form
              </>
            )}
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

// Wrapper component that provides FormContext
const FormGenerator = ({ schema, onSubmit }: FormGeneratorProps) => {
  return (
    <FormProvider 
      initialValues={{}}
      onValuesChange={(values) => {
        // Optional: You can add global form change handlers here
        console.log('Form values changed:', values);
      }}
    >
      <FormGeneratorInternal schema={schema} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default FormGenerator;
