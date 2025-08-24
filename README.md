# Zetta Custom Forms - Dynamic Form Generator

taking inspiration from: https://rjsf-team.github.io/react-jsonschema-form/

A powerful, enterprise-grade React-based dynamic form generator that creates complex forms from JSON schemas with advanced validation, conditional logic, API integration, and modern UI components.

## 🚀 Features

### ✨ **Core Functionality**
- **Dynamic Form Generation**: Create complex forms from JSON schema definitions
- **Real-time Validation**: Advanced validation system with debounced real-time feedback
- **Nested Group Support**: Organize fields into visual groups with unlimited nesting and colored borders
- **Multiple Field Types**: Support for all common input types with custom validations
- **Professional UI**: Built with ShadCN UI components for a modern, accessible interface
- **Context-Based Architecture**: Centralized state management with React Context for optimal performance

### 🎯 **Supported Field Types**
- **Text Fields**: `text`, `email`, `password`, `tel`, `url`, `search`
- **Textarea**: Multi-line text input with character limits
- **Number**: Numeric input with min/max validation
- **Select**: Dropdown with single selection
- **Radio**: Single choice from multiple options
- **Checkbox**: Multiple selections or single toggle
- **Date/Time**: `date`, `datetime-local`, `time`, `month`, `week`
- **File**: File upload with accept filters
- **Group**: Container for nested fields with visual grouping

### 🔧 **Advanced Features**
- **Dynamic Visibility**: Show/hide fields and groups based on other field values with complex conditional logic
- **Conditional Validation**: Apply different validation rules based on form context and field dependencies
- **API Integration**: Auto-fill fields with external API data (with mock implementation)
- **Local Storage**: Persist custom schemas across browser sessions
- **Real-time Validation Context**: Centralized validation with error categorization and timestamps
- **Form Context Management**: Nested field path support with dot notation (e.g., `user.profile.email`)
- **Comprehensive Testing**: 27+ unit tests covering all major functionality
- **Custom Error Messages**: Field-specific error messages with validation type detection
- **Debounced Performance**: Optimized validation with configurable debounce timing
- **Structured Data Output**: JSON output maintaining schema hierarchy and field relationships

## 📋 **Quick Start**

### 1. **Navigation**
The application has two main pages:
- **Home**: Welcome page with project overview
- **Form Generator**: Main form builder interface

### 2. **Creating Forms**
1. Navigate to the **Form Generator** page
2. Use the **Custom Schema Input** to define your form structure
3. Click **Load Example** to see a sample schema
4. Edit the JSON schema to customize your form
5. The form preview updates automatically when the schema is valid

### 3. **Basic Schema Structure**
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

## 🎯 **Advanced Features**

### **Dynamic Visibility**
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
    "fields": { /* ... */ }
  }
}
```

**Supported Operators:**
- `equals`: Field value equals specific value
- `in`: Field value is in array of values
- `not_equals`: Field value does not equal specific value

### **Conditional Validation**
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
        },
        {
          "condition": {
            "field": "identificationType", 
            "operator": "equals",
            "value": "PASSPORT"
          },
          "validation": {
            "pattern": "^[A-Z0-9]+$",
            "messages": {
              "pattern": "Passport must be uppercase letters and numbers"
            }
          }
        }
      ]
    }
  }
}
```

