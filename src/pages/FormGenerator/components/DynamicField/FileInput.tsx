import React from 'react';
import { InputField } from '../../../../types/input';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';
import { useFormContext } from '../../context/FormContext';

interface FileInputProps {
  field: InputField;
  error?: string;
  onBlur?: () => void;
  formValues?: Record<string, any>;
  onAutoFill?: (fieldUpdates: Record<string, any>) => void;
}

const FileInput = ({ field, error, onBlur, formValues, onAutoFill }: FileInputProps) => {
  const { getFieldValue, updateField } = useFormContext();
  const value = getFieldValue(field.name);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(field.name, e.target.files);
  };

  return (
    <div className="space-y-2">
      {field.label && (
        <Label htmlFor={field.id} className={cn(error && "text-destructive")}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        type="file"
        id={field.id}
        name={field.name}
        disabled={field.disabled}
        required={field.required}
        accept={field.accept}
        multiple={field.multiple}
        onChange={handleChange}
        onBlur={onBlur}
        className={cn(
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          error && "border-destructive focus-visible:ring-destructive"
        )}
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

export default FileInput;
