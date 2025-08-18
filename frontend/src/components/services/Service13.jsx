import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  HomeIcon,
  FireIcon,
  GlobeAltIcon,
  SparklesIcon,
  CalendarDaysIcon,
  HeartIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service13 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Comprehensive Housekeeping Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Experience the luxury of a perfectly maintained home with our comprehensive housekeeping services. From daily tidying to deep cleaning, laundry, and organization, we handle every aspect of home care so you can enjoy more quality time with what matters most.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500 rounded-full">
            <HomeIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-900">
            Premium Housekeeping Package
          </h3>
        </div>
        <p className="text-purple-800 text-xl leading-relaxed">
          Complete home care and housekeeping for only{" "}
          <span className="font-bold text-3xl text-purple-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Professional housekeeping that transforms your home into a sanctuary.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-purple-50 to-pink-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Complete Home Care Solutions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <CalendarDaysIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Regular Maintenance
            </h4>
            <p className="text-gray-600 text-base">
              Daily, weekly, or monthly housekeeping schedules to fit your lifestyle
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Laundry Service
            </h4>
            <p className="text-gray-600 text-base">
              Washing, drying, folding, and organizing your clothes and linens
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <HomeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Organization
            </h4>
            <p className="text-gray-600 text-base">
              Decluttering and organizing spaces for maximum efficiency
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-pink-500 rounded-full">
            <StarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Deep Cleaning Options
            </h4>
            <p className="text-gray-600 text-base">
              Comprehensive deep cleaning services when you need them most
            </p>
          </div>
        </div>
      </div>

      {/* Services Breakdown */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          What's Included in Our Housekeeping
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Daily Cleaning</h4>
            <p className="text-gray-600 text-sm">
              Beds, dishes, tidying, and surface cleaning
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Room Care</h4>
            <p className="text-gray-600 text-sm">
              Bathrooms, bedrooms, living areas, and kitchens
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Flexible Schedule</h4>
            <p className="text-gray-600 text-sm">
              Choose frequency that works for your lifestyle
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Personal Touch</h4>
            <p className="text-gray-600 text-sm">
              Customized service to match your preferences
            </p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why Families Trust Our Housekeeping
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Trusted Professionals</h4>
            <p className="text-gray-600 text-sm">
              Background-checked and thoroughly vetted housekeepers
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckBadgeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Consistent Quality</h4>
            <p className="text-gray-600 text-sm">
              Same high standards every single visit, guaranteed
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Time Freedom</h4>
            <p className="text-gray-600 text-sm">
              More time for family, work, and things you love
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <HomeIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Transform Your Home Today
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Stop spending your precious time on chores. Let our professional housekeeping team create the perfect home environment while you focus on what truly matters to you.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Housekeeping Now
        </button>
      </div>
    </div>
  );
};

export default Service13;
