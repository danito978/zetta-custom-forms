import React from 'react';
import { InputField } from '../../../../types/input';

interface FileInputProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const FileInput = ({ field, value, error, onChange, onBlur }: FileInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);
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
      type="file"
      id={field.id}
      name={field.name}
      disabled={field.disabled}
      required={field.required}
      accept={field.accept}
      multiple={field.multiple}
      onChange={handleChange}
      onBlur={onBlur}
      className={getInputClasses()}
    />
  );
};

export default FileInput;
