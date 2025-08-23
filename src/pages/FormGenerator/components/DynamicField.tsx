import React from 'react';
import { InputField } from '../../../types/input';

interface DynamicFieldProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const DynamicField = ({ field, value, error, onChange, onBlur }: DynamicFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    onChange(newValue);
  };

  const getInputClasses = () => {
    const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors";
    if (error) {
      return `${baseClasses} border-error-300 focus:ring-error-500 focus:border-error-500`;
    }
    return `${baseClasses} border-neutral-300 focus:ring-primary-500 focus:border-primary-500`;
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
      case 'search':
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            value={value || ''}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            onChange={handleChange}
            onBlur={onBlur}
            className={getInputClasses()}
          />
        );

      case 'number':
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

      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.name}
            value={value || ''}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            rows={field.rows || 4}
            cols={field.cols}
            onChange={handleChange}
            onBlur={onBlur}
            className={getInputClasses()}
          />
        );

      case 'select':
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

      case 'checkbox':
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
          </div>
        );

      case 'radio':
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
          </div>
        );

      case 'date':
      case 'datetime-local':
      case 'time':
      case 'month':
      case 'week':
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            value={value || ''}
            disabled={field.disabled}
            required={field.required}
            onChange={handleChange}
            onBlur={onBlur}
            className={getInputClasses()}
          />
        );

      case 'file':
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

      default:
        return (
          <input
            type="text"
            id={field.id}
            name={field.name}
            value={value || ''}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            onChange={handleChange}
            onBlur={onBlur}
            className={getInputClasses()}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      {field.type !== 'checkbox' && field.label && (
        <label htmlFor={field.id} className="block text-sm font-medium text-neutral-700">
          {field.label}
          {field.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {field.description && (
        <p className="text-xs text-neutral-500">{field.description}</p>
      )}
      
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default DynamicField;
