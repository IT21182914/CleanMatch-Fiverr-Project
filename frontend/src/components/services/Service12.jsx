import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  BeakerIcon,
  FireIcon,
  GlobeAltIcon,
  SparklesIcon,
  SunIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service12 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Crystal Clear Pool & Spa Maintenance
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Dive into perfection with our professional pool cleaning services. Whether it's your backyard oasis or commercial pool facility, we ensure your water is always sparkling clean, chemically balanced, and ready for enjoyment year-round.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500 rounded-full">
            <BeakerIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-cyan-900">
            Summer Pool Special
          </h3>
        </div>
        <p className="text-cyan-800 text-xl leading-relaxed">
          Professional pool cleaning and maintenance for only{" "}
          <span className="font-bold text-3xl text-cyan-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Keep your pool pristine all season long at an incredible value.
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
        Complete Pool Care Services
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-cyan-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Water Chemistry Balance
            </h4>
            <p className="text-gray-600 text-base">
              Perfect pH and chemical levels for safe, comfortable swimming
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Filter Cleaning & Maintenance
            </h4>
            <p className="text-gray-600 text-base">
              Professional filter cleaning and equipment maintenance
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Skimming & Vacuuming
            </h4>
            <p className="text-gray-600 text-base">
              Thorough cleaning of debris, leaves, and pool floor
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Equipment Check
            </h4>
            <p className="text-gray-600 text-base">
              Complete inspection of pumps, heaters, and pool equipment
            </p>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why Choose Our Pool Services?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SunIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Year-Round Service</h4>
            <p className="text-gray-600 text-sm">
              Seasonal maintenance and care for all weather conditions
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Certified Technicians</h4>
            <p className="text-gray-600 text-sm">
              Licensed pool professionals with years of experience
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h4>
            <p className="text-gray-600 text-sm">
              Weekly, bi-weekly, or monthly service plans available
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <BeakerIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Dive Into Crystal Clear Water
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't let pool maintenance stress you out. Let our professional team handle the chemistry, cleaning, and care so you can focus on enjoying your beautiful, sparkling pool.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Pool Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service12;
