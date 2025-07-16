import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import {
  CheckCircleIcon,
  SparklesIcon,
  StarIcon,
  CrownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import PaymentForm from "../../components/payment/PaymentForm";
import { membershipAPI } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";
import { useToast } from "../../hooks/useToast";

const MembershipSubscription = () => {
  const [plans, setPlans] = useState({});
  const [selectedTier, setSelectedTier] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchPlans = useCallback(async () => {
    try {
      const response = await membershipAPI.getPlans();
      setPlans(response.data.plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      showToast("Failed to load membership plans", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSubscribe = async () => {
    try {
      setSubscribing(true);
      const plan = plans[selectedTier];

      const response = await membershipAPI.subscribe({
        tier: selectedTier,
        priceId: plan.stripePriceId,
      });

      if (response.data.client_secret) {
        setClientSecret(response.data.client_secret);
        setShowPayment(true);
      } else {
        // Subscription was successful without additional payment required
        showToast(
          "Successfully subscribed to ForeverClean membership!",
          "success"
        );
        navigate("/customer/profile");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      showToast(
        error.response?.data?.error || "Failed to create subscription",
        "error"
      );
    } finally {
      setSubscribing(false);
    }
  };

  const handlePaymentSuccess = () => {
    showToast(
      "Welcome to ForeverClean! Your membership is now active.",
      "success"
    );
    navigate("/customer/profile");
  };

  const handlePaymentError = (error) => {
    showToast(error || "Payment failed. Please try again.", "error");
    setShowPayment(false);
    setClientSecret("");
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "gold":
        return <CrownIcon className="h-8 w-8 text-yellow-500" />;
      case "premium":
        return <StarIcon className="h-8 w-8 text-purple-500" />;
      default:
        return <SparklesIcon className="h-8 w-8 text-blue-500" />;
    }
  };

  const getTierGradient = (tier) => {
    switch (tier) {
      case "gold":
        return "from-yellow-400 to-yellow-600";
      case "premium":
        return "from-purple-400 to-purple-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const getTierBorder = (tier, isSelected) => {
    if (!isSelected) return "border-gray-200";
    switch (tier) {
      case "gold":
        return "border-yellow-400 ring-2 ring-yellow-400";
      case "premium":
        return "border-purple-400 ring-2 ring-purple-400";
      default:
        return "border-blue-400 ring-2 ring-blue-400";
    }
  };

  if (loading) {
    return <LoadingCard />;
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

    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your ForeverClean Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{plans[selectedTier].name}</span>
                <span className="text-lg font-bold">
                  {formatCurrency(plans[selectedTier].monthlyFee)}/month
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Save {plans[selectedTier].discountPercentage}% on all cleaning
                services
              </p>
            </div>

            <Elements
              options={{ clientSecret, appearance }}
              stripe={stripePromise}
            >
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Join ForeverClean Membership
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Save money on every cleaning service with our exclusive membership
          plans
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(plans).map(([tier, plan]) => (
          <Card
            key={tier}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${getTierBorder(
              tier,
              selectedTier === tier
            )}`}
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
              <div className="flex justify-center mb-4">
                {getTierIcon(tier)}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatCurrency(plan.monthlyFee)}
                  <span className="text-lg font-normal text-gray-600">
                    /month
                  </span>
                </div>
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getTierGradient(
                    tier
                  )}`}
                >
                  Save {plan.discountPercentage}% on all services
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {selectedTier === tier && (
                <div
                  className={`bg-gradient-to-r ${getTierGradient(
                    tier
                  )} text-white p-3 rounded-lg text-center font-medium`}
                >
                  Selected Plan
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Why Choose ForeverClean Membership?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Guaranteed Savings</h3>
              <p className="text-gray-600">
                Save on every single cleaning service with automatic member
                pricing
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Priority Service</h3>
              <p className="text-gray-600">
                Get first access to booking slots and priority customer support
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Cancellation</h3>
              <p className="text-gray-600">
                Cancel anytime with no fees. Your membership benefits continue
                until the end of your billing period
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button
          onClick={handleSubscribe}
          loading={subscribing}
          className="px-8 py-4 text-lg"
          size="lg"
        >
          Start My {plans[selectedTier]?.name || "Membership"} -{" "}
          {formatCurrency(plans[selectedTier]?.monthlyFee || 0)}/month
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          No setup fees • Cancel anytime • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default MembershipSubscription;
