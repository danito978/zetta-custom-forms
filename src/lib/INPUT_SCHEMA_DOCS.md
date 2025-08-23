# Input Field Schema Documentation

This document describes the comprehensive input field schema that supports all possible input types and configurations for dynamic form generation.

## Overview

The input schema is designed to be flexible and comprehensive, supporting everything from basic text inputs to complex components like rich text editors, file uploads, and conditional logic.

## Core Properties

### Required Properties
- **`id`** (string): Unique identifier for the input field
- **`name`** (string): Name attribute for the input field
- **`type`** (InputType): Type of input field (see Input Types section)

### Display Properties
- **`label`** (string): Display label for the input field
- **`placeholder`** (string): Placeholder text shown when input is empty
- **`description`** (string): Help text or description for the field

## Input Types

### Text-based Inputs
- `text` - Standard text input
- `email` - Email input with validation
- `password` - Password input (masked)
- `tel` - Telephone number input
- `url` - URL input with validation
- `search` - Search input
- `textarea` - Multi-line text input

### Numeric Inputs
- `number` - Numeric input
- `range` - Slider/range input
- `rating` - Star rating input
- `slider` - Custom slider component

### Date/Time Inputs
- `date` - Date picker
- `datetime-local` - Date and time picker
- `time` - Time picker
- `month` - Month picker
- `week` - Week picker

### Selection Inputs
- `select` - Dropdown selection
- `multiselect` - Multiple selection dropdown
- `radio` - Radio button group
- `checkbox` - Checkbox input
- `switch` - Toggle switch
- `autocomplete` - Autocomplete input with suggestions
- `tags` - Tag input for multiple values

### File Inputs
- `file` - File upload input

### Advanced Inputs
- `color` - Color picker
- `rich-text` - Rich text editor
- `code` - Code editor with syntax highlighting
- `json` - JSON editor
- `hidden` - Hidden input field

## Validation

The `validation` object supports comprehensive validation rules:

```json
{
  "validation": {
    "min": 0,
    "max": 100,
    "minLength": 3,
    "maxLength": 50,
    "pattern": "^[A-Za-z]+$",
    "format": "email",
    "custom": "validateCustomRule",
    "messages": {
      "required": "This field is required",
      "min": "Value must be at least {min}",
      "max": "Value cannot exceed {max}",
      "pattern": "Please enter a valid format",
      "format": "Please enter a valid email address"
    }
  }
}
```

### Validation Formats
- `email` - Email address validation
- `url` - URL validation
- `date` - Date format validation
- `time` - Time format validation
- `datetime` - Date and time validation
- `phone` - Phone number validation
- `postal-code` - Postal code validation
- `credit-card` - Credit card number validation

## Options for Selection Fields

For `select`, `radio`, `checkbox`, and `multiselect` fields:

```json
{
  "options": [
    "Simple string option",
    {
      "label": "Option Label",
      "value": "option_value",
      "disabled": false,
      "description": "Additional description",
      "icon": "icon-name",
      "group": "Option Group"
    }
  ]
}
```

## Conditional Logic

Fields can be shown/hidden or enabled/disabled based on other field values:

```json
{
  "conditional": {
    "field": "user_type",
    "operator": "equals",
    "value": "premium",
    "action": "show"
  }
}
```

### Conditional Operators
- `equals` / `not-equals`
- `contains` / `not-contains`
- `greater-than` / `less-than`
- `in` / `not-in`

### Conditional Actions
- `show` / `hide`
- `enable` / `disable`
- `require` / `optional`

## Styling and Layout

### Size Options
- `small` - Compact size
- `medium` - Default size
- `large` - Large size

### Variants
- `outlined` - Outlined border (default)
- `filled` - Filled background
- `underlined` - Bottom border only
- `borderless` - No border

### Colors
Uses the project's color system:
- `primary` - Main brand color
- `secondary` - Secondary color
- `success` - Success/positive color
- `warning` - Warning color
- `error` - Error/danger color
- `neutral` - Neutral/gray color

### Grid Layout
Responsive grid configuration:

```json
{
  "grid": {
    "xs": 12,
    "sm": 6,
    "md": 4,
    "lg": 3,
    "xl": 2
  }
}
```

## File Upload Configuration

For `file` type inputs:

```json
{
  "type": "file",
  "accept": "image/*,.pdf,.doc,.docx",
  "maxFileSize": 5242880,
  "maxFiles": 3,
  "multiple": true
}
```

## Events

Event handlers can be specified as function names:

```json
{
  "events": {
    "onChange": "handleFieldChange",
    "onFocus": "handleFieldFocus",
    "onBlur": "handleFieldBlur",
    "onKeyPress": "handleKeyPress"
  }
}
```

## Complete Example

```json
{
  "id": "user_email",
  "name": "email",
  "type": "email",
  "label": "Email Address",
  "placeholder": "Enter your email address",
  "description": "We'll use this to send you important updates",
  "required": true,
  "validation": {
    "format": "email",
    "messages": {
      "required": "Email address is required",
      "format": "Please enter a valid email address"
    }
  },
  "size": "medium",
  "variant": "outlined",
  "color": "primary",
  "icon": {
    "left": "mail"
  },
  "autoComplete": "email",
  "grid": {
    "xs": 12,
    "md": 6
  },
  "events": {
    "onChange": "validateEmail",
    "onBlur": "checkEmailAvailability"
  }
}
```

## Form Schema Structure

A complete form can be defined using the `FormSchema` interface:

```json
{
  "title": "User Registration Form",
  "description": "Please fill out all required fields",
  "layout": "grid",
  "fields": [
    // Array of input field objects
  ],
  "submitButton": {
    "label": "Create Account",
    "color": "primary",
    "size": "large"
  },
  "resetButton": {
    "label": "Clear Form",
    "color": "neutral",
    "size": "medium"
  }
}
```

## Field Groups

Fields can be organized into collapsible groups:

```json
{
  "groups": [
    {
      "title": "Personal Information",
      "description": "Basic personal details",
      "collapsible": true,
      "collapsed": false,
      "fields": [
        // Array of input field objects
      ],
      "conditional": {
        "field": "show_personal",
        "operator": "equals",
        "value": true,
        "action": "show"
      }
    }
  ]
}
```

## Best Practices

1. **Use semantic field names** - Choose descriptive `id` and `name` values
2. **Provide helpful labels and descriptions** - Make forms user-friendly
3. **Implement proper validation** - Use appropriate validation rules and clear error messages
4. **Consider mobile users** - Use appropriate `inputmode` and `autocapitalize` settings
5. **Group related fields** - Use field groups to organize complex forms
6. **Test conditional logic** - Ensure conditional fields work as expected
7. **Optimize for accessibility** - Include proper labels and ARIA attributes
8. **Use consistent styling** - Stick to the defined color and size system

## TypeScript Integration

Import the types in your React components:

```typescript
import { InputField, FormSchema, FormState } from '../types/input';

const MyForm: React.FC<{ schema: FormSchema }> = ({ schema }) => {
  // Component implementation
};
```

This schema provides a complete foundation for building dynamic, flexible forms with comprehensive validation, styling, and interaction capabilities.
