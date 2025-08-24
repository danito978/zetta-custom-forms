import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormProvider, useFormContext } from '../FormContext';

// Test component that uses FormContext
const TestComponent = () => {
  const {
    formValues,
    updateField,
    getFieldValue,
    resetForm,
    setFormValues,
    autoFillFields
  } = useFormContext();

  return (
    <div>
      <div data-testid="form-values">{JSON.stringify(formValues)}</div>
      <div data-testid="first-name">{getFieldValue('firstName') || 'empty'}</div>
      <div data-testid="nested-value">{getFieldValue('user.profile.email') || 'empty'}</div>
      
      <button 
        onClick={() => updateField('firstName', 'John')} 
        data-testid="update-first-name"
      >
        Update First Name
      </button>
      
      <button 
        onClick={() => updateField('user.profile.email', 'john@example.com')} 
        data-testid="update-nested"
      >
        Update Nested
      </button>
      
      <button 
        onClick={() => setFormValues({ firstName: 'Jane', lastName: 'Doe' })} 
        data-testid="set-form-values"
      >
        Set Form Values
      </button>
      
      <button 
        onClick={() => autoFillFields({ 
          'user.profile.city': 'Sofia', 
          'user.profile.country': 'Bulgaria' 
        })} 
        data-testid="auto-fill"
      >
        Auto Fill
      </button>
      
      <button onClick={resetForm} data-testid="reset-form">
        Reset Form
      </button>
    </div>
  );
};

describe('FormContext', () => {
  const initialValues = { 
    firstName: 'Initial', 
    user: { profile: { email: 'initial@example.com' } } 
  };

  const renderWithProvider = (initialVals = {}, onValuesChange?: (values: any) => void) => {
    return render(
      <FormProvider initialValues={initialVals} onValuesChange={onValuesChange}>
        <TestComponent />
      </FormProvider>
    );
  };

  test('should initialize with provided initial values', () => {
    renderWithProvider(initialValues);

    expect(screen.getByTestId('first-name')).toHaveTextContent('Initial');
    expect(screen.getByTestId('nested-value')).toHaveTextContent('initial@example.com');
  });

  test('should update simple field values', () => {
    renderWithProvider();

    // Initially empty
    expect(screen.getByTestId('first-name')).toHaveTextContent('empty');

    // Update field
    fireEvent.click(screen.getByTestId('update-first-name'));

    expect(screen.getByTestId('first-name')).toHaveTextContent('John');
  });

  test('should handle nested field paths correctly', () => {
    renderWithProvider();

    // Initially empty
    expect(screen.getByTestId('nested-value')).toHaveTextContent('empty');

    // Update nested field
    fireEvent.click(screen.getByTestId('update-nested'));

    expect(screen.getByTestId('nested-value')).toHaveTextContent('john@example.com');
  });

  test('should set entire form values at once', () => {
    renderWithProvider(initialValues);

    // Initially has initial values
    expect(screen.getByTestId('first-name')).toHaveTextContent('Initial');

    // Set new form values
    fireEvent.click(screen.getByTestId('set-form-values'));

    expect(screen.getByTestId('first-name')).toHaveTextContent('Jane');
    
    // Check that the form values contain both firstName and lastName
    const formValuesText = screen.getByTestId('form-values').textContent;
    expect(formValuesText).toContain('Jane');
    expect(formValuesText).toContain('Doe');
  });

  test('should handle auto-fill functionality', () => {
    renderWithProvider();

    // Auto-fill some nested fields
    fireEvent.click(screen.getByTestId('auto-fill'));

    const formValuesText = screen.getByTestId('form-values').textContent;
    expect(formValuesText).toContain('Sofia');
    expect(formValuesText).toContain('Bulgaria');
  });

  test('should reset form to initial values', () => {
    renderWithProvider(initialValues);

    // Update some values
    fireEvent.click(screen.getByTestId('update-first-name'));
    expect(screen.getByTestId('first-name')).toHaveTextContent('John');

    // Reset form
    fireEvent.click(screen.getByTestId('reset-form'));

    // Should return to initial values
    expect(screen.getByTestId('first-name')).toHaveTextContent('Initial');
    expect(screen.getByTestId('nested-value')).toHaveTextContent('initial@example.com');
  });

  test('should call onValuesChange callback when values change', () => {
    const mockOnValuesChange = jest.fn();
    renderWithProvider({}, mockOnValuesChange);

    // Update a field
    fireEvent.click(screen.getByTestId('update-first-name'));

    expect(mockOnValuesChange).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John'
      })
    );
  });

  test('should handle deep nested object creation', () => {
    renderWithProvider();

    // Update a deeply nested field that doesn't exist yet
    fireEvent.click(screen.getByTestId('update-nested'));

    const formValuesText = screen.getByTestId('form-values').textContent;
    expect(formValuesText).toContain('john@example.com');
    
    // Verify the nested structure was created correctly
    expect(JSON.parse(formValuesText || '{}')).toEqual({
      user: {
        profile: {
          email: 'john@example.com'
        }
      }
    });
  });

  test('should preserve existing nested values when updating', () => {
    const complexInitial = {
      user: {
        profile: {
          email: 'existing@example.com',
          name: 'Existing Name'
        },
        settings: {
          theme: 'dark'
        }
      }
    };

    renderWithProvider(complexInitial);

    // Update only the email
    fireEvent.click(screen.getByTestId('update-nested'));

    const formValues = JSON.parse(screen.getByTestId('form-values').textContent || '{}');
    
    // Email should be updated
    expect(formValues.user.profile.email).toBe('john@example.com');
    
    // Other values should be preserved
    expect(formValues.user.profile.name).toBe('Existing Name');
    expect(formValues.user.settings.theme).toBe('dark');
  });
});
