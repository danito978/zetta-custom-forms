# Zetta Custom Forms - Dynamic Form Generator

Taking inspiration from: https://rjsf-team.github.io/react-jsonschema-form/

Built following Bulletproof React architecture patterns: https://github.com/alan2207/bulletproof-react

## Features

### Core Functionality
- Dynamic form generation from JSON schema definitions
- Real-time validation with debounced feedback
- Nested group support with unlimited nesting
- Multiple field types with custom validations
- Built with ShadCN UI components
- Context-based state management

### Supported Field Types
- Text fields: text, email, password, tel, url, search
- Textarea: Multi-line text input
- Number: Numeric input with min/max validation
- Select: Dropdown with single selection
- Radio: Single choice from multiple options
- Checkbox: Multiple selections or single toggle
- Date/Time: date, datetime-local, time, month, week
- File: File upload with accept filters
- Group: Container for nested fields

### Advanced Features
- Dynamic visibility: Show/hide fields based on other field values
- Conditional validation: Different validation rules based on form context
- API integration: Auto-fill fields with external API data
- Local storage: Persist custom schemas and form data across sessions
- Form auto-save: Automatically save form progress
- Structured data output: JSON output maintaining schema hierarchy

## Quick Start

### Navigation
- Home: Welcome page
- Form Generator: Main form builder interface

### Creating Forms
1. Navigate to the Form Generator page
2. Use the Custom Schema Input to define your form structure
3. Click Load Example to see a sample schema
4. Edit the JSON schema to customize your form
5. The form preview updates automatically when the schema is valid

### Basic Schema Structure
```json
{
  "title": "My Custom Form",
  "description": "A sample form with various field types",
  "fields": {
    "fieldName": {
      "id": "fieldName",
      "name": "fieldName",
      "type": "text",
      "label": "Field Label",
      "placeholder": "Enter text...",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 50,
        "messages": {
          "required": "This field is required",
          "minLength": "Must be at least 2 characters"
        }
      }
    }
  }
}
```

## Advanced Features

### Dynamic Visibility
Show or hide fields and groups based on other field values:

```json
{
  "personalInfo": {
    "type": "group",
    "label": "Personal Information",
    "visibilityCondition": {
      "field": "accountType",
      "operator": "equals",
      "value": "INDIVIDUAL"
    },
    "fields": { }
  }
}
```

Supported operators: equals, in, not_equals

### Conditional Validation
Apply different validation rules based on form context:

```json
{
  "identificationNumber": {
    "type": "text",
    "label": "ID Number",
    "validation": {
      "conditionalRules": [
        {
          "condition": {
            "field": "identificationType",
            "operator": "equals",
            "value": "PERSONAL_ID"
          },
          "validation": {
            "pattern": "^[0-9]+$",
            "messages": {
              "pattern": "Personal ID must contain only numbers"
            }
          }
        }
      ]
    }
  }
}
```

### API Integration
Auto-populate fields with external API data:

```json
{
  "city": {
    "type": "text",
    "label": "City",
    "apiIntegration": {
      "trigger": "onBlur",
      "apiFunction": "fetchCityData",
      "targetFields": {
        "region": "region",
        "postalCode": "postalCode"
      },
      "debounceMs": 500
    }
  }
}
```

## Schema Documentation

### Field Properties
All fields support these common properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique identifier for the field |
| name | string | Yes | Form field name (used in output) |
| type | string | Yes | Field type |
| label | string | No | Display label for the field |
| placeholder | string | No | Placeholder text |
| description | string | No | Help text shown below the field |
| required | boolean | No | Whether the field is required |
| disabled | boolean | No | Whether the field is disabled |
| validation | object | No | Validation rules and messages |

### Validation Options
```json
{
  "validation": {
    "min": 0,
    "max": 100,
    "minLength": 2,
    "maxLength": 50,
    "pattern": "^[A-Za-z]+$",
    "format": "email",
    "messages": {
      "required": "Custom required message",
      "minLength": "Custom min length message",
      "pattern": "Custom pattern message"
    }
  }
}
```

## Technical Implementation

### Architecture
- FormContext: Centralized form values with nested field path support
- ValidationContext: Real-time validation with error categorization
- React Hooks: useState, useEffect, useCallback, useMemo for performance
- Debounced validation: Configurable timing for real-time feedback

### Component Structure
```
src/
├── components/ui/          # ShadCN UI components
├── pages/FormGenerator/    # Form generator page
│   ├── components/         # Form components
│   ├── context/           # React contexts
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utility functions
├── types/                 # TypeScript definitions
└── lib/                   # Schemas and utilities
```

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
git clone https://github.com/danito978/zetta-custom-forms.git
cd zetta-custom-forms
npm install
npm start
```

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```