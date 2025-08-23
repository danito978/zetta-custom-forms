import React, { useState, useCallback, useEffect } from 'react';
import { InputField } from '../../../../types/input';
import {
  TextInput,
  NumberInput,
  TextareaInput,
  SelectInput,
  CheckboxInput,
  RadioInput,
  DateInput,
  FileInput
} from './index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';

interface GroupInputProps {
  field: InputField;
  value?: Record<string, any>;
  onChange?: (value: Record<string, any>) => void;
  onBlur?: () => void;
  error?: string;
  depth?: number; // Track nesting depth for colored borders
}

// Helper function to get the appropriate field component
const getFieldComponent = (fieldType: string) => {
  switch (fieldType) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
    case 'search':
      return TextInput;
    case 'number':
      return NumberInput;
    case 'textarea':
      return TextareaInput;
    case 'select':
      return SelectInput;
    case 'checkbox':
      return CheckboxInput;
    case 'radio':
      return RadioInput;
    case 'date':
    case 'datetime-local':
    case 'time':
    case 'month':
    case 'week':
      return DateInput;
    case 'file':
      return FileInput;
    case 'group':
      return GroupInput; // Recursive for nested groups
    default:
      return TextInput; // Fallback
  }
};

const GroupInput = ({ field, value = {}, onChange, onBlur, error, depth = 0 }: GroupInputProps) => {
  const [groupValues, setGroupValues] = useState<Record<string, any>>(value);
  const [groupErrors, setGroupErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Convert fields object to array for rendering
  const fields = field.fields ? Object.entries(field.fields).map(([key, fieldData]) => ({
    ...fieldData,
    id: fieldData.id || key,
    name: fieldData.name || key,
  })) : [];

  // Get border color based on nesting depth
  const getBorderColor = (depth: number) => {
    const colors = [
      'border-primary-200',      // Level 0: Primary blue
      'border-secondary-200',    // Level 1: Sky blue  
      'border-success-200',      // Level 2: Green
      'border-warning-200',      // Level 3: Amber
      'border-purple-200',       // Level 4: Purple
      'border-pink-200',         // Level 5: Pink
    ];
    return colors[depth % colors.length] || 'border-border';
  };

  // Get background color based on nesting depth (subtle)
  const getBackgroundColor = (depth: number) => {
    const colors = [
      'bg-primary-50/30',        // Level 0: Very light primary
      'bg-secondary-50/30',      // Level 1: Very light sky
      'bg-success-50/30',        // Level 2: Very light green
      'bg-warning-50/30',        // Level 3: Very light amber
      'bg-purple-50/30',         // Level 4: Very light purple
      'bg-pink-50/30',           // Level 5: Very light pink
    ];
    return colors[depth % colors.length] || 'bg-card';
  };

  // Initialize with the provided value
  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      setGroupValues(value);
    }
  }, [value]);

  // Basic validation for group fields
  const validateField = useCallback((fieldDef: InputField, fieldValue: any): string | null => {
    if (!fieldDef.validation) return null;

    const validation = fieldDef.validation;

    // Required validation
    if (fieldDef.required && (!fieldValue || fieldValue === '')) {
      return validation.messages?.required || `${fieldDef.label || fieldDef.name} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!fieldValue || fieldValue === '') return null;

    // String validations
    if (typeof fieldValue === 'string') {
      if (validation.minLength && fieldValue.length < validation.minLength) {
        return validation.messages?.minLength || `Must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && fieldValue.length > validation.maxLength) {
        return validation.messages?.maxLength || `Cannot exceed ${validation.maxLength} characters`;
      }
      if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(fieldValue)) {
          return validation.messages?.pattern || 'Invalid format';
        }
      }
    }

    // Number validations
    if (typeof fieldValue === 'number') {
      if (validation.min !== undefined && fieldValue < validation.min) {
        return validation.messages?.min || `Must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && fieldValue > validation.max) {
        return validation.messages?.max || `Cannot exceed ${validation.max}`;
      }
    }

    return null;
  }, []);

  const handleFieldChange = useCallback((fieldName: string, fieldValue: any) => {
    const newGroupValues = {
      ...groupValues,
      [fieldName]: fieldValue
    };
    
    setGroupValues(newGroupValues);
    
    // Notify parent of the change immediately
    onChange?.(newGroupValues);

    // Validate the field
    const fieldDef = fields.find(f => f.name === fieldName);
    if (fieldDef) {
      const error = validateField(fieldDef, fieldValue);
      setGroupErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }));
    }
  }, [fields, validateField, groupValues, onChange]);

  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    onBlur?.();
  }, [onBlur]);

  return (
    <Card className={`mb-4 border-2 ${getBorderColor(depth)} ${getBackgroundColor(depth)}`}>
      <CardHeader>
        {field.label && (
          <CardTitle className="flex items-center">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </CardTitle>
        )}
        {field.description && (
          <CardDescription>
            {field.description}
          </CardDescription>
        )}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {fields.length > 0 ? (
          fields.map((groupField) => {
            // Import individual field components to avoid circular dependency
            const FieldComponent = getFieldComponent(groupField.type);
            return (
              <FieldComponent
                key={groupField.id}
                field={groupField}
                value={groupValues[groupField.name]}
                error={touched[groupField.name] ? groupErrors[groupField.name] : undefined}
                onChange={(value: any) => handleFieldChange(groupField.name, value)}
                onBlur={() => handleFieldBlur(groupField.name)}
                depth={groupField.type === 'group' ? depth + 1 : undefined}
              />
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-lg font-medium mb-2">Empty Group</h4>
            <p className="text-muted-foreground">This group doesn't contain any fields yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupInput;
