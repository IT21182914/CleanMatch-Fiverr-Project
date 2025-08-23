import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ModernPageLoader } from "../../components/ui/Loading";
import PaymentForm from "../../components/payment/PaymentForm";
import { formatCurrency } from "../../lib/utils";
import { useToast } from "../../hooks/useToast";
import axios from "axios";

const DynamicMembershipPayment = () => {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(5900); // Default to $59.00
  const [showPayment, setShowPayment] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAmountChange = (e) => {
    // Convert to cents and ensure it's a number
    const newAmount = Math.round(parseFloat(e.target.value) * 100);
    setAmount(newAmount || 0);
  };

  const handleContinueToPayment = async () => {
    try {
      setLoading(true);

      if (amount < 100) { // Minimum $1.00
        setError("Minimum payment amount is $1.00");
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/dynamic-pricing/dynamic-membership", {
        amount,
        tier: "custom",
        name: "Custom Membership"
      });

      if (response.data.client_secret) {
        setClientSecret(response.data.client_secret);
        setShowPayment(true);
      } else {
        throw new Error("No client secret received");
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError(
        error.response?.data?.error || 
        "Failed to create payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    showToast(
      "Welcome to CleanMatch! Your membership is now active.",
      "success"
    );
    navigate("/customer/profile");
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage || "Payment failed. Please try again.");
  };

  const handleBackToForm = () => {
    setShowPayment(false);
    setClientSecret("");
    setError("");
  };

  if (loading) {
    return <ModernPageLoader message="Processing payment..." />;
  }

  if (error && !showPayment) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => setError("")}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPayment && clientSecret) {
    const appearance = {
      theme: "stripe",
      variables: {
        colorPrimary: "#3b82f6",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    };

    const options = { clientSecret, appearance };

    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 pb-2">
                Complete Membership Payment
              </h2>
              <p className="text-xs text-gray-500">
                Custom Membership - {formatCurrency(amount/100)}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleBackToForm}>
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Payment Summary */}
          <Card>
            <CardHeader className="pb-2 bg-blue-50 border-b border-blue-200 rounded-t-lg">
              <h4 className="text-sm font-medium text-blue-900">Membership Summary</h4>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-lg font-medium text-gray-900">
                    Custom Membership
                  </span>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Monthly subscription with your custom pricing
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <div>
                <span className="text-sm font-medium text-gray-900 mb-2 block">Plan Benefits</span>
                <ul className="space-y-2">
                  <li className="flex items-start text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Access to exclusive offers</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Priority booking</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Special membership rates</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-3 rounded-md mt-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="h-3 w-3 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Your membership renews automatically every month</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  You can cancel anytime from your profile settings
                </div>
              </div>

              <div className="border-t pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Monthly fee:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(amount/100)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Billed monthly. Cancel anytime.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader className="pb-2 bg-blue-50 border-b border-blue-200 rounded-t-lg">
              <h4 className="text-sm font-medium text-blue-900">Payment Details</h4>
            </CardHeader>
            <CardContent className="pt-2">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <Elements options={options} stripe={stripePromise}>
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Custom Membership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Set your own membership price and enjoy all the benefits of being a CleanMatch member.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Monthly Payment Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                min="1"
                step="0.01"
                defaultValue="59.00"
                onChange={handleAmountChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Minimum amount is $1.00
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium">Membership Benefits</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access to exclusive cleaning offers
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority booking for high-demand times
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Member-only rates and discounts
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleContinueToPayment} 
            loading={loading}
            className="w-full"
          >
            Continue to Payment - {formatCurrency(amount/100)}/month
          </Button>
          <p className="text-xs text-center text-gray-500">
            Cancel anytime. Your membership will renew automatically each month.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DynamicMembershipPayment;
