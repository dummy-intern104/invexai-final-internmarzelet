
import { toast } from 'sonner';
import { logSecurityEvent } from './securityUtils';

export interface ErrorContext {
  userId?: string;
  action?: string;
  component?: string;
  additionalData?: any;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: any, context?: ErrorContext): void => {
  console.error('Error occurred:', {
    error: error.message || error,
    code: error.code || 'UNKNOWN',
    context,
    stack: error.stack
  });

  // Log security events for certain error types
  if (error.code === 'PERMISSION_DENIED' || error.code === 'UNAUTHORIZED') {
    logSecurityEvent('Unauthorized access attempt', {
      userId: context?.userId,
      action: context?.action,
      error: error.message
    });
  }

  // Show user-friendly error messages
  const userMessage = getUserFriendlyMessage(error);
  toast.error(userMessage);
};

const getUserFriendlyMessage = (error: any): string => {
  if (error instanceof AppError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again';
      case 'PERMISSION_DENIED':
        return 'You do not have permission to perform this action';
      case 'UNAUTHORIZED':
        return 'Please sign in to continue';
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection';
      case 'DATA_NOT_FOUND':
        return 'The requested data was not found';
      default:
        return 'An unexpected error occurred';
    }
  }

  // Handle Supabase errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return 'No data found';
      case 'PGRST301':
        return 'You do not have permission to access this data';
      case '23505':
        return 'This record already exists';
      case '23503':
        return 'Cannot delete this record as it is referenced by other data';
      default:
        return 'A database error occurred';
    }
  }

  // Generic error handling
  if (error.message) {
    if (error.message.includes('Failed to fetch')) {
      return 'Network connection error. Please try again';
    }
    if (error.message.includes('unauthorized')) {
      return 'Please sign in to continue';
    }
  }

  return 'An unexpected error occurred. Please try again';
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext
) => {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return undefined;
    }
  };
};

export const createValidationError = (message: string): AppError => {
  return new AppError(message, 'VALIDATION_ERROR', 400);
};

export const createPermissionError = (message: string = 'Permission denied'): AppError => {
  return new AppError(message, 'PERMISSION_DENIED', 403);
};

export const createUnauthorizedError = (message: string = 'Unauthorized access'): AppError => {
  return new AppError(message, 'UNAUTHORIZED', 401);
};
