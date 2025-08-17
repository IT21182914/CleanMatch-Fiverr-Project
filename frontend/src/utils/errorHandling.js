// Error types and codes
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  AUTHENTICATION: "AUTHENTICATION_ERROR",
  AUTHORIZATION: "AUTHORIZATION_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND_ERROR",
  CONFLICT: "CONFLICT_ERROR",
  PAYMENT: "PAYMENT_ERROR",
  SERVER: "SERVER_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]:
    "Network connection failed. Please check your internet connection.",
  [ERROR_TYPES.AUTHENTICATION]: "Authentication failed. Please log in again.",
  [ERROR_TYPES.AUTHORIZATION]: "You are not authorized to perform this action.",
  [ERROR_TYPES.VALIDATION]: "Please check your input and try again.",
  [ERROR_TYPES.NOT_FOUND]: "The requested resource was not found.",
  [ERROR_TYPES.CONFLICT]: "This resource already exists.",
  [ERROR_TYPES.PAYMENT]: "Payment processing failed. Please try again.",
  [ERROR_TYPES.SERVER]: "Server error occurred. Please try again later.",
  [ERROR_TYPES.UNKNOWN]: "An unexpected error occurred. Please try again.",
};

// Custom error classes
export class AppError extends Error {
  constructor(
    message,
    type = ERROR_TYPES.UNKNOWN,
    statusCode = 500,
    field = null
  ) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.statusCode = statusCode;
    this.field = field;
    this.timestamp = new Date().toISOString();
  }
}

export class NetworkError extends AppError {
  constructor(message = ERROR_MESSAGES[ERROR_TYPES.NETWORK]) {
    super(message, ERROR_TYPES.NETWORK, 0);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = ERROR_MESSAGES[ERROR_TYPES.AUTHENTICATION]) {
    super(message, ERROR_TYPES.AUTHENTICATION, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = ERROR_MESSAGES[ERROR_TYPES.AUTHORIZATION]) {
    super(message, ERROR_TYPES.AUTHORIZATION, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = ERROR_MESSAGES[ERROR_TYPES.VALIDATION], field = null) {
    super(message, ERROR_TYPES.VALIDATION, 400, field);
  }
}

export class NotFoundError extends AppError {
  constructor(message = ERROR_MESSAGES[ERROR_TYPES.NOT_FOUND]) {
    super(message, ERROR_TYPES.NOT_FOUND, 404);
  }
}

export class PaymentError extends AppError {
  constructor(message = ERROR_MESSAGES[ERROR_TYPES.PAYMENT]) {
    super(message, ERROR_TYPES.PAYMENT, 402);
  }
}

// Parse API error response
export const parseApiError = (error) => {
  // Network errors (no response)
  if (!error.response) {
    console.log("Network error details:", {
      code: error.code,
      message: error.message,
      config: error.config,
    });

    if (error.code === "ECONNABORTED" || error.code === "NETWORK_ERROR") {
      return new NetworkError("Request timeout. Please try again.");
    }

    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("ECONNREFUSED")
    ) {
      return new NetworkError(
        "Unable to connect to server. Please check your internet connection and try again."
      );
    }

    if (error.message?.includes("Network Error")) {
      return new NetworkError(
        "Network connection failed. Please check your internet connection and try again."
      );
    }

    return new NetworkError(
      "Connection failed. Please check your internet connection and try again."
    );
  }

  const { status, data } = error.response;
  const errorData = data?.error || data;
  const message = errorData?.message || errorData || "An error occurred";
  const field = errorData?.field;

  // Map status codes to error types
  switch (status) {
    case 400:
      return new ValidationError(message, field);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AuthorizationError(message);
    case 404:
      return new NotFoundError(message);
    case 402:
      return new PaymentError(message);
    case 409:
      return new AppError(message, ERROR_TYPES.CONFLICT, status);
    case 422:
      return new ValidationError(message, field);
    case 429:
      return new AppError(
        "Too many requests. Please try again later.",
        ERROR_TYPES.SERVER,
        status
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return new AppError(
        ERROR_MESSAGES[ERROR_TYPES.SERVER],
        ERROR_TYPES.SERVER,
        status
      );
    default:
      return new AppError(message, ERROR_TYPES.UNKNOWN, status);
  }
};

// Error logging utility
export const logError = (error, context = {}) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      field: error.field,
      stack: error.stack,
    },
    context: {
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: context.userId,
      action: context.action,
      ...context,
    },
  };

  // Log to console in development
  if (import.meta.env.MODE === "development") {
    console.group("🚨 Error Details");
    console.error("Error:", error);
    console.info("Context:", context);
    console.groupEnd();
  }

  // In production, you might want to send to external logging service
  if (import.meta.env.MODE === "production" && error.statusCode >= 500) {
    // Example: sendToLoggingService(errorInfo);
  }

  return errorInfo;
};

// Retry mechanism for API calls
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = parseApiError(error);

      // Don't retry for certain error types
      if (
        lastError.type === ERROR_TYPES.AUTHENTICATION ||
        lastError.type === ERROR_TYPES.AUTHORIZATION ||
        lastError.type === ERROR_TYPES.VALIDATION ||
        lastError.statusCode === 404
      ) {
        throw lastError;
      }

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, attempt - 1))
      );
    }
  }

  throw lastError;
};

// Form validation helpers
export const validateField = (value, rules) => {
  const errors = [];

  if (rules.required && (!value || value.toString().trim() === "")) {
    errors.push("This field is required");
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`);
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || "Invalid format");
  }

  if (value && rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.push("Please enter a valid email address");
  }

  if (value && rules.phone && !/^[+]?[1-9][\d]{0,15}$/.test(value)) {
    errors.push("Please enter a valid phone number");
  }

  if (value && rules.min && parseFloat(value) < rules.min) {
    errors.push(`Must be at least ${rules.min}`);
  }

  if (value && rules.max && parseFloat(value) > rules.max) {
    errors.push(`Must be no more than ${rules.max}`);
  }

  return errors;
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldErrors = validateField(formData[field], rules[field]);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors[0]; // Return first error
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// User-friendly error messages
export const getErrorMessage = (error) => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  // Handle different error scenarios
  if (error?.response?.data?.error) {
    return error.response.data.error.message || error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];
};

// Error boundary helper
export const handleAsyncError = (asyncFn) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      const parsedError = parseApiError(error);
      logError(parsedError, { action: asyncFn.name });
      throw parsedError;
    }
  };
};

export default {
  ERROR_TYPES,
  ERROR_MESSAGES,
  AppError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  PaymentError,
  parseApiError,
  logError,
  withRetry,
  validateField,
  validateForm,
  getErrorMessage,
  handleAsyncError,
};
