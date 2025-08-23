import React from 'react';
import { InputField } from '../../../../types/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';

interface SelectInputProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const SelectInput = ({ field, value, error, onChange, onBlur }: SelectInputProps) => {
  const handleValueChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <div className="space-y-2">
      {field.label && (
        <Label htmlFor={field.id} className={cn(error && "text-destructive")}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select
        value={value || ''}
        onValueChange={handleValueChange}
        disabled={field.disabled}
        required={field.required}
      >
        <SelectTrigger 
          className={cn(error && "border-destructive focus:ring-destructive")}
          onBlur={onBlur}
        >
          <SelectValue placeholder={field.placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg">
          {field.options?.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : String(option.value);
            const optionLabel = typeof option === 'string' ? option : option.label;
            const isDisabled = typeof option === 'object' && option.disabled;
            
            // Skip options with empty values as ShadCN Select doesn't allow them
            if (!optionValue || optionValue === '') {
              return null;
            }
            
            return (
              <SelectItem 
                key={index} 
                value={optionValue}
                disabled={isDisabled}
                className="text-neutral-900 dark:text-neutral-100 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:bg-primary-100 dark:focus:bg-primary-900/30 cursor-pointer"
              >
                {optionLabel}
              </SelectItem>
            );
          }).filter(Boolean)}
        </SelectContent>
      </Select>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;
