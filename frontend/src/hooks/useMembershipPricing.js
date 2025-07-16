import { useState, useEffect, useCallback } from "react";
import { membershipAPI } from "../lib/api";

export const useMembershipPricing = () => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembership = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await membershipAPI.getCurrentMembership();
      setMembership(response.data.membership);
    } catch (err) {
      console.error("Error fetching membership:", err);
      setError(err);
      setMembership(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  const calculatePricing = useCallback(
    (baseAmount) => {
      if (
        !membership ||
        membership.status !== "active" ||
        new Date(membership.current_period_end) < new Date()
      ) {
        return {
          originalAmount: baseAmount,
          discountAmount: 0,
          discountPercentage: 0,
          finalAmount: baseAmount,
          membershipTier: null,
          hasMembership: false,
        };
      }

      const discountPercentage = parseFloat(membership.discount_percentage);
      const discountAmount = baseAmount * (discountPercentage / 100);
      const finalAmount = baseAmount - discountAmount;

      return {
        originalAmount: baseAmount,
        discountAmount: Math.round(discountAmount * 100) / 100,
        discountPercentage,
        finalAmount: Math.round(finalAmount * 100) / 100,
        membershipTier: membership.tier,
        hasMembership: true,
        membershipName: membership.plan_name,
      };
    },
    [membership]
  );

  const calculateServicePricing = useCallback(async (serviceId, hours) => {
    try {
      const response = await membershipAPI.calculatePricing({
        serviceId: parseInt(serviceId),
        hours: parseInt(hours),
      });
      return response.data.pricing;
    } catch (err) {
      console.error("Error calculating service pricing:", err);
      throw err;
    }
  }, []);

  const isEligibleForDiscount = useCallback(() => {
    return (
      membership &&
      membership.status === "active" &&
      new Date(membership.current_period_end) > new Date() &&
      !membership.cancel_at_period_end
    );
  }, [membership]);

  return {
    membership,
    loading,
    error,
    calculatePricing,
    calculateServicePricing,
    isEligibleForDiscount,
    refetch: fetchMembership,
  };
};
