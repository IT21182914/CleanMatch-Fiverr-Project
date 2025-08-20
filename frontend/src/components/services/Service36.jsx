import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  HomeIcon,
  TrophyIcon,
  StarIcon,
  CalendarDaysIcon,
  BeakerIcon,
  KeyIcon,
  HeartIcon,
  CameraIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service36 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Five-Star Guest Experiences Start with Perfect Cleanliness
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your Airbnb success depends on consistently perfect guest experiences.
        Our specialized short-term rental cleaning services ensure every guest
        walks into a spotless, welcoming space that earns five-star reviews.
        From rapid turnovers to deep sanitization, we handle the cleaning so you
        can focus on hosting while maximizing your occupancy rates and guest
        satisfaction scores.
      </p>

      {/* Airbnb Offer Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500 rounded-full">
            <HomeIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-orange-900">
            Hospitality-Grade Airbnb Care
          </h3>
        </div>
        <p className="text-orange-800 text-xl leading-relaxed">
          Professional Airbnb cleaning services for only{" "}
          <span className="font-bold text-3xl text-orange-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Five-star cleanliness for maximum guest satisfaction.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-orange-50 to-red-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our Airbnb cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Rapid turnaround guarantee
            </h4>
            <p className="text-gray-600 text-base">
              Quick and efficient cleaning between guests to maximize bookings
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <StarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Five-star review focus
            </h4>
            <p className="text-gray-600 text-base">
              Every detail designed to earn perfect guest reviews and ratings
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-amber-500 rounded-full">
            <CameraIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Photo-ready presentation
            </h4>
            <p className="text-gray-600 text-base">
              Professional staging and presentation that matches your listing
              photos
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <PhoneIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Real-time communication
            </h4>
            <p className="text-gray-600 text-base">
              Instant updates and photos confirming readiness for next guest
            </p>
          </div>
        </div>
      </div>

      {/* Property Types Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Short-Term Rentals We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Entire Homes</h4>
            <p className="text-gray-600 text-sm">
              Houses, apartments, condos, vacation rentals
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <KeyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Private Rooms</h4>
            <p className="text-gray-600 text-sm">
              Guest rooms, master suites, private accommodations
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Luxury Properties
            </h4>
            <p className="text-gray-600 text-sm">
              High-end homes, luxury condos, premium accommodations
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Multi-Unit Properties
            </h4>
            <p className="text-gray-600 text-sm">
              Apartment buildings, multiple listings, property portfolios
            </p>
          </div>
        </div>
      </div>

      {/* Airbnb Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Five-Star Airbnb Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-orange-100 rounded-full">
              <span className="text-orange-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Pre-Arrival Inspection & Setup
              </h4>
              <p className="text-gray-600">
                Comprehensive check of guest checkout condition and preparation
                for deep cleaning process
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-red-100 rounded-full">
              <span className="text-red-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Deep Clean & Sanitization
              </h4>
              <p className="text-gray-600">
                Thorough cleaning of all areas with hospitality-grade products
                and guest safety focus
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-amber-100 rounded-full">
              <span className="text-amber-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Staging & Presentation Setup
              </h4>
              <p className="text-gray-600">
                Professional staging to match listing photos and create
                welcoming first impressions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Final Inspection & Photo Confirmation
              </h4>
              <p className="text-gray-600">
                Quality assurance check with photo documentation confirming
                guest-ready status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Airbnb Comparison */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Regular Cleaning vs. Airbnb Hospitality Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Cleaning Approach
            </h4>
            <div className="space-y-3">
              {[
                "Basic residential cleaning standards",
                "No guest experience focus",
                "Limited turnaround time awareness",
                "No staging or presentation skills",
                "Generic communication protocols",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Airbnb Hospitality Excellence
            </h4>
            <div className="space-y-3">
              {[
                "Five-star hospitality cleaning standards",
                "Guest satisfaction and review optimization",
                "Rapid turnaround for maximum occupancy",
                "Professional staging and photo-ready setup",
                "Real-time updates and host communication",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-green-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Airbnb Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Complete guest turnover cleaning service",
            "Fresh linen changing and bed preparation",
            "Bathroom deep cleaning and amenity restocking",
            "Kitchen deep clean and appliance sanitization",
            "Living area cleaning and furniture arrangement",
            "Floor care including vacuuming and mopping",
            "Trash removal and recycling management",
            "Professional staging and photo-ready setup",
            "Guest amenity setup and welcome touches",
            "Real-time photo updates and confirmation",
            "Lost and found item management",
            "Emergency cleaning and maintenance response",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-orange-500 rounded-full">
                <CheckBadgeIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Why Professional Airbnb Cleaning Maximizes Your Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Five-Star Reviews
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleanliness directly translates to higher guest
              ratings and positive reviews
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-amber-50 rounded-xl">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Maximum Occupancy
            </h4>
            <p className="text-gray-600 text-sm">
              Rapid turnarounds enable back-to-back bookings and higher revenue
              potential
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Host Peace of Mind
            </h4>
            <p className="text-gray-600 text-sm">
              Reliable service lets you focus on guest communication and
              property management
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Airbnb Service Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Same-Day Turnovers
            </h4>
            <p className="text-gray-600 text-sm">
              Quick cleaning between checkout and next check-in
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Weekly Deep Clean
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive maintenance between guest stays
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Special Events</h4>
            <p className="text-gray-600 text-sm">
              Holiday and special occasion preparation
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <GlobeAltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Transform Your Airbnb Success with Professional Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your Airbnb guests expect perfection from the moment they walk in. Let
          our professional cleaning service ensure every stay earns five stars
          while maximizing your occupancy rates and hosting success.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Airbnb Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service36;
