import React from 'react';
import { InputField } from '../../../../types/input';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';
import { useFormContext } from '../../context/FormContext';

interface RadioInputProps {
  field: InputField;
  error?: string;
  onBlur?: () => void;
  formValues?: Record<string, any>;
  onAutoFill?: (fieldUpdates: Record<string, any>) => void;
}

const RadioInput = ({ field, error, onBlur, formValues, onAutoFill }: RadioInputProps) => {
  const { getFieldValue, updateField } = useFormContext();
  const value = getFieldValue(field.name);
  const handleValueChange = (selectedValue: string) => {
    updateField(field.name, selectedValue);
  };

  return (
    <div className="space-y-3">
      {field.label && (
        <Label className={cn(error && "text-destructive")}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <RadioGroup
        value={value || ''}
        onValueChange={handleValueChange}
        disabled={field.disabled}
        required={field.required}
        className="space-y-2"
      >
        {field.options?.map((option, index) => {
          const optionValue = typeof option === 'string' ? option : String(option.value);
          const optionLabel = typeof option === 'string' ? option : option.label;
          const isDisabled = field.disabled || (typeof option === 'object' && option.disabled);

          return (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={optionValue}
                id={`${field.id}_${index}`}
                disabled={isDisabled}
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
      </RadioGroup>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default RadioInput;
