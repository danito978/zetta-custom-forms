import { useState, useCallback, useRef } from 'react';
import { ApiIntegration } from '../../../types/input';
import { fetchCityData } from '../utils/mockApi';

interface ApiIntegrationState {
  isLoading: boolean;
  error: string | null;
  lastValue: string | null;
}

// Registry of available API functions
const apiRegistry: Record<string, (value: string) => Promise<any>> = {
  fetchCityData: fetchCityData,
};

/**
 * Hook for handling API integration and auto-fill functionality
 */
export const useApiIntegration = (
  apiConfig: ApiIntegration | undefined,
  onAutoFill: (fieldUpdates: Record<string, any>) => void
) => {
  const [state, setState] = useState<ApiIntegrationState>({
    isLoading: false,
    error: null,
    lastValue: null
  });
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const triggerApiCall = useCallback(async (value: string) => {
    if (!apiConfig || !value.trim()) {
      setState(prev => ({ ...prev, isLoading: false, error: null }));
      return;
    }

    // Don't call API for the same value
    if (state.lastValue === value.trim()) {
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      lastValue: value.trim()
    }));

    try {
      // Get the API function from registry
      const apiFunction = apiRegistry[apiConfig.apiFunction];
      if (!apiFunction) {
        throw new Error(`API function '${apiConfig.apiFunction}' not found`);
      }

      // Call the API
      const response = await apiFunction(value.trim());
      
      if (response) {
        // Map API response to form fields
        const fieldUpdates: Record<string, any> = {};
        
        Object.entries(apiConfig.targetFields).forEach(([fieldPath, responsePath]) => {
          // Simple path resolution (e.g., 'region', 'postalCode')
          const responseValue = (response as any)[responsePath];
          if (responseValue !== undefined) {
            fieldUpdates[fieldPath] = responseValue;
          }
        });

        // Trigger auto-fill
        if (Object.keys(fieldUpdates).length > 0) {
          onAutoFill(fieldUpdates);
        }
      }

      setState(prev => ({ ...prev, isLoading: false, error: null }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'API call failed'
      }));
    }
  }, [apiConfig, onAutoFill, state.lastValue]);

  const handleFieldChange = useCallback((value: string) => {
    if (!apiConfig) return;

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    // Only trigger on onChange if configured
    if (apiConfig.trigger === 'onChange') {
      const debounceMs = apiConfig.debounceMs || 500;
      debounceRef.current = setTimeout(() => {
        triggerApiCall(value);
      }, debounceMs);
    }
  }, [apiConfig, triggerApiCall]);

  const handleFieldBlur = useCallback((value: string) => {
    if (!apiConfig) return;

    // Clear any pending debounced calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    // Trigger on blur (default behavior)
    if (!apiConfig.trigger || apiConfig.trigger === 'onBlur') {
      triggerApiCall(value);
    }
  }, [apiConfig, triggerApiCall]);

  const clearState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      lastValue: null
    });
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    handleFieldChange,
    handleFieldBlur,
    clearState
  };
};
