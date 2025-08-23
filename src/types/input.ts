// Input field types based on the comprehensive input schema

export type InputType = 
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  | 'date' | 'datetime-local' | 'time' | 'month' | 'week' | 'color' | 'range'
  | 'file' | 'hidden' | 'textarea' | 'select' | 'multiselect' | 'radio' 
  | 'checkbox' | 'switch' | 'rating' | 'slider' | 'autocomplete' | 'tags'
  | 'rich-text' | 'code' | 'json' | 'group';

export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'outlined' | 'filled' | 'underlined' | 'borderless';
export type InputColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
export type ResizeMode = 'none' | 'both' | 'horizontal' | 'vertical';
export type AutoComplete = 
  | 'off' | 'on' | 'name' | 'email' | 'username' | 'current-password' | 'new-password'
  | 'given-name' | 'family-name' | 'street-address' | 'postal-code' | 'country'
  | 'tel' | 'url' | 'cc-name' | 'cc-number' | 'cc-exp' | 'cc-csc';

export type ValidationFormat = 'email' | 'url' | 'date' | 'time' | 'datetime' | 'phone' | 'postal-code' | 'credit-card';
export type ConditionalOperator = 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than' | 'in' | 'not-in';
export type ConditionalAction = 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'optional';

// Visibility condition types
export type VisibilityOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'exists' | 'not_exists';
export type VisibilityLogic = 'and' | 'or';

export interface VisibilityConditionRule {
  field: string;
  operator: VisibilityOperator;
  value?: string | number | boolean | Array<string | number | boolean>;
}

export interface VisibilityCondition {
  field?: string;
  operator?: VisibilityOperator;
  value?: string | number | boolean | Array<string | number | boolean>;
  logic?: VisibilityLogic;
  conditions?: VisibilityConditionRule[];
}
export type InputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
export type AutoCapitalize = 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';

export interface InputOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  description?: string;
  icon?: string;
  group?: string;
}

export interface ValidationMessages {
  required?: string;
  min?: string;
  max?: string;
  minLength?: string;
  maxLength?: string;
  pattern?: string;
  format?: string;
  custom?: string;
}

export interface InputValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: ValidationFormat;
  custom?: string;
  messages?: ValidationMessages;
}

export interface InputIcon {
  left?: string;
  right?: string;
}

export interface ConditionalLogic {
  field: string;
  operator: ConditionalOperator;
  value: string | number | boolean | Array<any>;
  action: ConditionalAction;
}

export interface GridConfig {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface InputEvents {
  onChange?: string;
  onFocus?: string;
  onBlur?: string;
  onKeyPress?: string;
  onKeyDown?: string;
  onKeyUp?: string;
  onClick?: string;
  onDoubleClick?: string;
}

export interface InputField {
  // Core properties
  id: string;
  name: string;
  type: InputType;
  
  // Display properties
  label?: string;
  placeholder?: string;
  description?: string;
  
  // Value properties
  defaultValue?: string | number | boolean | Array<any> | object;
  
  // State properties
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  loading?: boolean;
  
  // Validation
  validation?: InputValidation;
  
  // Options (for select, radio, checkbox, etc.)
  options?: Array<string | InputOption>;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  
  // Fields (for group type)
  fields?: Record<string, InputField>;
  
  // Visibility conditions
  visibilityCondition?: VisibilityCondition;
  
  // HTML attributes
  autoComplete?: AutoComplete;
  step?: number;
  accept?: string;
  maxFileSize?: number;
  maxFiles?: number;
  rows?: number;
  cols?: number;
  resize?: ResizeMode;
  spellcheck?: boolean;
  autocapitalize?: AutoCapitalize;
  inputmode?: InputMode;
  
  // Styling
  size?: InputSize;
  variant?: InputVariant;
  color?: InputColor;
  icon?: InputIcon;
  prefix?: string;
  suffix?: string;
  
  // Behavior
  debounce?: number;
  conditional?: ConditionalLogic;
  
  // Layout
  grid?: GridConfig;
  
  // Custom
  className?: string;
  style?: React.CSSProperties;
  attributes?: Record<string, any>;
  events?: InputEvents;
}

// Form schema that contains multiple input fields
export interface FormSchema {
  title?: string;
  description?: string;
  fields: InputField[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  submitButton?: {
    label?: string;
    color?: InputColor;
    size?: InputSize;
    disabled?: boolean;
    loading?: boolean;
  };
  resetButton?: {
    label?: string;
    color?: InputColor;
    size?: InputSize;
    disabled?: boolean;
  };
}

// Utility types for form values
export type FormValues = Record<string, any>;
export type FormErrors = Record<string, string>;
export type FormTouched = Record<string, boolean>;

// Form state interface
export interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Input field groups for organization
export interface InputFieldGroup {
  title?: string;
  description?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  fields: InputField[];
  conditional?: ConditionalLogic;
  grid?: GridConfig;
  className?: string;
}

// Extended form schema with groups
export interface ExtendedFormSchema extends Omit<FormSchema, 'fields'> {
  groups?: InputFieldGroup[];
  fields?: InputField[];
}
