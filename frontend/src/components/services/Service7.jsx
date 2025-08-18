import React from "react";
import {
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  TruckIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service7 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Thorough move-in/move-out cleaning for fresh beginnings.
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Moving is stressful enough without worrying about deep cleaning. Our
        comprehensive move-in/move-out cleaning service ensures your new home is
        spotless when you arrive, or helps you get your deposit back when you
        leave.
      </p>

      {/* Moving Special */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500 rounded-full">
            <TruckIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-900">
            Moving Day Special
          </h3>
        </div>
        <p className="text-green-800 text-xl leading-relaxed">
          Complete move-in/move-out cleaning for just{" "}
          <span className="font-bold text-3xl text-green-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Start fresh in your new home!
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-green-50 to-emerald-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our complete move-in/move-out cleaning includes:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Deep cleaning of all rooms and surfaces
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Inside and outside of all appliances
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Cabinet interiors and drawers
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Bathroom deep cleaning and sanitizing
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Baseboards, trim, and door frames
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Window cleaning inside and out
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Light fixture and ceiling fan cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Floor deep cleaning and mopping
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Closet and storage area cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Garage and basement cleaning
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">Perfect for:</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <KeyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              New homeowners
            </h4>
            <p className="text-gray-600 text-base">
              Start fresh in your new space with a deep clean
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <TruckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Renters moving out
            </h4>
            <p className="text-gray-600 text-base">
              Maximize your security deposit return
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Real estate agents
            </h4>
            <p className="text-gray-600 text-base">
              Show properties in pristine condition
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Busy families
            </h4>
            <p className="text-gray-600 text-base">
              Save time during stressful moving periods
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our thorough cleaning process:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Property Walkthrough
          </h4>
          <p className="text-gray-600 text-xs">
            Assess cleaning needs and special requirements
          </p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Deep Clean
          </h4>
          <p className="text-gray-600 text-xs">
            Comprehensive cleaning of every surface
          </p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Detailed Work
          </h4>
          <p className="text-gray-600 text-xs">
            Focus on often-missed areas and details
          </p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-xl">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">4</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Final Inspection
          </h4>
          <p className="text-gray-600 text-xs">
            Quality check to ensure everything is perfect
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <TruckIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Book Your Move-In/Move-Out Cleaning
          </h3>
        </div>
        <p className="text-lg mb-6 text-white/90">
          Make your move stress-free with our comprehensive cleaning service
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Move-In/Out Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service7;
