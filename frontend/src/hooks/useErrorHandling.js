import { useState, useCallback } from "react";
import {
  parseApiError,
  logError,
  getErrorMessage,
} from "../utils/errorHandling";

/**
 * Hook for handling async operations with error management
 */
export const useAsyncError = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeAsync = useCallback(async (asyncFn, options = {}) => {
    const {
      onSuccess,
      onError,
      showToast = true,
      logErrors = true,
      context = {},
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFn();

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const parsedError = parseApiError(err);

      if (logErrors) {
        logError(parsedError, context);
      }

      setError(parsedError);

      if (onError) {
        onError(parsedError);
      }

      // Show toast notification if enabled and useToast is available
      if (showToast && window.showToast) {
        window.showToast(getErrorMessage(parsedError), "error");
      }

      throw parsedError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    executeAsync,
    clearError,
  };
};

/**
 * Hook for form error handling
 */
export const useFormErrors = (initialErrors = {}) => {
  const [errors, setErrors] = useState(initialErrors);

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setApiErrors = useCallback(
    (apiError) => {
      if (apiError.field) {
        setFieldError(apiError.field, apiError.message);
      } else {
        setFieldError("general", apiError.message);
      }
    },
    [setFieldError]
  );

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    hasErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setApiErrors,
  };
};

/**
 * Hook for handling network-related errors
 */
export const useNetworkError = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkError, setNetworkError] = useState(null);

  useState(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkError(
        "You are currently offline. Please check your internet connection."
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    networkError,
  };
};

/**
 * Hook for retry mechanism
 */
export const useRetry = (maxRetries = 3, delay = 1000) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(
    async (asyncFn) => {
      if (retryCount >= maxRetries) {
        throw new Error("Maximum retry attempts reached");
      }

      setIsRetrying(true);
      setRetryCount((prev) => prev + 1);

      try {
        // Wait before retrying (exponential backoff)
        if (retryCount > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, delay * Math.pow(2, retryCount))
          );
        }

        const result = await asyncFn();
        setRetryCount(0); // Reset on success
        return result;
      } finally {
        setIsRetrying(false);
      }
    },
    [retryCount, maxRetries, delay]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  const canRetry = retryCount < maxRetries;

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    canRetry,
    maxRetries,
  };
};

/**
 * Hook for error recovery strategies
 */
export const useErrorRecovery = () => {
  const [recoveryStrategy, setRecoveryStrategy] = useState(null);

  const recover = useCallback((strategy) => {
    const strategies = {
      reload: () => window.location.reload(),
      goBack: () => window.history.back(),
      goHome: () => (window.location.href = "/"),
      goDashboard: () => (window.location.href = "/dashboard"),
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      },
    };

    if (strategies[strategy]) {
      setRecoveryStrategy(strategy);
      strategies[strategy]();
    }
  }, []);

  return {
    recover,
    recoveryStrategy,
    strategies: ["reload", "goBack", "goHome", "goDashboard", "logout"],
  };
};

export default {
  useAsyncError,
  useFormErrors,
  useNetworkError,
  useRetry,
  useErrorRecovery,
};
