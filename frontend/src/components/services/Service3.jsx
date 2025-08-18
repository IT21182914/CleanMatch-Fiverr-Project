import React from "react";
import {
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service3 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        A clean office is a productive office.
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your workspace should inspire focus and professionalism. Simorgh's
        office cleaning service ensures your business environment stays
        spotless, healthy, and welcoming for both employees and clients.
      </p>

      {/* Special Membership Price */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500 rounded-full">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-900">
            Business Membership Price
          </h3>
        </div>
        <p className="text-indigo-800 text-xl leading-relaxed">
          Get professional office cleaning for just{" "}
          <span className="font-bold text-3xl text-indigo-900">
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
          className="w-full h-auto object-contain bg-gradient-to-br from-indigo-50 to-purple-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our office cleaning covers:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Desks, chairs, and workstations
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Conference rooms and common areas
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Restrooms and kitchen areas
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Floor maintenance and trash removal
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Window cleaning and dusting
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Reception and lobby areas
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Elevator and stairwell cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Disinfection of high-touch surfaces
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why businesses choose us:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Professional appearance
            </h4>
            <p className="text-gray-600 text-base">
              Creates a more inviting workspace for your team
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Reduces dust and allergens
            </h4>
            <p className="text-gray-600 text-base">
              Eliminates germs in the workplace
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Reliable cleaners
            </h4>
            <p className="text-gray-600 text-base">
              who respect your workspace and confidentiality
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Flexible timing
            </h4>
            <p className="text-gray-600 text-base">
              Available outside business hours
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">How it works:</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="text-center p-6 bg-indigo-50 rounded-xl">
          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Book Online</h4>
          <p className="text-gray-600 text-sm">
            Select your preferred date, time, and service.
          </p>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-xl">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">We Arrive Ready</h4>
          <p className="text-gray-600 text-sm">
            Our team comes prepared with the right tools and supplies.
          </p>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            Enjoy a Spotless Office
          </h4>
          <p className="text-gray-600 text-sm">
            A fresh, organized space that boosts morale and productivity.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <GlobeAltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Book Your Office Cleaning Now</h3>
        </div>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Office Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service3;
