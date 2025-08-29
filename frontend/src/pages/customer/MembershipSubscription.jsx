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
          setError("You cannot downgrade from annual to monthly plan while your annual plan is active. Please wait until your annual plan expires to subscribe to a monthly plan.");
          setSubscribing(false);
          return;
        }

        // Case 3: User is upgrading - this is allowed for same tier different duration or different tier
        if (membership.tier !== selectedTier) {
          // Show a confirmation dialog for tier changes
          const currentPlan = plans[membership.tier];
          const newPlan = plans[selectedTier];
          if (!window.confirm(`You are about to change from ${currentPlan?.name} ${currentPlan?.subtitle} to ${newPlan?.name} ${newPlan?.subtitle}. Your current plan will be replaced. Do you want to continue?`)) {
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
        setError("You cannot downgrade from annual to monthly plan while your annual plan is active. Please wait until your annual plan expires to subscribe to a monthly plan.");
      } else if (errorMessage.includes("already has this membership tier active")) {
        setError("You already have this membership plan active.");
      } else if (errorMessage.includes("already has an active membership")) {
        setError("You already have an active membership. Please contact support if you need to change your plan.");
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
                      ? "Your membership renews automatically"
                      : `Your membership is valid for ${plan.duration} days`
                    }
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {plan.isRecurring
                    ? "Automatic renewal for your convenience"
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
                    ? `Billed every ${plan?.duration || 30} days. Automatic renewal.`
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
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Enhanced Header */}
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <SparklesIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Choose Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comfort Life
          </span>{" "}
          Plan
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Join CleanMatch Comfort Life and unlock exclusive discounts on professional cleaning services.
          Choose the perfect plan that fits your lifestyle and budget.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">10%-20%</div>
            <div className="text-sm text-gray-600">Average Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">5K+</div>
            <div className="text-sm text-gray-600">Happy Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Premium Support</div>
          </div>
        </div>
      </div>

      {/* Payment Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isRecurring
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
              }`}
            onClick={() => setIsRecurring(false)}
          >
            One-time Payment
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isRecurring
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
        <div className="bg-gray-50 rounded-2xl p-3 flex gap-3 shadow-lg max-w-2xl">
          {["moon", "star", "sun"].map((tier) => {
            const samplePlan = plans[`${tier}_1_month`];
            const isSelected = selectedPlanTier === tier;

            return (
              <button
                key={tier}
                className={`relative px-6 py-6 rounded-xl text-sm font-medium transition-all duration-300 min-w-[140px] flex-1 group ${isSelected
                  ? 'bg-white shadow-xl transform scale-105 border-2 border-blue-200'
                  : 'bg-white/60 hover:bg-white hover:shadow-lg hover:scale-102 border border-gray-200'
                  }`}
                onClick={() => setSelectedPlanTier(tier)}
              >
                {/* Gradient Background for Selected State */}
                {isSelected && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getTierGradient(`${tier}_1_month`)} rounded-xl opacity-10`}
                  ></div>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center space-y-2">
                  {/* Icon with proper color handling */}
                  <div className={`transform transition-all duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {tier === 'moon' && (
                      <SparklesIcon className={`h-10 w-10 ${isSelected ? 'text-blue-600' : 'text-blue-500'}`} />
                    )}
                    {tier === 'star' && (
                      <FaStar className={`h-10 w-10 ${isSelected ? 'text-yellow-600' : 'text-yellow-500'}`} />
                    )}
                    {tier === 'sun' && (
                      <FaCrown className={`h-10 w-10 ${isSelected ? 'text-orange-600' : 'text-orange-500'}`} />
                    )}
                  </div>

                  {/* Title */}
                  <span className={`capitalize font-bold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                    {tier === 'moon' ? 'Moon' : tier === 'star' ? 'Star' : 'Sun'}
                  </span>

                  {/* Subtitle */}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${isSelected
                    ? tier === 'moon' ? 'bg-blue-100 text-blue-700' :
                      tier === 'star' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {samplePlan?.discountRange ? `$${samplePlan.discountRange.min}-$${samplePlan.discountRange.max}` : 'Loading...'}
                  </span>

                  {/* Discount Badge */}
                  {samplePlan?.discountPercentage && (
                    <div className={`text-xs font-semibold px-2 py-1 rounded-full ${isSelected
                      ? tier === 'moon' ? 'bg-blue-600 text-white' :
                        tier === 'star' ? 'bg-yellow-600 text-white' :
                          'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                      }`}>
                      {samplePlan.discountPercentage}% OFF
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${tier === 'moon' ? 'bg-blue-600' :
                      tier === 'star' ? 'bg-yellow-600' :
                        'bg-orange-600'
                      }`}>
                      ✓
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-50 rounded-2xl p-3 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl w-full">
          {["1_month", "3_months", "6_months", "12_months"].map((duration) => {
            const planKey = `${selectedPlanTier}_${duration}`;
            const plan = plans[planKey];
            if (!plan) return null;

            const isSelected = selectedDuration === duration;
            const savings = plan.discount || (plan.originalFee ? Math.round(((plan.originalFee - plan.fee) / plan.originalFee) * 100) : 0);

            return (
              <button
                key={duration}
                className={`relative p-5 rounded-xl font-medium transition-all duration-300 group ${isSelected
                  ? 'bg-white shadow-xl transform scale-105 border-2 border-blue-200'
                  : 'bg-white/70 hover:bg-white hover:shadow-lg hover:scale-102 border border-gray-200'
                  }`}
                onClick={() => setSelectedDuration(duration)}
              >
                {/* Gradient Background for Selected State */}
                {isSelected && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getTierGradient(`${selectedPlanTier}_1_month`)} rounded-xl opacity-5`}
                  ></div>
                )}

                {/* Content */}
                <div className="relative z-10 text-center space-y-2">
                  {/* Duration Label */}
                  <div className={`font-bold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {formatDuration(duration)}
                  </div>

                  {/* Price */}
                  <div className={`text-3xl font-bold ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                    ${plan.fee}
                  </div>

                  {/* Original Price */}
                  {plan.originalFee && (
                    <div className="text-sm text-gray-400 line-through">
                      was ${plan.originalFee}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="space-y-2">
                    {savings > 0 && (
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isSelected
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700'
                        }`}>
                        Save {savings}%
                      </div>
                    )}

                    {plan.popular && (
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-700'
                        }`}>
                        Most Popular
                      </div>
                    )}
                  </div>

                  {/* Per Month Calculation for multi-month plans */}
                  {duration !== "1_month" && (
                    <div className="text-xs text-gray-500 border-t border-gray-100 pt-2">
                      ${(plan.fee / parseInt(duration.split('_')[0])).toFixed(2)} per month
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      ✓
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Plan Details */}
      {plans[selectedTier] && (
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Check if this is the user's active membership */}
            {membership?.tier === selectedTier && membership?.status === "active" && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30">
                <div className="relative">
                  {/* Glowing effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-sm opacity-75"></div>
                  {/* Main badge */}
                  <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-xl border-3 border-white">
                    <div className="flex items-center font-bold text-sm">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      <span>Your Active Plan</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Card className="border-0 shadow-2xl overflow-hidden relative mt-6">
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getTierGradient(selectedTier)} opacity-5`}
              ></div>

              <CardHeader className="text-center py-8 relative z-10">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-2xl ${selectedPlanTier === 'moon' ? 'bg-blue-100' :
                    selectedPlanTier === 'star' ? 'bg-yellow-100' :
                      'bg-orange-100'
                    }`}>
                    {selectedPlanTier === 'moon' && (
                      <SparklesIcon className="h-12 w-12 text-blue-600" />
                    )}
                    {selectedPlanTier === 'star' && (
                      <FaStar className="h-12 w-12 text-yellow-600" />
                    )}
                    {selectedPlanTier === 'sun' && (
                      <FaCrown className="h-12 w-12 text-orange-600" />
                    )}
                  </div>
                </div>

                {/* Plan Name */}
                <CardTitle className="text-3xl font-bold mb-3 text-gray-900">
                  {plans[selectedTier].name}
                </CardTitle>

                {/* Subtitle */}
                <div className="text-lg text-gray-600 mb-6">
                  {plans[selectedTier].subtitle}
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plans[selectedTier].fee}
                    </span>
                    <span className="text-lg font-medium text-gray-600">
                      {isRecurring ? ` / ${plans[selectedTier].duration} days` : ' one-time'}
                    </span>
                  </div>

                  {plans[selectedTier].originalFee && (
                    <div className="text-xl text-gray-500 line-through mb-3">
                      Originally ${plans[selectedTier].originalFee}
                    </div>
                  )}

                  {/* Service Range Badge */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getTierGradient(selectedTier)} shadow-lg`}>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Services ${plans[selectedTier].discountRange.min}-${plans[selectedTier].discountRange.max} get {plans[selectedTier].discountPercentage}% OFF
                  </div>

                  {/* Savings Badge */}
                  {plans[selectedTier].discount && (
                    <div className="mt-3">
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold border border-green-200">
                        🎉 Save {plans[selectedTier].discount}% on plan price
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Plan Benefits */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                      <div className={`p-2 rounded-lg mr-3 ${selectedPlanTier === 'moon' ? 'bg-blue-100' :
                        selectedPlanTier === 'star' ? 'bg-yellow-100' :
                          'bg-orange-100'
                        }`}>
                        <CheckCircleIcon className={`h-5 w-5 ${selectedPlanTier === 'moon' ? 'text-blue-600' :
                          selectedPlanTier === 'star' ? 'text-yellow-600' :
                            'text-orange-600'
                          }`} />
                      </div>
                      Plan Benefits
                    </h4>
                    <ul className="space-y-3">
                      {plans[selectedTier].features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Plan Details */}
                  <div className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                      <div className="p-2 rounded-lg bg-blue-100 mr-3">
                        <FaShieldAlt className="h-5 w-5 text-blue-600" />
                      </div>
                      Plan Details
                    </h4>

                    <div className="space-y-4">
                      {/* Duration */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Duration:</span>
                        <span className="font-bold text-gray-900">
                          {formatDuration(selectedDuration)}
                        </span>
                      </div>

                      {/* Payment Type */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Payment:</span>
                        <span className={`font-bold px-3 py-1 rounded-full text-xs ${isRecurring ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                          {isRecurring ? 'Recurring' : 'One-time'}
                        </span>
                      </div>

                      {/* Discount Rate */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Discount:</span>
                        <span className="font-bold text-green-600">
                          {plans[selectedTier].discountPercentage}%
                        </span>
                      </div>

                      {/* Service Range */}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Applies to:</span>
                        <span className="font-bold text-gray-900">
                          ${plans[selectedTier].discountRange.min}-${plans[selectedTier].discountRange.max}
                        </span>
                      </div>
                    </div>

                    {/* Guarantee */}
                    <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                      <div className="text-center">
                        <div className="text-blue-600 font-bold text-sm">� Secure Payment Processing</div>
                        <div className="text-blue-700 text-xs mt-1">
                          {isRecurring ? 'Automatic renewal for convenience' : 'One-time secure payment'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                {plans[selectedTier].tagline && (
                  <div className="mt-8 text-center">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <p className="text-gray-700 font-medium text-lg italic">
                        "{plans[selectedTier].tagline}"
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Main CTA Button */}
          <Button
            onClick={handleContinueToPayment}
            loading={subscribing}
            disabled={
              (membership?.tier === selectedTier && membership?.status === "active") ||
              (membership?.tier?.includes("12_months") && selectedTier.includes("1_month") && membership?.status === "active")
            }
            className={`w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 ${(membership?.tier === selectedTier && membership?.status === "active") ||
              (membership?.tier?.includes("12_months") && selectedTier.includes("1_month") && membership?.status === "active")
              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
              : `bg-gradient-to-r ${getTierGradient(selectedTier)} hover:shadow-2xl`
              }`}
            size="lg"
          >
            {membership?.tier === selectedTier && membership?.status === "active"
              ? "✓ Already Subscribed"
              : membership?.tier?.includes("12_months") && selectedTier.includes("1_month") && membership?.status === "active"
                ? "❌ Cannot Downgrade to Monthly"
                : `🚀 Get ${plans[selectedTier]?.name} for $${plans[selectedTier]?.fee}`
            }
          </Button>

          {/* Benefits Summary */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-center text-gray-600">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span>{isRecurring ? 'Automatic renewal' : 'No auto-renewal'}</span>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <FaShieldAlt className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                Secure payment powered by Stripe • Your data is protected with bank-level security
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipSubscription;
