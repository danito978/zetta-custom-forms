import React from 'react';
import { InputField } from '../../../../types/input';

interface RadioInputProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const RadioInput = ({ field, value, error, onChange, onBlur }: RadioInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {field.options?.map((option, index) => {
        const optionValue = typeof option === 'string' ? option : String(option.value);
        const optionLabel = typeof option === 'string' ? option : option.label;
        return (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`${field.id}_${index}`}
              name={field.name}
              value={optionValue}
              checked={value === optionValue}
              disabled={field.disabled}
              required={field.required}
              onChange={handleChange}
              onBlur={onBlur}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
            />
            <label htmlFor={`${field.id}_${index}`} className="ml-2 text-sm text-neutral-700">
              {optionLabel}
            </label>
          </div>
        );
      })}
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default RadioInput;
