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
  CogIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service49 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Manufacturing Plant & Industrial Facility Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Manufacturing and industrial facilities demand specialized cleaning services 
        that meet strict safety, compliance, and operational requirements. Our 
        comprehensive industrial cleaning solutions ensure production areas, machinery 
        zones, and administrative spaces maintain the highest standards of cleanliness 
        and safety. From heavy-duty equipment cleaning to precision area maintenance, 
        we provide thorough services with industry-specific protocols that support 
        operational efficiency while ensuring worker safety and regulatory compliance.
      </p>

      {/* Industrial Offer Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500 rounded-full">
            <CogIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-orange-900">
            Comprehensive Industrial Facility Care
          </h3>
        </div>
        <p className="text-orange-800 text-xl leading-relaxed">
          Professional manufacturing plant and industrial facility cleaning services for only{" "}
          <span className="font-bold text-3xl text-orange-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Maintain safety standards and operational efficiency.
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
        Why choose our industrial facility cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <CogIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Industrial safety compliance
            </h4>
            <p className="text-gray-600 text-base">
              Specialized knowledge of industrial safety standards and regulations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Heavy-duty equipment expertise
            </h4>
            <p className="text-gray-600 text-base">
              Professional cleaning of industrial machinery and production equipment
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <FireIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Hazardous material handling
            </h4>
            <p className="text-gray-600 text-base">
              Safe cleaning procedures for industrial waste and hazardous materials
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-amber-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Production schedule coordination
            </h4>
            <p className="text-gray-600 text-base">
              Flexible service timing that minimizes production downtime
            </p>
          </div>
        </div>
      </div>

      {/* Industrial Facility Types Section */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Industrial Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CogIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Manufacturing Plants</h4>
            <p className="text-gray-600 text-sm">
              Production floors, assembly lines, quality control areas
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Warehouses</h4>
            <p className="text-gray-600 text-sm">
              Storage facilities, distribution centers, logistics hubs
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Processing Plants
            </h4>
            <p className="text-gray-600 text-sm">
              Chemical processing, food processing, pharmaceutical facilities
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FireIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Heavy Industry
            </h4>
            <p className="text-gray-600 text-sm">
              Steel mills, foundries, automotive plants, machinery facilities
            </p>
          </div>
        </div>
      </div>

      {/* Industrial Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Comprehensive Industrial Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-orange-100 rounded-full">
              <span className="text-orange-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Safety Assessment & Equipment Shutdown
              </h4>
              <p className="text-gray-600">
                Comprehensive safety evaluation and proper equipment shutdown procedures before cleaning begins
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-red-100 rounded-full">
              <span className="text-red-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Heavy-Duty Industrial Cleaning
              </h4>
              <p className="text-gray-600">
                Specialized cleaning of production equipment, machinery, and industrial surfaces using appropriate methods
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Waste Management & Disposal
              </h4>
              <p className="text-gray-600">
                Safe handling and disposal of industrial waste and hazardous materials according to regulations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-amber-100 rounded-full">
              <span className="text-amber-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Safety Compliance Verification
              </h4>
              <p className="text-gray-600">
                Final inspection ensuring all areas meet industrial safety standards and regulatory requirements
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Industrial Cleaning Comparison */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Commercial Cleaning vs. Industrial Safety Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "No industrial safety training",
                "Limited hazardous material knowledge",
                "Basic equipment cleaning methods",
                "No regulatory compliance understanding",
                "Generic waste disposal procedures",
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
              Professional Industrial Care
            </h4>
            <div className="space-y-3">
              {[
                "Industrial safety compliance expertise",
                "Specialized hazardous material handling",
                "Heavy-duty equipment cleaning protocols",
                "Regulatory standards understanding",
                "Proper industrial waste management",
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

      {/* What's Included */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Industrial Facility Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Production floor and assembly line cleaning",
            "Heavy machinery and equipment maintenance",
            "Industrial waste removal and disposal",
            "Quality control area sanitization",
            "Administrative office cleaning services",
            "Warehouse and storage facility maintenance",
            "Break room and employee facility care",
            "Safety equipment cleaning and maintenance",
            "Floor care for industrial surfaces",
            "Specialized industrial window cleaning",
            "Emergency spill cleanup and response",
            "Regulatory compliance documentation",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-orange-500 rounded-full">
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
          Why Professional Industrial Cleaning Enhances Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Safety Compliance
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleaning maintains safety standards and regulatory compliance
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-yellow-50 rounded-xl">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CogIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Operational Efficiency
            </h4>
            <p className="text-gray-600 text-sm">
              Clean facilities support smooth operations and equipment longevity
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Worker Productivity
            </h4>
            <p className="text-gray-600 text-sm">
              Clean, safe work environments boost morale and productivity
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Industrial Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Shift-Based Service</h4>
            <p className="text-gray-600 text-sm">
              Cleaning during production downtime between shifts
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Maintenance Windows</h4>
            <p className="text-gray-600 text-sm">
              Deep cleaning during scheduled maintenance periods
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Emergency Response</h4>
            <p className="text-gray-600 text-sm">
              24/7 emergency cleaning for spills and incidents
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <CogIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Optimize Operations with Professional Industrial Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your industrial facility deserves cleaning services that understand safety 
          requirements and operational demands. Let our specialized team maintain the 
          clean, safe environment essential for productive manufacturing operations.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Industrial Facility Cleaning
        </button>
      </div>
    </div>
  );
};

export default Service49;
