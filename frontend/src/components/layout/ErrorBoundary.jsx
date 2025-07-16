import React from "react";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { logError } from "../../utils/errorHandling";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `error_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log error with context
    const context = {
      errorId,
      component: this.props.fallbackComponent || "Unknown",
      userId: this.props.userId,
      retryCount: this.state.retryCount,
      errorBoundary: true,
    };

    logError(error, context);

    // Report to error tracking service in production
    if (import.meta.env.MODE === "production") {
      this.reportError(error, errorInfo, context);
    }
  }

  reportError = (error, errorInfo, context) => {
    // Here you would send the error to your error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    try {
      // Example implementation
      if (window.Sentry) {
        window.Sentry.withScope((scope) => {
          scope.setTag("errorBoundary", true);
          scope.setContext("errorInfo", {
            ...context,
            componentStack: errorInfo.componentStack,
          });
          window.Sentry.captureException(error);
        });
      }
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError);
    }
  };

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      const { error, errorInfo, errorId, retryCount } = this.state;
      const isProduction = import.meta.env.MODE === "production";
      const showDetails = !isProduction || this.props.showDetails;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Oops! Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We're sorry, but an unexpected error occurred.
                {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
              </p>

              {errorId && (
                <p className="mt-2 text-xs text-gray-500">
                  Error ID: {errorId}
                </p>
              )}

              {showDetails && error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Error Details {isProduction ? "" : "(Development)"}
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs">
                    <div className="mb-2">
                      <span className="font-semibold text-red-600">Error:</span>
                      <pre className="whitespace-pre-wrap text-red-800 mt-1">
                        {error.toString()}
                      </pre>
                    </div>

                    {!isProduction && errorInfo?.componentStack && (
                      <div className="mb-2">
                        <span className="font-semibold text-blue-600">
                          Component Stack:
                        </span>
                        <pre className="whitespace-pre-wrap text-blue-800 mt-1 text-xs">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    {!isProduction && error.stack && (
                      <div>
                        <span className="font-semibold text-purple-600">
                          Stack Trace:
                        </span>
                        <pre className="whitespace-pre-wrap text-purple-800 mt-1 text-xs">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="mt-6 space-y-3">
                {/* Retry button - show if retry count is less than 3 */}
                {retryCount < 3 && (
                  <Button
                    onClick={this.handleRetry}
                    className="w-full flex items-center justify-center"
                    variant="primary"
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}

                {/* Reload button */}
                <Button
                  onClick={this.handleReload}
                  className="w-full"
                  variant="secondary"
                >
                  Reload Page
                </Button>

                {/* Go to dashboard button */}
                <Button
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  Go to Dashboard
                </Button>
              </div>

              {/* Contact support message */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  If this problem persists, please contact our support team
                  {errorId && ` and include the error ID: ${errorId}`}
                </p>
                {isProduction && (
                  <button
                    onClick={() =>
                      window.open(
                        "mailto:support@cleanmatch.com?subject=Error Report&body=" +
                          encodeURIComponent(
                            `Error ID: ${errorId}\nURL: ${window.location.href}\nUser Agent: ${navigator.userAgent}`
                          )
                      )
                    }
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Send Error Report
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
