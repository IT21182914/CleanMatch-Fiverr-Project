const {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  PaymentError,
} = require("../middleware/errorHandler");

/**
 * Database operation wrapper with error handling
 */
const dbOperation = async (
  operation,
  errorMessage = "Database operation failed"
) => {
  try {
    return await operation();
  } catch (error) {
    // PostgreSQL specific errors
    if (error.code === "23505") {
      throw new ConflictError("Resource already exists");
    }
    if (error.code === "23503") {
      throw new ValidationError("Referenced resource not found");
    }
    if (error.code === "23502") {
      throw new ValidationError("Required field is missing");
    }
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      throw new DatabaseError("Database connection failed");
    }

    throw new DatabaseError(errorMessage);
  }
};

/**
 * Stripe operation wrapper with error handling
 */
const stripeOperation = async (
  operation,
  errorMessage = "Payment operation failed"
) => {
  try {
    return await operation();
  } catch (error) {
    if (error.type === "StripeCardError") {
      throw new PaymentError(error.message || "Your card was declined");
    }
    if (error.type === "StripeInvalidRequestError") {
      throw new PaymentError("Invalid payment information");
    }
    if (error.type === "StripeConnectionError") {
      throw new PaymentError("Payment service temporarily unavailable");
    }
    if (error.type === "StripeAuthenticationError") {
      throw new PaymentError("Payment service configuration error");
    }
    if (error.type === "StripeRateLimitError") {
      throw new PaymentError(
        "Too many payment requests, please try again later"
      );
    }

    throw new PaymentError(errorMessage);
  }
};

/**
 * Validation helper
 */
const validateRequired = (fields, data) => {
  const missing = [];

  for (const field of fields) {
    if (
      !data[field] ||
      (typeof data[field] === "string" && !data[field].trim())
    ) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(", ")}`);
  }
};

/**
 * Authorization helper
 */
const checkPermission = (user, requiredRole, resourceOwnerId = null) => {
  if (!user) {
    throw new AuthenticationError("Authentication required");
  }

  if (user.role === "admin") {
    return true; // Admin has access to everything
  }

  if (requiredRole && user.role !== requiredRole) {
    throw new AuthorizationError(
      `Access denied. Required role: ${requiredRole}`
    );
  }

  if (resourceOwnerId && user.id !== resourceOwnerId) {
    throw new AuthorizationError(
      "Access denied. You can only access your own resources"
    );
  }

  return true;
};

/**
 * Resource existence checker
 */
const ensureResourceExists = (resource, resourceName = "Resource") => {
  if (!resource) {
    throw new NotFoundError(`${resourceName} not found`);
  }
  return resource;
};

/**
 * Safe JSON parsing
 */
const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return fallback;
  }
};

/**
 * Pagination helper
 */
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Build pagination response
 */
const buildPaginationResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

/**
 * Email validation
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone validation
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Password strength validation
 */
const validatePasswordStrength = (password) => {
  if (password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters long");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    throw new ValidationError(
      "Password must contain at least one lowercase letter"
    );
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    throw new ValidationError(
      "Password must contain at least one uppercase letter"
    );
  }

  if (!/(?=.*[0-9])/.test(password)) {
    throw new ValidationError("Password must contain at least one number");
  }

  if (!/(?=.*[!@#$%^&*])/.test(password)) {
    throw new ValidationError(
      "Password must contain at least one special character"
    );
  }

  return true;
};

module.exports = {
  dbOperation,
  stripeOperation,
  validateRequired,
  checkPermission,
  ensureResourceExists,
  safeJsonParse,
  getPaginationParams,
  buildPaginationResponse,
  isValidEmail,
  isValidPhone,
  validatePasswordStrength,
  // Re-export error classes for convenience
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  PaymentError,
};
