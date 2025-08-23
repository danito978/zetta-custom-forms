import React, { useState, useCallback, useEffect, useRef } from 'react';
import { validateFormSchema, isValidJSON, ValidationResult } from '../utils/schemaValidator';

interface SchemaInputProps {
  onSchemaChange?: (schema: any, isValid: boolean) => void;
  placeholder?: string;
  defaultValue?: string;
}

const SchemaInput = ({ onSchemaChange, placeholder, defaultValue = '' }: SchemaInputProps) => {
  const [schemaText, setSchemaText] = useState(defaultValue);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const validateAndParseSchema = useCallback((text: string) => {
    if (!text.trim()) {
      setJsonError(null);
      setValidationResult(null);
      onSchemaChange?.(null, false);
      return;
    }

    // First validate JSON syntax
    const jsonValidation = isValidJSON(text);
    if (!jsonValidation.valid) {
      setJsonError(jsonValidation.error || 'Invalid JSON format');
      setValidationResult(null);
      onSchemaChange?.(null, false);
      return;
    }

    // Clear JSON error if valid
    setJsonError(null);

    // Parse and validate schema structure
    try {
      const parsed = JSON.parse(text);
      const schemaValidation = validateFormSchema(parsed);
      setValidationResult(schemaValidation);
      
      if (schemaValidation.isValid) {
        onSchemaChange?.(parsed, true);
      } else {
        onSchemaChange?.(null, false);
      }
    } catch (err) {
      setJsonError('Failed to parse JSON');
      setValidationResult(null);
      onSchemaChange?.(null, false);
    }
  }, [onSchemaChange]);

  // Validate default value on mount
  useEffect(() => {
    if (defaultValue.trim()) {
      validateAndParseSchema(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]); // Only depend on defaultValue, ignore validateAndParseSchema

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSchemaText(value);
    
    // Clear previous errors when schema changes
    setJsonError(null);
    setValidationResult(null);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set validating state
    setIsValidating(true);
    
    // Debounce validation
    debounceRef.current = setTimeout(() => {
      setIsValidating(false);
      validateAndParseSchema(value);
    }, 500); // 500ms delay
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
    setJsonError(null);
    setValidationResult(null);
    setIsValidating(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
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
            jsonError || (validationResult && !validationResult.isValid)
              ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
              : validationResult?.isValid
                ? 'border-success-300 focus:ring-success-500 focus:border-success-500'
                : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
          }`}
        />

        {/* Status indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {jsonError || (validationResult && !validationResult.isValid) ? (
              <div className="flex items-center gap-1 text-error-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  {jsonError ? 'Invalid JSON' : 'Schema Errors'}
                </span>
              </div>
            ) : validationResult?.isValid ? (
              <div className="flex items-center gap-1 text-success-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Valid Schema</span>
              </div>
            ) : isValidating ? (
              <div className="flex items-center gap-1 text-warning-600">
                <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Validating...</span>
              </div>
            ) : schemaText.trim() ? (
              <div className="flex items-center gap-1 text-neutral-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Waiting for input...</span>
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

        {/* JSON Error message */}
        {jsonError && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-700">
              <span className="font-medium">JSON Error:</span> {jsonError}
            </p>
          </div>
        )}

        {/* Schema validation errors */}
        {validationResult && !validationResult.isValid && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-700 font-medium mb-2">Schema Validation Errors:</p>
            <ul className="text-sm text-error-600 space-y-1">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-error-500 mt-0.5">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Schema validation warnings */}
        {validationResult && validationResult.warnings.length > 0 && (
          <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <p className="text-sm text-warning-700 font-medium mb-2">Warnings:</p>
            <ul className="text-sm text-warning-600 space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-warning-500 mt-0.5">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Success message */}
        {validationResult?.isValid && (
          <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-700">
              <span className="font-medium">Valid Schema:</span> Ready to generate form
              {validationResult.warnings.length > 0 && ' (with warnings above)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaInput;
