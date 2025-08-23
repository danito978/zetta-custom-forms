import React, { useState, useCallback } from 'react';
import Navigation from '../../components/Navigation';
import { SchemaInput, FormGenerator } from './components';
import defaultFormSchema from '../../lib/form-schema.json';

const FormGeneratorPage = () => {
  const [currentSchema, setCurrentSchema] = useState<any>(null);
  const [isSchemaValid, setIsSchemaValid] = useState(false);

  const handleSchemaChange = useCallback((schema: any, isValid: boolean) => {
    setCurrentSchema(schema);
    setIsSchemaValid(isValid);
  }, []);

  const handleFormSubmit = (values: Record<string, any>) => {
    console.log('Form submitted with values:', values);
    // Here you can handle the form submission
    alert('Form submitted successfully! Check console for values.');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Form Generator
          </h1>
          <p className="text-lg text-neutral-600">
            Create dynamic forms by defining JSON schemas
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Schema Input Section */}
          <SchemaInput 
            onSchemaChange={handleSchemaChange}
            placeholder="Enter your input field schema in JSON format..."
            defaultValue={JSON.stringify(defaultFormSchema, null, 2)}
          />

          {/* Generated Form Section */}
          {isSchemaValid && currentSchema && (
            <FormGenerator 
              schema={currentSchema} 
              onSubmit={handleFormSubmit}
            />
          )}

          {/* Instructions when no valid schema */}
          {!isSchemaValid && (
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
                  Enter a valid schema above to start generating form fields.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default FormGeneratorPage;
