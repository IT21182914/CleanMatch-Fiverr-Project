import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import {
  CheckCircleIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { FaCrown, FaStar, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LoadingCard, ModernPageLoader } from "../../components/ui/Loading";
import PaymentForm from "../../components/payment/PaymentForm";
import { membershipAPI } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";
import { useToast } from "../../hooks/useToast";

const MembershipSubscription = () => {
  const [plans, setPlans] = useState({});
  const [selectedTier, setSelectedTier] = useState("supersaver_month");
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [paymentStep, setPaymentStep] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchPlans = useCallback(async () => {
    try {
      const response = await membershipAPI.getPlans();
      setPlans(response.data.plans);

      // Default to supersaver_month if available
      if (response.data.plans.supersaver_month) {
        setSelectedTier("supersaver_month");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to load membership plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleContinueToPayment = async () => {
    try {
      setSubscribing(true);
      const plan = plans[selectedTier];

      if (!plan) {
        setError("Please select a membership plan");
        setSubscribing(false);
        return;
      }

      const response = await membershipAPI.subscribe({
        tier: selectedTier,
        isRecurring: isRecurring
      });

      // Handle both payment intent and subscription client secrets
      const clientSecret =
        response.data.client_secret ||
        response.data.data?.clientSecret ||
        response.data.data?.client_secret;

      if (!clientSecret) {
        // Payment was successful without requiring additional action
        showToast("Successfully subscribed to your membership!", "success");
        navigate("/customer/profile");
        return;
      }

      setClientSecret(clientSecret);
      setPaymentStep(true);
    } catch (error) {
      console.error("Error creating subscription:", error);
      setError(error.response?.data?.error || "Failed to create subscription. Please try again.");
      if (error.response?.data?.details) {
        console.error("Error details:", error.response.data.details);
      }
    } finally {
      setSubscribing(false);
    }
  };

  const handlePaymentSuccess = () => {
    membershipAPI.activateMembership(selectedTier)
      .then(() => {
        navigate("/customer/profile", {
          state: {
            message: "Welcome to CleanMatch! Your membership is now active.",
            success: true
          }
        });
      })
      .catch(() => {
        setError("Your payment was processed but we couldn't activate your membership. Our team has been notified.");
      });
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage || "Payment failed. Please try again.");
  };

  const handleBackToPlans = () => {
    setPaymentStep(false);
    setClientSecret("");
    setError("");
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "supersaver":
        return <SparklesIcon className="h-8 w-8 text-orange-500" />;
      case "gold":
        return <FaCrown className="h-8 w-8 text-cyan-500" />;
      case "premium":
        return <FaStar className="h-8 w-8 text-purple-500" />;
      default:
        return <FaCheckCircle className="h-8 w-8 text-blue-500" />;
    }
  };

  const getTierGradient = (tier) => {
    switch (tier) {
      case "supersaver":
        return "from-orange-400 to-red-600";
      case "gold":
        return "from-cyan-400 to-cyan-600";
      case "premium":
        return "from-purple-400 to-purple-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "supersaver":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "gold":
        return "bg-cyan-50 border-cyan-200 text-cyan-900";
      case "premium":
        return "bg-purple-50 border-purple-200 text-purple-900";
      default:
        return "bg-blue-50 border-blue-200 text-blue-900";
    }
  };

  if (loading) {
    return <ModernPageLoader message="Loading membership plans..." />;
  }

  if (error && !paymentStep) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => {
              setError("");
              fetchPlans();
            }}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep && clientSecret) {
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
    const plan = plans[selectedTier];

    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 pb-2">
                Complete Membership Payment
              </h2>
              <p className="text-xs text-gray-500">Activating {plan?.name || "Membership"}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleBackToPlans}>
            Back to Plans
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Membership Summary */}
          <Card>
            <CardHeader className={`pb-2 border-b rounded-t-lg ${getTierColor(selectedTier)}`}>
              <h4 className="text-sm font-medium">Membership Summary</h4>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {/* Plan Information */}
              <div className="flex items-center">
                <div className="mr-3">
                  {getTierIcon(selectedTier)}
                </div>
                <div>
                  <span className="text-lg font-medium text-gray-900">
                    {plan.name}
                  </span>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {plan.description || `Save ${plan.discountPercentage}% on all cleaning services`}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-3"></div>

              {/* Plan Benefits */}
              <div>
                <span className="text-sm font-medium text-gray-900 mb-2 block">Plan Benefits</span>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security Note */}
              <div className="bg-gray-50 p-3 rounded-md mt-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FaShieldAlt className="h-3 w-3 mr-2 text-gray-400" />
                  <span>
                    {plan.isRecurring 
                      ? "Your membership renews automatically every month" 
                      : `Your membership is valid for ${plan.duration} days`
                    }
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {plan.isRecurring 
                    ? "You can cancel anytime from your profile settings" 
                    : "One-time payment with no auto-renewal"
                  }
                </div>
              </div>

              {/* Total Amount */}
              <div className="border-t pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {plan.isRecurring ? "Monthly fee:" : "One-time fee:"}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(plan.isRecurring ? plan.monthlyFee : plan.fee || 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {plan.isRecurring 
                    ? "Billed monthly. Cancel anytime." 
                    : `Valid for ${plan.duration} days. No auto-renewal.`
                  }
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

  // Main plan selection view
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Choose Your Membership Plan
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Join CleanMatch and save up to 50% on all cleaning services
        </p>
      </div>

      {/* Payment Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              !isRecurring
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setIsRecurring(false)}
          >
            One-time Payment
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isRecurring
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setIsRecurring(true)}
          >
            Recurring Payment
          </button>
        </div>
      </div>
      
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(plans).map(([tier, plan]) => (
          <Card
            key={tier}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${selectedTier === tier
                ? `border-${tier === 'supersaver_month' ? 'blue' : 'green'}-400 ring-2 ring-${tier === 'supersaver_month' ? 'blue' : 'green'}-300`
                : 'border-gray-200'
              }`}
            onClick={() => setSelectedTier(tier)}
          >
            {tier === "premium" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                {getTierIcon(tier)}
              </div>
              <CardTitle className="text-xl font-bold">
                {tier === 'supersaver_month' ? 'Monthly Plan' : 'Annual Plan'}
              </CardTitle>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(tier === 'supersaver_month' ? 49 : 499)}
                  <span className="text-base font-normal text-gray-600">
                    {isRecurring ? (tier === 'supersaver_month' ? '/mo' : '/yr') : ' one-time'}
                  </span>
                </div>
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getTierGradient(
                    tier
                  )}`}
                >
                  Save {plan.discountPercentage}% on services
                </div>
                {plan.badge && (
                  <div className="mt-2">
                    <span className="bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-800 font-medium">
                      {plan.badge}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-0">
              {selectedTier === tier && (
                <div
                  className={`w-full bg-gradient-to-r ${getTierGradient(
                    tier
                  )} text-white p-2 rounded-md text-center font-medium text-sm`}
                >
                  Selected Plan
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Benefits and Trust Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Benefits */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Membership Benefits
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <SparklesIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Exclusive Discounts</h3>
                  <p className="text-sm text-gray-600">
                    Save up to 50% on every cleaning service with automatic member pricing
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Priority Service</h3>
                  <p className="text-sm text-gray-600">
                    Get first access to booking slots and priority customer support
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <StarIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Flexible Membership</h3>
                  <p className="text-sm text-gray-600">
                    Cancel anytime with no fees. Benefits continue until your billing period ends
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Trust and Security */}
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Secure Membership
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <FaShieldAlt className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Secure Payment</h3>
                  <p className="text-sm text-gray-600">
                    All payments are encrypted and secured with Stripe
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">30-Day Guarantee</h3>
                  <p className="text-sm text-gray-600">
                    Try our membership risk-free with our 30-day money-back guarantee
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <StarIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Easy Management</h3>
                  <p className="text-sm text-gray-600">
                    Update, pause, or cancel your membership anytime from your account dashboard
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center mt-8 pb-10">
        <Button
          onClick={handleContinueToPayment}
          loading={subscribing}
          className="px-8 py-3 text-lg"
          size="lg"
        >
          {`Continue with ${selectedTier === 'supersaver_month' ? 'Monthly' : 'Annual'} Plan - 
          ${formatCurrency(selectedTier === 'supersaver_month' ? 49 : 499)}
          ${isRecurring 
            ? (selectedTier === 'supersaver_month' ? '/month' : '/year') 
            : ' one-time'}`
          }
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          No setup fees • {isRecurring ? 'Cancel anytime' : 'No auto-renewal'} • 30-day money-back guarantee
        </p>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-2">Looking for more flexibility?</p>
          <a 
            href="/customer/custom-membership" 
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            <span>Create your own custom membership</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MembershipSubscription;
