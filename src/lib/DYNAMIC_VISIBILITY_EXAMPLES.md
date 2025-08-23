# Dynamic Visibility Examples

This document provides comprehensive examples of how to use dynamic visibility conditions in your form schemas.

## 🎯 Basic Visibility Conditions

### Simple Equality Check
```json
{
  "fieldName": {
    "type": "text",
    "label": "Conditional Field",
    "visibilityCondition": {
      "field": "accountType",
      "operator": "equals",
      "value": "BUSINESS"
    }
  }
}
```
**Result**: Field appears only when `accountType` equals "BUSINESS"

### Array Membership Check
```json
{
  "managementField": {
    "type": "radio",
    "label": "Management Options",
    "visibilityCondition": {
      "field": "experience",
      "operator": "in",
      "value": ["mid", "senior"]
    }
  }
}
```
**Result**: Field appears when `experience` is either "mid" or "senior"

### Field Existence Check
```json
{
  "followUpField": {
    "type": "text",
    "label": "Follow-up Question",
    "visibilityCondition": {
      "field": "email",
      "operator": "exists"
    }
  }
}
```
**Result**: Field appears when `email` has any non-empty value

## 🔗 Multiple Conditions

### AND Logic (All conditions must be true)
```json
{
  "complexField": {
    "type": "textarea",
    "label": "Business Leadership Experience",
    "visibilityCondition": {
      "logic": "and",
      "conditions": [
        {
          "field": "accountType",
          "operator": "equals",
          "value": "BUSINESS"
        },
        {
          "field": "experience",
          "operator": "in",
          "value": ["mid", "senior"]
        },
        {
          "field": "hasTeam",
          "operator": "equals",
          "value": true
        }
      ]
    }
  }
}
```
**Result**: Field appears only for business accounts with mid/senior experience who have a team

### OR Logic (Any condition can be true)
```json
{
  "flexibleField": {
    "type": "select",
    "label": "Contact Preference",
    "visibilityCondition": {
      "logic": "or",
      "conditions": [
        {
          "field": "accountType",
          "operator": "equals",
          "value": "PREMIUM"
        },
        {
          "field": "experience",
          "operator": "equals",
          "value": "senior"
        }
      ]
    }
  }
}
```
**Result**: Field appears for premium accounts OR senior experience users

## 🏗️ Nested Group Visibility

### Conditional Groups
```json
{
  "businessDetails": {
    "type": "group",
    "label": "Business Information",
    "visibilityCondition": {
      "field": "accountType",
      "operator": "equals",
      "value": "BUSINESS"
    },
    "fields": {
      "companyName": {
        "type": "text",
        "label": "Company Name"
      },
      "taxId": {
        "type": "text",
        "label": "Tax ID",
        "visibilityCondition": {
          "field": "businessType",
          "operator": "not_equals",
          "value": "sole_proprietorship"
        }
      }
    }
  }
}
```
**Result**: 
- Business group appears only for business accounts
- Tax ID field within the group appears only for non-sole-proprietorship businesses

## 📋 All Supported Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match | `"value": "BUSINESS"` |
| `not_equals` | Not equal to | `"value": ""` (not empty) |
| `in` | Value in array | `"value": ["mid", "senior"]` |
| `not_in` | Value not in array | `"value": ["entry", "junior"]` |
| `contains` | String/array contains | `"value": "admin"` |
| `not_contains` | String/array doesn't contain | `"value": "temp"` |
| `exists` | Field has any value | No value needed |
| `not_exists` | Field is empty/null | No value needed |

## 🎨 Real-World Examples

### User Type Based Sections
```json
{
  "userType": {
    "type": "select",
    "options": [
      {"label": "Student", "value": "student"},
      {"label": "Professional", "value": "professional"},
      {"label": "Retiree", "value": "retiree"}
    ]
  },
  "studentInfo": {
    "type": "group",
    "visibilityCondition": {
      "field": "userType",
      "operator": "equals",
      "value": "student"
    },
    "fields": {
      "school": {"type": "text", "label": "School Name"},
      "graduationYear": {"type": "number", "label": "Expected Graduation"}
    }
  },
  "professionalInfo": {
    "type": "group",
    "visibilityCondition": {
      "field": "userType",
      "operator": "equals",
      "value": "professional"
    },
    "fields": {
      "company": {"type": "text", "label": "Company"},
      "jobTitle": {"type": "text", "label": "Job Title"}
    }
  }
}
```

### Progressive Disclosure
```json
{
  "hasExperience": {
    "type": "radio",
    "options": [
      {"label": "Yes", "value": "yes"},
      {"label": "No", "value": "no"}
    ]
  },
  "experienceDetails": {
    "type": "group",
    "visibilityCondition": {
      "field": "hasExperience",
      "operator": "equals",
      "value": "yes"
    },
    "fields": {
      "yearsOfExperience": {
        "type": "select",
        "options": [
          {"label": "1-2 years", "value": "1-2"},
          {"label": "3-5 years", "value": "3-5"},
          {"label": "5+ years", "value": "5+"}
        ]
      },
      "seniorRoleDetails": {
        "type": "textarea",
        "label": "Senior Role Experience",
        "visibilityCondition": {
          "field": "yearsOfExperience",
          "operator": "equals",
          "value": "5+"
        }
      }
    }
  }
}
```

## 💡 Best Practices

1. **Keep conditions simple**: Use single conditions when possible
2. **Use descriptive field names**: Make conditions easy to understand
3. **Test edge cases**: Consider empty values and user navigation patterns
4. **Group related fields**: Use groups to show/hide multiple related fields together
5. **Provide clear labels**: Help users understand why fields appear/disappear
6. **Consider validation**: Hidden fields should not be required unless conditionally required

## 🔄 Dynamic Behavior

- Fields appear/disappear **instantly** when conditions change
- Form validation updates automatically for visible fields
- Hidden field values are preserved but not validated
- Nested conditions work within groups and across form sections
- Performance is optimized with React memoization

Try these examples in the form generator to see dynamic visibility in action! 🚀
