import React, { useState, useCallback } from 'react';
import DynamicField from './DynamicField';
import { InputField } from '../../../types/input';

interface FormGeneratorProps {
  schema: any;
  onSubmit?: (values: Record<string, any>) => void;
}

const FormGenerator = ({ schema, onSubmit }: FormGeneratorProps) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Extract fields from schema
  const fields = schema?.fields ? Object.entries(schema.fields).map(([key, fieldData]: [string, any]) => ({
    ...fieldData,
    id: fieldData.id || key,
    name: fieldData.name || key,
  })) : [];

  const validateField = useCallback((field: InputField, value: any): string | null => {
    if (!field.validation) return null;

    const validation = field.validation;

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return validation.messages?.required || `${field.label || field.name} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // String length validations
    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        return validation.messages?.minLength || `Must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return validation.messages?.maxLength || `Cannot exceed ${validation.maxLength} characters`;
      }
    }

    // Pattern validation
    if (validation.pattern && typeof value === 'string') {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return validation.messages?.pattern || 'Invalid format';
      }
    }

    // Format validation
    if (validation.format && typeof value === 'string') {
      let isValid = true;
      switch (validation.format) {
        case 'email':
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case 'url':
          try {
            new URL(value);
          } catch {
            isValid = false;
          }
          break;
        case 'phone':
          isValid = /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''));
          break;
        default:
          break;
      }
      if (!isValid) {
        return validation.messages?.format || `Invalid ${validation.format} format`;
      }
    }

    // Numeric validations
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        return validation.messages?.min || `Must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return validation.messages?.max || `Cannot exceed ${validation.max}`;
      }
    }

    return null;
  }, []);

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  }, [errors]);

  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, formValues[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
    }
  }, [fields, formValues, validateField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, formValues[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}));

    if (!hasErrors) {
      onSubmit?.(formValues);
    }
  };

  const handleReset = () => {
    setFormValues({});
    setErrors({});
    setTouched({});
  };

  if (!schema || !fields.length) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No valid form schema provided</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          {schema.title || 'Generated Form'}
        </h3>
        {schema.description && (
          <p className="text-neutral-600">{schema.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <DynamicField
            key={field.id}
            field={field}
            value={formValues[field.name]}
            error={touched[field.name] ? errors[field.name] : undefined}
            onChange={(value) => handleFieldChange(field.name, value)}
            onBlur={() => handleFieldBlur(field.name)}
          />
        ))}

        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-neutral-500 hover:bg-neutral-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Form Values Debug (optional) */}
      {Object.keys(formValues).length > 0 && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Form Values:</h4>
          <pre className="text-xs text-neutral-600 overflow-x-auto">
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FormGenerator;
