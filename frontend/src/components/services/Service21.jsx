import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  HomeIcon,
  TrophyIcon,
  StarIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service21 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Reach New Heights with Professional Care
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your roof and terrace deserve the same attention as the rest of your
        property, but accessing these elevated spaces requires specialized
        equipment and expertise. Our certified high-level cleaning team brings
        professional safety protocols and advanced techniques to restore and
        maintain your rooftops, terraces, and elevated outdoor spaces to
        pristine condition.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500 rounded-full">
            <HomeIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-orange-900">
            High-Level Cleaning Excellence
          </h3>
        </div>
        <p className="text-orange-800 text-xl leading-relaxed">
          Professional roof and terrace cleaning for only{" "}
          <span className="font-bold text-3xl text-orange-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Expert high-altitude cleaning that protects your property
          investment.
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
        Why trust us with your elevated spaces?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Safety Certified
            </h4>
            <p className="text-gray-600 text-base">
              Fully trained and certified in high-altitude safety protocols
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Professional Equipment
            </h4>
            <p className="text-gray-600 text-base">
              Specialized high-level cleaning tools and safety harnesses
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Weather Protection
            </h4>
            <p className="text-gray-600 text-base">
              Weatherproof treatments and protective coatings available
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <TrophyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Surface Restoration
            </h4>
            <p className="text-gray-600 text-base">
              Complete restoration services to revitalize weathered surfaces
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete High-Level Cleaning Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-orange-500" />
              Roof Cleaning & Maintenance
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Tile and shingle cleaning</li>
              <li>• Moss and algae removal</li>
              <li>• Gutter cleaning and repair</li>
              <li>• Downspout clearing and maintenance</li>
              <li>• Roof inspection and assessment</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-red-500" />
              Terrace & Balcony Services
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Deck and balcony deep cleaning</li>
              <li>• Railing and barrier maintenance</li>
              <li>• Drainage system clearing</li>
              <li>• Surface treatment and sealing</li>
              <li>• Outdoor furniture cleaning</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-lg mb-3 text-center">
            Specialized Surface Types
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              Clay Tiles
            </span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
              Metal Roofing
            </span>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              Composite Decking
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              Stone Terraces
            </span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
              Concrete Surfaces
            </span>
          </div>
        </div>
      </div>

      {/* Safety Standards */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-red-900 mb-4 text-center flex items-center justify-center gap-2">
          <ExclamationTriangleIcon className="h-6 w-6" />
          Safety First Protocol
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🦺</div>
            <h4 className="font-semibold text-red-900 mb-2">Certified Teams</h4>
            <p className="text-red-800 text-sm">
              All technicians certified in high-altitude safety and fall
              protection
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔒</div>
            <h4 className="font-semibold text-red-900 mb-2">
              Safety Equipment
            </h4>
            <p className="text-red-800 text-sm">
              Professional-grade harnesses, ropes, and safety anchoring systems
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🛡️</div>
            <h4 className="font-semibold text-red-900 mb-2">
              Insurance Coverage
            </h4>
            <p className="text-red-800 text-sm">
              Full liability coverage and bonding for complete peace of mind
            </p>
          </div>
        </div>
      </div>

      {/* Weather Considerations */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Weather-Smart Service Planning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <ClockIcon className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Optimal Timing
              </h4>
              <p className="text-blue-800 text-sm">
                Services scheduled during ideal weather conditions for safety
                and effectiveness
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Weather Protection
              </h4>
              <p className="text-blue-800 text-sm">
                Protective treatments applied to guard against future weather
                damage
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
          <h3 className="text-2xl font-bold">
            Ready to Elevate Your Property?
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Trust our certified professionals to safely clean and maintain your
          roof, terrace, and elevated spaces with the highest safety and quality
          standards.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book High-Level Service
        </button>
      </div>
    </div>
  );
};

export default Service21;
