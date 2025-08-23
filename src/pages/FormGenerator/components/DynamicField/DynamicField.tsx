import React from 'react';
import { InputField } from '../../../../types/input';
import {
  TextInput,
  NumberInput,
  TextareaInput,
  SelectInput,
  CheckboxInput,
  RadioInput,
  DateInput,
  FileInput,
  GroupInput
} from './index';

interface DynamicFieldProps {
  field: InputField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const DynamicField = ({ field, value, error, onChange, onBlur }: DynamicFieldProps) => {
  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
      case 'search':
        return (
          <TextInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'number':
        return (
          <NumberInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'textarea':
        return (
          <TextareaInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'select':
        return (
          <SelectInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'checkbox':
        return (
          <CheckboxInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'radio':
        return (
          <RadioInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'date':
      case 'datetime-local':
      case 'time':
      case 'month':
      case 'week':
        return (
          <DateInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'file':
        return (
          <FileInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'group':
        return (
          <GroupInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      default:
        // Fallback to text input for unknown types
        return (
          <TextInput
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
          />
        );
    }
  };

  // Group fields handle their own layout
  if (field.type === 'group') {
    return renderInput();
  }

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
      
      {error && field.type !== 'checkbox' && field.type !== 'radio' && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default DynamicField;
