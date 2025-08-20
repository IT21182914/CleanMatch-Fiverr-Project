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
  ComputerDesktopIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service44 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Data Center & Server Room Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Data centers and server rooms are the backbone of modern business
        operations, housing critical IT infrastructure worth millions. Our
        specialized cleaning services protect your valuable equipment from dust,
        debris, and environmental contamination that can cause system failures
        and costly downtime. Using ESD-safe methods and precision cleaning
        techniques, we maintain optimal operating conditions that extend
        equipment life, ensure reliable performance, and protect your technology
        investments.
      </p>

      {/* Data Center Offer Banner */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-500 rounded-full">
            <ComputerDesktopIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Professional Data Center Care
          </h3>
        </div>
        <p className="text-gray-800 text-xl leading-relaxed">
          Professional data center cleaning services for only{" "}
          <span className="font-bold text-3xl text-gray-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Protect your critical IT infrastructure with precision cleaning.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-gray-50 to-slate-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our data center cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-gray-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              ESD-safe cleaning protocols
            </h4>
            <p className="text-gray-600 text-base">
              Electrostatic discharge protection for sensitive electronic
              equipment
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-slate-500 rounded-full">
            <CpuChipIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Precision equipment cleaning
            </h4>
            <p className="text-gray-600 text-base">
              Specialized techniques for servers, networking, and critical
              hardware
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-zinc-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Contamination control expertise
            </h4>
            <p className="text-gray-600 text-base">
              Advanced dust and particle removal to prevent system failures
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-stone-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Zero-downtime maintenance
            </h4>
            <p className="text-gray-600 text-base">
              Cleaning schedules designed to avoid operational disruption
            </p>
          </div>
        </div>
      </div>

      {/* IT Facility Types Section */}
      <div className="bg-gradient-to-r from-gray-50 to-zinc-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          IT Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ComputerDesktopIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Data Centers</h4>
            <p className="text-gray-600 text-sm">
              Enterprise data centers, colocation facilities, cloud
              infrastructure
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CpuChipIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Server Rooms</h4>
            <p className="text-gray-600 text-sm">
              Corporate server rooms, network operations centers, IT closets
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-zinc-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Clean Rooms</h4>
            <p className="text-gray-600 text-sm">
              Semiconductor facilities, research labs, precision manufacturing
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-stone-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Control Centers
            </h4>
            <p className="text-gray-600 text-sm">
              Command centers, monitoring facilities, mission-critical
              operations
            </p>
          </div>
        </div>
      </div>

      {/* Data Center Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Precision Data Center Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-gray-100 rounded-full">
              <span className="text-gray-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Pre-Cleaning Assessment & ESD Protection Setup
              </h4>
              <p className="text-gray-600">
                Comprehensive facility assessment and electrostatic discharge
                protection preparation for safe equipment handling
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-slate-100 rounded-full">
              <span className="text-slate-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Precision Equipment & Hardware Cleaning
              </h4>
              <p className="text-gray-600">
                Detailed cleaning of servers, networking equipment, and critical
                hardware using specialized ESD-safe techniques
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-zinc-100 rounded-full">
              <span className="text-zinc-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Environmental Control & Air Filtration
              </h4>
              <p className="text-gray-600">
                HVAC system cleaning, air filtration maintenance, and
                environmental contamination control measures
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-stone-100 rounded-full">
              <span className="text-stone-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Final Inspection & Performance Verification
              </h4>
              <p className="text-gray-600">
                Comprehensive quality check ensuring optimal operating
                conditions and equipment protection standards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Data Center Cleaning Comparison */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Regular Cleaning vs. Data Center Precision Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Basic cleaning without ESD protection",
                "No specialized IT equipment knowledge",
                "Risk of static discharge damage",
                "Generic cleaning products and methods",
                "No contamination control protocols",
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
              Professional Data Center Care
            </h4>
            <div className="space-y-3">
              {[
                "ESD-safe cleaning protocols and equipment protection",
                "Specialized IT infrastructure cleaning expertise",
                "Static-free cleaning methods and grounding procedures",
                "Precision cleaning products safe for electronics",
                "Advanced contamination control and clean room standards",
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
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Data Center Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Server and networking equipment precision cleaning",
            "ESD-safe cleaning protocols and static protection",
            "Raised floor and underfloor space maintenance",
            "HVAC system and air filtration cleaning",
            "Cable management and wire routing area care",
            "Control room and monitoring station cleaning",
            "Power distribution and UPS system maintenance",
            "Emergency systems and safety equipment care",
            "Data storage and backup system cleaning",
            "Environmental monitoring and contamination control",
            "Documentation and compliance reporting",
            "24/7 emergency cleaning and response services",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-gray-500 rounded-full">
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
          Why Professional Data Center Cleaning Protects Your Technology
          Investment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ComputerDesktopIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Equipment Protection
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleaning extends hardware lifespan and prevents
              costly equipment failures
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-zinc-50 rounded-xl">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Uptime Reliability
            </h4>
            <p className="text-gray-600 text-sm">
              Prevent downtime and system failures with optimal environmental
              conditions and cleanliness
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-zinc-50 to-stone-50 rounded-xl">
            <div className="p-3 bg-zinc-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CpuChipIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Performance Optimization
            </h4>
            <p className="text-gray-600 text-sm">
              Clean environments ensure optimal cooling efficiency and peak
              system performance
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Data Center Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Regular Maintenance
            </h4>
            <p className="text-gray-600 text-sm">
              Scheduled cleaning during planned maintenance windows
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              24/7 Availability
            </h4>
            <p className="text-gray-600 text-sm">
              Around-the-clock service for critical operations
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FireIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Emergency Response
            </h4>
            <p className="text-gray-600 text-sm">
              Rapid response for contamination incidents
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <ComputerDesktopIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Protect Your Critical IT Infrastructure with Professional Data
            Center Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your data center represents millions in technology investment and
          supports critical business operations. Let our precision cleaning
          service maintain the optimal environment that protects your equipment
          and ensures reliable performance.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Data Center Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service44;
