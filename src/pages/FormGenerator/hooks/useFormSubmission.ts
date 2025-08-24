import { useState, useCallback } from 'react';

export interface SubmittedData {
  data: Record<string, any>;
  submittedAt: string;
  timestamp: number;
}

export interface FormSubmissionState {
  submittedData: SubmittedData | null;
  isSubmitting: boolean;
  submitError: string | null;
}

export interface UseFormSubmissionReturn extends FormSubmissionState {
  handleSubmit: (data: Record<string, any>) => Promise<void>;
  clearSubmission: () => void;
  retrySubmission: () => Promise<void>;
}

/**
 * Hook for managing form submission state and operations
 */
export const useFormSubmission = (
  onSubmit?: (data: Record<string, any>) => Promise<void> | void
): UseFormSubmissionReturn => {
  const [state, setState] = useState<FormSubmissionState>({
    submittedData: null,
    isSubmitting: false,
    submitError: null
  });

  const handleSubmit = useCallback(async (data: Record<string, any>) => {
    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      submitError: null 
    }));

    try {
      // Call external submit handler if provided
      if (onSubmit) {
        await onSubmit(data);
      }

      // Store successful submission
      const submittedData: SubmittedData = {
        data,
        submittedAt: new Date().toISOString(),
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        submittedData,
        isSubmitting: false,
        submitError: null
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        submitError: errorMessage
      }));
    }
  }, [onSubmit]);

  const clearSubmission = useCallback(() => {
    setState(prev => ({
      ...prev,
      submittedData: null,
      submitError: null
    }));
  }, []);

  const retrySubmission = useCallback(async () => {
    if (state.submittedData) {
      await handleSubmit(state.submittedData.data);
    }
  }, [state.submittedData, handleSubmit]);

  return {
    ...state,
    handleSubmit,
    clearSubmission,
    retrySubmission
  };
};
