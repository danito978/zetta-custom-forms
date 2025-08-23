// Color system types for the application
export type ColorVariant = 
  | '50' | '100' | '200' | '300' | '400' | '500' 
  | '600' | '700' | '800' | '900' | '950';

export type ColorPalette = 
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';

export type SemanticColor = 
  | 'success' | 'warning' | 'error' | 'info';

// Helper type for creating color class names
export type ColorClass = `${ColorPalette}-${ColorVariant}`;

// Common color combinations for components
export interface ColorTheme {
  background: ColorClass;
  text: ColorClass;
  border?: ColorClass;
  hover?: ColorClass;
}

// Predefined themes for common UI patterns
export const colorThemes = {
  primary: {
    background: 'primary-500' as ColorClass,
    text: 'white' as any,
    hover: 'primary-600' as ColorClass,
  },
  secondary: {
    background: 'secondary-500' as ColorClass,
    text: 'white' as any,
    hover: 'secondary-600' as ColorClass,
  },
  success: {
    background: 'success-500' as ColorClass,
    text: 'white' as any,
    hover: 'success-600' as ColorClass,
  },
  warning: {
    background: 'warning-500' as ColorClass,
    text: 'white' as any,
    hover: 'warning-600' as ColorClass,
  },
  error: {
    background: 'error-500' as ColorClass,
    text: 'white' as any,
    hover: 'error-600' as ColorClass,
  },
  neutral: {
    background: 'neutral-100' as ColorClass,
    text: 'neutral-900' as ColorClass,
    border: 'neutral-200' as ColorClass,
    hover: 'neutral-200' as ColorClass,
  },
} as const;
