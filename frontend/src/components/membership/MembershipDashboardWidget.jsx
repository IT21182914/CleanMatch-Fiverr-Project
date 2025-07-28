import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  ArrowRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  TagIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useMembership } from "../../hooks/useMembership";

const MembershipDashboardWidget = ({ className = "" }) => {
  const { isNonMemberCustomer, loading } = useMembership();
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  // Don't show if user is not a non-member customer, still loading, or dismissed
  if (loading || !isNonMemberCustomer || dismissed) {
    return null;
  }

  const handleUpgrade = () => {
    navigate("/memberships/subscribe");
  };

  const benefits = [
    {
      icon: TagIcon,
      title: "Save 50% on Every Service",
      description: "Cut your cleaning costs in half",
    },
    {
      icon: ClockIcon,
      title: "Priority Booking",
      description: "Get your preferred time slots",
    },
    {
      icon: ShieldCheckIcon,
      title: "Premium Support",
      description: "Dedicated customer service",
    },
    {
      icon: CurrencyDollarIcon,
      title: "No Hidden Fees",
      description: "Transparent pricing always",
    },
  ];

  return (
    <div
      className={`bg-gradient-to-br from-[#4EC6E5] via-[#2BA8CD] to-[#1E90B8] rounded-2xl p-6 text-white shadow-2xl border border-cyan-200 relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-12 right-8 w-16 h-16 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-8 left-12 w-12 h-12 border border-white/15 rounded-full"></div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center mb-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              Upgrade to SuperSaver
            </h3>
            <p className="text-cyan-100">
              Start saving 50% on every cleaning service
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-white">$59</span>
            <span className="text-lg font-normal text-cyan-100 ml-1">
              /month
            </span>
            <span className="text-sm text-cyan-200 ml-3 bg-white/20 px-3 py-1 rounded-full">
              Cancel anytime
            </span>
          </div>
          <p className="text-cyan-100 text-sm mt-2">
            Typical member saves $200+ per month on cleaning services
          </p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="flex items-start">
              <div className="bg-white/20 rounded-lg p-2 mr-3 flex-shrink-0">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">
                  {benefit.title}
                </div>
                <div className="text-cyan-100 text-xs">
                  {benefit.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      <div className="relative z-10">
        <button
          onClick={handleUpgrade}
          className="w-full bg-white hover:bg-gray-50 text-[#2BA8CD] font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center group"
        >
          <span className="text-lg">Start Saving Today</span>
          <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="relative z-10 mt-4 flex items-center justify-center space-x-6 text-xs text-cyan-200">
        <div className="flex items-center">
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          <span>No setup fees</span>
        </div>
        <div className="flex items-center">
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          <span>30-day guarantee</span>
        </div>
        <div className="flex items-center">
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          <span>Instant savings</span>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-6 left-16 w-1 h-1 bg-white/60 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-8 right-20 w-1 h-1 bg-white/40 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-12 left-20 w-1 h-1 bg-white/50 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-6 right-16 w-1 h-1 bg-white/60 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
    </div>
  );
};

export default MembershipDashboardWidget;
