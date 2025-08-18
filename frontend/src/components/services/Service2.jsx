import React from "react";
import {
  CheckBadgeIcon,
  SparklesIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service2 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        When surface cleaning isn't enough, we go deeper.
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Simorgh's deep cleaning service targets every hidden corner, removing
        dust, dirt, and buildup even in places you didn't know needed attention.
        Perfect for when you want your home to feel truly refreshed from top to
        bottom.
      </p>

      {/* Special Membership Price */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-full">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">
            Special Membership Price
          </h3>
        </div>
        <p className="text-blue-800 text-xl leading-relaxed">
          Get our deep cleaning service for just{" "}
          <span className="font-bold text-3xl text-blue-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          .
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-blue-50 to-cyan-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        What makes our deep cleaning special:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Inside appliances (oven, fridge, microwave)
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Baseboards and window sills
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Cabinet interiors and drawers
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Light fixtures and ceiling fans
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <GlobeAltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Book Your Deep Clean Today</h3>
        </div>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Your Deep Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service2;
