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
  const [selectedTier, setSelectedTier] = useState("moon_1_month");
  const [selectedPlanTier, setSelectedPlanTier] = useState("moon"); // moon, star, sun
  const [selectedDuration, setSelectedDuration] = useState("1_month"); // 1_month, 3_months, 6_months, 12_months
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

      // Default to moon_1_month if available
      if (response.data.plans.moon_1_month) {
        setSelectedTier("moon_1_month");
        setSelectedPlanTier("moon");
        setSelectedDuration("1_month");
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
  
  // Update selected tier based on plan tier and duration
  useEffect(() => {
    const tierKey = `${selectedPlanTier}_${selectedDuration}`;
    if (plans[tierKey]) {
      setSelectedTier(tierKey);
    }
  }, [selectedPlanTier, selectedDuration, plans]);
  
  // Update selected tier if user has an active membership
  useEffect(() => {
    if (membership?.status === "active" && plans[membership.tier]) {
      setSelectedTier(membership.tier);
      // Extract tier and duration from membership.tier
      const [tier, duration] = membership.tier.split('_');
      const durationPart = membership.tier.replace(`${tier}_`, '');
      setSelectedPlanTier(tier);
      setSelectedDuration(durationPart);
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
        if (membership.tier.includes("12_months") && selectedTier.includes("1_month")) {
          setError("You cannot downgrade from annual to monthly plan while your annual plan is active. You may cancel your annual plan and subscribe to monthly after it expires.");
          setSubscribing(false);
          return;
        }
        
        // Case 3: User is upgrading - this is allowed for same tier different duration or different tier
        if (membership.tier !== selectedTier) {
          // Show a confirmation dialog for tier changes
          const currentPlan = plans[membership.tier];
          const newPlan = plans[selectedTier];
          if (!window.confirm(`You are about to change from ${currentPlan?.name} ${currentPlan?.subtitle} to ${newPlan?.name} ${newPlan?.subtitle}. Your current plan will be cancelled. Do you want to continue?`)) {
            setSubscribing(false);
            return;
          }
          // If user confirms, proceed with the change
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
    const tierName = tier.split('_')[0];
    switch (tierName) {
      case "moon":
        return <SparklesIcon className="h-8 w-8 text-blue-500" />;
      case "star":
        return <FaStar className="h-8 w-8 text-yellow-500" />;
      case "sun":
        return <FaCrown className="h-8 w-8 text-orange-500" />;
      default:
        return <FaCheckCircle className="h-8 w-8 text-blue-500" />;
    }
  };

  const getTierGradient = (tier) => {
    const tierName = tier.split('_')[0];
    switch (tierName) {
      case "moon":
        return "from-blue-400 to-blue-600";
      case "star":
        return "from-yellow-400 to-yellow-600";
      case "sun":
        return "from-orange-400 to-orange-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const getTierColor = (tier) => {
    const tierName = tier.split('_')[0];
    switch (tierName) {
      case "moon":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "star":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "sun":
        return "bg-orange-50 border-orange-200 text-orange-900";
      default:
        return "bg-blue-50 border-blue-200 text-blue-900";
    }
  };

  const getPlansByTier = () => {
    const plansByTier = {
      moon: {},
      star: {},
      sun: {}
    };

    Object.entries(plans).forEach(([key, plan]) => {
      const [tierName] = key.split('_');
      if (plansByTier[tierName]) {
        plansByTier[tierName][key] = plan;
      }
    });

    return plansByTier;
  };

  const formatDuration = (duration) => {
    switch (duration) {
      case "1_month":
        return "1 Month";
      case "3_months":
        return "3 Months";
      case "6_months":
        return "6 Months";
      case "12_months":
        return "12 Months";
      default:
        return duration;
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
                    ${plan?.fee || 0}
                  </span>
                </div>
                {plan?.originalFee && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Original price:</span>
                    <span className="text-sm text-gray-500 line-through">
                      ${plan.originalFee}
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  {plan?.isRecurring 
                    ? `Billed every ${plan?.duration || 30} days. Cancel anytime.` 
                    : `Valid for ${plan?.duration || 30} days. No auto-renewal.`
                  }
                </p>
                {plan?.discountRange && (
                  <p className="text-xs text-blue-600 mt-1">
                    Discounts apply to services between ${plan.discountRange.min}-${plan.discountRange.max}
                  </p>
                )}
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
  const plansByTier = getPlansByTier();
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Choose Your Membership Plan
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Join CleanMatch Comfort Life and get discounts on cleaning services
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

      {/* Plan Tier Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-white border rounded-xl p-2 flex shadow-lg max-w-md">
          {["moon", "star", "sun"].map((tier) => {
            const samplePlan = plans[`${tier}_1_month`];
            return (
              <button
                key={tier}
                className={`px-4 py-4 rounded-lg text-sm font-medium transition-all min-w-[100px] flex-1 ${
                  selectedPlanTier === tier
                    ? `bg-gradient-to-r ${getTierGradient(`${tier}_1_month`)} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPlanTier(tier)}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className={`${selectedPlanTier === tier ? 'text-white' : ''}`}>
                    {getTierIcon(`${tier}_1_month`)}
                  </div>
                  <span className="capitalize font-semibold text-sm">
                    {tier === 'moon' ? 'Moon' : tier === 'star' ? 'Star' : 'Sun'}
                  </span>
                  <span className={`text-xs ${selectedPlanTier === tier ? 'text-white opacity-90' : 'text-gray-500'}`}>
                    {samplePlan?.discountRange ? `$${samplePlan.discountRange.min}-$${samplePlan.discountRange.max}` : 'Loading...'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-50 rounded-xl p-2 grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl w-full">
          {["1_month", "3_months", "6_months", "12_months"].map((duration) => {
            const planKey = `${selectedPlanTier}_${duration}`;
            const plan = plans[planKey];
            if (!plan) return null;
            
            return (
              <button
                key={duration}
                className={`p-4 rounded-lg text-sm font-medium transition-all ${
                  selectedDuration === duration
                    ? 'bg-white text-blue-600 shadow-lg border-2 border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
                }`}
                onClick={() => setSelectedDuration(duration)}
              >
                <div className="text-center space-y-1">
                  <div className="font-bold text-lg">{formatDuration(duration)}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${plan.fee}
                  </div>
                  {plan.originalFee && (
                    <div className="text-sm text-gray-400 line-through">
                      ${plan.originalFee}
                    </div>
                  )}
                  {plan.discount && (
                    <div className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      Save {plan.discount}%
                    </div>
                  )}
                  {plan.popular && (
                    <div className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Selected Plan Details */}
      {plans[selectedTier] && (
        <div className="max-w-2xl mx-auto">
          <Card className={`border-2 ${getTierColor(selectedTier)} shadow-lg`}>
            {/* Check if this is the user's active membership */}
            {membership?.tier === selectedTier && membership?.status === "active" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Current Active Plan
                </span>
              </div>
            )}
            
            <CardHeader className="text-center py-6">
              <div className="flex justify-center mb-4">
                {getTierIcon(selectedTier)}
              </div>
              <CardTitle className="text-2xl font-bold mb-2">
                {plans[selectedTier].name}
              </CardTitle>
              <div className="text-lg text-gray-600 mb-3">
                {plans[selectedTier].subtitle}
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${plans[selectedTier].fee}
                  <span className="text-lg font-normal text-gray-600">
                    {isRecurring ? ` / ${plans[selectedTier].duration} days` : ' one-time'}
                  </span>
                </div>
                {plans[selectedTier].originalFee && (
                  <div className="text-lg text-gray-500 line-through mb-2">
                    Originally ${plans[selectedTier].originalFee}
                  </div>
                )}
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getTierGradient(selectedTier)}`}
                >
                  Services ${plans[selectedTier].discountRange.min}-${plans[selectedTier].discountRange.max} get discounts
                </div>
                {plans[selectedTier].discount && (
                  <div className="mt-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      Save {plans[selectedTier].discount}% on plan price
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Plan Benefits:</h4>
                  <ul className="space-y-2">
                    {plans[selectedTier].features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plans[selectedTier].tagline && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-center text-gray-700 font-medium">
                      {plans[selectedTier].tagline}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-8 pb-6">
        <Button
          onClick={handleContinueToPayment}
          loading={subscribing}
          disabled={
            (membership?.tier === selectedTier && membership?.status === "active") || 
            (membership?.tier?.includes("12_months") && selectedTier.includes("1_month") && membership?.status === "active")
          }
          className="px-8 py-3 text-lg"
          size="lg"
        >
          {membership?.tier === selectedTier && membership?.status === "active" 
            ? "Already Subscribed" 
            : membership?.tier?.includes("12_months") && selectedTier.includes("1_month") && membership?.status === "active"
              ? "Cannot Downgrade to Monthly"
              : `Continue with ${plans[selectedTier]?.name} ${plans[selectedTier]?.subtitle} - $${plans[selectedTier]?.fee}`
          }
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          No setup fees • {isRecurring ? 'Cancel anytime' : 'No auto-renewal'} • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default MembershipSubscription;
