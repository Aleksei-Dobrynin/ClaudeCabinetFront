import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

type Validator<T> = (data: T) => Promise<ValidationResult>;
type FieldValidator = (name: string, value: any) => Promise<{ isValid: boolean; error: string }>;

/**
 * Custom hook for form handling with validation
 * @param initialValues - The initial form values
 * @param validator - Form validator function
 * @param fieldValidator - Individual field validator function
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validator?: Validator<T>,
  fieldValidator?: FieldValidator
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const api = useApi();

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Update form when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // Handle input change
  const handleChange = useCallback((event: { target: { name: string; value: any } }) => {
    const { name, value } = event.target;

    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field if fieldValidator provided
    if (fieldValidator) {
      fieldValidator(name, value).then(({ isValid, error }) => {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: isValid ? '' : error
        }));
      });
    }
  }, [fieldValidator]);

  // Set a specific field value
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field if fieldValidator provided
    if (fieldValidator) {
      fieldValidator(name, value).then(({ isValid, error }) => {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: isValid ? '' : error
        }));
      });
    }
  }, [fieldValidator]);

  // Validate the entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validator) return true;

    const result = await validator(values);

    if (!result.isValid) {
      setErrors(result.errors);

      // Mark all fields with errors as touched
      const newTouched: Record<string, boolean> = {};
      Object.keys(result.errors).forEach(key => {
        if (result.errors[key]) {
          newTouched[key] = true;
        }
      });

      setTouched(prev => ({
        ...prev,
        ...newTouched
      }));

      return false;
    }

    return true;
  }, [values, validator]);

  // Submit the form if validation passes
  const submitForm = useCallback(async (
    onSubmit: (values: T) => Promise<any>,
    onSuccess?: (data: any) => void
  ) => {
    const isValid = await validateForm();

    if (!isValid) return;

    api.callApi(
      () => onSubmit(values),
      data => {
        if (onSuccess) onSuccess(data);
      }
    );
  }, [values, validateForm, api]);

  return {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    resetForm,
    validateForm,
    submitForm,
    isSubmitting: api.loading
  };
}