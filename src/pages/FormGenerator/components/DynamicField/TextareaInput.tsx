import React from 'react';
import { InputField } from '../../../../types/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';
import { useFormContext } from '../../context/FormContext';

interface TextareaInputProps {
  field: InputField;
  error?: string;
  onBlur?: () => void;
  formValues?: Record<string, any>;
  onAutoFill?: (fieldUpdates: Record<string, any>) => void;
}

const TextareaInput = ({ field, error, onBlur, formValues, onAutoFill }: TextareaInputProps) => {
  const { getFieldValue, updateField } = useFormContext();
  const value = getFieldValue(field.name);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField(field.name, e.target.value);
  };

  return (
    <div className="space-y-2">
      {field.label && (
        <Label htmlFor={field.id} className={cn(error && "text-destructive")}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Textarea
        id={field.id}
        name={field.name}
        value={value || ''}
        placeholder={field.placeholder}
        disabled={field.disabled}
        required={field.required}
        rows={field.rows || 4}
        onChange={handleChange}
        onBlur={onBlur}
        className={cn(error && "border-destructive focus-visible:ring-destructive")}
      />
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default TextareaInput;
