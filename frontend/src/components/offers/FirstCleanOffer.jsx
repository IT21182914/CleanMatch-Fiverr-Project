import React, { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import { api } from "../../lib/api";

const FirstCleanOffer = ({ onOfferApplied, serviceId, hours, onClose }) => {
  const [offer, setOffer] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  useEffect(() => {
    if (eligibility?.eligible && serviceId && hours) {
      calculatePricing();
    }
  }, [eligibility, serviceId, hours, calculatePricing]);

  const checkEligibility = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/offers/first-clean/eligibility");

      if (response.data.success) {
        setEligibility(response.data);
        if (response.data.eligible) {
          setOffer(response.data.offer);
        }
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      showToast("Error checking offer eligibility", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const calculatePricing = useCallback(async () => {
    if (!serviceId || !hours) return;

    try {
      setCalculatingPrice(true);
      const response = await api.post("/offers/first-clean/calculate", {
        serviceId,
        hours: parseInt(hours),
      });

      if (response.data.success) {
        setPricing(response.data.pricing);
      }
    } catch (error) {
      console.error("Error calculating pricing:", error);
      showToast("Error calculating offer pricing", "error");
    } finally {
      setCalculatingPrice(false);
    }
  }, [serviceId, hours, showToast]);

  const handleApplyOffer = () => {
    if (pricing && onOfferApplied) {
      onOfferApplied({
        offerId: offer.id,
        offerName: offer.name,
        originalAmount: pricing.calculation.originalAmount,
        finalAmount: pricing.calculation.finalAmount,
        discountAmount: pricing.calculation.discountAmount,
        pricing: pricing,
      });
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!eligibility?.eligible) {
    return null; // Don't show offer if not eligible
  }

  const validHours = [2, 3, 4, 6];
  const isValidHours = hours && validHours.includes(parseInt(hours));

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                {offer?.name}
              </h3>
              <p className="text-sm text-green-600">
                Special offer for ForeverClean members
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-3">{offer?.description}</p>

          {!isValidHours && hours && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <p className="text-yellow-800 text-sm">
                ⚠️ This offer is valid for 2, 3, 4, or 6-hour cleaning sessions
                only. Please select a valid duration to apply this offer.
              </p>
            </div>
          )}

          {pricing && isValidHours && (
            <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Pricing Breakdown
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Original Price ({hours} hours):
                  </span>
                  <span className="line-through text-gray-500">
                    ${pricing.calculation.originalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>First Clean Discount:</span>
                  <span>-${pricing.calculation.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-green-800 border-t pt-2">
                  <span>Your Price:</span>
                  <span>${pricing.calculation.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {calculatingPrice && (
            <div className="text-center py-4">
              <div className="inline-flex items-center text-sm text-gray-600">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Calculating pricing...
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {pricing && isValidHours && (
            <Button
              onClick={handleApplyOffer}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Apply $18 First Clean Offer
            </Button>
          )}

          <div className="text-xs text-gray-500">
            <p>✓ Active ForeverClean membership required</p>
            <p>✓ One-time offer for new customers</p>
          </div>
        </div>

        {eligibility.membership && (
          <div className="mt-4 text-xs text-gray-600 bg-blue-50 rounded-lg p-3">
            <p className="font-medium text-blue-800">
              Your ForeverClean Membership
            </p>
            <p>
              Plan:{" "}
              {eligibility.membership.plan_type.charAt(0).toUpperCase() +
                eligibility.membership.plan_type.slice(1)}
            </p>
            <p>Status: {eligibility.membership.status}</p>
            <p>
              Valid until:{" "}
              {new Date(
                eligibility.membership.current_period_end
              ).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FirstCleanOffer;
