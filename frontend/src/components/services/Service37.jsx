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
  CalendarDaysIcon,
  BeakerIcon,
  KeyIcon,
  HeartIcon,
  CameraIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service37 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Gym & Fitness Center Cleaning Excellence
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your fitness facility's cleanliness directly impacts member satisfaction, 
        retention, and health safety. Our specialized gym cleaning services ensure 
        every piece of equipment, locker room, and workout area meets the highest 
        hygiene standards. From intensive equipment sanitization to comprehensive 
        facility maintenance, we create the clean, healthy environment your members 
        deserve while supporting your business reputation and success.
      </p>

      {/* Gym Offer Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-purple-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500 rounded-full">
            <BuildingOfficeIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-900">
            Elite Fitness Facility Care
          </h3>
        </div>
        <p className="text-purple-800 text-xl leading-relaxed">
          Professional gym cleaning services for only{" "}
          <span className="font-bold text-3xl text-purple-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Clean, safe fitness environment for member satisfaction.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-purple-50 to-violet-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our gym cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Medical-grade sanitization
            </h4>
            <p className="text-gray-600 text-base">
              Advanced disinfection protocols for equipment and high-touch surfaces
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-violet-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              24/7 service availability
            </h4>
            <p className="text-gray-600 text-base">
              Flexible scheduling to work around peak gym hours and operations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Equipment expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized knowledge of fitness equipment cleaning and maintenance
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-pink-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Health code compliance
            </h4>
            <p className="text-gray-600 text-base">
              Adherence to fitness facility health and safety regulations
            </p>
          </div>
        </div>
      </div>

      {/* Facility Areas Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Fitness Facility Areas We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Equipment Areas</h4>
            <p className="text-gray-600 text-sm">
              Cardio machines, weight equipment, functional training zones
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Locker Rooms</h4>
            <p className="text-gray-600 text-sm">
              Changing areas, showers, restrooms, personal storage
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Specialized Studios
            </h4>
            <p className="text-gray-600 text-sm">
              Yoga studios, spin rooms, group fitness, dance studios
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Common Areas
            </h4>
            <p className="text-gray-600 text-sm">
              Reception, lobby, juice bar, relaxation areas
            </p>
          </div>
        </div>
      </div>

      {/* Gym Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Comprehensive Gym Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Equipment Deep Sanitization
              </h4>
              <p className="text-gray-600">
                Thorough cleaning and disinfection of all fitness equipment including cardio machines, weights, and accessories
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-violet-100 rounded-full">
              <span className="text-violet-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Locker Room Deep Clean
              </h4>
              <p className="text-gray-600">
                Complete sanitization of changing areas, showers, restrooms with anti-bacterial and anti-fungal treatments
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Floor Care & Surface Cleaning
              </h4>
              <p className="text-gray-600">
                Specialized floor cleaning for various surfaces including rubber, wood, and tile with appropriate products
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-pink-100 rounded-full">
              <span className="text-pink-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Air Quality & Final Inspection
              </h4>
              <p className="text-gray-600">
                HVAC cleaning, air freshening, and comprehensive quality assurance check for member-ready facility
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Gym Cleaning Comparison */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Regular Cleaning vs. Specialized Gym Maintenance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Basic surface wiping and vacuuming",
                "Generic cleaning products only",
                "No equipment-specific knowledge",
                "Limited sanitization protocols",
                "No health code compliance focus",
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
              Professional Gym Care
            </h4>
            <div className="space-y-3">
              {[
                "Medical-grade sanitization protocols",
                "Fitness equipment specialized products",
                "Expert knowledge of gym maintenance",
                "Advanced disinfection systems",
                "Health department compliance assurance",
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
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Gym Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "All fitness equipment sanitization and maintenance",
            "Locker room and shower deep cleaning service",
            "Specialized floor care for all surface types",
            "Mirror and window cleaning for clarity",
            "Restroom deep cleaning and restocking",
            "Reception and common area maintenance",
            "Air quality improvement and ventilation cleaning",
            "Trash removal and recycling management",
            "High-touch surface disinfection protocols",
            "Emergency spill and cleanup response",
            "Health code compliance documentation",
            "Member safety and satisfaction focus",
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
          Why Professional Gym Cleaning Drives Business Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Member Retention
            </h4>
            <p className="text-gray-600 text-sm">
              Clean facilities directly impact member satisfaction and long-term retention rates
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Health Compliance
            </h4>
            <p className="text-gray-600 text-sm">
              Meet all health department requirements and maintain professional facility standards
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Competitive Advantage
            </h4>
            <p className="text-gray-600 text-sm">
              Exceptional cleanliness sets your facility apart from competition and attracts new members
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Gym Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Daily Maintenance</h4>
            <p className="text-gray-600 text-sm">
              Regular equipment cleaning and facility maintenance
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Deep Clean Service</h4>
            <p className="text-gray-600 text-sm">
              Comprehensive weekly or monthly intensive cleaning
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FireIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Emergency Response</h4>
            <p className="text-gray-600 text-sm">
              24/7 availability for urgent cleaning situations
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <BuildingOfficeIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Elevate Your Fitness Facility with Professional Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your gym members deserve a clean, safe, and healthy environment. 
          Let our professional cleaning service maintain the highest standards 
          while you focus on helping your members achieve their fitness goals.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Gym Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service37;