### **API Integration & Auto-fill**
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
        "postalCode": "postalCode",
        "population": "population"
      },
      "debounceMs": 500,
      "loadingMessage": "Fetching city data..."
    }
  }
}
```

### **Local Storage Persistence**
Custom schemas are automatically saved to localStorage and restored on page refresh. Features include:
- Auto-save on schema changes
- Visual indicators for saved schemas
- Last saved timestamp display
- Clear storage functionality

## 🏗️ **Schema Documentation**

### **Field Properties**
All fields support these common properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the field |
| `name` | string | ✅ | Form field name (used in output) |
| `type` | string | ✅ | Field type (see supported types) |
| `label` | string | ❌ | Display label for the field |
| `placeholder` | string | ❌ | Placeholder text |
| `description` | string | ❌ | Help text shown below the field |
| `required` | boolean | ❌ | Whether the field is required |
| `disabled` | boolean | ❌ | Whether the field is disabled |
| `validation` | object | ❌ | Validation rules and messages |

### **Validation Options**
```json
{
  "validation": {
    "min": 0,                    // Minimum value (numbers)
    "max": 100,                  // Maximum value (numbers)
    "minLength": 2,              // Minimum string length
    "maxLength": 50,             // Maximum string length
    "pattern": "^[A-Za-z]+$",    // Regex pattern
    "format": "email",           // Predefined format (email, url, etc.)
    "messages": {
      "required": "Custom required message",
      "minLength": "Custom min length message",
      "maxLength": "Custom max length message",
      "pattern": "Custom pattern message",
      "format": "Custom format message"
    }
  }
}
```

### **Field Type Examples**

#### **Text Input**
```json
{
  "firstName": {
    "id": "firstName",
    "name": "firstName",
    "type": "text",
    "label": "First Name",
    "placeholder": "Enter your first name",
    "required": true,
    "validation": {
      "minLength": 2,
      "maxLength": 50,
      "pattern": "^[A-Za-z\\s'-]+$"
    }
  }
}
```

#### **Select Dropdown**
```json
{
  "country": {
    "id": "country",
    "name": "country",
    "type": "select",
    "label": "Country",
    "required": true,
    "options": [
      { "label": "United States", "value": "us" },
      { "label": "Canada", "value": "ca" },
      { "label": "United Kingdom", "value": "uk" }
    ]
  }
}
```

#### **Radio Buttons**
```json
{
  "experience": {
    "id": "experience",
    "name": "experience",
    "type": "radio",
    "label": "Years of Experience",
    "required": true,
    "options": [
      { "label": "0-1 years (Entry level)", "value": "entry" },
      { "label": "2-5 years (Junior)", "value": "junior" },
      { "label": "6-10 years (Mid-level)", "value": "mid" },
      { "label": "11+ years (Senior)", "value": "senior" }
    ]
  }
}
```

#### **Checkbox Group**
```json
{
  "skills": {
    "id": "skills",
    "name": "skills",
    "type": "checkbox",
    "label": "Technical Skills",
    "description": "Select all that apply",
    "options": [
      { "label": "JavaScript", "value": "javascript" },
      { "label": "TypeScript", "value": "typescript" },
      { "label": "React", "value": "react" },
      { "label": "Node.js", "value": "nodejs" }
    ]
  }
}
```

#### **Nested Groups**
```json
{
  "personalInfo": {
    "id": "personalInfo",
    "name": "personalInfo",
    "type": "group",
    "label": "Personal Information",
    "description": "Your basic details",
    "fields": {
      "firstName": {
        "id": "firstName",
        "name": "firstName",
        "type": "text",
        "label": "First Name",
        "required": true
      },
      "address": {
        "id": "address",
        "name": "address",
        "type": "group",
        "label": "Address",
        "fields": {
          "street": {
            "id": "street",
            "name": "street",
            "type": "text",
            "label": "Street Address"
          },
          "city": {
            "id": "city",
            "name": "city",
            "type": "text",
            "label": "City"
          }
        }
      }
    }
  }
}
```

## 🎨 **UI Components & Styling**

### **Design System**
- **Framework**: Built with ShadCN UI components
- **Styling**: Tailwind CSS with custom color palette
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **Responsive**: Mobile-first design with touch-friendly interactions

### **Color Palette**
The application uses a comprehensive color system:

| Color | Usage | Example Classes |
|-------|-------|----------------|
| **Primary** | Main actions, navigation | `bg-primary-500`, `text-primary-600` |
| **Secondary** | Secondary actions | `bg-secondary-500`, `text-secondary-600` |
| **Success** | Success states, confirmations | `bg-success-500`, `text-success-600` |
| **Warning** | Warnings, cautions | `bg-warning-500`, `text-warning-600` |
| **Error/Destructive** | Errors, destructive actions | `bg-destructive`, `text-destructive` |
| **Muted** | Secondary text, descriptions | `text-muted-foreground`, `bg-muted` |

### **Component Architecture**
```
src/
├── components/
│   ├── ui/                    # ShadCN UI components
│   └── Navigation.tsx         # Global navigation
├── pages/
│   ├── Home/                  # Home page components
│   └── FormGenerator/         # Form generator page
│       ├── components/
│       │   ├── SchemaInput.tsx       # JSON schema editor with localStorage
│       │   ├── FormGenerator.tsx     # Main form renderer with contexts
│       │   └── DynamicField/         # Field components
│       │       ├── TextInput.tsx     # Text input with validation
│       │       ├── SelectInput.tsx   # Dropdown with options
│       │       ├── CheckboxInput.tsx # Checkbox groups
│       │       ├── RadioInput.tsx    # Radio button groups
│       │       ├── GroupInput.tsx    # Nested field groups
│       │       ├── NumberInput.tsx   # Numeric input
│       │       ├── TextareaInput.tsx # Multi-line text
│       │       ├── DateInput.tsx     # Date/time inputs
│       │       └── FileInput.tsx     # File upload
│       ├── context/
│       │   ├── FormContext.tsx       # Form state management
│       │   └── ValidationContext.tsx # Validation state management
│       ├── hooks/
│       │   └── useApiIntegration.tsx # API integration hook
│       └── utils/
│           ├── schemaValidator.ts         # Schema validation logic
│           ├── visibilityEvaluator.ts     # Dynamic visibility logic
│           ├── dynamicValidationEvaluator.ts # Conditional validation
│           ├── formDataStructurer.ts      # Data output structuring
│           └── localStorage.ts            # Local storage utilities
├── types/
│   ├── input.ts               # TypeScript type definitions
│   └── colors.ts              # Color system types
└── lib/
    ├── utils.ts              # Utility functions
    ├── input-schema.json     # JSON schema definition
    └── form-schema.json      # Default form example
