import { useEffect, useCallback, useRef } from 'react';

/**
 * Configuration options for form auto-save
 */
interface FormAutoSaveConfig {
  /** Debounce delay in milliseconds (default: 1000ms) */
  debounceMs?: number;
  /** Storage key prefix (default: 'zetta-form-autosave') */
  storageKey?: string;
  /** Whether to enable auto-save (default: true) */
  enabled?: boolean;
  /** Callback when save occurs */
  onSave?: (values: Record<string, any>) => void;
  /** Callback when load occurs */
  onLoad?: (values: Record<string, any>) => void;
}

/**
 * localStorage utilities for form values
 */
const FORM_STORAGE_KEY = 'zetta-form-generator-form-values';

const saveFormValues = (values: Record<string, any>, storageKey: string = FORM_STORAGE_KEY): boolean => {
  try {
    const timestamp = new Date().toISOString();
    const formData = {
      values,
      savedAt: timestamp,
      version: '1.0'
    };
    
    localStorage.setItem(storageKey, JSON.stringify(formData));
    return true;
  } catch (error) {
    console.warn('Failed to save form values to localStorage:', error);
    return false;
  }
};

const loadFormValues = (storageKey: string = FORM_STORAGE_KEY): { values: Record<string, any>; savedAt: string } | null => {
  try {
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      return null;
    }
    
    const parsed = JSON.parse(stored);
    
    // Validate the structure
    if (parsed && typeof parsed.values === 'object' && parsed.savedAt) {
      return {
        values: parsed.values,
        savedAt: parsed.savedAt
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to load form values from localStorage:', error);
    return null;
  }
};

const clearFormValues = (storageKey: string = FORM_STORAGE_KEY): boolean => {
  try {
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.warn('Failed to clear form values from localStorage:', error);
    return false;
  }
};

const hasFormValues = (storageKey: string = FORM_STORAGE_KEY): boolean => {
  const stored = loadFormValues(storageKey);
  return stored !== null && Object.keys(stored.values).length > 0;
};

/**
 * Hook for auto-saving form values to localStorage
 * 
 * @param formValues - Current form values to save
 * @param config - Configuration options
 * @returns Object with save info and utility functions
 */
export const useFormAutoSave = (
  formValues: Record<string, any>,
  config: FormAutoSaveConfig = {}
) => {
  const {
    debounceMs = 1000,
    storageKey = FORM_STORAGE_KEY,
    enabled = true,
    onSave,
    onLoad
  } = config;

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');
  const initialLoadRef = useRef<boolean>(false);

  // Load saved values on mount
  const loadSavedValues = useCallback((): Record<string, any> | null => {
    if (!enabled) return null;
    
    const saved = loadFormValues(storageKey);
    if (saved) {
      onLoad?.(saved.values);
      return saved.values;
    }
    return null;
  }, [enabled, storageKey, onLoad]);

  // Save form values (debounced)
  const saveValues = useCallback((values: Record<string, any>) => {
    if (!enabled) return;

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't save if values haven't changed
    const valuesString = JSON.stringify(values);
    if (valuesString === lastSavedRef.current) {
      return;
    }

    // Debounce the save operation
    debounceRef.current = setTimeout(() => {
      const success = saveFormValues(values, storageKey);
      if (success) {
        lastSavedRef.current = valuesString;
        onSave?.(values);
      }
    }, debounceMs);
  }, [enabled, storageKey, debounceMs, onSave]);

  // Clear saved values
  const clearSavedValues = useCallback((): boolean => {
    const success = clearFormValues(storageKey);
    if (success) {
      lastSavedRef.current = '';
    }
    return success;
  }, [storageKey]);

  // Check if saved values exist
  const hasSavedValues = useCallback((): boolean => {
    return hasFormValues(storageKey);
  }, [storageKey]);

  // Get saved values info
  const getSavedValuesInfo = useCallback((): { savedAt: string } | null => {
    const saved = loadFormValues(storageKey);
    return saved ? { savedAt: saved.savedAt } : null;
  }, [storageKey]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled || !formValues) return;

    // Skip initial empty values to avoid overwriting saved data
    const hasNonEmptyValues = Object.values(formValues).some(value => {
      if (value === null || value === undefined || value === '') return false;
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      return true;
    });

    if (hasNonEmptyValues) {
      saveValues(formValues);
    }
  }, [formValues, enabled, saveValues]);

  // Note: Loading saved values is handled by FormContext, not here

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    // State
    hasSavedValues: hasSavedValues(),
    savedValuesInfo: getSavedValuesInfo(),
    
    // Actions
    loadSavedValues,
    clearSavedValues,
    saveValues: (values: Record<string, any>) => saveValues(values),
    
    // Utils
    getSavedValuesInfo
  };
};

export default useFormAutoSave;
