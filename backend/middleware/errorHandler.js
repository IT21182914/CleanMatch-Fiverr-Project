// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, "VALIDATION_ERROR");
    this.field = field;
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR");
  }
}

class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT_ERROR");
  }
}

class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR");
  }
}

class PaymentError extends AppError {
  constructor(message = "Payment processing failed") {
    super(message, 402, "PAYMENT_ERROR");
  }
}

// Enhanced error logging
const logError = (err, req = null) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
    },
    request: req
      ? {
          method: req.method,
          url: req.originalUrl,
          headers: {
            "user-agent": req.get("User-Agent"),
            "content-type": req.get("Content-Type"),
          },
          body: req.method !== "GET" ? req.body : undefined,
          user: req.user ? { id: req.user.id, role: req.user.role } : null,
          ip: req.ip,
        }
      : null,
  };

  // Log based on severity
  if (err.statusCode >= 500) {
    console.error("🚨 SERVER ERROR:", JSON.stringify(errorInfo, null, 2));
  } else if (err.statusCode >= 400) {
    console.warn("⚠️  CLIENT ERROR:", JSON.stringify(errorInfo, null, 2));
  } else {
    console.info("ℹ️  INFO:", JSON.stringify(errorInfo, null, 2));
  }

  // In production, you might want to send to external logging service
  if (process.env.NODE_ENV === "production" && err.statusCode >= 500) {
    // Example: sendToLoggingService(errorInfo);
  }
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error
  logError(err, req);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Invalid resource ID format";
    error = new NotFoundError(message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = field
      ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      : "Duplicate field value entered";
    error = new ConflictError(message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ValidationError(messages.join(", "));
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AuthenticationError("Invalid authentication token");
  }

  if (err.name === "TokenExpiredError") {
    error = new AuthenticationError("Authentication token has expired");
  }

  // PostgreSQL errors with detailed handling
  if (err.code === "23505") {
    // Unique violation
    const match = err.detail?.match(/Key \((.+)\)=\((.+)\) already exists/);
    const field = match ? match[1] : "field";
    const value = match ? match[2] : "value";
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } '${value}' already exists`;
    error = new ConflictError(message);
  }

  if (err.code === "23503") {
    // Foreign key violation
    const message = "Referenced resource does not exist";
    error = new ValidationError(message);
  }

  if (err.code === "23502") {
    // Not null violation
    const match = err.column ? err.column : "field";
    const message = `${
      match.charAt(0).toUpperCase() + match.slice(1)
    } is required`;
    error = new ValidationError(message);
  }

  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
    error = new DatabaseError("Database connection failed");
  }

  // Stripe errors with enhanced handling
  if (err.type === "StripeCardError") {
    const message = err.message || "Your card was declined";
    error = new PaymentError(message);
  }

  if (err.type === "StripeInvalidRequestError") {
    const message = "Invalid payment information provided";
    error = new PaymentError(message);
  }

  if (err.type === "StripeConnectionError") {
    error = new PaymentError("Payment service temporarily unavailable");
  }

  if (err.type === "StripeAuthenticationError") {
    error = new PaymentError("Payment service configuration error");
  }

  if (err.type === "StripeRateLimitError") {
    error = new PaymentError(
      "Too many payment requests, please try again later"
    );
  }

  // File upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    error = new ValidationError("File size too large");
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    error = new ValidationError("Too many files uploaded");
  }

  // Network and timeout errors
  if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT") {
    error = new AppError("Request timeout", 408, "TIMEOUT_ERROR");
  }

  // Default to AppError if not already one
  if (!(error instanceof AppError)) {
    error = new AppError(
      error.message || "An unexpected error occurred",
      error.statusCode || 500,
      "INTERNAL_SERVER_ERROR"
    );
  }

  // Build response
  const response = {
    success: false,
    error: {
      message: error.message,
      code: error.errorCode,
      ...(error.field && { field: error.field }),
    },
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  };

  res.status(error.statusCode).json(response);
};

// Async wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler for unknown routes
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Unhandled promise rejection handler
const unhandledRejectionHandler = (reason, promise) => {
  console.error("🚨 Unhandled Promise Rejection:", reason);
  console.error("Promise:", promise);

  // Log the rejection
  logError(new Error(`Unhandled Promise Rejection: ${reason}`));

  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};

// Uncaught exception handler
const uncaughtExceptionHandler = (error) => {
  console.error("🚨 Uncaught Exception:", error);

  // Log the exception
  logError(error);

  // Exit the process as the application is in an undefined state
  process.exit(1);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
  // Export custom error classes
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  PaymentError,
};
