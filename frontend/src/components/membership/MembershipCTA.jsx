import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  SparklesIcon,
  ArrowRightIcon,
  TagIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";

const MembershipCTA = ({
  variant = "default", // "default" | "compact" | "banner" | "floating"
  className = "",
  showPricing = true,
  customText = null,
  onClose = null,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMembershipClick = () => {
    if (user) {
      // User is logged in, go directly to membership subscription
      navigate("/memberships/subscribe");
    } else {
      // User not logged in, redirect to registration with membership intent
      navigate("/register", {
        state: {
          redirectTo: "/memberships/subscribe",
          membershipIntent: true,
          from: location.pathname,
        },
      });
    }
  };

  const renderDefault = () => (
    <div
      className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {customText || "Save 50% on Every Service"}
              </h3>
              <p className="text-sm text-blue-600 font-medium">
                SuperSaver Monthly Membership
              </p>
            </div>
          </div>

          {showPricing && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">$59</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-2xl font-bold text-green-600">50%</div>
                <div className="text-sm text-green-600">
                  savings on all services
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 mr-1 text-green-500" />
              <span>House cleaning: $18/h instead of $36/h</span>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            ×
          </button>
        )}
      </div>

      <Button
        onClick={handleMembershipClick}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        size="lg"
      >
        <SparklesIcon className="h-5 w-5 mr-2" />
        {user ? "Become a Member - $59/month" : "Sign Up & Become a Member"}
        <ArrowRightIcon className="h-5 w-5 ml-2" />
      </Button>

      <p className="text-xs text-gray-500 text-center mt-2">
        No setup fees • Cancel anytime • 30-day money-back guarantee
      </p>
    </div>
  );

  const renderCompact = () => (
    <div className={`bg-blue-600 text-white rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2" />
          <div>
            <div className="font-semibold">Save 50% on Services</div>
            <div className="text-xs text-blue-100">$59/month membership</div>
          </div>
        </div>
        <Button onClick={handleMembershipClick} variant="white" size="sm">
          Join Now
        </Button>
      </div>
    </div>
  );

  const renderBanner = () => (
    <div
      className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 ${className}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <SparklesIcon className="h-6 w-6 mr-3" />
          <div>
            <span className="font-bold text-lg">
              Limited Time: Save 50% on Every Cleaning Service!
            </span>
            <span className="ml-2 text-yellow-100">
              Join our SuperSaver membership for just $59/month
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleMembershipClick}
            className="px-6 py-3 text-base font-bold text-white border-2 border-white/30 rounded-lg bg-transparent hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Become a Member
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-100"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderFloating = () => (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <SparklesIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Save 50% Today!</div>
            <div className="text-sm text-gray-600">SuperSaver Membership</div>
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

      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-2">
          House cleaning:{" "}
          <span className="line-through text-gray-400">$36/h</span>{" "}
          <span className="font-bold text-green-600">$18/h</span>
        </div>
        <div className="text-xs text-blue-600">
          Pay only $59/month for unlimited 50% savings
        </div>
      </div>

      <Button
        onClick={handleMembershipClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        Join Now
      </Button>
    </div>
  );

  switch (variant) {
    case "compact":
      return renderCompact();
    case "banner":
      return renderBanner();
    case "floating":
      return renderFloating();
    default:
      return renderDefault();
  }
};

export default MembershipCTA;
