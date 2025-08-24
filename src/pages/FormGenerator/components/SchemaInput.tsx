import React, { useState, useCallback, useEffect, useRef } from 'react';
import { validateFormSchema, isValidJSON, ValidationResult } from '../utils/schemaValidator';
import { saveCustomSchema, loadCustomSchema, clearCustomSchema, hasCustomSchema } from '../utils/localStorage';
import defaultFormSchema from '../../../lib/form-schema.json';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Textarea } from '../../../components/ui/textarea';

interface SchemaInputProps {
  onSchemaChange?: (schema: any, isValid: boolean) => void;
  placeholder?: string;
  defaultValue?: string;
}

const SchemaInput = ({ onSchemaChange, placeholder, defaultValue = '' }: SchemaInputProps) => {
  // Initialize with stored schema or defaultValue
  const [schemaText, setSchemaText] = useState(() => {
    const stored = loadCustomSchema();
    return stored?.schema || defaultValue;
  });
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [storedSchemaInfo, setStoredSchemaInfo] = useState<{ savedAt: string } | null>(null);
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
  // Load stored schema info and validate on mount
  useEffect(() => {
    const stored = loadCustomSchema();
    if (stored && stored.schema.trim()) {
      // Prioritize stored schema over defaultValue
      setStoredSchemaInfo({ savedAt: stored.savedAt });
      validateAndParseSchema(stored.schema);
    } else if (defaultValue.trim()) {
      // Use defaultValue if no stored schema
      validateAndParseSchema(defaultValue);
      // Save the defaultValue to localStorage for future use
      saveCustomSchema(defaultValue);
      setStoredSchemaInfo({ savedAt: new Date().toISOString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]); // Only depend on defaultValue, ignore validateAndParseSchema

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSchemaText(value);
    
    // Save to localStorage immediately (no debounce for saving)
    const success = saveCustomSchema(value);
    if (success) {
      setStoredSchemaInfo({ savedAt: new Date().toISOString() });
    }
    
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
    setStoredSchemaInfo(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Clear from localStorage as well
    clearCustomSchema();
    
    onSchemaChange?.(null, false);
  };

  const loadExampleSchema = () => {
    const formatted = JSON.stringify(defaultFormSchema, null, 2);
    setSchemaText(formatted);
    setStoredSchemaInfo(null); // Clear stored info when loading example
    validateAndParseSchema(formatted);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Custom Schema Input
              {storedSchemaInfo && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2m-8 0V7a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Auto-saved
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {storedSchemaInfo ? (
                <>
                  Schema automatically saved locally (last saved: {new Date(storedSchemaInfo.savedAt).toLocaleString()})
                </>
              ) : (
                'Define your form structure using JSON schema - changes are saved automatically'
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadExampleSchema}
              size="sm"
              className="bg-secondary-500 hover:bg-secondary-600 text-white font-medium transition-colors duration-200 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Load Example
            </Button>
            <Button
              onClick={handleFormatJson}
              disabled={!schemaText.trim()}
              size="sm"
              className="bg-success-500 hover:bg-success-600 disabled:bg-neutral-300 disabled:text-neutral-500 text-white font-medium transition-colors duration-200 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Format JSON
            </Button>
            <Button
              onClick={handleClear}
              disabled={!schemaText.trim()}
              size="sm"
              className="bg-error-500 hover:bg-error-600 disabled:bg-neutral-300 disabled:text-neutral-500 text-white font-medium transition-colors duration-200 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          value={schemaText}
          onChange={handleChange}
          placeholder={placeholder || 'Paste your JSON schema here...'}
          className={`h-64 font-mono text-sm resize-vertical ${
            jsonError || (validationResult && !validationResult.isValid)
              ? 'border-destructive focus-visible:ring-destructive' 
              : validationResult?.isValid
                ? 'border-green-500 focus-visible:ring-green-500'
                : ''
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
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <span className="font-medium">Valid Schema:</span> Ready to generate form
              {validationResult.warnings.length > 0 && ' (with warnings above)'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchemaInput;
