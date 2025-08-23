import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  SparklesIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { LoadingCard } from "../ui/Loading";
import Modal from "../ui/Modal";
import { membershipAPI } from "../../lib/api";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import { useToast } from "../../hooks/useToast";

// Custom confirmation dialog component
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const MembershipCard = () => {
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [usageStats, setUsageStats] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const { showInfo, showError } = useToast();

  const fetchMembershipData = useCallback(async () => {
    try {
      setLoading(true);
      const [membershipResponse, plansResponse] = await Promise.all([
        membershipAPI.getCurrentMembership(),
        membershipAPI.getPlans(),
      ]);

      console.log("Membership Data:", membershipResponse.data);
      console.log("Plans Data:", plansResponse.data);

      setMembership(membershipResponse.data.membership);
      setUsageStats(membershipResponse.data.usageStats);
      setPlans(plansResponse.data.plans);
    } catch (error) {
      console.error("Error fetching membership data:", error);
      showError("Failed to load membership information");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchMembershipData();
  }, [fetchMembershipData]);

  const showCancelConfirmation = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Cancel Membership",
      message: "Are you sure you want to cancel your membership? You'll lose access to member pricing at the end of your current billing period.",
      onConfirm: handleCancelMembership
    });
  };

  const handleCancelMembership = async () => {
    setConfirmDialog({ isOpen: false });

    try {
      setActionLoading(true);
      await membershipAPI.cancelMembership({
        cancelAtPeriodEnd: true,
        reason: "User requested cancellation",
      });

      showInfo(
        "Membership will be cancelled at the end of your billing period"
      );
      await fetchMembershipData();
    } catch (error) {
      console.error("Error cancelling membership:", error);
      showError("Failed to cancel membership");
    } finally {
      setActionLoading(false);
    }
  };

  // Removed reactivate membership function as requested - users should use the membership page instead

  const getMembershipStatusColor = (status, cancelAtPeriodEnd, endDate) => {
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

  // Check if membership is ending within 7 days
  const isEndingSoon = (endDate) => {
    if (!endDate) return false;
    const endDateTime = new Date(endDate).getTime();
    const currentTime = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return endDateTime - currentTime <= sevenDaysInMs;
  };

  const getMembershipStatusText = (status, cancelAtPeriodEnd, currentPeriodEnd) => {
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
            Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Join Membership Today!
            </h3>
            <p className="text-gray-600 mb-6">
              Save up to 50% on all cleaning services with our membership plans
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
                      ${tier === "supersaver_month" ? "49" : "499"}
                      <span className="text-sm text-gray-500">{tier.includes("year") ? "/yr" : "/mo"}</span>
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
              href="/customer/membership-subscription"
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
            Membership
          </div>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMembershipStatusColor(
              membership.status,
              membership.cancel_at_period_end,
              membership.current_period_end
            )}`}
          >
            {getMembershipStatusText(
              membership.status,
              membership.cancel_at_period_end,
              membership.current_period_end
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Current Plan */}
        <div
          className={`bg-gradient-to-r ${getTierColor(
            membership.tier
          )} rounded-lg p-6 text-white relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 bg-white/10 rounded-full"></div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center mb-2">
                {getTierIcon(membership.tier)}
                <h3 className="ml-2 text-xl font-semibold">
                  {membership.plan_name}
                </h3>
              </div>
              <div className="flex items-center mt-1">
                <CheckCircleIcon className="h-4 w-4 text-white/80 mr-1.5" />
                <p className="text-white/90 text-sm">
                  Save {membership.discount_percentage}% on all cleaning services
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                ${membership.tier === "supersaver_month" ? "49" : "499"}
              </div>
              <div className="text-white/80 text-sm">
                {membership.tier.includes("year") ? "per year" : "per month"}
              </div>
            </div>
          </div>
        </div>

        {/* Membership Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
              Membership Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium bg-blue-50 px-2 py-1 rounded text-blue-700">
                  {formatDateTime(membership.start_date, { dateOnly: true })}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Expires / Renews:</span>
                <span className={`font-medium px-2 py-1 rounded ${isEndingSoon(membership.current_period_end) ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {formatDateTime(membership.current_period_end, {
                    dateOnly: true,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Auto-Renewal:</span>
                <span className={`font-medium px-2 py-1 rounded ${membership.auto_renewal ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {membership.auto_renewal ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          {usageStats && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <SparklesIcon className="h-4 w-4 mr-2 text-green-500" />
                Your Membership Savings
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-green-100">
                  <span className="text-gray-700">Total Bookings:</span>
                  <span className="font-medium bg-white px-2 py-1 rounded text-gray-800 shadow-sm">
                    {usageStats.total_bookings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-green-100">
                  <span className="text-gray-700">Money Saved:</span>
                  <span className="font-medium bg-white px-2 py-1 rounded text-green-600 shadow-sm">
                    ${(usageStats.total_discounts || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Avg. Discount:</span>
                  <span className="font-medium bg-white px-2 py-1 rounded text-gray-800 shadow-sm">
                    ${usageStats.total_bookings > 0
                      ? ((usageStats.total_discounts || 0) / usageStats.total_bookings).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Features */}
        {planDetails && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2 text-blue-500" />
              Your Membership Benefits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {planDetails.features.map((feature, index) => (
                <div key={index} className="flex items-start bg-white p-2 rounded shadow-sm">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancellation Notice */}
        {membership.cancel_at_period_end && (
          <div className={`${isEndingSoon(membership.current_period_end) ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"} border rounded-md p-4`}>
            <div className="flex">
              <XCircleIcon className={`h-5 w-5 ${isEndingSoon(membership.current_period_end) ? "text-red-400" : "text-yellow-400"} mr-2`} />
              <div>
                <h4 className={`text-sm font-medium ${isEndingSoon(membership.current_period_end) ? "text-red-800" : "text-yellow-800"}`}>
                  {isEndingSoon(membership.current_period_end) ? "Membership Ending Soon!" : "Membership Cancelled"}
                </h4>
                <p className={`text-sm ${isEndingSoon(membership.current_period_end) ? "text-red-700" : "text-yellow-700"} mt-1`}>
                  Your membership will end on{" "}
                  <span className="font-medium">
                    {formatDateTime(membership.current_period_end, {
                      dateOnly: true,
                    })}
                  </span>
                  . Visit the Membership page to activate a new plan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {membership.cancel_at_period_end ? (
            <>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  // Handle view membership plans
                  console.log("View Membership Plans clicked");
                  navigate("/customer/membership");
                }}
              >
                View Membership Plans
              </Button>
            </>

          ) : (
            <>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  // Handle view membership plans
                  console.log("View Membership Plans clicked");
                  navigate("/customer/membership");
                }}
              >
                View Membership Plans
              </Button>
              <Button
                variant="outline"
                onClick={showCancelConfirmation}
                loading={actionLoading}
                className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel Membership
              </Button>
            </>
          )}
        </div>
      </CardContent>

      {/* Render confirmation dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </Card>
  );
};

export default MembershipCard;
