import React, { useState, useCallback } from 'react';

interface SchemaInputProps {
  onSchemaChange?: (schema: any, isValid: boolean) => void;
  placeholder?: string;
  defaultValue?: string;
}

const SchemaInput = ({ onSchemaChange, placeholder, defaultValue = '' }: SchemaInputProps) => {
  const [schemaText, setSchemaText] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validateAndParseSchema = useCallback((text: string) => {
    if (!text.trim()) {
      setError(null);
      setIsValid(false);
      onSchemaChange?.(null, false);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      setError(null);
      setIsValid(true);
      onSchemaChange?.(parsed, true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(errorMessage);
      setIsValid(false);
      onSchemaChange?.(null, false);
    }
  }, [onSchemaChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSchemaText(value);
    validateAndParseSchema(value);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(schemaText);
      const formatted = JSON.stringify(parsed, null, 2);
      setSchemaText(formatted);
      validateAndParseSchema(formatted);
    } catch (err) {
      // JSON is invalid, don't format
    }
  };

  const handleClear = () => {
    setSchemaText('');
    setError(null);
    setIsValid(false);
    onSchemaChange?.(null, false);
  };

  const loadExampleSchema = () => {
    const exampleSchema = {
      id: "example_field",
      name: "example",
      type: "text",
      label: "Example Field",
      placeholder: "Enter some text",
      description: "This is an example field",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 50,
        messages: {
          required: "This field is required",
          minLength: "Must be at least 3 characters",
          maxLength: "Cannot exceed 50 characters"
        }
      }
    };
    
    const formatted = JSON.stringify(exampleSchema, null, 2);
    setSchemaText(formatted);
    validateAndParseSchema(formatted);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Custom Schema Input</h3>
        <div className="flex gap-2">
          <button
            onClick={loadExampleSchema}
            className="px-3 py-1 text-sm bg-secondary-500 text-white rounded hover:bg-secondary-600 transition-colors"
          >
            Load Example
          </button>
          <button
            onClick={handleFormatJson}
            disabled={!schemaText.trim()}
            className="px-3 py-1 text-sm bg-neutral-500 text-white rounded hover:bg-neutral-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            Format JSON
          </button>
          <button
            onClick={handleClear}
            disabled={!schemaText.trim()}
            className="px-3 py-1 text-sm bg-error-500 text-white rounded hover:bg-error-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={schemaText}
          onChange={handleChange}
          placeholder={placeholder || 'Paste your JSON schema here...'}
          className={`w-full h-64 p-3 border rounded-lg font-mono text-sm resize-vertical focus:outline-none focus:ring-2 transition-colors ${
            error 
              ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
              : isValid 
                ? 'border-success-300 focus:ring-success-500 focus:border-success-500'
                : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
          }`}
        />

        {/* Status indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {error ? (
              <div className="flex items-center gap-1 text-error-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Invalid JSON</span>
              </div>
            ) : isValid ? (
              <div className="flex items-center gap-1 text-success-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Valid JSON</span>
              </div>
            ) : schemaText.trim() ? (
              <div className="flex items-center gap-1 text-warning-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Checking...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-neutral-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Enter JSON schema</span>
              </div>
            )}
          </div>

          <div className="text-xs text-neutral-500">
            {schemaText.length} characters
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-700">
              <span className="font-medium">JSON Error:</span> {error}
            </p>
          </div>
        )}

        {/* Success message with schema info */}
        {isValid && schemaText.trim() && (
          <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-700">
              <span className="font-medium">Valid Schema:</span> Ready to generate form field
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaInput;
