import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  SunIcon,
  TrophyIcon,
  StarIcon,
  HomeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service19 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Winter-Ready Solutions for Every Challenge
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Don't let winter weather bring your property to a standstill. Our
        comprehensive winter services team provides everything from snow removal
        and ice treatment to seasonal property preparation, ensuring your home
        or business remains safe, accessible, and operational throughout the
        harshest winter conditions.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-sky-500 rounded-full">
            <SunIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-sky-900">
            Complete Winter Care
          </h3>
        </div>
        <p className="text-sky-800 text-xl leading-relaxed">
          Professional winter services for only{" "}
          <span className="font-bold text-3xl text-sky-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Year-round property protection that keeps you prepared for winter's
          worst.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-sky-50 to-blue-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our winter service expertise?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-sky-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              24/7 Snow Response
            </h4>
            <p className="text-gray-600 text-base">
              Emergency snow and ice removal services available around the clock
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Safety First
            </h4>
            <p className="text-gray-600 text-base">
              Professional equipment and techniques for safe winter maintenance
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Property Protection
            </h4>
            <p className="text-gray-600 text-base">
              Comprehensive winter prep to prevent damage and costly repairs
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <TrophyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Seasonal Expertise
            </h4>
            <p className="text-gray-600 text-base">
              Years of experience handling all types of winter challenges
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete Winter Protection Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <SunIcon className="h-5 w-5 text-sky-500" />
              Snow & Ice Management
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Driveway and walkway snow removal</li>
              <li>• Ice treatment and de-icing applications</li>
              <li>• Roof snow load management</li>
              <li>• Emergency storm response</li>
              <li>• Salt and sand application</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-blue-500" />
              Seasonal Preparation
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Gutter cleaning and protection</li>
              <li>• Outdoor furniture winterization</li>
              <li>• Window and door weatherproofing</li>
              <li>• Seasonal equipment storage</li>
              <li>• Property inspection and maintenance</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-lg mb-3 text-center">
            Service Plans Available
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
              Per-Storm Basis
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Seasonal Contract
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              Monthly Maintenance
            </span>
            <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
              Emergency On-Call
            </span>
          </div>
        </div>
      </div>

      {/* Weather Response */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center flex items-center justify-center gap-2">
          <ExclamationTriangleIcon className="h-6 w-6" />
          Weather Emergency Response
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">❄️</div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Storm Preparation
            </h4>
            <p className="text-slate-800 text-sm">
              Pre-storm setup and protection measures for your property
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🚨</div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Emergency Response
            </h4>
            <p className="text-slate-800 text-sm">
              Rapid response team for urgent winter weather situations
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🧹</div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Post-Storm Cleanup
            </h4>
            <p className="text-slate-800 text-sm">
              Complete cleanup and damage assessment after severe weather
            </p>
          </div>
        </div>
      </div>

      {/* Seasonal Timeline */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Year-Round Winter Readiness
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🍂</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Fall Preparation
              </h4>
              <p className="text-blue-800 text-sm">
                October-November: Winterization services, equipment prep, and
                property inspection
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">❄️</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Winter Operations
              </h4>
              <p className="text-blue-800 text-sm">
                December-March: Active snow removal, ice management, and
                emergency response
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <StarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Ready to Conquer Winter?</h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't let winter weather catch you unprepared. Schedule your winter
          services today and ensure your property stays safe and accessible all
          season long.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Winter Services
        </button>
      </div>
    </div>
  );
};

export default Service19;
