import React from 'react';
import { InputField } from '../../../../types/input';

interface SelectInputProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const SelectInput = ({ field, value, error, onChange, onBlur }: SelectInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    <select
      id={field.id}
      name={field.name}
      value={value || ''}
      disabled={field.disabled}
      required={field.required}
      onChange={handleChange}
      onBlur={onBlur}
      className={getInputClasses()}
    >
      <option value="">{field.placeholder || 'Select an option'}</option>
      {field.options?.map((option, index) => {
        const optionValue = typeof option === 'string' ? option : String(option.value);
        const optionLabel = typeof option === 'string' ? option : option.label;
        return (
          <option key={index} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
};

export default SelectInput;
