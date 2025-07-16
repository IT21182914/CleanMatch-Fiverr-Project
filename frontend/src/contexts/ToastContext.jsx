import React, { createContext, useState, useCallback } from "react";
import Toast from "../components/ui/Toast";
import { getErrorMessage } from "../utils/errorHandling";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", options = {}) => {
    const {
      duration = type === "error" ? 8000 : 4000, // Longer duration for errors
      persistent = false,
      action = null,
      id = null,
    } = options;

    const toast = {
      id:
        id || `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: typeof message === "object" ? getErrorMessage(message) : message,
      type,
      duration,
      persistent,
      action,
      timestamp: new Date(),
    };

    setToasts((prev) => [...prev, toast]);

    // Auto remove toast after duration (unless persistent)
    if (!persistent && duration > 0) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id));
      }, duration);
    }

    return toast.id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const showSuccess = useCallback(
    (message, options = {}) => {
      return addToast(message, "success", options);
    },
    [addToast]
  );

  const showError = useCallback(
    (error, options = {}) => {
      const message = getErrorMessage(error);
      return addToast(message, "error", {
        duration: 8000, // Longer duration for errors
        ...options,
      });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      return addToast(message, "warning", options);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      return addToast(message, "info", options);
    },
    [addToast]
  );

  const showLoading = useCallback(
    (message, options = {}) => {
      return addToast(message, "loading", {
        persistent: true,
        ...options,
      });
    },
    [addToast]
  );

  // Global error handler
  const showApiError = useCallback(
    (error, context = {}) => {
      const errorMessage = getErrorMessage(error);

      // Add context information if available
      let fullMessage = errorMessage;
      if (context.action) {
        fullMessage = `Failed to ${context.action}: ${errorMessage}`;
      }

      const action =
        error.statusCode === 401
          ? {
              label: "Login Again",
              onClick: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              },
            }
          : null;

      return addToast(fullMessage, "error", {
        duration: 10000,
        action,
      });
    },
    [addToast]
  );

  // Legacy support for existing toast usage
  const toast = {
    success: (title, message) => showSuccess(`${title}: ${message}`),
    error: (title, message) => showError(`${title}: ${message}`),
    warning: (title, message) => showWarning(`${title}: ${message}`),
    info: (title, message) => showInfo(`${title}: ${message}`),
  };

  // Make showToast available globally for the error handling utilities
  React.useEffect(() => {
    window.showToast = addToast;
    window.showError = showError;
    window.showSuccess = showSuccess;

    return () => {
      delete window.showToast;
      delete window.showError;
      delete window.showSuccess;
    };
  }, [addToast, showError, showSuccess]);

  const value = {
    toast, // Legacy support
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showApiError,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            action={toast.action}
            persistent={toast.persistent}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
