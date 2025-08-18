import React from "react";
import {
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service10 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Clean stores create better shopping experiences.
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your retail space is your brand's first impression. Our professional
        shop and store cleaning service ensures your customers enjoy a clean,
        welcoming environment that encourages them to stay, shop, and return.
      </p>

      {/* Retail Special */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500 rounded-full">
            <BuildingStorefrontIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900">
            Retail Excellence Package
          </h3>
        </div>
        <p className="text-emerald-800 text-xl leading-relaxed">
          Professional retail cleaning for just{" "}
          <span className="font-bold text-3xl text-emerald-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Keep your store sparkling for customers!
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-emerald-50 to-teal-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Complete retail space cleaning:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Sales floor deep cleaning and maintenance
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Fitting rooms and changing areas
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Customer restrooms and facilities
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Checkout counters and POS areas
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Storage and inventory areas
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Window displays and storefront cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Staff break rooms and offices
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Entrance and exit area maintenance
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Perfect for all retail businesses:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-pink-500 rounded-full">
            <BuildingStorefrontIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Clothing & fashion stores
            </h4>
            <p className="text-gray-600 text-base">
              Keep your boutique looking pristine and inviting
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <UserGroupIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Grocery & food stores
            </h4>
            <p className="text-gray-600 text-base">
              Maintain health standards and customer confidence
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Electronics & tech stores
            </h4>
            <p className="text-gray-600 text-base">
              Dust-free environment for sensitive equipment
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Specialty retail
            </h4>
            <p className="text-gray-600 text-base">
              Bookstores, pharmacies, and unique shops
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our retail cleaning approach:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="text-center p-4 bg-emerald-50 rounded-xl">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Business Hours Planning
          </h4>
          <p className="text-gray-600 text-xs">
            Schedule around your operating hours
          </p>
        </div>
        <div className="text-center p-4 bg-teal-50 rounded-xl">
          <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Customer Area Focus
          </h4>
          <p className="text-gray-600 text-xs">
            Priority cleaning of customer-facing areas
          </p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Deep Clean & Sanitize
          </h4>
          <p className="text-gray-600 text-xs">
            Thorough cleaning of all surfaces
          </p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">4</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Final Polish
          </h4>
          <p className="text-gray-600 text-xs">
            Perfect finishing touches for opening
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <StarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Book Your Retail Cleaning Service
          </h3>
        </div>
        <p className="text-lg mb-6 text-white/90">
          Create an inviting shopping environment for your customers
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Store Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service10;
