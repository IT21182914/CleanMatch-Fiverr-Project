import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  ScissorsIcon,
  TrophyIcon,
  StarIcon,
  SunIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service16 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Transform Your Outdoor Space Into Paradise
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Don't let overgrown weeds and unruly grass diminish your property's
        beauty. Our professional landscaping team brings precision, care, and
        expertise to every lawn, creating outdoor spaces that enhance your
        home's curb appeal and provide a pristine environment for relaxation and
        entertainment.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500 rounded-full">
            <ScissorsIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-900">
            Professional Lawn Care
          </h3>
        </div>
        <p className="text-green-800 text-xl leading-relaxed">
          Expert landscaping and lawn maintenance for only{" "}
          <span className="font-bold text-3xl text-green-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Professional-grade equipment and techniques that transform your
          outdoor space.
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
        Why choose our landscaping expertise?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Professional Equipment
            </h4>
            <p className="text-gray-600 text-base">
              Commercial-grade mowers and tools for superior results
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-500 rounded-full">
            <SunIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Seasonal Expertise
            </h4>
            <p className="text-gray-600 text-base">
              Year-round lawn care adapted to seasonal needs
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Eco-Friendly Methods
            </h4>
            <p className="text-gray-600 text-base">
              Environmentally conscious practices that protect your landscape
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <TrophyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Precision Service
            </h4>
            <p className="text-gray-600 text-base">
              Meticulous attention to detail for perfectly manicured results
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete Lawn & Garden Care
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <ScissorsIcon className="h-5 w-5 text-green-500" />
              Cutting & Trimming
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Precision grass cutting to optimal height</li>
              <li>• Edge trimming around walkways and beds</li>
              <li>• Weed removal from lawn and garden areas</li>
              <li>• Overgrowth clearance and shaping</li>
              <li>• Clean geometric patterns and lines</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-emerald-500" />
              Property Enhancement
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Debris and clipping cleanup</li>
              <li>• Pathway and driveway clearing</li>
              <li>• Garden bed maintenance</li>
              <li>• Fence line and border cleaning</li>
              <li>• Overall property beautification</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-lg mb-3 text-center">
            Service Schedule Options
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Weekly
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Bi-weekly
            </span>
            <span className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full">
              Monthly
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              Seasonal
            </span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              One-time
            </span>
          </div>
        </div>
      </div>

      {/* Seasonal Benefits */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">
          Year-Round Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <SunIcon className="h-12 w-12 text-green-600" />
            </div>
            <h4 className="font-semibold text-green-900 mb-2">Spring & Summer</h4>
            <p className="text-green-800 text-sm">
              Regular maintenance promotes healthy growth and prevents weed establishment
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <HomeIcon className="h-12 w-12 text-orange-600" />
            </div>
            <h4 className="font-semibold text-green-900 mb-2">Fall & Winter</h4>
            <p className="text-green-800 text-sm">
              Seasonal cleanup and preparation for dormancy and spring revival
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <StarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Ready for a Perfect Lawn?</h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Schedule your landscaping service and transform your outdoor space
          into a beautiful, well-maintained environment that enhances your
          property value.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Landscaping Service
        </button>
      </div>
    </div>
  );
};

export default Service16;
