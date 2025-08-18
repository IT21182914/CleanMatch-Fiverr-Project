import React from "react";
import {
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  BoltIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service6 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        High-pressure cleaning that restores surfaces to like-new condition.
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Over time, dirt, grime, mold, and stains build up on your exterior
        surfaces. Our professional pressure washing service uses powerful,
        controlled water pressure to blast away years of buildup, revealing
        clean surfaces that look brand new.
      </p>

      {/* Power Clean Special */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-full">
            <BoltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">
            Power Clean Special
          </h3>
        </div>
        <p className="text-blue-800 text-xl leading-relaxed">
          Professional pressure washing for just{" "}
          <span className="font-bold text-3xl text-blue-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Transform your property's appearance!
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
        Surfaces we pressure wash:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Driveways and walkways
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            House siding and brick walls
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">Decks and patios</span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Fences and outdoor furniture
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Pool areas and concrete surfaces
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Parking lots and commercial areas
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">Roofing and gutters</span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Building exteriors and signage
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose professional pressure washing:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <BoltIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Powerful cleaning
            </h4>
            <p className="text-gray-600 text-base">
              Removes stubborn dirt, mold, and mildew effectively
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Safe techniques
            </h4>
            <p className="text-gray-600 text-base">
              Professional equipment prevents surface damage
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <HomeModernIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Increases property value
            </h4>
            <p className="text-gray-600 text-base">
              Clean exteriors improve curb appeal
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Time-saving
            </h4>
            <p className="text-gray-600 text-base">
              Quick, efficient cleaning saves you hours
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our pressure washing process:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Surface Assessment
          </h4>
          <p className="text-gray-600 text-xs">
            Evaluate surface type and condition
          </p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Pre-treatment
          </h4>
          <p className="text-gray-600 text-xs">
            Apply cleaning solutions for tough stains
          </p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-xl">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Power Wash
          </h4>
          <p className="text-gray-600 text-xs">
            High-pressure cleaning with proper technique
          </p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">4</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Final Rinse
          </h4>
          <p className="text-gray-600 text-xs">
            Remove all debris and cleaning residue
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <BoltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Book Powerful Pressure Washing</h3>
        </div>
        <p className="text-lg mb-6 text-white/90">
          Restore your surfaces with professional pressure washing
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Pressure Washing Now
        </button>
      </div>
    </div>
  );
};

export default Service6;
