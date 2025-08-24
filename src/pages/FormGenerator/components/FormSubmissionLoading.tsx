import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

interface FormSubmissionLoadingProps {
  message?: string;
  className?: string;
}

const FormSubmissionLoading: React.FC<FormSubmissionLoadingProps> = ({
  message = 'Submitting your form...',
  className = ''
}) => {
  return (
    <Card className={`mt-8 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <CardTitle>Processing Submission</CardTitle>
        </div>
        <CardDescription>
          {message}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            {/* Animated Progress Indicator */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
            
            {/* Status Text */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Please wait while we process your submission
              </p>
              <p className="text-xs text-muted-foreground">
                This usually takes just a few seconds
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps (Visual Enhancement) */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Validating data
            </div>
            <div className="flex items-center gap-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
              Processing
            </div>
            <div className="flex items-center gap-1 opacity-50">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completing
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormSubmissionLoading;
