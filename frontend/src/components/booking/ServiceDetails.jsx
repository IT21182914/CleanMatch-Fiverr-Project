import {
  ArrowLeftIcon,
  CheckCircleIcon,
  StarIcon,
  InformationCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { formatCurrency } from "../../lib/utils";
import { getServiceImage } from "../../utils/serviceImages";
import ServiceImage from "../ui/ServiceImage";

const ServiceDetails = ({ service, onBack, onBookNow }) => {
  const navigate = useNavigate();

  if (!service) return null;

  // Use actual API pricing - membership_price for members, base_price for non-members
  const memberPrice = service.membership_price
    ? parseFloat(service.membership_price)
    : service.memberPrice
      ? parseInt(service.memberPrice.replace(/\D/g, ""))
      : 18;

  const regularPrice = service.base_price
    ? parseFloat(service.base_price)
    : service.regularPrice
      ? parseInt(service.regularPrice.replace(/\D/g, ""))
      : service.basePrice || service.price || 36;

  const savings = regularPrice - memberPrice;
  const savingsPercentage = Math.round((savings / regularPrice) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 touch-pan-x touch-pan-y">
      {/* Hero Section - Mobile Optimized */}
      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          {/* Back Button - More User Friendly */}
          <div className="mb-3 sm:mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="group text-white hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-xl px-4 py-2.5 transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center">
                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Services</span>
              </div>
            </Button>
          </div>

          {/* Service Header - Smaller and More Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {service.category && (
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/30">
                    {service.category}
                  </span>
                )}
                {service.popular && (
                  <span className="inline-flex items-center bg-amber-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    <StarIconSolid className="h-3 w-3 mr-1" />
                    Popular
                  </span>
                )}
              </div>
              <span className="text-lg text-black sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">
                {service.name}
              </span>
              <p className="text-xs md:text-sm text-white/90 max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Rating Display - More Compact */}
            {service.rating && (
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/30 min-w-fit">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(service.rating)
                        ? "text-yellow-300"
                        : "text-white/30"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {service.rating}
                  </div>
                  <div className="text-xs text-white/70">
                    ({service.review_count || 0})
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Service Image - More Responsive */}
            <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-100 to-slate-200">
              <img
                src={getServiceImage(service.name)}
                alt={service.name}
                className="w-full h-full object-contain bg-white transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/services/1/House & Apartment Cleaning.png";
                }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
            </div>

            {/* What's Included Section - More Compact */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200/60 p-4 sm:p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-lg sm:rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  What's Included
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {(
                  service.features || [
                    "Professional cleaning supplies included",
                    "Insured and bonded cleaners",
                    "Satisfaction guarantee",
                    "Flexible scheduling",
                    "Online booking and payment",
                    "Quality control checks",
                    "24/7 customer support",
                    "Eco-friendly products available",
                  ]
                ).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3 group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Guarantees - More Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                <ShieldCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold text-emerald-900 mb-1 text-sm sm:text-base">
                  Satisfaction
                </h3>
                <p className="text-xs text-emerald-700">
                  100% Guaranteed
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                <CheckBadgeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Vetted</h3>
                <p className="text-xs text-blue-700">
                  Background Checked
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 mx-auto mb-2 sm:mb-3" />
                <h3 className="font-semibold text-amber-900 mb-1 text-sm sm:text-base">Flexible</h3>
                <p className="text-xs text-amber-700">
                  Easy Rescheduling
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Panel - More Responsive */}
          <div className="space-y-3 sm:space-y-4">
            {/* Membership Highlight Card - More Compact */}
            <div
              onClick={() => navigate("/customer/membership")}
              className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white overflow-hidden shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">
                      Membership Special!
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm">Get exclusive pricing</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold">
                        {formatCurrency(memberPrice)}
                        <span className="text-sm sm:text-base font-medium">/hour</span>
                      </div>
                      <div className="text-white/90 text-sm line-through">
                        Regular: {formatCurrency(regularPrice)}/hour
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2">
                        <div className="text-lg sm:text-xl font-bold">SAVE</div>
                        <div className="text-sm sm:text-base font-semibold">
                          {savingsPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                      <span className="font-semibold text-sm sm:text-base">
                        You Save {formatCurrency(savings)} per hour!
                      </span>
                    </div>
                    <p className="text-white/90 text-xs sm:text-sm">
                      Join our membership for exclusive discounts and priority booking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card - More Responsive */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200/60 shadow-xl sticky top-6">
              <div className="p-4 sm:p-6">
                {/* Service Availability - More Compact */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/60 rounded-lg sm:rounded-xl">
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-emerald-900">
                        Available Today
                      </span>
                      <p className="text-xs text-emerald-700">
                        Book now for same-day service
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/60 rounded-lg sm:rounded-xl">
                    <FireIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-blue-900">
                        High Demand
                      </span>
                      <p className="text-xs text-blue-700">
                        12 bookings this week
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Options - More Responsive */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <button className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 border border-slate-200 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105">
                    <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      Call Now
                    </span>
                  </button>
                  <button className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 border border-slate-200 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105">
                    <ChatBubbleLeftEllipsisIcon className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      Live Chat
                    </span>
                  </button>
                </div>

                {/* CTA Buttons - More Responsive */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Main Book Now Button */}
                  <Button
                    onClick={onBookNow}
                    className="w-full bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                    size="lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Book Now</span>
                    </div>
                  </Button>

                  {/* Get Membership Button */}
                  <Button
                    onClick={() => navigate("/customer/membership")}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm border-2 border-emerald-400"
                    size="md"
                  >
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <TrophyIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Get Membership & Save {savingsPercentage}%</span>
                    </div>
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-3 sm:mt-4">
                  <p className="text-center text-xs text-slate-500">
                    🔒 Secure booking • 24/7 support • Satisfaction guaranteed
                  </p>
                </div>
              </div>
            </div>

            {/* Why Choose Us - More Compact */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200/60 p-4 sm:p-6 shadow-xl">
              <span className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6 text-center">
                Why Choose CleanMatch?
              </span>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4EC6E5] shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-700">
                    Vetted & Experienced Professionals
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <ShieldCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4EC6E5] shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-700">
                    Fully Insured & Bonded
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckBadgeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4EC6E5] shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-700">
                    100% Satisfaction Guarantee
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4EC6E5] shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-700">
                    Flexible Scheduling & Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
