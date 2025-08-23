# Zetta Custom Forms - Dynamic Form Generator

A powerful, flexible React-based dynamic form generator that creates forms from JSON schemas with full validation, nested groups, and modern UI components.

## 🚀 Features

### ✨ **Core Functionality**
- **Dynamic Form Generation**: Create complex forms from JSON schema definitions
- **Real-time Schema Validation**: Live validation with detailed error reporting
- **Nested Group Support**: Organize fields into visual groups with unlimited nesting
- **Multiple Field Types**: Support for all common input types with custom validations
- **Professional UI**: Built with ShadCN UI components for a modern, accessible interface

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
- **Custom Validations**: Pattern matching, length limits, format validation
- **Error Handling**: Field-level and form-level validation with custom messages
- **Debounced Input**: Optimized performance with 500ms validation delay
- **Form State Management**: Complete form state with touched/dirty tracking
- **JSON Output**: Structured data output matching schema hierarchy
- **Responsive Design**: Mobile-friendly interface with touch support

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
│       │   ├── SchemaInput.tsx       # JSON schema editor
│       │   ├── FormGenerator.tsx     # Main form renderer
│       │   └── DynamicField/         # Field components
│       │       ├── TextInput.tsx
│       │       ├── SelectInput.tsx
│       │       ├── CheckboxInput.tsx
│       │       ├── RadioInput.tsx
│       │       ├── GroupInput.tsx
│       │       └── ...
│       └── utils/
│           └── schemaValidator.ts    # Schema validation logic
├── types/
│   └── input.ts               # TypeScript type definitions
└── lib/
    ├── utils.ts              # Utility functions
    ├── input-schema.json     # JSON schema definition
    └── form-schema.json      # Default form example
```

## 🔧 **Technical Implementation**

### **State Management**
- **React Hooks**: `useState`, `useEffect`, `useCallback` for component state
- **Form State**: Centralized form values, errors, and touched state
- **Validation**: Real-time validation with debouncing for performance
- **Error Handling**: Automatic error reset when schema changes

### **Performance Optimizations**
- **Debounced Validation**: 500ms delay for schema input validation
- **Memoized Callbacks**: `useCallback` for stable function references
- **Component Lazy Loading**: Dynamic imports for better code splitting
- **Efficient Re-renders**: Optimized state updates and dependency arrays

### **Validation System**
- **JSON Syntax**: Real-time JSON parsing with error reporting
- **Schema Structure**: Validation against input schema definition
- **Field Validation**: Client-side validation with custom error messages
- **Form Validation**: Complete form validation before submission

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

### **Planned Features**
- **Conditional Logic**: Show/hide fields based on other field values
- **Multi-step Forms**: Wizard-style form progression
- **File Upload**: Enhanced file handling with preview
- **Custom Components**: Plugin system for custom field types
- **Form Templates**: Pre-built form templates
- **Export/Import**: Save and load form configurations
- **API Integration**: Direct form submission to APIs

### **Technical Improvements**
- **Performance**: Virtual scrolling for large forms
- **Accessibility**: Enhanced screen reader support
- **Testing**: Comprehensive test coverage
- **Documentation**: Interactive documentation site
- **Theming**: Multiple theme options

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **ShadCN UI**: For the beautiful, accessible UI components
- **Tailwind CSS**: For the utility-first CSS framework
- **React**: For the powerful component-based architecture
- **TypeScript**: For type safety and developer experience

---

**Built with ❤️ by the Zetta Forms team**

For questions, issues, or feature requests, please visit our [GitHub repository](https://github.com/danito978/zetta-custom-forms).