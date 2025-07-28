import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  ArrowRightIcon,
  CalculatorIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { formatCurrency } from "../../lib/utils";

const ServicePricingBanner = ({
  serviceName = "this service",
  hourlyRate = 36,
  hours = 1,
  onMembershipClick,
  className = "",
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const originalPrice = hourlyRate * hours;
  const memberPrice = Math.round(hourlyRate * 0.5 * hours); // 50% discount
  const savings = originalPrice - memberPrice;

  const handleMembershipClick = () => {
    if (onMembershipClick) {
      onMembershipClick();
    } else if (user) {
      navigate("/memberships/subscribe");
    } else {
      navigate("/register", {
        state: {
          redirectTo: "/memberships/subscribe",
          membershipIntent: true,
        },
      });
    }
  };

  return (
    <div
      className={`bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="bg-orange-100 rounded-full p-2 mr-3">
              <CalculatorIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                💡 Save Big on {serviceName}!
              </h3>
              <p className="text-sm text-orange-600 font-medium">
                SuperSaver Members get 50% off
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Current Price */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600 line-through">
                  {formatCurrency(originalPrice)}
                </div>
                <div className="text-sm text-gray-500">Regular Price</div>
                <div className="text-xs text-gray-400">
                  {formatCurrency(hourlyRate)}/hour × {hours}h
                </div>
              </div>
            </div>

            {/* Member Price */}
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(memberPrice)}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Member Price
                </div>
                <div className="text-xs text-green-500">
                  {formatCurrency(memberPrice / hours)}/hour × {hours}h
                </div>
              </div>
            </div>

            {/* Savings */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(savings)}
                </div>
                <div className="text-sm text-blue-600">You Save</div>
                <div className="text-xs text-blue-500">50% discount</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Plus priority booking, guarantee & 24/7 support</span>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">
                Membership: $59/month
              </div>
              <div className="text-xs text-green-600 font-medium">
                Break even after just {Math.ceil(59 / savings)} bookings!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-orange-600">Limited Time:</span>{" "}
          No setup fees, cancel anytime
        </div>

        <Button
          onClick={handleMembershipClick}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          size="lg"
        >
          <SparklesIcon className="h-5 w-5 mr-2" />
          {user ? "Become a Member & Save" : "Sign Up & Save 50%"}
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ServicePricingBanner;
