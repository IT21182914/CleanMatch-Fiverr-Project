import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  TrophyIcon,
  StarIcon,
  HomeIcon,
  CalendarDaysIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service26 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Restore Your Building's Impressive First Impression
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your building's facade is the first thing people notice. Our
        professional facade cleaning service combines advanced high-rise
        techniques with specialized equipment to restore the pristine appearance
        of commercial and residential buildings, ensuring your property makes a
        lasting positive impression while protecting its structural integrity.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-sky-500 rounded-full">
            <BuildingOffice2Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-sky-900">
            Professional Facade Restoration
          </h3>
        </div>
        <p className="text-sky-800 text-xl leading-relaxed">
          Expert facade cleaning services for only{" "}
          <span className="font-bold text-3xl text-sky-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Transform your building's exterior with professional expertise.
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
        Why choose our facade cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-sky-500 rounded-full">
            <BuildingOffice2Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              High-rise cleaning expertise
            </h4>
            <p className="text-gray-600 text-base">
              Certified professionals with advanced equipment for all building
              heights
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Material-specific care
            </h4>
            <p className="text-gray-600 text-base">
              Customized cleaning methods for glass, stone, metal, and composite
              materials
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Advanced safety protocols
            </h4>
            <p className="text-gray-600 text-base">
              Full safety compliance with professional harnesses and protective
              equipment
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Weather protection planning
            </h4>
            <p className="text-gray-600 text-base">
              Strategic scheduling and protective measures for optimal results
            </p>
          </div>
        </div>
      </div>

      {/* Building Types Section */}
      <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Buildings We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-sky-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOffice2Icon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Office Buildings
            </h4>
            <p className="text-gray-600 text-sm">
              Commercial high-rises and corporate headquarters
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Residential Complexes
            </h4>
            <p className="text-gray-600 text-sm">
              Apartment buildings and condominiums
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Retail Centers</h4>
            <p className="text-gray-600 text-sm">
              Shopping centers and commercial retail spaces
            </p>
          </div>
        </div>
      </div>

      {/* Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Professional Facade Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-sky-100 rounded-full">
              <span className="text-sky-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Building Assessment & Planning
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of building height, materials, access
                points, and safety requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Safety Setup & Equipment Preparation
              </h4>
              <p className="text-gray-600">
                Professional rigging systems, safety harnesses, and weather
                protection installation
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Specialized Surface Cleaning
              </h4>
              <p className="text-gray-600">
                Material-specific cleaning techniques using professional-grade
                equipment and solutions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Quality Inspection & Final Protection
              </h4>
              <p className="text-gray-600">
                Thorough quality check and application of protective treatments
                for long-lasting results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Materials We Clean */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Facade Materials We Specialize In
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Glass & Windows
            </h4>
            <div className="space-y-3">
              {[
                "Curtain wall systems",
                "Large glass panels",
                "Architectural glazing",
                "Decorative glass features",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-sky-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Stone & Masonry
            </h4>
            <div className="space-y-3">
              {[
                "Natural stone facades",
                "Brick and mortar surfaces",
                "Concrete panels",
                "Decorative stonework",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-blue-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Metal Surfaces
            </h4>
            <div className="space-y-3">
              {[
                "Aluminum cladding",
                "Steel framework",
                "Copper and bronze details",
                "Architectural metal panels",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-cyan-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Composite Materials
            </h4>
            <div className="space-y-3">
              {[
                "EIFS (synthetic stucco)",
                "Fiber cement panels",
                "Vinyl and plastic cladding",
                "Modern composite systems",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-purple-500 rounded-full">
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
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Facade Cleaning Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Comprehensive building assessment",
            "Professional safety setup and rigging",
            "Material-specific cleaning solutions",
            "High-rise access equipment",
            "Weather protection measures",
            "Quality inspection and guarantee",
            "Site cleanup and debris removal",
            "Maintenance recommendations",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-sky-500 rounded-full">
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
          Benefits of Professional Facade Cleaning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl">
            <div className="p-3 bg-sky-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Enhanced Property Value
            </h4>
            <p className="text-gray-600 text-sm">
              Clean, well-maintained facades significantly increase property
              value and attract quality tenants
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Building Protection
            </h4>
            <p className="text-gray-600 text-sm">
              Regular cleaning prevents material degradation and extends the
              lifespan of facade systems
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Professional Image
            </h4>
            <p className="text-gray-600 text-sm">
              Pristine facades create positive first impressions for clients,
              visitors, and business partners
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Compliance */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Safety & Compliance Guarantee
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Safety Certifications
            </h4>
            <div className="space-y-3">
              {[
                "OSHA compliance certified",
                "High-rise work specialists",
                "Fall protection experts",
                "Emergency response trained",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-red-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Insurance & Bonding
            </h4>
            <div className="space-y-3">
              {[
                "Fully insured and bonded",
                "Workers' compensation coverage",
                "Liability insurance protection",
                "Equipment damage coverage",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-orange-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <GlobeAltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Transform Your Building's Appearance Today
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't let a dirty facade diminish your property's value and
          professional image. Trust our certified high-rise specialists to
          restore your building's impressive appearance safely and effectively.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Facade Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service26;
