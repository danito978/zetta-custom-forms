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
        <SelectContent className="!bg-white !border-gray-200 shadow-lg max-h-60 overflow-y-auto">
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
                className="!text-gray-900 !bg-white hover:!bg-blue-50 focus:!bg-blue-100 cursor-pointer px-3 py-2 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
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
