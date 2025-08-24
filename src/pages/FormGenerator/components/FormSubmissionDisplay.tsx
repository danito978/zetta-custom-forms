import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { SubmittedData } from '../hooks/useFormSubmission';

interface FormSubmissionDisplayProps {
  submittedData: SubmittedData;
  onClear?: () => void;
  onRetry?: () => void;
  className?: string;
}

const FormSubmissionDisplay: React.FC<FormSubmissionDisplayProps> = ({
  submittedData,
  onClear,
  onRetry,
  className = ''
}) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(submittedData.data, null, 2));
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const formatSubmissionTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const getCopyButtonText = () => {
    switch (copyStatus) {
      case 'copied': return 'Copied!';
      case 'error': return 'Failed';
      default: return 'Copy JSON';
    }
  };

  const getCopyButtonClass = () => {
    const baseClass = "text-xs px-3 py-1 rounded transition-colors duration-200";
    switch (copyStatus) {
      case 'copied': 
        return `${baseClass} bg-success-100 text-success-700`;
      case 'error': 
        return `${baseClass} bg-error-100 text-error-700`;
      default: 
        return `${baseClass} bg-primary-100 text-primary-700 hover:bg-primary-200`;
    }
  };

  return (
    <Card className={`mt-8 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <CardTitle>Submitted Form Data</CardTitle>
          </div>
          
          <div className="flex gap-2">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-xs"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Resubmit
              </Button>
            )}
            
            {onClear && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </Button>
            )}
          </div>
        </div>
        
        <CardDescription>
          Structured JSON output with proper hierarchy (submitted at {formatSubmissionTime(submittedData.submittedAt)})
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* JSON Output Section */}
        <div className="bg-neutral-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-neutral-700">JSON Output:</h4>
            <button 
              onClick={handleCopyToClipboard}
              className={getCopyButtonClass()}
              disabled={copyStatus !== 'idle'}
            >
              {copyStatus === 'idle' && (
                <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              {getCopyButtonText()}
            </button>
          </div>
          
          <pre className="text-xs text-neutral-800 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
            {JSON.stringify(submittedData.data, null, 2)}
          </pre>
        </div>
        
        {/* Data Characteristics Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded border">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div className="font-medium text-blue-800">Structure</div>
            </div>
            <div className="text-blue-700">Mirrors form schema hierarchy</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded border">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div className="font-medium text-green-800">Data Types</div>
            </div>
            <div className="text-green-700">Numbers, dates preserved as-is</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded border">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <div className="font-medium text-purple-800">Visibility</div>
            </div>
            <div className="text-purple-700">Hidden fields excluded</div>
          </div>
        </div>

        {/* Submission Metadata */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submitted: {formatSubmissionTime(submittedData.submittedAt)}
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Size: {JSON.stringify(submittedData.data).length} characters
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Fields: {Object.keys(submittedData.data).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormSubmissionDisplay;
