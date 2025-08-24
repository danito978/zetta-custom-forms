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
  error?: string;
  onBlur?: () => void;
  depth?: number; // For nested group coloring
  formValues?: Record<string, any>; // Full form context for dynamic validation
  onAutoFill?: (fieldUpdates: Record<string, any>) => void; // API auto-fill callback
}

const DynamicField = ({ field, error, onBlur, depth, formValues, onAutoFill }: DynamicFieldProps) => {
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
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );

      case 'number':
        return (
          <NumberInput
            field={field}
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );

      case 'textarea':
        return (
          <TextareaInput
            field={field}
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );

      case 'select':
        return (
          <SelectInput
            field={field}
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );

      case 'checkbox':
        return (
          <CheckboxInput
            field={field}
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );

      case 'radio':
        return (
          <RadioInput
            field={field}
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
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
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );

      case 'file':
        return (
          <FileInput
            field={field}
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );

      case 'group':
        return (
          <GroupInput
            field={field}
            error={error}
            onBlur={onBlur}
            depth={depth}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );

      default:
        // Fallback to text input for unknown types
        return (
          <TextInput
            field={field}
            error={error}
            onBlur={onBlur}
            formValues={formValues}
            onAutoFill={onAutoFill}
          />
        );
    }
  };

  // All field components now handle their own layout
  return renderInput();
};

export default DynamicField;
