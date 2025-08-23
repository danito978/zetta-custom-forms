import React from 'react';
import { InputField } from '../../../../types/input';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';

interface NumberInputProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const NumberInput = ({ field, value, error, onChange, onBlur }: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === '' ? '' : Number(e.target.value);
    onChange(numValue);
  };

  return (
    <div className="space-y-2">
      {field.label && (
        <Label htmlFor={field.id} className={cn(error && "text-destructive")}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        type="number"
        id={field.id}
        name={field.name}
        value={value || ''}
        placeholder={field.placeholder}
        disabled={field.disabled}
        required={field.required}
        min={field.validation?.min}
        max={field.validation?.max}
        step={field.step}
        onChange={handleChange}
        onBlur={onBlur}
        className={cn(error && "border-destructive focus-visible:ring-destructive")}
      />
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default NumberInput;
