import React from 'react';
import { InputField } from '../../../../types/input';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';
import { useApiIntegration } from '../../hooks/useApiIntegration';
import { useFormContext } from '../../context/FormContext';

interface TextInputProps {
  field: InputField;
  error?: string;
  onBlur?: () => void;
  formValues?: Record<string, any>;
  onAutoFill?: (fieldUpdates: Record<string, any>) => void;
}

const TextInput = ({ field, error, onBlur, formValues, onAutoFill }: TextInputProps) => {
  const { getFieldValue, updateField } = useFormContext();
  const value = getFieldValue(field.name);
  
  // API integration hook
  const { isLoading, error: apiError, handleFieldChange, handleFieldBlur } = useApiIntegration(
    field.apiIntegration,
    onAutoFill || (() => {})
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    updateField(field.name, newValue);
    
    // Trigger API integration if configured
    if (field.apiIntegration) {
      handleFieldChange(newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    
    // Trigger API integration if configured
    if (field.apiIntegration) {
      handleFieldBlur(currentValue);
    }
    
    onBlur?.();
  };

  // Combine validation error with API error
  const displayError = error || apiError;

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
            isLoading && "opacity-70"
          )}
        />
        {isLoading && (
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
