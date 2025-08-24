import React, { useState, useCallback } from 'react';
import Navigation from '../../components/Navigation';
import { SchemaInput, FormGenerator } from './components';
import defaultFormSchema from '../../lib/form-schema.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const FormGeneratorPage = () => {
  const [currentSchema, setCurrentSchema] = useState<any>(null);
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleSchemaChange = useCallback((schema: any, isValid: boolean) => {
    setCurrentSchema(schema);
    setIsSchemaValid(isValid);
    // Clear submitted data when schema changes
    setSubmittedData(null);
  }, []);

  const handleFormSubmit = (structuredData: Record<string, any>) => {
    // Store the submitted data to display it
    setSubmittedData({
      data: structuredData,
      submittedAt: new Date().toISOString(),
      timestamp: Date.now()
    });
    
    // You can also send this to an API here
    // await fetch('/api/submit-form', { method: 'POST', body: JSON.stringify(structuredData) });
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

          {/* Submitted Data Display */}
          {submittedData && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submitted Form Data
                </CardTitle>
                <CardDescription>
                  Structured JSON output with proper hierarchy (submitted at {new Date(submittedData.submittedAt).toLocaleString()})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-neutral-50 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-neutral-700">JSON Output:</h4>
                    <button 
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(submittedData.data, null, 2))}
                      className="text-xs px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="text-xs text-neutral-800 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {JSON.stringify(submittedData.data, null, 2)}
                  </pre>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded border">
                    <div className="font-medium text-blue-800">Structure</div>
                    <div className="text-blue-700">Mirrors form schema hierarchy</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded border">
                    <div className="font-medium text-green-800">Data Types</div>
                    <div className="text-green-700">Numbers, dates preserved as-is</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded border">
                    <div className="font-medium text-purple-800">Visibility</div>
                    <div className="text-purple-700">Hidden fields excluded</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions when no valid schema */}
          {!isSchemaValid && (
            <div className="bg-card text-card-foreground rounded-lg shadow-md p-8 border">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  Form Generator
                </h2>
                <p className="text-muted-foreground">
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
