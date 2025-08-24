import React from 'react';
import { InputField } from '../../../../types/input';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';
import { useApiIntegration } from '../../hooks/useApiIntegration';
import { useFormContext } from '../../context/FormContext';
import { useValidationContext } from '../../context/ValidationContext';

interface TextInputProps {
  field: InputField;
  error?: string;
  onBlur?: () => void;
  formValues?: Record<string, any>;
  onAutoFill?: (fieldUpdates: Record<string, any>) => void;
}

const TextInput = ({ field, error, onBlur, formValues, onAutoFill }: TextInputProps) => {
  const { getFieldValue, updateField, formValues: contextFormValues } = useFormContext();
  const { validateField, isFieldValidating, getFieldError, isFieldTouched, setFieldTouched } = useValidationContext();
  const value = getFieldValue(field.name);
  
  // API integration hook
  const { isLoading, error: apiError, handleFieldChange, handleFieldBlur } = useApiIntegration(
    field.apiIntegration,
    onAutoFill || (() => {})
  );
  
  // ValidationContext is the single source of truth for validation errors
  const validationError = isFieldTouched(field.name) ? getFieldError(field.name)?.message : undefined;
  const displayError = validationError || apiError; // Only use ValidationContext and API errors
  const isValidating = isFieldValidating(field.name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    updateField(field.name, newValue);
    
    // Real-time validation trigger
    
    // Trigger real-time validation (debounced in ValidationContext)
    validateField(field.name, newValue, field, { ...contextFormValues, [field.name]: newValue });
    
    // Trigger API integration if configured
    if (field.apiIntegration) {
      handleFieldChange(newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    
    // Validation on blur
    
    // Mark field as touched
    setFieldTouched(field.name, true);
    
    // Trigger immediate validation on blur using ValidationContext
    validateField(field.name, currentValue, field, contextFormValues);
    
    // Trigger API integration if configured
    if (field.apiIntegration) {
      handleFieldBlur(currentValue);
    }
    
    onBlur?.();
  };

  // Combine validation error with API error (already handled above)

  return (
    <div className="space-y-2">
      {field.label && (
        <Label htmlFor={field.id} className={cn(error && "text-destructive")}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          type={field.type}
          id={field.id}
          name={field.name}
          value={value || ''}
          placeholder={isLoading ? (field.apiIntegration?.loadingMessage || 'Loading...') : field.placeholder}
          disabled={field.disabled || isLoading}
          required={field.required}
          readOnly={field.readonly}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            displayError && "border-destructive focus-visible:ring-destructive",
            isLoading && "opacity-70",
            isValidating && "border-blue-300"
          )}
        />
        {(isLoading || isValidating) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}
    </div>
  );
};

export default TextInput;