```

## 🔧 **Technical Implementation**

### **Context-Based State Management**
- **FormContext**: Centralized form values with nested field path support
- **ValidationContext**: Real-time validation with error categorization and timestamps
- **React Hooks**: `useState`, `useEffect`, `useCallback`, `useMemo` for optimized performance
- **Debounced Validation**: Configurable debounce timing (300ms default) for real-time feedback
- **Error Persistence**: Validation errors persist across field interactions

### **Performance Optimizations**
- **Debounced Validation**: 500ms delay for schema input validation
- **Memoized Callbacks**: `useCallback` for stable function references
- **Component Lazy Loading**: Dynamic imports for better code splitting
- **Efficient Re-renders**: Optimized state updates and dependency arrays

### **Advanced Validation System**
- **Real-time Validation**: Debounced validation with visual feedback (loading spinners, error states)
- **Conditional Validation**: Dynamic validation rules based on other field values
- **Error Categorization**: Validation errors categorized by type (required, format, length, range, pattern, custom, api)
- **Cross-field Dependencies**: Validation rules that consider the entire form context
- **Custom Error Messages**: Field-specific error messages with fallback to default messages
- **Validation Context**: Centralized validation state with touched field tracking

### **Testing Coverage**
Comprehensive test suite with 27+ unit tests covering:

#### **ValidationContext Tests** (9 tests)
- Required field validation
- MinLength/MaxLength validation  
- Pattern matching validation
- Numeric range validation
- Touched state management
- Error clearing functionality
- Validation callback integration

#### **FormContext Tests** (10 tests)
- Form initialization with default values
- Simple and nested field updates
- Dot notation field paths (e.g., `user.profile.email`)
- Bulk form value updates
- Auto-fill functionality
- Form reset capabilities
- Deep nested object creation
- Value preservation during updates

#### **Dynamic Validation Tests** (8 tests)
- Basic validation rules (required, length, pattern, range)
- Conditional validation based on other fields
- Multiple conditional rules per field
- Nested field conditions
- Array value matching with "in" operator
- Combined base and conditional validations
- Validation message prioritization

**Run Tests:**
```bash
npm test                           # Run all tests
npm test -- --testPathPattern="FormGenerator"  # Run form-specific tests
npm test -- --coverage           # Run with coverage report
```

## 📊 **Data Flow**

### **Input → Processing → Output**

1. **Schema Input**: User enters JSON schema in the editor
2. **Validation**: Real-time validation of JSON syntax and structure
3. **Form Generation**: Dynamic creation of form fields based on schema
4. **User Interaction**: User fills out the generated form
5. **Validation**: Field-level validation as user types/interacts
6. **Submission**: Form data collected and structured according to schema
7. **Output**: JSON object with hierarchical data matching schema structure

### **Example Data Flow**
```json
// Input Schema
{
  "fields": {
    "personalInfo": {
      "type": "group",
      "fields": {
        "name": { "type": "text" },
        "email": { "type": "text" }
      }
    }
  }
}

