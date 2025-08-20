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
  CalendarDaysIcon,
  BeakerIcon,
  TrophyIcon,
  StarIcon,
  CursorArrowRaysIcon,
  BuildingOffice2Icon,
  KeyIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service29 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Luxury Villa Care Beyond Your Expectations
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your luxury villa deserves the finest care available. Our comprehensive
        luxury villa cleaning and maintenance service combines meticulous
        attention to detail with premium products and specialized techniques to
        preserve the elegance, sophistication, and value of your prestigious
        property while ensuring every space reflects the highest standards of
        luxury living.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500 rounded-full">
            <BuildingOffice2Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-900">
            Luxury Villa Concierge Service
          </h3>
        </div>
        <p className="text-purple-800 text-xl leading-relaxed">
          Complete luxury villa care and maintenance for only{" "}
          <span className="font-bold text-3xl text-purple-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Experience unparalleled luxury property care services.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-purple-50 to-indigo-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our luxury villa service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <StarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              White-glove service standard
            </h4>
            <p className="text-gray-600 text-base">
              Premium care with attention to every luxury detail and finish
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Property protection guarantee
            </h4>
            <p className="text-gray-600 text-base">
              Comprehensive insurance and bonding for complete peace of mind
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Full maintenance integration
            </h4>
            <p className="text-gray-600 text-base">
              Complete property care from cleaning to minor repairs and upkeep
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-500 rounded-full">
            <KeyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Trusted property access
            </h4>
            <p className="text-gray-600 text-base">
              Vetted, background-checked staff with secure key management
            </p>
          </div>
        </div>
      </div>

      {/* Service Areas Section */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Luxury Villa Areas We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Main Residence</h4>
            <p className="text-gray-600 text-sm">
              Living areas, bedrooms, dining spaces
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOffice2Icon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Guest Houses</h4>
            <p className="text-gray-600 text-sm">
              Separate guest accommodations and suites
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Entertainment Areas
            </h4>
            <p className="text-gray-600 text-sm">
              Pool areas, outdoor spaces, recreation rooms
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Service Areas</h4>
            <p className="text-gray-600 text-sm">
              Garages, utility rooms, storage spaces
            </p>
          </div>
        </div>
      </div>

      {/* Service Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Luxury Villa Care Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Property Assessment & Custom Plan
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of your villa's unique features,
                materials, and care requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Premium Deep Cleaning Service
              </h4>
              <p className="text-gray-600">
                Meticulous cleaning of all areas using luxury-grade products
                safe for premium finishes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-violet-100 rounded-full">
              <span className="text-violet-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Maintenance & Minor Repairs
              </h4>
              <p className="text-gray-600">
                Proactive maintenance checks and immediate attention to minor
                issues before they escalate
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Quality Inspection & Reporting
              </h4>
              <p className="text-gray-600">
                Thorough quality check and detailed service report with
                recommendations for ongoing care
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Villa vs Standard Comparison */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Luxury Villa Care vs. Standard Cleaning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Cleaning Limitations
            </h4>
            <div className="space-y-3">
              {[
                "Generic products for all surfaces",
                "Basic cleaning without maintenance",
                "Limited understanding of luxury materials",
                "No property protection coverage",
                "Rushed service with minimal attention",
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
              Luxury Villa Service Benefits
            </h4>
            <div className="space-y-3">
              {[
                "Premium products for specific luxury surfaces",
                "Integrated cleaning and maintenance service",
                "Expert knowledge of high-end materials",
                "Comprehensive property protection insurance",
                "White-glove attention to every detail",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-emerald-500 rounded-full">
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
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Luxury Villa Care Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Custom property assessment and care plan",
            "Premium deep cleaning of all living spaces",
            "Luxury surface and material specific care",
            "Minor maintenance and repair services",
            "Guest house and auxiliary building care",
            "Pool and outdoor entertainment area service",
            "Property security and access management",
            "Detailed service reporting and documentation",
            "Emergency response and priority scheduling",
            "Seasonal property preparation services",
            "Vendor coordination and oversight",
            "Property value preservation guidance",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-purple-500 rounded-full">
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
          Why Luxury Villa Care Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Preserve Property Value
            </h4>
            <p className="text-gray-600 text-sm">
              Professional luxury care maintains and enhances your villa's
              substantial investment value
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Maintain Luxury Standards
            </h4>
            <p className="text-gray-600 text-sm">
              Keep your villa in pristine condition worthy of its prestigious
              status and your lifestyle
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CursorArrowRaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Complete Peace of Mind
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive service with full insurance coverage and trusted,
              verified professionals
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Luxury Service Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Weekly Service</h4>
            <p className="text-gray-600 text-sm">
              Regular maintenance and light cleaning
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Monthly Deep Care
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning and maintenance service
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Seasonal Preparation
            </h4>
            <p className="text-gray-600 text-sm">
              Complete seasonal property care and preparation
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
            Give Your Villa the Luxury Care It Deserves
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't trust your luxury villa to ordinary cleaning services.
          Experience the difference of true luxury property care with our
          comprehensive villa cleaning and maintenance service designed for
          discerning property owners.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Luxury Villa Service
        </button>
      </div>
    </div>
  );
};

export default Service29;
