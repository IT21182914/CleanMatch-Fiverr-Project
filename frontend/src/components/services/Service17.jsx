import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  CogIcon,
  TrophyIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service17 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Heavy-Duty Industrial Excellence
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Industrial environments demand specialized cleaning solutions that go
        beyond standard commercial services. Our certified industrial cleaning
        team brings the expertise, equipment, and safety protocols necessary to
        maintain manufacturing facilities, warehouses, and heavy industrial
        operations at peak cleanliness and operational efficiency.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-l-4 border-slate-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-500 rounded-full">
            <CogIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Industrial Grade Service
          </h3>
        </div>
        <p className="text-slate-800 text-xl leading-relaxed">
          Professional industrial cleaning for only{" "}
          <span className="font-bold text-3xl text-slate-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Heavy-duty cleaning solutions designed for the toughest industrial
          environments.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-slate-50 to-gray-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why trust us with your industrial facility?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-slate-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              OSHA Certified
            </h4>
            <p className="text-gray-600 text-base">
              Fully trained in industrial safety protocols and compliance
              standards
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Hazmat Handling
            </h4>
            <p className="text-gray-600 text-base">
              Licensed for hazardous material cleanup and disposal
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Heavy Equipment
            </h4>
            <p className="text-gray-600 text-base">
              Industrial-grade cleaning machinery for large-scale operations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Compliance Ready
            </h4>
            <p className="text-gray-600 text-base">
              Meets all regulatory requirements and industry standards
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Comprehensive Industrial Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <CogIcon className="h-5 w-5 text-slate-500" />
              Heavy Machinery & Equipment
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Production line deep cleaning</li>
              <li>• Machinery degreasing and maintenance</li>
              <li>• Conveyor system sanitization</li>
              <li>• Equipment housing and controls</li>
              <li>• Specialized tool and fixture cleaning</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              Safety & Compliance
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Hazardous material cleanup</li>
              <li>• Chemical spill containment</li>
              <li>• Emergency response cleaning</li>
              <li>• Safety documentation and reporting</li>
              <li>• Environmental compliance protocols</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-lg mb-3 text-center">
            Industrial Facility Types
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
              Manufacturing Plants
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
              Warehouses
            </span>
            <span className="bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full">
              Food Processing
            </span>
            <span className="bg-stone-100 text-stone-800 px-3 py-1 rounded-full">
              Chemical Plants
            </span>
            <span className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full">
              Auto Assembly
            </span>
          </div>
        </div>
      </div>

      {/* Safety Standards */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-red-900 mb-4 text-center flex items-center justify-center gap-2">
          <ExclamationTriangleIcon className="h-6 w-6" />
          Safety First Philosophy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheckIcon className="h-12 w-12 text-red-600" />
            </div>
            <h4 className="font-semibold text-red-900 mb-2">Personal Protection</h4>
            <p className="text-red-800 text-sm">Full PPE compliance and safety gear for all team members</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
            </div>
            <h4 className="font-semibold text-red-900 mb-2">Risk Assessment</h4>
            <p className="text-red-800 text-sm">Thorough site evaluation and hazard identification protocols</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ClockIcon className="h-12 w-12 text-red-600" />
            </div>
            <h4 className="font-semibold text-red-900 mb-2">Documentation</h4>
            <p className="text-red-800 text-sm">Complete compliance records and safety audit trails</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <StarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Ready for Industrial Excellence?
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Schedule your industrial cleaning service and maintain the highest
          standards of cleanliness, safety, and operational efficiency in your
          facility.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Industrial Service
        </button>
      </div>
    </div>
  );
};

export default Service17;
