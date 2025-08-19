import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
  StarIcon,
  HomeIcon,
  CalendarDaysIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service23 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Keep Your Property in Perfect Condition
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Maintain your property's value and functionality with our comprehensive
        maintenance cleaning services. Our experienced team combines routine
        cleaning with preventive care, ensuring your space remains in optimal
        condition year-round while protecting your investment for the future.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-full">
            <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">
            Professional Maintenance Care
          </h3>
        </div>
        <p className="text-blue-800 text-xl leading-relaxed">
          Expert maintenance cleaning services for only{" "}
          <span className="font-bold text-3xl text-blue-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Professional care that keeps your property pristine and functional.
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
        Why choose our maintenance cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Preventive care approach
            </h4>
            <p className="text-gray-600 text-base">
              Identifying and addressing issues before they become problems
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Regular inspections
            </h4>
            <p className="text-gray-600 text-base">
              Thorough property assessments during each service visit
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <CogIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Minor repairs included
            </h4>
            <p className="text-gray-600 text-base">
              Basic maintenance fixes as part of our comprehensive service
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Detailed maintenance logs
            </h4>
            <p className="text-gray-600 text-base">
              Complete documentation of all work performed and recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Comprehensive Maintenance Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Property Care</h4>
            <p className="text-gray-600 text-sm">
              Complete interior and exterior maintenance cleaning
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Scheduled Service
            </h4>
            <p className="text-gray-600 text-sm">
              Regular maintenance visits based on your property's needs
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Quality Assurance
            </h4>
            <p className="text-gray-600 text-sm">
              Consistent high standards with detailed quality checks
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Maintenance Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Initial Property Assessment
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of your property's current condition
                and maintenance needs
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Customized Maintenance Plan
              </h4>
              <p className="text-gray-600">
                Tailored schedule and checklist based on your property's unique
                requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Regular Service Visits
              </h4>
              <p className="text-gray-600">
                Scheduled maintenance cleaning with detailed inspections and
                minor repairs
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Detailed Reporting
              </h4>
              <p className="text-gray-600">
                Complete documentation and recommendations for optimal property
                maintenance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          What's Included in Our Maintenance Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Regular deep cleaning of all areas",
            "Preventive maintenance checks",
            "Minor repair services",
            "Detailed maintenance logs",
            "Property condition reports",
            "Scheduled follow-up visits",
            "Emergency maintenance support",
            "Quality assurance inspections",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-blue-500 rounded-full">
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
          Benefits of Regular Maintenance Cleaning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Preserve Property Value
            </h4>
            <p className="text-gray-600 text-sm">
              Regular maintenance keeps your property in excellent condition,
              protecting and enhancing its market value
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Prevent Costly Repairs
            </h4>
            <p className="text-gray-600 text-sm">
              Early detection and prevention of issues saves money on major
              repairs and replacements
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">Peace of Mind</h4>
            <p className="text-gray-600 text-sm">
              Professional oversight ensures your property is always
              well-maintained and ready for any occasion
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
            Schedule Your Maintenance Service Today
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't wait for problems to arise. Protect your investment with our
          professional maintenance cleaning services and enjoy the confidence
          that comes with a well-maintained property.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Maintenance Service Now
        </button>
      </div>
    </div>
  );
};

export default Service23;
