import { useState, useEffect, useCallback } from "react";
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { LoadingCard } from "../ui/Loading";
import { membershipAPI } from "../../lib/api";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import { useToast } from "../../hooks/useToast";

const MembershipCard = () => {
  const [membership, setMembership] = useState(null);
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [usageStats, setUsageStats] = useState(null);
  const { showToast } = useToast();

  const fetchMembershipData = useCallback(async () => {
    try {
      setLoading(true);
      const [membershipResponse, plansResponse] = await Promise.all([
        membershipAPI.getCurrentMembership(),
        membershipAPI.getPlans(),
      ]);

      setMembership(membershipResponse.data.membership);
      setUsageStats(membershipResponse.data.usageStats);
      setPlans(plansResponse.data.plans);
    } catch (error) {
      console.error("Error fetching membership data:", error);
      showToast("Failed to load membership information", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMembershipData();
  }, [fetchMembershipData]);

  const handleCancelMembership = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your ForeverClean membership? You'll lose access to member pricing at the end of your current billing period."
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await membershipAPI.cancelMembership({
        cancelAtPeriodEnd: true,
        reason: "User requested cancellation",
      });

      showToast(
        "Membership will be cancelled at the end of your billing period",
        "info"
      );
      await fetchMembershipData();
    } catch (error) {
      console.error("Error cancelling membership:", error);
      showToast("Failed to cancel membership", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateMembership = async () => {
    try {
      setActionLoading(true);
      await membershipAPI.reactivateMembership();
      showToast("Membership reactivated successfully!", "success");
      await fetchMembershipData();
    } catch (error) {
      console.error("Error reactivating membership:", error);
      showToast("Failed to reactivate membership", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const getMembershipStatusColor = (status, cancelAtPeriodEnd) => {
    if (cancelAtPeriodEnd) return "bg-yellow-100 text-yellow-800";
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "past_due":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMembershipStatusText = (status, cancelAtPeriodEnd) => {
    if (cancelAtPeriodEnd) return "Ending Soon";
    switch (status) {
      case "active":
        return "Active";
      case "past_due":
        return "Past Due";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "gold":
        return <SparklesIcon className="h-5 w-5 text-yellow-600" />;
      case "premium":
        return <StarIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "gold":
        return "from-yellow-400 to-yellow-600";
      case "premium":
        return "from-purple-400 to-purple-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  // No membership - show subscription options
  if (!membership || membership.status === "cancelled") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            ForeverClean Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Join ForeverClean Today!
            </h3>
            <p className="text-gray-600 mb-6">
              Save up to 35% on all cleaning services with our membership plans
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(plans).map(([tier, plan]) => (
                <div
                  key={tier}
                  className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {formatCurrency(plan.monthlyFee)}
                      <span className="text-sm text-gray-500">/mo</span>
                    </div>
                    <div className="text-sm text-green-600 font-medium mb-3">
                      Save {plan.discountPercentage}% on all services
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => console.log("Upgrade modal to be implemented")}
              className="w-full sm:w-auto"
            >
              Choose Your Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const planDetails = plans[membership.tier];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            ForeverClean Membership
          </div>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMembershipStatusColor(
              membership.status,
              membership.cancel_at_period_end
            )}`}
          >
            {getMembershipStatusText(
              membership.status,
              membership.cancel_at_period_end
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div
          className={`bg-gradient-to-r ${getTierColor(
            membership.tier
          )} rounded-lg p-6 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                {getTierIcon(membership.tier)}
                <h3 className="ml-2 text-lg font-semibold">
                  {membership.plan_name}
                </h3>
              </div>
              <p className="text-white/90 text-sm">
                Save {membership.discount_percentage}% on all cleaning services
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {formatCurrency(membership.monthly_fee)}
              </div>
              <div className="text-white/80 text-sm">per month</div>
            </div>
          </div>
        </div>

        {/* Membership Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Membership Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">
                  {formatDateTime(membership.start_date, { dateOnly: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Billing:</span>
                <span className="font-medium">
                  {formatDateTime(membership.current_period_end, {
                    dateOnly: true,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Auto-Renewal:</span>
                <span className="font-medium">
                  {membership.auto_renewal ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          {usageStats && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Your Savings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings:</span>
                  <span className="font-medium">
                    {usageStats.total_bookings || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Money Saved:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(usageStats.total_discounts || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Discount:</span>
                  <span className="font-medium">
                    {usageStats.total_bookings > 0
                      ? formatCurrency(
                          (usageStats.total_discounts || 0) /
                            usageStats.total_bookings
                        )
                      : formatCurrency(0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Features */}
        {planDetails && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Your Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {planDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancellation Notice */}
        {membership.cancel_at_period_end && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Membership Ending Soon
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your membership will end on{" "}
                  {formatDateTime(membership.current_period_end, {
                    dateOnly: true,
                  })}
                  . You can reactivate it anytime before then.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {membership.cancel_at_period_end ? (
            <Button
              onClick={handleReactivateMembership}
              loading={actionLoading}
              className="w-full sm:w-auto"
            >
              Reactivate Membership
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => console.log("Plan upgrade to be implemented")}
                className="w-full sm:w-auto"
              >
                Upgrade Plan
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelMembership}
                loading={actionLoading}
                className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel Membership
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
