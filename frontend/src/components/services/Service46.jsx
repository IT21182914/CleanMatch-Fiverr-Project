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
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service46 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Bank & Financial Institution Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Financial institutions represent trust, security, and professional
        excellence in the community. Our specialized banking facility cleaning
        services ensure every customer interaction area, teller station, and
        office space maintains the immaculate presentation that builds client
        confidence. From high-security areas to customer lobbies, we provide
        comprehensive cleaning with strict confidentiality protocols that
        protect sensitive environments while creating the professional
        atmosphere essential for financial success.
      </p>

      {/* Banking Offer Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500 rounded-full">
            <BanknotesIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-900">
            Professional Financial Institution Care
          </h3>
        </div>
        <p className="text-green-800 text-xl leading-relaxed">
          Professional banking facility cleaning services for only{" "}
          <span className="font-bold text-3xl text-green-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Build client trust with pristine financial environments.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-green-50 to-emerald-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our banking facility cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              High-security environment expertise
            </h4>
            <p className="text-gray-600 text-base">
              Background-checked staff trained for secure financial environments
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-500 rounded-full">
            <KeyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Confidentiality and privacy protocols
            </h4>
            <p className="text-gray-600 text-base">
              Strict confidentiality measures for sensitive financial
              environments
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-teal-500 rounded-full">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Customer experience focus
            </h4>
            <p className="text-gray-600 text-base">
              Professional presentation that builds client trust and confidence
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-cyan-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Business hours coordination
            </h4>
            <p className="text-gray-600 text-base">
              Service scheduling that minimizes disruption to banking operations
            </p>
          </div>
        </div>
      </div>

      {/* Banking Facility Types Section */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Financial Institutions We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BanknotesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Commercial Banks
            </h4>
            <p className="text-gray-600 text-sm">
              Branch locations, main offices, customer service areas
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Credit Unions</h4>
            <p className="text-gray-600 text-sm">
              Member service areas, loan offices, financial counseling rooms
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Investment Firms
            </h4>
            <p className="text-gray-600 text-sm">
              Trading floors, client meeting rooms, advisory offices
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Financial Centers
            </h4>
            <p className="text-gray-600 text-sm">
              Corporate headquarters, regional offices, operations centers
            </p>
          </div>
        </div>
      </div>

      {/* Banking Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Secure Banking Facility Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Security Clearance & Access Verification
              </h4>
              <p className="text-gray-600">
                Comprehensive security verification and coordination with bank
                security personnel for facility access
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-emerald-100 rounded-full">
              <span className="text-emerald-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Customer Area Professional Cleaning
              </h4>
              <p className="text-gray-600">
                Meticulous cleaning of lobbies, teller areas, and all
                customer-facing spaces to maintain professional image
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-teal-100 rounded-full">
              <span className="text-teal-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Office & Administrative Area Maintenance
              </h4>
              <p className="text-gray-600">
                Thorough cleaning of offices, meeting rooms, and work areas with
                document confidentiality awareness
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-cyan-100 rounded-full">
              <span className="text-cyan-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Security Protocol Compliance Check
              </h4>
              <p className="text-gray-600">
                Final inspection ensuring all banking security requirements are
                met with proper documentation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Banking Cleaning Comparison */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Commercial Cleaning vs. Banking Security Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Basic cleaning without security protocols",
                "No background verification requirements",
                "Limited confidentiality awareness",
                "Generic approach to financial environments",
                "No banking compliance understanding",
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
              Professional Banking Care
            </h4>
            <div className="space-y-3">
              {[
                "High-security environment specialized protocols",
                "Background-checked and security-cleared staff",
                "Strict confidentiality and privacy measures",
                "Financial institution expertise and understanding",
                "Banking compliance and regulatory awareness",
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Banking Facility Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Customer lobby and reception area deep cleaning",
            "Teller stations and transaction area maintenance",
            "Private office and meeting room professional cleaning",
            "ATM area and self-service facility care",
            "Vault area and secure space specialized cleaning",
            "Break room and employee area maintenance",
            "Conference room and presentation space care",
            "Restroom maintenance and supply management",
            "Floor care for high-traffic banking areas",
            "Window cleaning for professional appearance",
            "Emergency cleaning and incident response",
            "Confidential document area secure cleaning",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-green-500 rounded-full">
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
          Why Professional Banking Cleaning Builds Financial Trust
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BanknotesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Client Confidence
            </h4>
            <p className="text-gray-600 text-sm">
              Immaculate facilities build client trust and confidence in your
              financial institution
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Security Assurance
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleaning maintains security standards while ensuring
              facility excellence
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Professional Image
            </h4>
            <p className="text-gray-600 text-sm">
              Pristine facilities reflect financial stability and professional
              excellence to clients
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Banking Facility Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
            <p className="text-gray-600 text-sm">
              Minimal disruption cleaning during banking operations
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              After-Hours Service
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning when bank is closed
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Weekend Deep Clean
            </h4>
            <p className="text-gray-600 text-sm">
              Intensive cleaning during bank closure periods
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <BanknotesIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Build Financial Trust with Professional Banking Facility Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your financial institution represents trust, security, and
          professional excellence. Let our specialized banking cleaning service
          maintain the immaculate environment that builds client confidence and
          supports your business success.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Banking Facility Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service46;
