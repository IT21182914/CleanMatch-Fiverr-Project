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
import { useMembership } from "../../hooks/useMembership";

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
  const { membership, loading: membershipLoading } = useMembership();

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
  
  // Update selected tier if user has an active membership
  useEffect(() => {
    if (membership?.status === "active" && plans[membership.tier]) {
      setSelectedTier(membership.tier);
    }
  }, [membership, plans]);

  const handleContinueToPayment = async () => {
    try {
      setSubscribing(true);
      const plan = plans[selectedTier];

      if (!plan) {
        setError("Please select a membership plan");
        setSubscribing(false);
        return;
      }
      
      // Handle plan selection based on current membership status
      if (membership?.status === "active") {
        // Case 1: User is trying to activate the same plan
        if (membership.tier === selectedTier) {
          setError("You already have this membership plan active.");
          setSubscribing(false);
          return;
        }
        
        // Case 2: User is trying to downgrade from annual to monthly
        if (membership.tier === "supersaver_year" && selectedTier === "supersaver_month") {
          setError("You cannot downgrade from annual to monthly plan while your annual plan is active. You may cancel your annual plan and subscribe to monthly after it expires.");
          setSubscribing(false);
          return;
        }
        
        // Case 3: User is upgrading from monthly to annual - this is allowed
        if (membership.tier === "supersaver_month" && selectedTier === "supersaver_year") {
          // Show a confirmation dialog
          if (!window.confirm("You are about to upgrade from a monthly to an annual plan. Your current monthly plan will be cancelled. Do you want to continue?")) {
            setSubscribing(false);
            return;
          }
          // If user confirms, proceed with the upgrade
        }
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
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.error || "Failed to create subscription. Please try again.";
      
      // Map error messages to more user-friendly versions
      if (errorMessage.includes("Cannot downgrade")) {
        setError("You cannot downgrade from annual to monthly plan while your annual plan is active. You may cancel your annual plan and subscribe to monthly after it expires.");
      } else if (errorMessage.includes("already has this membership tier active")) {
        setError("You already have this membership plan active.");
      } else if (errorMessage.includes("already has an active membership")) {
        setError("You already have an active membership. Please cancel it before subscribing to a different plan.");
      } else {
        setError(errorMessage);
      }
      
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

  if (loading || membershipLoading) {
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
                    ${selectedTier === 'supersaver_month' ? '49' : '499'}
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Choose Your Membership Plan
        </h1>
        <p className="text-lg text-gray-600 mb-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(plans).map(([tier, plan]) => {
          // Check if this is the user's active membership
          const isActive = membership?.tier === tier && membership?.status === "active";
          
          return (
            <Card
              key={tier}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                isActive 
                  ? 'border-green-500 ring-2 ring-green-300' 
                  : selectedTier === tier
                    ? `border-${tier === 'supersaver_month' ? 'blue' : 'green'}-400 ring-2 ring-${tier === 'supersaver_month' ? 'blue' : 'green'}-300`
                    : 'border-gray-200'
              }`}
              onClick={() => {
                // Only allow selection if:
                // 1. The plan is not already active
                // 2. Not downgrading from annual to monthly
                const isDowngrading = membership?.tier === "supersaver_year" && tier === "supersaver_month" && membership?.status === "active";
                if (!isActive && !isDowngrading) {
                  setSelectedTier(tier);
                }
              }}
            >
              {isActive && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Active Plan
                  </span>
                </div>
              )}
              {/* Show upgrade badge for annual plan if user has monthly active */}
              {tier === "supersaver_year" && membership?.tier === "supersaver_month" && membership?.status === "active" && !isActive && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Upgrade Available
                  </span>
                </div>
              )}
              {/* Show locked badge for monthly plan if user has annual active */}
              {tier === "supersaver_month" && membership?.tier === "supersaver_year" && membership?.status === "active" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Not Available
                  </span>
                </div>
              )}
              {tier === "premium" && !isActive && !membership?.status && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center py-3">
                <div className="flex justify-center mb-2">
                  {getTierIcon(tier)}
                </div>
                <CardTitle className="text-lg font-bold mb-0">
                  {tier === 'supersaver_month' ? 'Monthly Plan' : 'Annual Plan'}
                </CardTitle>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${tier === 'supersaver_month' ? '49' : '499'}
                    <span className="text-sm font-normal text-gray-600">
                      {isRecurring ? (tier === 'supersaver_month' ? '/mo' : '/yr') : ' one-time'}
                    </span>
                  </div>
                  <div
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getTierGradient(
                      tier
                    )}`}
                  >
                    Save {plan.discountPercentage}% on services
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-2">
                <ul className="space-y-1">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-0">
                {isActive ? (
                  <div className="w-full bg-green-500 text-white p-2 rounded-md text-center font-medium text-xs">
                    Already Active
                  </div>
                ) : membership?.tier === "supersaver_year" && tier === "supersaver_month" && membership?.status === "active" ? (
                  <div className="w-full bg-gray-500 text-white p-2 rounded-md text-center font-medium text-xs">
                    Cannot Downgrade
                  </div>
                ) : membership?.tier === "supersaver_month" && tier === "supersaver_year" && membership?.status === "active" ? (
                  <div className="w-full bg-blue-500 text-white p-2 rounded-md text-center font-medium text-xs">
                    Upgrade Available
                  </div>
                ) : selectedTier === tier && (
                  <div
                    className={`w-full bg-gradient-to-r ${getTierGradient(
                      tier
                    )} text-white p-2 rounded-md text-center font-medium text-xs`}
                  >
                    Selected Plan
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center mt-6 pb-6">
        <Button
          onClick={handleContinueToPayment}
          loading={subscribing}
          disabled={
            (membership?.tier === selectedTier && membership?.status === "active") || 
            (membership?.tier === "supersaver_year" && selectedTier === "supersaver_month" && membership?.status === "active")
          }
          className="px-6 py-2"
          size="md"
        >
          {membership?.tier === selectedTier && membership?.status === "active" 
            ? "Already Subscribed" 
            : membership?.tier === "supersaver_year" && selectedTier === "supersaver_month" && membership?.status === "active"
              ? "Cannot Downgrade to Monthly"
              : membership?.tier === "supersaver_month" && selectedTier === "supersaver_year" && membership?.status === "active"
                ? `Upgrade to Annual Plan - $499` 
                : `Continue with ${selectedTier === 'supersaver_month' ? 'Monthly' : 'Annual'} Plan - $${selectedTier === 'supersaver_month' ? '49' : '499'}`
          }
        </Button>
        <p className="text-xs text-gray-500 mt-3">
          No setup fees • {isRecurring ? 'Cancel anytime' : 'No auto-renewal'} • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default MembershipSubscription;
