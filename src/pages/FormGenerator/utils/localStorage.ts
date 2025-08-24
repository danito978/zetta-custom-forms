/**
 * Utility functions for localStorage operations with error handling
 */

const STORAGE_KEYS = {
  CUSTOM_SCHEMA: 'zetta-form-generator-custom-schema',
  SCHEMA_HISTORY: 'zetta-form-generator-schema-history'
} as const;

/**
 * Safely get an item from localStorage
 */
const getItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
};

/**
 * Safely set an item in localStorage
 */
const setItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('Failed to write to localStorage:', error);
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 */
const removeItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
    return false;
  }
};

/**
 * Save custom schema to localStorage
 */
export const saveCustomSchema = (schemaText: string): boolean => {
  const timestamp = new Date().toISOString();
  const schemaData = {
    schema: schemaText,
    savedAt: timestamp,
    version: '1.0'
  };
  
  return setItem(STORAGE_KEYS.CUSTOM_SCHEMA, JSON.stringify(schemaData));
};

/**
 * Load custom schema from localStorage
 */
export const loadCustomSchema = (): { schema: string; savedAt: string } | null => {
  const stored = getItem(STORAGE_KEYS.CUSTOM_SCHEMA);
  
  if (!stored) {
    return null;
  }
  
  try {
    const parsed = JSON.parse(stored);
    
    // Validate the structure
    if (parsed && typeof parsed.schema === 'string' && parsed.savedAt) {
      return {
        schema: parsed.schema,
        savedAt: parsed.savedAt
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to parse stored schema:', error);
    return null;
  }
};

/**
 * Clear custom schema from localStorage
 */
export const clearCustomSchema = (): boolean => {
  return removeItem(STORAGE_KEYS.CUSTOM_SCHEMA);
};

/**
 * Check if custom schema exists in localStorage
 */
export const hasCustomSchema = (): boolean => {
  const stored = loadCustomSchema();
  return stored !== null && stored.schema.trim().length > 0;
};

/**
 * Save schema to history (for future "recent schemas" feature)
 */
export const saveToSchemaHistory = (schemaText: string, name?: string): boolean => {
  try {
    const existing = getItem(STORAGE_KEYS.SCHEMA_HISTORY);
    let history: Array<{ schema: string; name?: string; savedAt: string }> = [];
    
    if (existing) {
      history = JSON.parse(existing) || [];
    }
    
    // Add new schema to history
    const newEntry = {
      schema: schemaText,
      name: name || `Schema ${new Date().toLocaleString()}`,
      savedAt: new Date().toISOString()
    };
    
    // Remove duplicates and limit to 10 entries
    history = history.filter(item => item.schema !== schemaText);
    history.unshift(newEntry);
    history = history.slice(0, 10);
    
    return setItem(STORAGE_KEYS.SCHEMA_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.warn('Failed to save to schema history:', error);
    return false;
  }
};

/**
 * Get schema history
 */
export const getSchemaHistory = (): Array<{ schema: string; name?: string; savedAt: string }> => {
  try {
    const stored = getItem(STORAGE_KEYS.SCHEMA_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load schema history:', error);
    return [];
  }
};
