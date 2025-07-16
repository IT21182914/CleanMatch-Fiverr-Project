import { useState, useEffect, useCallback } from "react";
import { SparklesIcon, TagIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../../lib/utils";
import { useMembershipPricing } from "../../hooks/useMembershipPricing";

const PricingDisplay = ({
  serviceId,
  hours,
  hourlyRate,
  showMembershipInfo = true,
  className = "",
}) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
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

  if (loading || !pricing) {
    return (
      <div className={`bg-white border rounded-lg p-4 ${className}`}>
        <h3 className="font-semibold mb-3">Pricing</h3>
        <div className="space-y-2">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const { calculation } = pricing;
  const hasMembershipDiscount = calculation.discountAmount > 0;

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold mb-3">Pricing</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Service Rate:</span>
          <span>
            {formatCurrency(calculation.originalAmount / calculation.hours)}
            /hour
          </span>
        </div>
        <div className="flex justify-between">
          <span>Duration:</span>
          <span>
            {calculation.hours} hour{calculation.hours > 1 ? "s" : ""}
          </span>
        </div>

        {/* Show original amount if there's a discount */}
        {hasMembershipDiscount && (
          <>
            <div className="flex justify-between text-gray-500">
              <span>Subtotal:</span>
              <span className="line-through">
                {formatCurrency(calculation.originalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-green-600">
              <span className="flex items-center">
                <SparklesIcon className="h-4 w-4 mr-1" />
                ForeverClean {calculation.discountPercentage}% Discount:
              </span>
              <span>-{formatCurrency(calculation.discountAmount)}</span>
            </div>
          </>
        )}

        <hr />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span className={hasMembershipDiscount ? "text-green-600" : ""}>
            {formatCurrency(calculation.finalAmount)}
          </span>
        </div>

        {/* Membership savings callout */}
        {hasMembershipDiscount && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800 font-medium">
                You saved {formatCurrency(calculation.discountAmount)} with your
                ForeverClean membership!
              </span>
            </div>
          </div>
        )}

        {/* Membership promotion for non-members */}
        {!hasMembershipDiscount &&
          !isEligibleForDiscount() &&
          showMembershipInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <div className="flex items-center">
                <SparklesIcon className="h-4 w-4 text-blue-600 mr-2" />
                <div className="text-sm">
                  <span className="text-blue-800 font-medium">
                    Join ForeverClean and save up to 35% on all services!
                  </span>
                  <div className="text-blue-600 mt-1">
                    You could save{" "}
                    {formatCurrency(calculation.originalAmount * 0.15)}
                    with our Basic plan.
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Membership expiring warning */}
        {membership && membership.cancel_at_period_end && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
            <div className="flex items-center">
              <SparklesIcon className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Your membership is ending soon. Reactivate to keep saving!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingDisplay;
