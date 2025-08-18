import React from "react";
import {
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  FireIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service5 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Deep carpet cleaning that removes years of dirt and stains.
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your carpets trap dirt, allergens, and odors over time. Our professional
        carpet cleaning service uses advanced equipment and techniques to
        restore your carpets to like-new condition, extending their life and
        improving your home's air quality.
      </p>

      {/* Special Membership Offer */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500 rounded-full">
            <FireIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-red-900">
            Deep Clean Special
          </h3>
        </div>
        <p className="text-red-800 text-xl leading-relaxed">
          Professional carpet deep cleaning for just{" "}
          <span className="font-bold text-3xl text-red-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Remove years of embedded dirt and allergens!
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-red-50 to-pink-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our carpet cleaning includes:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Pre-treatment of stains and high-traffic areas
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Hot water extraction (steam cleaning)
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Deep soil and allergen removal
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Pet odor and stain elimination
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Eco-friendly cleaning solutions
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Fast-drying techniques
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Area rug and upholstery cleaning
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Furniture moving and replacement
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Benefits of professional carpet cleaning:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Removes embedded dirt
            </h4>
            <p className="text-gray-600 text-base">
              Deep cleaning reaches soil that vacuums can't
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Eliminates allergens
            </h4>
            <p className="text-gray-600 text-base">
              Reduces dust mites, pollen, and pet dander
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <HomeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Extends carpet life
            </h4>
            <p className="text-gray-600 text-base">
              Proper maintenance saves money long-term
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Improves appearance
            </h4>
            <p className="text-gray-600 text-base">
              Restores original colors and texture
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Our deep cleaning process:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Inspection
          </h4>
          <p className="text-gray-600 text-xs">
            Assess carpet condition and stains
          </p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Pre-treat
          </h4>
          <p className="text-gray-600 text-xs">Apply stain removal solutions</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Steam Clean
          </h4>
          <p className="text-gray-600 text-xs">
            Hot water extraction deep clean
          </p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">4</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Rinse</h4>
          <p className="text-gray-600 text-xs">Remove cleaning residue</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-white">5</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Quick Dry
          </h4>
          <p className="text-gray-600 text-xs">Speed dry for fast use</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <FireIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Book Professional Carpet Cleaning
          </h3>
        </div>
        <p className="text-lg mb-6 text-white/90">
          Transform your carpets with our deep cleaning service
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Carpet Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service5;
