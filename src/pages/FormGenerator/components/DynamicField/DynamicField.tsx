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
  depth?: number; // For nested group coloring
  formValues?: Record<string, any>; // Full form context for dynamic validation
  onAutoFill?: (fieldUpdates: Record<string, any>) => void; // API auto-fill callback
}

const DynamicField = ({ field, value, error, onChange, onBlur, depth, formValues, onAutoFill }: DynamicFieldProps) => {
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
            formValues={formValues}
            onAutoFill={onAutoFill}
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
            depth={depth}
            formValues={formValues}
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

  // All field components now handle their own layout
  return renderInput();
};

export default DynamicField;
