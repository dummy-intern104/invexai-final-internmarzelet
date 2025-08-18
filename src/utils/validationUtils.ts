
import { sanitizeInput, validateEmailFormat, validateNumericInput } from './securityUtils';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export const validatePaymentData = (formData: any): ValidationResult => {
  const errors: string[] = [];
  const sanitizedData: any = {};

  // Client name validation
  if (!formData.clientName || typeof formData.clientName !== 'string') {
    errors.push('Client name is required');
  } else {
    const sanitized = sanitizeInput(formData.clientName);
    if (sanitized.length < 2) {
      errors.push('Client name must be at least 2 characters');
    } else if (sanitized.length > 100) {
      errors.push('Client name must be less than 100 characters');
    } else {
      sanitizedData.clientName = sanitized;
    }
  }

  // Amount validation
  if (!formData.amount || isNaN(formData.amount)) {
    errors.push('Valid amount is required');
  } else {
    const amount = validateNumericInput(formData.amount);
    if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    } else if (amount > 10000000) {
      errors.push('Amount cannot exceed 10,000,000');
    } else {
      sanitizedData.amount = amount;
    }
  }

  // Payment method validation
  const allowedMethods = ['Credit Card', 'UPI', 'Bank Transfer', 'Cash', 'Cheque'];
  if (!formData.method || !allowedMethods.includes(formData.method)) {
    errors.push('Valid payment method is required');
  } else {
    sanitizedData.method = formData.method;
  }

  // Status validation
  const allowedStatuses = ['paid', 'pending', 'failed'];
  if (!formData.status || !allowedStatuses.includes(formData.status)) {
    errors.push('Valid payment status is required');
  } else {
    sanitizedData.status = formData.status;
  }

  // Description validation
  if (!formData.description || typeof formData.description !== 'string') {
    errors.push('Description is required');
  } else {
    const sanitized = sanitizeInput(formData.description);
    if (sanitized.length < 3) {
      errors.push('Description must be at least 3 characters');
    } else if (sanitized.length > 500) {
      errors.push('Description must be less than 500 characters');
    } else {
      sanitizedData.description = sanitized;
    }
  }

  // GST number validation (optional)
  if (formData.gstNumber) {
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstPattern.test(formData.gstNumber)) {
      errors.push('Invalid GST number format');
    } else {
      sanitizedData.gstNumber = formData.gstNumber;
    }
  }

  // Address validation (if provided)
  if (formData.address) {
    const sanitized = sanitizeInput(formData.address);
    if (sanitized.length > 200) {
      errors.push('Address must be less than 200 characters');
    } else {
      sanitizedData.address = sanitized;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

export const validateClientData = (formData: any): ValidationResult => {
  const errors: string[] = [];
  const sanitizedData: any = {};

  // Name validation
  if (!formData.name || typeof formData.name !== 'string') {
    errors.push('Client name is required');
  } else {
    const sanitized = sanitizeInput(formData.name);
    if (sanitized.length < 2) {
      errors.push('Name must be at least 2 characters');
    } else {
      sanitizedData.name = sanitized;
    }
  }

  // Email validation (optional)
  if (formData.email) {
    if (!validateEmailFormat(formData.email)) {
      errors.push('Invalid email format');
    } else {
      sanitizedData.email = formData.email;
    }
  }

  // Phone validation (optional)
  if (formData.phone) {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(formData.phone)) {
      errors.push('Invalid phone number format');
    } else {
      sanitizedData.phone = formData.phone;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

export const validateProductData = (formData: any): ValidationResult => {
  const errors: string[] = [];
  const sanitizedData: any = {};

  // Product name validation
  if (!formData.name || typeof formData.name !== 'string') {
    errors.push('Product name is required');
  } else {
    const sanitized = sanitizeInput(formData.name);
    if (sanitized.length < 2) {
      errors.push('Product name must be at least 2 characters');
    } else {
      sanitizedData.name = sanitized;
    }
  }

  // Price validation
  if (!formData.price || isNaN(formData.price)) {
    errors.push('Valid price is required');
  } else {
    const price = validateNumericInput(formData.price);
    if (price < 0) {
      errors.push('Price cannot be negative');
    } else {
      sanitizedData.price = price;
    }
  }

  // Stock validation
  if (formData.stock !== undefined) {
    const stock = validateNumericInput(formData.stock);
    if (stock < 0) {
      errors.push('Stock cannot be negative');
    } else {
      sanitizedData.stock = Math.floor(stock);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};
