import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import SchemaInput from '../components/SchemaInput';

const FromGenerator = () => {
  const [currentSchema, setCurrentSchema] = useState<any>(null);
  const [isSchemaValid, setIsSchemaValid] = useState(false);

  const handleSchemaChange = (schema: any, isValid: boolean) => {
    setCurrentSchema(schema);
    setIsSchemaValid(isValid);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            From Generator
          </h1>
          <p className="text-lg text-neutral-600">
            This page is ready for you to add components
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Schema Input Section */}
          <SchemaInput 
            onSchemaChange={handleSchemaChange}
            placeholder="Enter your input field schema in JSON format..."
          />

          {/* Preview Section */}
          {isSchemaValid && currentSchema && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Schema Preview</h3>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-neutral-700">Field ID:</span>
                    <span className="ml-2 text-neutral-900">{currentSchema.id || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Type:</span>
                    <span className="ml-2 text-neutral-900">{currentSchema.type || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Label:</span>
                    <span className="ml-2 text-neutral-900">{currentSchema.label || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Required:</span>
                    <span className="ml-2 text-neutral-900">{currentSchema.required ? 'Yes' : 'No'}</span>
                  </div>
                  {currentSchema.placeholder && (
                    <div>
                      <span className="font-medium text-neutral-700">Placeholder:</span>
                      <span className="ml-2 text-neutral-900">{currentSchema.placeholder}</span>
                    </div>
                  )}
                  {currentSchema.description && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-neutral-700">Description:</span>
                      <span className="ml-2 text-neutral-900">{currentSchema.description}</span>
                    </div>
                  )}
                  {currentSchema.validation && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-neutral-700">Validation:</span>
                      <span className="ml-2 text-neutral-900">
                        {Object.keys(currentSchema.validation).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for future form generation */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-neutral-200">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                Form Generator
              </h2>
              <p className="text-neutral-600">
                {isSchemaValid 
                  ? "Schema loaded! Form generation components will be added here." 
                  : "Enter a valid schema above to start generating form fields."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FromGenerator;
