import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  CloudIcon,
  TrophyIcon,
  StarIcon,
  SunIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service15 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Where Luxury Meets the Open Sea
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your yacht represents freedom, luxury, and adventure on the water. Our
        specialized marine cleaning services ensure your vessel maintains its
        pristine condition while protecting it from the harsh marine
        environment. From intimate sailboats to luxury super yachts, we deliver
        excellence that matches your maritime lifestyle.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500 rounded-full">
            <CloudIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-cyan-900">
            Premium Marine Service
          </h3>
        </div>
        <p className="text-cyan-800 text-xl leading-relaxed">
          Professional yacht and ship cleaning for only{" "}
          <span className="font-bold text-3xl text-cyan-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Marine-grade cleaning that protects your investment and enhances
          your time on the water.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-cyan-50 to-blue-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our marine cleaning expertise?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-cyan-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Marine Specialists
            </h4>
            <p className="text-gray-600 text-base">
              Certified marine cleaning professionals with extensive vessel
              experience
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Marine-Safe Products
            </h4>
            <p className="text-gray-600 text-base">
              Eco-friendly products safe for marine environments and wildlife
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Hull Protection
            </h4>
            <p className="text-gray-600 text-base">
              Specialized hull cleaning and protective treatments
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
              White-glove service that maintains your vessel's prestige
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete Marine Vessel Care
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-cyan-500" />
              Interior Services
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Salon and cabin deep cleaning</li>
              <li>• Galley and head sanitization</li>
              <li>• Upholstery and carpet care</li>
              <li>• Wood and metal polishing</li>
              <li>• Electronics and instrumentation cleaning</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <SunIcon className="h-5 w-5 text-blue-500" />
              Exterior Services
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Deck washing and non-slip treatment</li>
              <li>• Hull cleaning and antifouling prep</li>
              <li>• Superstructure detailing</li>
              <li>• Canvas and sail cleaning</li>
              <li>• Hardware and rigging maintenance</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-lg mb-3 text-center">
            Available for All Vessel Types
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
              Sailboats
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Motor Yachts
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              Super Yachts
            </span>
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
              Commercial Vessels
            </span>
            <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
              Fishing Boats
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <StarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Ready to Set Sail in Style?</h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Schedule your marine cleaning service and ensure every voyage is
          aboard a vessel that reflects your passion for excellence on the
          water.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Marine Service
        </button>
      </div>
    </div>
  );
};

export default Service15;
