import React from "react";
import {
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service8 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Perfect events start with perfect spaces.
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your event deserves a spotless venue. From intimate gatherings to large
        celebrations, our professional event cleaning service ensures your space
        is pristine before, during, and after your special occasion.
      </p>

      {/* Event Special Pricing */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500 rounded-full">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-900">
            Event Planning Special
          </h3>
        </div>
        <p className="text-purple-800 text-xl leading-relaxed">
          Professional event cleaning for just{" "}
          <span className="font-bold text-3xl text-purple-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Make your event unforgettable!
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
        Complete event cleaning services:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Pre-event venue preparation and setup cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            During-event maintenance and restroom monitoring
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Post-event cleanup and debris removal
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Table, chair, and decoration area cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Kitchen and catering area sanitization
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Dance floor and entertainment area cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Restroom deep cleaning and restocking
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Parking area and entrance cleanup
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Perfect for all events:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-pink-500 rounded-full">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Weddings & celebrations
            </h4>
            <p className="text-gray-600 text-base">
              Make your special day perfect from start to finish
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <UserGroupIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Corporate events
            </h4>
            <p className="text-gray-600 text-base">
              Professional cleaning for business functions
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Private parties
            </h4>
            <p className="text-gray-600 text-base">
              Enjoy your party, we'll handle the cleanup
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Community events
            </h4>
            <p className="text-gray-600 text-base">
              Festivals, fundraisers, and public gatherings
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our event cleaning process:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Pre-Event Setup
          </h4>
          <p className="text-gray-600 text-xs">
            Venue preparation and final cleaning touches
          </p>
        </div>
        <div className="text-center p-4 bg-pink-50 rounded-xl">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Event Support
          </h4>
          <p className="text-gray-600 text-xs">
            Maintenance during event if needed
          </p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Post-Event Cleanup
          </h4>
          <p className="text-gray-600 text-xs">
            Complete cleanup and debris removal
          </p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">4</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Final Restoration
          </h4>
          <p className="text-gray-600 text-xs">
            Return venue to original condition
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <GlobeAltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Book Your Event Cleaning Service
          </h3>
        </div>
        <p className="text-lg mb-6 text-white/90">
          Focus on your guests, we'll handle the cleaning
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Event Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service8;
