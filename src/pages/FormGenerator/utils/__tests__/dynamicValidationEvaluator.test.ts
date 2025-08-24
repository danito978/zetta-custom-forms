import { validateFieldWithDynamicRules } from '../dynamicValidationEvaluator';
import { InputValidation, ConditionalValidationRule } from '../../../../types/input';

describe('dynamicValidationEvaluator', () => {
  describe('Basic validation rules', () => {
    test('should validate required fields', () => {
      const validation: InputValidation = {
        messages: {
          required: 'This field is required'
        }
      };

      // Empty value should fail
      expect(validateFieldWithDynamicRules('', validation, {}, true))
        .toBe('This field is required');

      // Non-empty value should pass
      expect(validateFieldWithDynamicRules('test', validation, {}, true))
        .toBeNull();

      // Non-required empty field should pass
      expect(validateFieldWithDynamicRules('', validation, {}, false))
        .toBeNull();
    });

    test('should validate minLength', () => {
      const validation: InputValidation = {
        minLength: 3,
        messages: {
          minLength: 'Must be at least 3 characters'
        }
      };

      expect(validateFieldWithDynamicRules('ab', validation, {}, false))
        .toBe('Must be at least 3 characters');

      expect(validateFieldWithDynamicRules('abc', validation, {}, false))
        .toBeNull();

      expect(validateFieldWithDynamicRules('abcd', validation, {}, false))
        .toBeNull();
    });

    test('should validate maxLength', () => {
      const validation: InputValidation = {
        maxLength: 5,
        messages: {
          maxLength: 'Cannot exceed 5 characters'
        }
      };

      expect(validateFieldWithDynamicRules('123456', validation, {}, false))
        .toBe('Cannot exceed 5 characters');

      expect(validateFieldWithDynamicRules('12345', validation, {}, false))
        .toBeNull();

      expect(validateFieldWithDynamicRules('1234', validation, {}, false))
        .toBeNull();
    });

    test('should validate pattern', () => {
      const validation: InputValidation = {
        pattern: '^[A-Za-z]+$',
        messages: {
          pattern: 'Only letters allowed'
        }
      };

      expect(validateFieldWithDynamicRules('abc123', validation, {}, false))
        .toBe('Only letters allowed');

      expect(validateFieldWithDynamicRules('abc', validation, {}, false))
        .toBeNull();
    });

    test('should validate numeric ranges', () => {
      const validation: InputValidation = {
        min: 10,
        max: 100,
        messages: {
          min: 'Must be at least 10',
          max: 'Cannot exceed 100'
        }
      };

      expect(validateFieldWithDynamicRules(5, validation, {}, false))
        .toBe('Must be at least 10');

      expect(validateFieldWithDynamicRules(150, validation, {}, false))
        .toBe('Cannot exceed 100');

      expect(validateFieldWithDynamicRules(50, validation, {}, false))
        .toBeNull();
    });
  });

  describe('Conditional validation rules', () => {
    test('should apply conditional validation based on other field values', () => {
      const conditionalRules: ConditionalValidationRule[] = [
        {
          condition: {
            field: 'accountType',
            operator: 'equals',
            value: 'BUSINESS'
          },
          validation: {
            minLength: 5,
            messages: {
              minLength: 'Business names must be at least 5 characters'
            }
          }
        }
      ];

      const validation: InputValidation = {
        conditionalRules,
        messages: {}
      };

      const formValues = { accountType: 'BUSINESS' };

      // Should apply business validation
      expect(validateFieldWithDynamicRules('ABC', validation, formValues, false))
        .toBe('Business names must be at least 5 characters');

      expect(validateFieldWithDynamicRules('ABCDE', validation, formValues, false))
        .toBeNull();

      // Should not apply business validation for individual accounts
      const individualFormValues = { accountType: 'INDIVIDUAL' };
      expect(validateFieldWithDynamicRules('ABC', validation, individualFormValues, false))
        .toBeNull();
    });

    test('should handle multiple conditional rules', () => {
      const conditionalRules: ConditionalValidationRule[] = [
        {
          condition: {
            field: 'identificationType',
            operator: 'equals',
            value: 'PERSONAL_ID'
          },
          validation: {
            pattern: '^[0-9]+$',
            messages: {
              pattern: 'Personal ID must contain only numbers'
            }
          }
        },
        {
          condition: {
            field: 'identificationType',
            operator: 'equals',
            value: 'PASSPORT'
          },
          validation: {
            pattern: '^[A-Z0-9]+$',
            messages: {
              pattern: 'Passport must contain only uppercase letters and numbers'
            }
          }
        }
      ];

      const validation: InputValidation = {
        conditionalRules,
        messages: {}
      };

      // Test Personal ID validation
      const personalIdFormValues = { identificationType: 'PERSONAL_ID' };
      expect(validateFieldWithDynamicRules('ABC123', validation, personalIdFormValues, false))
        .toBe('Personal ID must contain only numbers');

      expect(validateFieldWithDynamicRules('123456', validation, personalIdFormValues, false))
        .toBeNull();

      // Test Passport validation
      const passportFormValues = { identificationType: 'PASSPORT' };
      expect(validateFieldWithDynamicRules('abc123', validation, passportFormValues, false))
        .toBe('Passport must contain only uppercase letters and numbers');

      expect(validateFieldWithDynamicRules('ABC123', validation, passportFormValues, false))
        .toBeNull();
    });

    test('should handle nested field conditions', () => {
      const conditionalRules: ConditionalValidationRule[] = [
        {
          condition: {
            field: 'user.preferences.notifications',
            operator: 'equals',
            value: true
          },
          validation: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            messages: {
              pattern: 'Valid email required when notifications are enabled'
            }
          }
        }
      ];

      const validation: InputValidation = {
        conditionalRules,
        messages: {}
      };

      const formValues = {
        user: {
          preferences: {
            notifications: true
          }
        }
      };

      expect(validateFieldWithDynamicRules('invalid-email', validation, formValues, false))
        .toBe('Valid email required when notifications are enabled');

      expect(validateFieldWithDynamicRules('valid@example.com', validation, formValues, false))
        .toBeNull();

      // Should not validate when notifications are disabled
      const disabledNotificationsValues = {
        user: {
          preferences: {
            notifications: false
          }
        }
      };

      expect(validateFieldWithDynamicRules('invalid-email', validation, disabledNotificationsValues, false))
        .toBeNull();
    });

    test('should handle "in" operator for conditional validation', () => {
      const conditionalRules: ConditionalValidationRule[] = [
        {
          condition: {
            field: 'experience',
            operator: 'in',
            value: ['senior', 'lead']
          },
          validation: {
            minLength: 10,
            messages: {
              minLength: 'Senior roles require detailed descriptions (min 10 characters)'
            }
          }
        }
      ];

      const validation: InputValidation = {
        conditionalRules,
        messages: {}
      };

      // Should apply validation for senior level
      const seniorFormValues = { experience: 'senior' };
      expect(validateFieldWithDynamicRules('Short', validation, seniorFormValues, false))
        .toBe('Senior roles require detailed descriptions (min 10 characters)');

      expect(validateFieldWithDynamicRules('This is a long description', validation, seniorFormValues, false))
        .toBeNull();

      // Should apply validation for lead level
      const leadFormValues = { experience: 'lead' };
      expect(validateFieldWithDynamicRules('Short', validation, leadFormValues, false))
        .toBe('Senior roles require detailed descriptions (min 10 characters)');

      // Should not apply validation for junior level
      const juniorFormValues = { experience: 'junior' };
      expect(validateFieldWithDynamicRules('Short', validation, juniorFormValues, false))
        .toBeNull();
    });
  });

  describe('Combined validation rules', () => {
    test('should apply both base and conditional validations', () => {
      const validation: InputValidation = {
        minLength: 2,
        conditionalRules: [
          {
            condition: {
              field: 'type',
              operator: 'equals',
              value: 'premium'
            },
            validation: {
              minLength: 5,
              messages: {
                minLength: 'Premium accounts require at least 5 characters'
              }
            }
          }
        ],
        messages: {
          minLength: 'Must be at least 2 characters'
        }
      };

      const premiumFormValues = { type: 'premium' };

      // Should fail base validation first
      expect(validateFieldWithDynamicRules('a', validation, {}, false))
        .toBe('Must be at least 2 characters');

      // Should fail conditional validation for premium
      expect(validateFieldWithDynamicRules('abc', validation, premiumFormValues, false))
        .toBe('Premium accounts require at least 5 characters');

      // Should pass both validations
      expect(validateFieldWithDynamicRules('abcdef', validation, premiumFormValues, false))
        .toBeNull();
    });

    test('should prioritize conditional validation messages', () => {
      const validation: InputValidation = {
        minLength: 2,
        conditionalRules: [
          {
            condition: {
              field: 'context',
              operator: 'equals',
              value: 'special'
            },
            validation: {
              minLength: 2,
              messages: {
                minLength: 'Special context requires custom message'
              }
            }
          }
        ],
        messages: {
          minLength: 'Default minimum length message'
        }
      };

      const specialFormValues = { context: 'special' };

      // Should use conditional message
      expect(validateFieldWithDynamicRules('a', validation, specialFormValues, false))
        .toBe('Special context requires custom message');

      // Should use default message
      expect(validateFieldWithDynamicRules('a', validation, {}, false))
        .toBe('Default minimum length message');
    });
  });
});
