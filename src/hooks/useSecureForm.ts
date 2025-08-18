
import { useState } from 'react';
import { ValidationResult } from '@/utils/validationUtils';
import { handleError, createValidationError } from '@/utils/errorHandler';
import { checkRateLimiting } from '@/utils/securityUtils';

interface UseSecureFormOptions {
  validateFn: (data: any) => ValidationResult;
  onSubmit: (sanitizedData: any) => Promise<void>;
  rateLimitAction?: string;
  userId?: string;
}

export const useSecureForm = ({ validateFn, onSubmit, rateLimitAction, userId }: UseSecureFormOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrors([]);

      // Rate limiting check
      if (rateLimitAction && !checkRateLimiting(rateLimitAction, userId)) {
        throw createValidationError('Too many requests. Please try again later.');
      }

      // Validate form data
      const validation = validateFn(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        throw createValidationError(validation.errors.join(', '));
      }

      // Submit with sanitized data
      await onSubmit(validation.sanitizedData!);
      
    } catch (error) {
      handleError(error, {
        userId,
        action: rateLimitAction || 'form_submit',
        component: 'SecureForm'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    errors,
    clearErrors: () => setErrors([])
  };
};
