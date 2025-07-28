import { useState, useEffect, useCallback } from "react";
import {
  SparklesIcon,
  TagIcon,
  ClockIcon,
  CreditCardIcon,
  StarIcon,
  CheckCircleIcon,
  GiftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "../../lib/utils";
import { useMembershipPricing } from "../../hooks/useMembershipPricing";
import Button from "../ui/Button";

const PricingDisplay = ({
  serviceId,
  hours,
  hourlyRate,
  showMembershipInfo = true,
  showUpgradePrompt = true,
  variant = "default", // "default" | "compact" | "detailed" | "checkout"
  className = "",
  onMembershipClick,
}) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSavingsBreakdown, setShowSavingsBreakdown] = useState(false);
  const { calculateServicePricing, isEligibleForDiscount, membership } =
    useMembershipPricing();

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      const pricingData = await calculateServicePricing(serviceId, hours);
      setPricing(pricingData);
    } catch (error) {
      console.error("Error fetching pricing:", error);
      // Fallback to basic calculation
      if (hourlyRate && hours) {
        const baseAmount = hourlyRate * hours;
        setPricing({
          calculation: {
            hours,
            originalAmount: baseAmount,
            finalAmount: baseAmount,
            discountAmount: 0,
            discountPercentage: 0,
            membershipTier: null,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  }, [serviceId, hours, calculateServicePricing, hourlyRate]);

  useEffect(() => {
    if (serviceId && hours) {
      fetchPricing();
    } else if (hourlyRate && hours) {
      // Calculate simple pricing without membership API call
      const baseAmount = hourlyRate * hours;
      setPricing({
        calculation: {
          hours,
          originalAmount: baseAmount,
          finalAmount: baseAmount,
          discountAmount: 0,
          discountPercentage: 0,
          membershipTier: null,
        },
      });
    }
  }, [serviceId, hours, hourlyRate, fetchPricing]);

  const calculatePotentialSavings = (amount) => {
    return {
      basic: amount * 0.15,
      premium: amount * 0.25,
      supersaver: amount * 0.5, // 50% savings
      foreverclean: amount * 0.35,
    };
  };

  if (loading || !pricing) {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-xl shadow-sm ${
          variant === "checkout" ? "sticky top-6" : ""
        } ${className}`}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <CreditCardIcon className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Pricing Details
            </h3>
          </div>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const { calculation } = pricing;
  const hasMembershipDiscount = calculation.discountAmount > 0;
  const potentialSavings = calculatePotentialSavings(
    calculation.originalAmount
  );

  const renderCompactView = () => (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">
            {calculation.hours}h service
          </span>
        </div>
        <div className="text-right">
          {hasMembershipDiscount && (
            <div className="text-sm text-gray-500 line-through">
              {formatCurrency(calculation.originalAmount)}
            </div>
          )}
          <div
            className={`text-lg font-bold ${
              hasMembershipDiscount ? "text-green-600" : "text-gray-900"
            }`}
          >
            {formatCurrency(calculation.finalAmount)}
          </div>
        </div>
      </div>

      {hasMembershipDiscount && (
        <div className="mt-2 text-xs text-green-600 flex items-center">
          <TagIcon className="h-3 w-3 mr-1" />
          Saved {formatCurrency(calculation.discountAmount)} with ForeverClean
        </div>
      )}
    </div>
  );

  const renderDetailedView = () => (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-lg ${
        variant === "checkout" ? "sticky top-6" : ""
      } ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 rounded-t-xl border-b border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCardIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Service Pricing
            </h3>
          </div>
          {hasMembershipDiscount && (
            <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
              <StarIcon className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-semibold text-green-800">
                Member Price
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Service Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Hourly Rate:</span>
            <span className="font-medium">
              {formatCurrency(calculation.originalAmount / calculation.hours)}
              /hour
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Duration:</span>
            </div>
            <span className="font-medium">
              {calculation.hours} hour{calculation.hours !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service Subtotal:</span>
            <span
              className={
                hasMembershipDiscount
                  ? "line-through text-gray-500"
                  : "font-medium"
              }
            >
              {formatCurrency(calculation.originalAmount)}
            </span>
          </div>

          {/* Membership Discount */}
          {hasMembershipDiscount && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    ForeverClean {calculation.discountPercentage}% Discount
                  </span>
                </div>
                <span className="text-green-600 font-semibold">
                  -{formatCurrency(calculation.discountAmount)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${
                  hasMembershipDiscount ? "text-green-600" : "text-gray-900"
                }`}
              >
                {formatCurrency(calculation.finalAmount)}
              </div>
              {hasMembershipDiscount && (
                <div className="text-sm text-green-600">
                  You saved {formatCurrency(calculation.discountAmount)}!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Membership Benefits */}
        {hasMembershipDiscount && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ForeverClean Benefits Applied
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>
                    • {calculation.discountPercentage}% discount on all services
                  </li>
                  <li>• Priority booking & scheduling</li>
                  <li>• Free re-cleaning guarantee</li>
                  <li>• Dedicated customer support</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Potential Savings for Non-Members */}
        {!hasMembershipDiscount &&
          !isEligibleForDiscount() &&
          showMembershipInfo && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <GiftIcon className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    💡 Save More with ForeverClean Membership
                  </h4>
                  <div className="space-y-2 mb-3">
                    <div className="text-sm text-blue-800">
                      <span className="font-semibold">
                        You could save{" "}
                        {formatCurrency(potentialSavings.supersaver)}
                      </span>{" "}
                      on this service with our SuperSaver plan (50% off)!
                    </div>
                  </div>{" "}
                  {showUpgradePrompt && (
                    <button
                      onClick={() =>
                        setShowSavingsBreakdown(!showSavingsBreakdown)
                      }
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      See all membership savings →
                    </button>
                  )}
                  {showSavingsBreakdown && (
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between text-orange-700 font-bold">
                        <span>SuperSaver (50% off):</span>
                        <span className="font-bold">
                          Save {formatCurrency(potentialSavings.supersaver)}
                        </span>
                      </div>
                      <div className="flex justify-between text-blue-700">
                        <span>ForeverClean (35% off):</span>
                        <span className="font-semibold">
                          Save {formatCurrency(potentialSavings.foreverclean)}
                        </span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>Premium (25% off):</span>
                        <span>
                          Save {formatCurrency(potentialSavings.premium)}
                        </span>
                      </div>
                      <div className="flex justify-between text-blue-500">
                        <span>Basic (15% off):</span>
                        <span>
                          Save {formatCurrency(potentialSavings.basic)}
                        </span>
                      </div>
                    </div>
                  )}
                  {showUpgradePrompt && onMembershipClick && (
                    <div className="mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={onMembershipClick}
                        className="w-full"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Join ForeverClean - $49/month
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Membership Expiring Warning */}
        {membership && membership.cancel_at_period_end && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <span className="text-sm font-semibold text-orange-800">
                  Your ForeverClean membership is ending soon!
                </span>
                <div className="text-sm text-orange-700 mt-1">
                  Reactivate to keep saving on all your cleaning services.
                </div>
                {onMembershipClick && (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={onMembershipClick}
                    className="mt-2"
                  >
                    Reactivate Membership
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
              <span>Satisfaction Guaranteed</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
              <span>Insured & Bonded</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
              <span>Background Checked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Return appropriate view based on variant
  if (variant === "compact") {
    return renderCompactView();
  }

  return renderDetailedView();
};

export default PricingDisplay;
