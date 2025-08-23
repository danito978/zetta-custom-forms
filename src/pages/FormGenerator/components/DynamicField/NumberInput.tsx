import React from 'react';
import { InputField } from '../../../../types/input';

interface NumberInputProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const NumberInput = ({ field, value, error, onChange, onBlur }: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const getInputClasses = () => {
    const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors";
    if (error) {
      return `${baseClasses} border-error-300 focus:ring-error-500 focus:border-error-500`;
    }
    return `${baseClasses} border-neutral-300 focus:ring-primary-500 focus:border-primary-500`;
  };

  return (
    <input
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
      className={getInputClasses()}
    />
  );
};

export default NumberInput;
