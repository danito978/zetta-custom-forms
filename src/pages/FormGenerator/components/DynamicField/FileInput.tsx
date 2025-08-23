import React from 'react';
import { InputField } from '../../../../types/input';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../lib/utils';

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
