import React from "react";
import { useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  ArrowRightIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useMembership } from "../../hooks/useMembership";

const MembershipCTAForCustomers = ({
  variant = "dashboard", // "dashboard" | "navbar" | "sticky" | "inline"
  className = "",
  onClose = null,
}) => {
  const { isNonMemberCustomer, loading } = useMembership();
  const navigate = useNavigate();

  // Don't show if user is not a non-member customer or still loading
  if (loading || !isNonMemberCustomer) {
    return null;
  }

  const handleUpgrade = () => {
    navigate("/memberships/subscribe");
  };

  const benefits = [
    "Save 50% on every cleaning service",
    "Priority booking & scheduling",
    "Dedicated customer support",
    "No additional fees or charges",
  ];

  // Dashboard variant - prominent card for dashboard pages
  if (variant === "dashboard") {
    return (
      <div
        className={`bg-gradient-to-br from-[#4EC6E5] via-[#2BA8CD] to-[#1E90B8] rounded-2xl p-6 text-white shadow-xl border border-cyan-200 ${className}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Upgrade to SuperSaver
              </h3>
              <p className="text-cyan-100 text-sm">
                Start saving 50% on every service today
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              $59<span className="text-lg font-normal">/month</span>
            </div>
            <div className="text-cyan-100 text-sm">Cancel anytime</div>
          </div>
          <div className="space-y-2">
            {benefits.slice(0, 2).map((benefit, index) => (
              <div key={index} className="flex items-center text-sm">
                <CheckCircleIcon className="h-4 w-4 mr-2 text-cyan-200" />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleUpgrade}
          className="w-full bg-white hover:bg-gray-50 text-[#2BA8CD] font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center"
        >
          <span>Upgrade Now</span>
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    );
  }

  // Navbar variant - compact banner for navbar area
  if (variant === "navbar") {
    return (
      <div
        className={`bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] px-4 py-2 text-white ${className}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2" />
            <span className="font-semibold text-sm">
              Start saving 50% on every service!
            </span>
            <span className="text-cyan-100 text-sm ml-2 hidden sm:inline">
              SuperSaver membership - $59/month
            </span>
          </div>
          <button
            onClick={handleUpgrade}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 flex items-center"
          >
            Upgrade
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  // Sticky variant - floating sticky banner
  if (variant === "sticky") {
    return (
      <div
        className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 ${className}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-[#4EC6E5] rounded-full p-2 mr-3">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">
                Save 50% Today!
              </div>
              <div className="text-xs text-gray-600">SuperSaver Membership</div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        <div className="text-xs text-gray-600 mb-3">
          Join now and start saving on every cleaning service
        </div>

        <button
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg text-sm flex items-center justify-center"
        >
          <span>Upgrade for $59/month</span>
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </button>
      </div>
    );
  }

  // Inline variant - subtle inline banner
  if (variant === "inline") {
    return (
      <div
        className={`bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-[#4EC6E5] rounded-full p-2 mr-3">
              <TagIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">
                Save 50% with SuperSaver Membership
              </div>
              <div className="text-xs text-gray-600">
                $59/month • Cancel anytime • Start saving immediately
              </div>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            className="bg-[#4EC6E5] hover:bg-[#3BB8DF] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md text-sm flex items-center"
          >
            <span>Upgrade</span>
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MembershipCTAForCustomers;
