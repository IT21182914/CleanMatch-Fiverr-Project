import React from "react";
import { LoadingOverlay, LoadingCard } from "../components/ui/Loading";

/**
 * Higher-order component for lazy loading with custom loading states
 */
export const withLazyLoading = (
  Component,
  fallbackType = "overlay",
  message = "Loading..."
) => {
  return React.forwardRef((props, ref) => {
    const renderFallback = () => {
      switch (fallbackType) {
        case "overlay":
          return <LoadingOverlay message={message} variant="spinner" />;
        case "card":
          return <LoadingCard variant="detailed" />;
        case "minimal":
          return (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">{message}</p>
              </div>
            </div>
          );
        case "skeleton":
          return (
            <div className="space-y-4 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          );
      }
    };

    return (
      <React.Suspense fallback={renderFallback()}>
        <Component {...props} ref={ref} />
      </React.Suspense>
    );
  });
};

/**
 * Lazy load a component with retry mechanism
 */
export const lazyWithRetry = (componentImport, retries = 3) => {
  return React.lazy(async () => {
    let attempt = 0;

    while (attempt < retries) {
      try {
        return await componentImport();
      } catch (error) {
        attempt++;

        if (attempt >= retries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  });
};
