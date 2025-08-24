import { renderHook, act } from '@testing-library/react';
import { useFormSubmission } from '../useFormSubmission';

describe('useFormSubmission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useFormSubmission());

    expect(result.current.submittedData).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBeNull();
  });

  test('should handle successful submission', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useFormSubmission(mockOnSubmit));

    const testData = { name: 'John', email: 'john@example.com' };

    await act(async () => {
      await result.current.handleSubmit(testData);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(testData);
    expect(result.current.submittedData).toEqual({
      data: testData,
      submittedAt: expect.any(String),
      timestamp: expect.any(Number)
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBeNull();
  });

  test('should handle submission without onSubmit callback', async () => {
    const { result } = renderHook(() => useFormSubmission());

    const testData = { name: 'John', email: 'john@example.com' };

    await act(async () => {
      await result.current.handleSubmit(testData);
    });

    expect(result.current.submittedData).toEqual({
      data: testData,
      submittedAt: expect.any(String),
      timestamp: expect.any(Number)
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBeNull();
  });

  test('should handle submission error', async () => {
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useFormSubmission(mockOnSubmit));

    const testData = { name: 'John', email: 'john@example.com' };

    await act(async () => {
      await result.current.handleSubmit(testData);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(testData);
    expect(result.current.submittedData).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBe('Network error');
  });

  test('should handle non-Error submission failure', async () => {
    const mockOnSubmit = jest.fn().mockRejectedValue('String error');
    const { result } = renderHook(() => useFormSubmission(mockOnSubmit));

    const testData = { name: 'John', email: 'john@example.com' };

    await act(async () => {
      await result.current.handleSubmit(testData);
    });

    expect(result.current.submitError).toBe('Submission failed');
  });

  test('should set isSubmitting during submission', async () => {
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
    
    const mockOnSubmit = jest.fn().mockReturnValue(submitPromise);
    const { result } = renderHook(() => useFormSubmission(mockOnSubmit));

    const testData = { name: 'John', email: 'john@example.com' };

    // Start submission
    act(() => {
      result.current.handleSubmit(testData);
    });

    // Should be submitting
    expect(result.current.isSubmitting).toBe(true);
    expect(result.current.submitError).toBeNull();

    // Complete submission
    await act(async () => {
      resolveSubmit();
      await submitPromise;
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  test('should clear submission data', async () => {
    const { result } = renderHook(() => useFormSubmission());

    const testData = { name: 'John', email: 'john@example.com' };

    // Submit data first
    await act(async () => {
      await result.current.handleSubmit(testData);
    });

    expect(result.current.submittedData).not.toBeNull();

    // Clear submission
    act(() => {
      result.current.clearSubmission();
    });

    expect(result.current.submittedData).toBeNull();
    expect(result.current.submitError).toBeNull();
  });

  test('should retry submission with previous data', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useFormSubmission(mockOnSubmit));

    const testData = { name: 'John', email: 'john@example.com' };

    // Initial submission
    await act(async () => {
      await result.current.handleSubmit(testData);
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    // Retry submission
    await act(async () => {
      await result.current.retrySubmission();
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(2);
    expect(mockOnSubmit).toHaveBeenLastCalledWith(testData);
  });

  test('should not retry if no previous submission data', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useFormSubmission(mockOnSubmit));

    await act(async () => {
      await result.current.retrySubmission();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
