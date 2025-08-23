# Dynamic Validation Examples

This document provides comprehensive examples of how to use dynamic validation rules that change based on other field values.

## 🎯 **Core Concept**

Dynamic validation allows validation rules to adapt based on the values of other fields in the form. For example:
- **Personal ID**: Requires exactly 10 digits
- **Passport**: Requires 2 letters followed by 7 digits  
- **Driver's License**: Requires 1 letter followed by 8 digits

## 🔧 **Basic Dynamic Validation**

### Simple Conditional Pattern
```json
{
  "identificationNumber": {
    "type": "text",
    "label": "ID Number",
    "required": true,
    "validation": {
      "conditionalRules": [
        {
          "condition": {
            "field": "identificationType",
            "operator": "equals",
            "value": "PERSONAL_ID"
          },
          "validation": {
            "pattern": "^[0-9]{10}$",
            "messages": {
              "pattern": "Personal ID must be exactly 10 digits"
            }
          }
        }
      ]
    }
  }
}
```

### Multiple Conditional Rules
```json
{
  "identificationNumber": {
    "type": "text",
    "label": "ID Number",
    "validation": {
      "conditionalRules": [
        {
          "condition": {
            "field": "idType",
            "operator": "equals",
            "value": "PERSONAL_ID"
          },
          "validation": {
            "pattern": "^[0-9]{10}$",
            "minLength": 10,
            "maxLength": 10,
            "messages": {
              "pattern": "Personal ID must be exactly 10 digits"
            }
          }
        },
        {
          "condition": {
            "field": "idType",
            "operator": "equals",
            "value": "PASSPORT"
          },
          "validation": {
            "pattern": "^[A-Z]{2}[0-9]{7}$",
            "messages": {
              "pattern": "Passport must be 2 letters followed by 7 digits (e.g., AB1234567)"
            }
          }
        }
      ]
    }
  }
}
```

## 📋 **Supported Validation Properties**

Each conditional rule can override these validation properties:

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `required` | boolean | Makes field required | `"required": true` |
| `pattern` | string | Regex pattern | `"pattern": "^[0-9]+$"` |
| `minLength` | number | Minimum string length | `"minLength": 5` |
| `maxLength` | number | Maximum string length | `"maxLength": 20` |
| `min` | number | Minimum numeric value | `"min": 0` |
| `max` | number | Maximum numeric value | `"max": 100` |
| `format` | string | Predefined format | `"format": "email"` |
| `messages` | object | Custom error messages | See examples below |

## 🎨 **Advanced Examples**

### Conditional Required Fields
```json
{
  "countryOfIssue": {
    "type": "select",
    "label": "Country of Issue",
    "required": false,
    "validation": {
      "conditionalRules": [
        {
          "condition": {
            "field": "identificationType",
            "operator": "equals",
            "value": "PASSPORT"
          },
          "validation": {
            "required": true,
            "messages": {
              "required": "Country of issue is required for passports"
            }
          }
        }
      ]
    }
  }
}
```

### Multiple Condition Types
```json
{
  "expirationDate": {
    "type": "date",
    "label": "Expiration Date",
    "required": false,
    "validation": {
      "conditionalRules": [
        {
          "condition": {
            "field": "identificationType",
            "operator": "in",
            "value": ["PASSPORT", "DRIVERS_LICENSE"]
          },
          "validation": {
            "required": true,
            "messages": {
              "required": "Expiration date is required for passports and driver's licenses"
            }
          }
        }
      ]
    }
  }
}
```

### Format-Based Validation
```json
{
  "contactMethod": {
    "type": "text",
    "label": "Contact Information",
    "validation": {
      "conditionalRules": [
        {
          "condition": {
            "field": "contactType",
            "operator": "equals",
            "value": "EMAIL"
          },
          "validation": {
            "format": "email",
            "messages": {
              "format": "Please enter a valid email address"
            }
          }
        },
        {
          "condition": {
            "field": "contactType",
            "operator": "equals",
            "value": "PHONE"
          },
          "validation": {
            "format": "phone",
            "messages": {
              "format": "Please enter a valid phone number"
            }
          }
        }
      ]
    }
  }
}
```

## 🔄 **Condition Operators**

