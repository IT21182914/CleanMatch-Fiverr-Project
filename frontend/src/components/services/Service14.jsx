import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  CommandLineIcon,
  TrophyIcon,
  StarIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service14 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Executive Aviation Deserves Executive Care
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your private jet represents the pinnacle of luxury and precision. Our
        specialized aircraft cleaning service ensures every surface meets the
        highest aviation industry standards while maintaining the pristine
        elegance your passengers expect at 40,000 feet.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-full">
            <RocketLaunchIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">
            Premium Aviation Service
          </h3>
        </div>
        <p className="text-blue-800 text-xl leading-relaxed">
          Professional aircraft detailing for only{" "}
          <span className="font-bold text-3xl text-blue-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Aviation-grade cleaning that meets industry standards and exceeds
          expectations.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-blue-50 to-indigo-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why trust us with your aviation investment?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Aviation Certified
            </h4>
            <p className="text-gray-600 text-base">
              FAA compliant cleaning protocols and certified professionals
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Premium Products
            </h4>
            <p className="text-gray-600 text-base">
              Aerospace-grade cleaning solutions safe for all aircraft surfaces
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Rapid Turnaround
            </h4>
            <p className="text-gray-600 text-base">
              Quick service to minimize ground time and maximize flight
              readiness
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <TrophyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Luxury Standards
            </h4>
            <p className="text-gray-600 text-base">
              White-glove service that maintains your aircraft's prestige
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Comprehensive Aircraft Care
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-blue-500" />
              Interior Detailing
            </h4>
            <ul className="text-gray-600 space-y-1 ml-7">
              <li>• Leather seat conditioning</li>
              <li>• Carpet and upholstery cleaning</li>
              <li>• Galley and lavatory sanitization</li>
              <li>• Window and surface polishing</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <CommandLineIcon className="h-5 w-5 text-indigo-500" />
              Exterior Services
            </h4>
            <ul className="text-gray-600 space-y-1 ml-7">
              <li>• Fuselage washing and waxing</li>
              <li>• Wing and control surface care</li>
              <li>• Landing gear cleaning</li>
              <li>• Engine nacelle detailing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <StarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Ready for Your Next Flight?</h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Schedule your aircraft cleaning service and ensure every journey
          reflects the luxury and professionalism your passengers deserve.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Schedule Aircraft Service
        </button>
      </div>
    </div>
  );
};

export default Service14;
