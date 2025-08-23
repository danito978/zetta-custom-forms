import React from 'react';
import { InputField } from '../../../../types/input';

interface CheckboxInputProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const CheckboxInput = ({ field, value, error, onChange, onBlur }: CheckboxInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={field.id}
        name={field.name}
        checked={value || false}
        disabled={field.disabled}
        required={field.required}
        onChange={handleChange}
        onBlur={onBlur}
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
      />
      <label htmlFor={field.id} className="ml-2 text-sm text-neutral-700">
        {field.label}
      </label>
      {error && (
        <span className="ml-2 text-sm text-error-600">{error}</span>
      )}
    </div>
  );
};

export default CheckboxInput;