// Output Data
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## 🚀 **Development**

### **Prerequisites**
- Node.js 16+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone https://github.com/danito978/zetta-custom-forms.git
cd zetta-custom-forms

# Install dependencies
npm install

# Start development server
npm start
```

### **Available Scripts**
```bash
# Development
npm start          # Start development server (http://localhost:3000)
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App (not recommended)
```

### **Project Structure**
```
zetta-custom-forms/
├── public/                    # Static assets
├── src/                      # Source code
│   ├── components/           # Reusable components
│   ├── pages/               # Page components
│   ├── types/               # TypeScript definitions
│   ├── lib/                 # Utilities and schemas
│   └── index.tsx            # Application entry point
├── components.json          # ShadCN configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🎯 **Use Cases**

### **Perfect For:**
- **Dynamic Surveys**: Create surveys with conditional logic
- **Configuration Forms**: Build admin panels and settings forms
- **Data Collection**: Gather structured data with validation
- **Form Prototyping**: Quickly prototype complex forms
- **Multi-step Forms**: Create grouped, organized form flows

### **Example Applications:**
- User registration and onboarding
- Product configuration forms
- Survey and feedback collection
- Admin panel settings
- Data entry applications
- Form builders and generators

## 🔮 **Future Enhancements**

### **Completed Features** ✅
- ✅ **Conditional Logic**: Dynamic show/hide fields based on other field values
- ✅ **API Integration**: Auto-fill fields with external API data (mock implementation)
- ✅ **Advanced Validation**: Conditional validation rules and cross-field dependencies
- ✅ **Local Storage**: Persist custom schemas across browser sessions
- ✅ **Comprehensive Testing**: 27+ unit tests with full coverage of core functionality
- ✅ **Context Architecture**: FormContext and ValidationContext for optimal state management
- ✅ **Real-time Validation**: Debounced validation with visual feedback

### **Planned Features**
- **Multi-step Forms**: Wizard-style form progression with step validation
- **Enhanced File Upload**: File handling with preview, drag-and-drop, and progress indicators
- **Custom Components**: Plugin system for custom field types and validators
- **Form Templates**: Pre-built form templates for common use cases
- **Export/Import**: Save and load form configurations as JSON files
- **Form Analytics**: Track form completion rates and field interaction metrics
- **Internationalization**: Multi-language support with locale-specific validation

### **Technical Improvements**
- **Performance**: Virtual scrolling for large forms with 100+ fields
- **Accessibility**: Enhanced screen reader support and keyboard navigation
- **Documentation**: Interactive documentation site with live examples
- **Theming**: Multiple theme options and custom CSS variable support
- **Mobile Optimization**: Enhanced touch interactions and mobile-specific UI patterns
- **TypeScript**: Stricter type definitions and improved developer experience

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **ShadCN UI**: For the beautiful, accessible UI components and design system
- **Tailwind CSS**: For the utility-first CSS framework and responsive design capabilities
- **React**: For the powerful component-based architecture and Context API
- **TypeScript**: For type safety, developer experience, and robust error handling
- **React Testing Library**: For comprehensive testing utilities and best practices
- **Jest**: For the testing framework and excellent developer tooling

## 📈 **Project Stats**

- **Lines of Code**: 5,000+ (TypeScript/React)
- **Components**: 15+ reusable UI components
- **Test Coverage**: 27+ unit tests with comprehensive coverage
- **Field Types**: 8 supported input types with extensible architecture
- **Validation Rules**: 10+ built-in validation types with conditional logic
- **Features**: 20+ advanced features including API integration and local storage

---

**Built with ❤️ by the Zetta Forms team**

This project demonstrates enterprise-grade React development with advanced state management, comprehensive testing, and modern UI/UX patterns. Perfect for developers looking to understand complex form systems, validation architectures, and React Context patterns.

For questions, issues, or feature requests, please visit our [GitHub repository](https://github.com/danito978/zetta-custom-forms).