All visibility operators are supported for dynamic validation:

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match | `"value": "PASSPORT"` |
| `not_equals` | Not equal to | `"value": "NONE"` |
| `in` | Value in array | `"value": ["TYPE1", "TYPE2"]` |
| `not_in` | Value not in array | `"value": ["INVALID"]` |
| `contains` | String/array contains | `"value": "ADMIN"` |
| `not_contains` | Doesn't contain | `"value": "TEMP"` |
| `exists` | Has any value | No value needed |
| `not_exists` | Empty/null | No value needed |

## 🏗️ **Real-World Examples**

### Credit Card Validation
```json
{
  "cardType": {
    "type": "select",
    "options": [
      {"label": "Visa", "value": "VISA"},
      {"label": "MasterCard", "value": "MASTERCARD"},
      {"label": "American Express", "value": "AMEX"}
    ]
  },
  "cardNumber": {
    "type": "text",
    "label": "Card Number",
    "validation": {
      "conditionalRules": [
        {
          "condition": {"field": "cardType", "operator": "equals", "value": "VISA"},
          "validation": {
            "pattern": "^4[0-9]{15}$",
            "messages": {"pattern": "Visa cards must start with 4 and have 16 digits"}
          }
        },
        {
          "condition": {"field": "cardType", "operator": "equals", "value": "MASTERCARD"},
          "validation": {
            "pattern": "^5[1-5][0-9]{14}$",
            "messages": {"pattern": "MasterCard must start with 51-55 and have 16 digits"}
          }
        },
        {
          "condition": {"field": "cardType", "operator": "equals", "value": "AMEX"},
          "validation": {
            "pattern": "^3[47][0-9]{13}$",
            "messages": {"pattern": "American Express must start with 34 or 37 and have 15 digits"}
          }
        }
      ]
    }
  }
}
```

### Age-Based Validation
```json
{
  "age": {
    "type": "number",
    "label": "Age"
  },
  "parentalConsent": {
    "type": "checkbox",
    "label": "Parental Consent",
    "validation": {
      "conditionalRules": [
        {
          "condition": {"field": "age", "operator": "in", "value": [16, 17]},
          "validation": {
            "required": true,
            "messages": {"required": "Parental consent is required for minors"}
          }
        }
      ]
    }
  }
}
```

### Country-Specific Validation
```json
{
  "country": {
    "type": "select",
    "options": [
      {"label": "United States", "value": "US"},
      {"label": "Canada", "value": "CA"},
      {"label": "United Kingdom", "value": "UK"}
    ]
  },
  "postalCode": {
    "type": "text",
    "label": "Postal Code",
    "validation": {
      "conditionalRules": [
        {
          "condition": {"field": "country", "operator": "equals", "value": "US"},
          "validation": {
            "pattern": "^[0-9]{5}(-[0-9]{4})?$",
            "messages": {"pattern": "US ZIP code must be 5 digits or 5+4 format"}
          }
        },
        {
          "condition": {"field": "country", "operator": "equals", "value": "CA"},
          "validation": {
            "pattern": "^[A-Z][0-9][A-Z] [0-9][A-Z][0-9]$",
            "messages": {"pattern": "Canadian postal code format: A1A 1A1"}
          }
        },
        {
          "condition": {"field": "country", "operator": "equals", "value": "UK"},
          "validation": {
            "pattern": "^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}$",
            "messages": {"pattern": "UK postcode format: SW1A 1AA"}
          }
        }
      ]
    }
  }
}
```

## 💡 **Best Practices**

1. **Clear Error Messages**: Provide specific, helpful error messages for each condition
2. **Logical Grouping**: Group related conditional rules together
3. **Performance**: Conditional validation runs on every form value change
4. **Testing**: Test all condition combinations thoroughly
5. **User Experience**: Make it clear to users why validation rules change

## 🔄 **How It Works**

1. **Real-time Evaluation**: Validation rules are evaluated whenever form values change
2. **Rule Merging**: Conditional rules override base validation rules when conditions are met
3. **Message Priority**: Conditional validation messages take precedence over base messages
4. **Multiple Rules**: Multiple conditional rules can apply simultaneously
5. **Nested Fields**: Works with nested field references using dot notation

## 🚀 **Live Demo**

The current form schema includes a complete example in the "Dynamic Validation Examples" section:

1. **Select "Personal ID"** → Number field requires only digits (no letters allowed)
2. **Select "Passport"** → Number field requires 2 letters + 7 digits, Country becomes required
3. **Select "Driver's License"** → Number field requires 1 letter + 8 digits, Expiration becomes required

Try different combinations to see how validation rules adapt in real-time! 🎯
