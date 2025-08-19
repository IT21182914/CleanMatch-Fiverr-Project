import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  KeyIcon,
  TrophyIcon,
  StarIcon,
  HomeIcon,
  CalendarDaysIcon,
  BeakerIcon,
  EyeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service27 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Property Care You Can Trust
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your property deserves dedicated professional oversight. Our
        comprehensive caretaker services provide reliable property management,
        security monitoring, and maintenance coordination, giving you complete
        peace of mind whether you're a property owner, manager, or resident.
        We're your trusted partners in maintaining your investment's value and
        security.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500 rounded-full">
            <KeyIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-900">
            Trusted Property Care
          </h3>
        </div>
        <p className="text-indigo-800 text-xl leading-relaxed">
          Professional caretaker services for only{" "}
          <span className="font-bold text-3xl text-indigo-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Reliable property oversight and maintenance coordination.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-indigo-50 to-purple-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our caretaker service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <EyeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Comprehensive property oversight
            </h4>
            <p className="text-gray-600 text-base">
              Daily monitoring and care of your property's condition and
              security
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Professional security monitoring
            </h4>
            <p className="text-gray-600 text-base">
              Vigilant security oversight and immediate response to concerns
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Expert maintenance coordination
            </h4>
            <p className="text-gray-600 text-base">
              Professional oversight of all property maintenance and repairs
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <PhoneIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              24/7 emergency response
            </h4>
            <p className="text-gray-600 text-base">
              Round-the-clock availability for urgent property issues
            </p>
          </div>
        </div>
      </div>

      {/* Service Areas Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Properties We Care For
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Residential Properties
            </h4>
            <p className="text-gray-600 text-sm">
              Homes, condos, and multi-unit residential buildings
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <KeyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Commercial Buildings
            </h4>
            <p className="text-gray-600 text-sm">
              Offices, retail spaces, and business complexes
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Vacation Properties
            </h4>
            <p className="text-gray-600 text-sm">
              Second homes, seasonal properties, and rental units
            </p>
          </div>
        </div>
      </div>

      {/* Service Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Comprehensive Caretaker Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Property Assessment & Setup
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of your property's unique needs and
                security requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Daily Monitoring & Inspection
              </h4>
              <p className="text-gray-600">
                Regular property checks, security monitoring, and maintenance
                oversight
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Coordination & Communication
              </h4>
              <p className="text-gray-600">
                Professional coordination of maintenance, repairs, and regular
                updates to owners
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Emergency Response & Reporting
              </h4>
              <p className="text-gray-600">
                24/7 emergency availability and detailed reporting on all
                property activities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Caretaker Services Include
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Security & Monitoring
            </h4>
            <div className="space-y-3">
              {[
                "Daily security checks and patrols",
                "Access control and visitor management",
                "Alarm system monitoring",
                "Emergency response coordination",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-indigo-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Maintenance Oversight
            </h4>
            <div className="space-y-3">
              {[
                "Regular maintenance inspections",
                "Contractor coordination and supervision",
                "Preventive maintenance scheduling",
                "Repair project management",
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
              Property Care
            </h4>
            <div className="space-y-3">
              {[
                "Landscaping and grounds maintenance",
                "Weather protection measures",
                "Seasonal property preparations",
                "Utility monitoring and management",
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
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Communication & Reporting
            </h4>
            <div className="space-y-3">
              {[
                "Regular status reports to owners",
                "Photo documentation of issues",
                "Maintenance logs and schedules",
                "Emergency notification system",
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
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Caretaker Service Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Comprehensive property assessment",
            "Daily security monitoring and patrols",
            "Maintenance coordination and oversight",
            "Emergency response and availability",
            "Regular property inspections",
            "Detailed reporting and documentation",
            "Contractor supervision and management",
            "Owner communication and updates",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-indigo-500 rounded-full">
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
          Benefits of Professional Caretaker Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Protect Your Investment
            </h4>
            <p className="text-gray-600 text-sm">
              Professional oversight maintains property value and prevents
              costly damage through early detection
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Save Time & Stress
            </h4>
            <p className="text-gray-600 text-sm">
              Focus on your priorities while we handle all property management
              responsibilities
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Professional Expertise
            </h4>
            <p className="text-gray-600 text-sm">
              Benefit from experienced property management professionals who
              understand your needs
            </p>
          </div>
        </div>
      </div>

      {/* Service Levels */}
      <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Service Levels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Basic Care</h4>
            <p className="text-gray-600 text-sm mb-4">
              Weekly property checks and basic maintenance oversight
            </p>
            <div className="text-sm text-gray-500">
              Perfect for low-maintenance properties
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border-2 border-indigo-200">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <KeyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Full Service</h4>
            <p className="text-gray-600 text-sm mb-4">
              Daily oversight with comprehensive maintenance coordination
            </p>
            <div className="text-sm text-indigo-600 font-semibold">
              Most Popular
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Premium Care</h4>
            <p className="text-gray-600 text-sm mb-4">
              24/7 monitoring with concierge-level property management
            </p>
            <div className="text-sm text-gray-500">
              For luxury and high-value properties
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
            Trust Your Property to the Professionals
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't worry about property management anymore. Our experienced
          caretaker team provides the reliable oversight and professional care
          your property deserves, giving you complete peace of mind.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Caretaker Service
        </button>
      </div>
    </div>
  );
};

export default Service27;
