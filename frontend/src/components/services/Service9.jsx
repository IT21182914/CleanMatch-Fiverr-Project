import React from "react";
import {
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service9 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Transform construction chaos into move-in ready perfection.
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Construction projects leave behind dust, debris, and mess. Our
        specialized post-construction cleaning service handles the heavy-duty
        cleanup, making your new space ready for occupancy and inspection.
      </p>

      {/* Construction Special */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500 rounded-full">
            <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-orange-900">
            Construction Ready Special
          </h3>
        </div>
        <p className="text-orange-800 text-xl leading-relaxed">
          Professional construction cleanup for just{" "}
          <span className="font-bold text-3xl text-orange-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Get your space ready for occupancy!
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-orange-50 to-red-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comprehensive construction cleanup includes:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Heavy debris and construction waste removal
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Fine dust elimination from all surfaces
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Window and glass cleaning (interior and exterior)
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Floor deep cleaning and preparation
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Paint splatter and adhesive removal
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            HVAC system and vent cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Fixture and appliance cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Final inspection and touch-ups
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Perfect for all construction projects:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <BuildingOfficeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              New construction
            </h4>
            <p className="text-gray-600 text-base">
              Make your new building move-in ready
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Renovation projects
            </h4>
            <p className="text-gray-600 text-base">
              Clean up after remodeling work
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Commercial spaces
            </h4>
            <p className="text-gray-600 text-base">
              Office buildings, retail, and industrial
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <TruckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Residential builds
            </h4>
            <p className="text-gray-600 text-base">
              New homes and apartment complexes
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our construction cleaning process:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Site Assessment
          </h4>
          <p className="text-gray-600 text-xs">
            Evaluate cleanup requirements and safety
          </p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Debris Removal
          </h4>
          <p className="text-gray-600 text-xs">
            Clear all construction waste and materials
          </p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-xl">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Dust Elimination
          </h4>
          <p className="text-gray-600 text-xs">
            Remove fine dust from all surfaces
          </p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">4</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Detail Clean
          </h4>
          <p className="text-gray-600 text-xs">
            Deep clean all surfaces and fixtures
          </p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">5</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Final Inspection
          </h4>
          <p className="text-gray-600 text-xs">
            Quality check and final touches
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Book Construction Cleanup Service
          </h3>
        </div>
        <p className="text-lg mb-6 text-white/90">
          Professional post-construction cleaning for move-in ready spaces
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Construction Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service9;
