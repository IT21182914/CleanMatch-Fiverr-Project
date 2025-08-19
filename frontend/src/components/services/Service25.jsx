import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  TrophyIcon,
  StarIcon,
  HomeIcon,
  CalendarDaysIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service25 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Preserve the Beauty of Your Hardwood Floors
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your parquet and hardwood floors are an investment in elegance and
        style. Our specialized parquet cleaning service combines expert
        knowledge with wood-safe products and professional techniques to
        maintain the natural beauty, luster, and longevity of your precious
        hardwood surfaces while protecting their finish and value.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500 rounded-full">
            <Squares2X2Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900">
            Expert Hardwood Care
          </h3>
        </div>
        <p className="text-amber-800 text-xl leading-relaxed">
          Professional parquet cleaning services for only{" "}
          <span className="font-bold text-3xl text-amber-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Preserve your floors' natural beauty with expert care.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-amber-50 to-orange-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our parquet cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-amber-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Wood-safe products only
            </h4>
            <p className="text-gray-600 text-base">
              Specially formulated cleaners that protect wood fibers and finish
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Finish protection guarantee
            </h4>
            <p className="text-gray-600 text-base">
              Our methods preserve and enhance your floor's protective coating
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Specialized stain treatment
            </h4>
            <p className="text-gray-600 text-base">
              Expert removal of water marks, scratches, and discoloration
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Professional polishing service
            </h4>
            <p className="text-gray-600 text-base">
              Restore natural shine and luster to dull or worn surfaces
            </p>
          </div>
        </div>
      </div>

      {/* Floor Types Section */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Hardwood Floors We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Squares2X2Icon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Parquet Floors</h4>
            <p className="text-gray-600 text-sm">
              Traditional parquet patterns and modern designs
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Solid Hardwood</h4>
            <p className="text-gray-600 text-sm">
              Oak, maple, cherry, and exotic wood species
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Engineered Wood
            </h4>
            <p className="text-gray-600 text-sm">
              Multi-layer engineered hardwood flooring
            </p>
          </div>
        </div>
      </div>

      {/* Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Professional Parquet Care Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-amber-100 rounded-full">
              <span className="text-amber-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Floor Assessment & Preparation
              </h4>
              <p className="text-gray-600">
                Thorough inspection of wood type, finish condition, and specific
                care requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-orange-100 rounded-full">
              <span className="text-orange-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Gentle Deep Cleaning
              </h4>
              <p className="text-gray-600">
                Wood-safe cleaning solutions remove dirt and grime without
                damaging the finish
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Stain & Scratch Treatment
              </h4>
              <p className="text-gray-600">
                Targeted treatment of water marks, scuffs, and minor surface
                imperfections
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Polishing & Protection
              </h4>
              <p className="text-gray-600">
                Professional polishing restores shine and applies protective
                treatment for longevity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Care Tips & Benefits */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Professional Care vs. DIY Cleaning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              DIY Risks
            </h4>
            <div className="space-y-3">
              {[
                "Wrong products damage finish",
                "Excess moisture warps wood",
                "Improper techniques create streaks",
                "No professional stain treatment",
                "Risk of permanent damage",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Professional Benefits
            </h4>
            <div className="space-y-3">
              {[
                "Wood-specific cleaning products",
                "Moisture-controlled techniques",
                "Streak-free finish guaranteed",
                "Expert stain and scratch repair",
                "Finish protection and enhancement",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-green-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Parquet Care Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Wood type assessment and analysis",
            "Gentle deep cleaning with wood-safe products",
            "Specialized stain and scratch treatment",
            "Professional polishing and restoration",
            "Protective finish enhancement",
            "Floor care guidance and tips",
            "Quality inspection and guarantee",
            "Follow-up maintenance recommendations",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-amber-500 rounded-full">
                <CheckBadgeIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Why Professional Parquet Care Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Preserve Investment
            </h4>
            <p className="text-gray-600 text-sm">
              Professional care maintains your hardwood floors' value and
              extends their lifespan significantly
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Maintain Beauty
            </h4>
            <p className="text-gray-600 text-sm">
              Keep your floors looking pristine with restored natural luster and
              protected finish
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Expert Knowledge
            </h4>
            <p className="text-gray-600 text-sm">
              Benefit from specialized expertise in wood care and finish
              protection techniques
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Recommended Maintenance Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Monthly</h4>
            <p className="text-gray-600 text-sm">
              Light cleaning and dust removal
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Quarterly</h4>
            <p className="text-gray-600 text-sm">
              Professional deep cleaning service
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Annually</h4>
            <p className="text-gray-600 text-sm">
              Complete restoration and protection
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <GlobeAltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Give Your Floors the Care They Deserve
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't risk damaging your beautiful hardwood floors with improper care.
          Trust our parquet specialists to preserve their natural beauty and
          protect your investment for years to come.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Parquet Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service25;
