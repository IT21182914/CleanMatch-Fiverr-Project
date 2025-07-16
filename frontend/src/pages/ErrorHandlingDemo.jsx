// Test component to demonstrate the enhanced error handling
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../contexts/ToastContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const ErrorHandlingDemo = () => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Test login with intentionally wrong credentials
  const testLoginError = async () => {
    setIsLoading(true);
    try {
      const result = await login({
        email: "wrong@email.com",
        password: "wrongpassword",
      });

      if (!result.success) {
        showToast({
          message: result.error,
          type: "error",
          ...(result.field && {
            action: {
              text: "Fix",
              onClick: () => console.log(`Focus on field: ${result.field}`),
            },
          }),
        });
      }
    } catch (error) {
      showToast({
        message: "Unexpected error occurred",
        type: "error",
        error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test registration with invalid data
  const testRegisterError = async () => {
    setIsLoading(true);
    try {
      const result = await register({
        email: "invalid-email", // Invalid email format
        password: "123", // Too short password
        role: "customer",
      });

      if (!result.success) {
        showToast({
          message: result.error,
          type: "error",
          ...(result.field && {
            action: {
              text: "Fix",
              onClick: () => console.log(`Focus on field: ${result.field}`),
            },
          }),
        });
      }
    } catch (error) {
      showToast({
        message: "Unexpected error occurred",
        type: "error",
        error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test network error
  const testNetworkError = async () => {
    setIsLoading(true);
    showToast({
      message: "Testing network connectivity...",
      type: "info",
      persistent: true,
    });

    // Simulate a network error by making a request to a non-existent endpoint
    try {
      await fetch("/api/non-existent-endpoint");
    } catch (error) {
      showToast({
        message: "Network error detected",
        type: "error",
        error,
        action: {
          text: "Retry",
          onClick: testNetworkError,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Error Handling Demo</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Authentication Error Tests
        </h2>
        <div className="space-y-4">
          <Button
            onClick={testLoginError}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Test Login Error (Wrong Credentials)
          </Button>

          <Button
            onClick={testRegisterError}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Test Registration Error (Invalid Data)
          </Button>

          <Button
            onClick={testNetworkError}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Test Network Error
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Error Handling Features</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ Custom error classes and parsing</li>
          <li>✅ Field-specific error identification</li>
          <li>✅ Retry mechanisms for network errors</li>
          <li>✅ Enhanced error logging with context</li>
          <li>✅ User-friendly error messages</li>
          <li>✅ Toast notifications with actions</li>
          <li>✅ Error boundaries for React components</li>
          <li>✅ Consistent error responses across API</li>
        </ul>
      </Card>
    </div>
  );
};

export default ErrorHandlingDemo;
