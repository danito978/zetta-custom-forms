import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ValidationProvider, useValidationContext } from '../ValidationContext';
import { InputField } from '../../../../types/input';

// Test component that uses ValidationContext
const TestComponent = () => {
  const {
    errors,
    touched,
    isFormValid,
    validateField,
    setFieldTouched,
    clearAllErrors,
    getFieldError,
    isFieldTouched
  } = useValidationContext();

  const testField: InputField = {
    id: 'testField',
    name: 'testField',
    type: 'text',
    label: 'Test Field',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 10,
      messages: {
        required: 'Test field is required',
        minLength: 'Test field must be at least 2 characters',
        maxLength: 'Test field cannot exceed 10 characters'
      }
    }
  };

  const handleValidate = async (value: string) => {
    await validateField('testField', value, testField, { testField: value });
  };

  const handleTouch = () => {
    setFieldTouched('testField', true);
  };

  const handleClear = () => {
    clearAllErrors();
  };

  return (
    <div>
      <div data-testid="form-valid">{isFormValid ? 'valid' : 'invalid'}</div>
      <div data-testid="field-error">{getFieldError('testField')?.message || 'no error'}</div>
      <div data-testid="field-touched">{isFieldTouched('testField') ? 'touched' : 'not touched'}</div>
      <div data-testid="error-count">{Object.keys(errors).length}</div>
      
      <button onClick={() => handleValidate('')} data-testid="validate-empty">
        Validate Empty
      </button>
      <button onClick={() => handleValidate('a')} data-testid="validate-short">
        Validate Short
      </button>
      <button onClick={() => handleValidate('valid')} data-testid="validate-valid">
        Validate Valid
      </button>
      <button onClick={() => handleValidate('this is way too long for the field')} data-testid="validate-long">
        Validate Long
      </button>
      <button onClick={handleTouch} data-testid="touch-field">
        Touch Field
      </button>
      <button onClick={handleClear} data-testid="clear-errors">
        Clear Errors
      </button>
    </div>
  );
};

describe('ValidationContext', () => {
  const renderWithProvider = (children: React.ReactNode) => {
    return render(
      <ValidationProvider realTimeValidation={false} debounceMs={0}>
        {children}
      </ValidationProvider>
    );
  };

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('should validate required field correctly', async () => {
    renderWithProvider(<TestComponent />);

    // Initially form should be valid (no validations run yet)
    expect(screen.getByTestId('form-valid')).toHaveTextContent('valid');
    expect(screen.getByTestId('field-error')).toHaveTextContent('no error');

    // Validate empty value (should fail required validation)
    fireEvent.click(screen.getByTestId('validate-empty'));

    await waitFor(() => {
      expect(screen.getByTestId('form-valid')).toHaveTextContent('invalid');
      expect(screen.getByTestId('field-error')).toHaveTextContent('Test field is required');
    });
  });

  test('should validate minLength correctly', async () => {
    renderWithProvider(<TestComponent />);

    // Validate short value (should fail minLength validation)
    fireEvent.click(screen.getByTestId('validate-short'));

    await waitFor(() => {
      expect(screen.getByTestId('form-valid')).toHaveTextContent('invalid');
      expect(screen.getByTestId('field-error')).toHaveTextContent('Test field must be at least 2 characters');
    });
  });

  test('should validate maxLength correctly', async () => {
    renderWithProvider(<TestComponent />);

    // Validate long value (should fail maxLength validation)
    fireEvent.click(screen.getByTestId('validate-long'));

    await waitFor(() => {
      expect(screen.getByTestId('form-valid')).toHaveTextContent('invalid');
      expect(screen.getByTestId('field-error')).toHaveTextContent('Test field cannot exceed 10 characters');
    });
  });

  test('should pass validation for valid input', async () => {
    renderWithProvider(<TestComponent />);

    // Clear any existing errors first
    fireEvent.click(screen.getByTestId('clear-errors'));
    
    // Wait for clear to complete
    await waitFor(() => {
      expect(screen.getByTestId('form-valid')).toHaveTextContent('valid');
    });

    // Validate valid value (should pass all validations)
    fireEvent.click(screen.getByTestId('validate-valid'));

    await waitFor(() => {
      expect(screen.getByTestId('form-valid')).toHaveTextContent('valid');
      expect(screen.getByTestId('field-error')).toHaveTextContent('no error');
    });
  });

  test('should handle touched state correctly', async () => {
    renderWithProvider(<TestComponent />);

    // Initially not touched
    expect(screen.getByTestId('field-touched')).toHaveTextContent('not touched');

    // Touch the field
    fireEvent.click(screen.getByTestId('touch-field'));

    await waitFor(() => {
      expect(screen.getByTestId('field-touched')).toHaveTextContent('touched');
    });
  });

  test('should clear all errors and touched state', async () => {
    renderWithProvider(<TestComponent />);

    // First create an error
    fireEvent.click(screen.getByTestId('validate-empty'));
    fireEvent.click(screen.getByTestId('touch-field'));

    await waitFor(() => {
      expect(screen.getByTestId('form-valid')).toHaveTextContent('invalid');
      expect(screen.getByTestId('field-touched')).toHaveTextContent('touched');
    });

    // Clear all errors
    fireEvent.click(screen.getByTestId('clear-errors'));

    await waitFor(() => {
      expect(screen.getByTestId('form-valid')).toHaveTextContent('valid');
      expect(screen.getByTestId('field-error')).toHaveTextContent('no error');
      expect(screen.getByTestId('field-touched')).toHaveTextContent('not touched');
    });
  });

  test('should call onValidationChange callback', async () => {
    const mockOnValidationChange = jest.fn();

    render(
      <ValidationProvider 
        realTimeValidation={false} 
        debounceMs={0}
        onValidationChange={mockOnValidationChange}
      >
        <TestComponent />
      </ValidationProvider>
    );

    // Trigger validation
    fireEvent.click(screen.getByTestId('validate-empty'));

    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(
        false, // isValid
        expect.objectContaining({
          testField: expect.objectContaining({
            message: 'Test field is required',
            type: 'required'
          })
        })
      );
    });
  });
});
