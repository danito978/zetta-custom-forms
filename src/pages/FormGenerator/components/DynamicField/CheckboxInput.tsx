import React from 'react';
import { InputField } from '../../../../types/input';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';
import { useFormContext } from '../../context/FormContext';

interface CheckboxInputProps {
  field: InputField;
  error?: string;
  onBlur?: () => void;
  formValues?: Record<string, any>;
  onAutoFill?: (fieldUpdates: Record<string, any>) => void;
}

const CheckboxInput = ({ field, error, onBlur, formValues, onAutoFill }: CheckboxInputProps) => {
  const { getFieldValue, updateField } = useFormContext();
  const value = getFieldValue(field.name);
  // Handle multiple checkbox options
  if (field.options && field.options.length > 0) {
    const selectedValues = Array.isArray(value) ? value : [];

    const handleOptionChange = (optionValue: string, checked: boolean) => {
      let newValues;
      if (checked) {
        newValues = [...selectedValues, optionValue];
      } else {
        newValues = selectedValues.filter((v: string) => v !== optionValue);
      }
      updateField(field.name, newValues);
    };

    return (
      <div className="space-y-3">
        {field.label && (
          <Label className={cn(error && "text-destructive")}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="space-y-2">
          {field.options.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : String(option.value);
            const optionLabel = typeof option === 'string' ? option : option.label;
            const isDisabled = field.disabled || (typeof option === 'object' && option.disabled);
            const isChecked = selectedValues.includes(optionValue);

            return (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}_${index}`}
                  checked={isChecked}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => handleOptionChange(optionValue, checked as boolean)}
                  onBlur={onBlur}
                />
                <Label
                  htmlFor={`${field.id}_${index}`}
                  className={cn(
                    "text-sm font-normal cursor-pointer",
                    isDisabled && "cursor-not-allowed opacity-70"
                  )}
                >
                  {optionLabel}
                </Label>
              </div>
            );
          })}
        </div>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }

  // Handle single checkbox
      const handleSingleChange = (checked: boolean) => {
      updateField(field.name, checked);
    };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.id}
          checked={value || false}
          disabled={field.disabled}
          onCheckedChange={handleSingleChange}
          onBlur={onBlur}
        />
        <Label
          htmlFor={field.id}
          className={cn(
            "text-sm font-normal cursor-pointer",
            field.disabled && "cursor-not-allowed opacity-70",
            error && "text-destructive"
          )}
        >
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default CheckboxInput;
