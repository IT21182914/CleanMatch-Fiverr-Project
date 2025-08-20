import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  CloudIcon,
  TrophyIcon,
  StarIcon,
  CalendarDaysIcon,
  BeakerIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service31 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Industrial Cleaning for Maximum Efficiency
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your industrial facility demands specialized cleaning that goes beyond
        standard commercial services. Our comprehensive industrial cleaning
        solutions combine heavy-duty equipment, specialized chemicals, and
        expert knowledge of industrial environments to maintain optimal
        operational efficiency, safety compliance, and pristine working
        conditions in manufacturing, warehouse, and production facilities.
      </p>

      {/* Industrial Offer Banner */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-l-4 border-slate-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-500 rounded-full">
            <CubeIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Heavy-Duty Industrial Solutions
          </h3>
        </div>
        <p className="text-slate-800 text-xl leading-relaxed">
          Complete industrial facility cleaning for only{" "}
          <span className="font-bold text-3xl text-slate-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Professional industrial-grade cleaning solutions.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-slate-50 to-gray-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our industrial cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-slate-500 rounded-full">
            <CogIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Heavy-duty equipment
            </h4>
            <p className="text-gray-600 text-base">
              Industrial-grade machinery designed for large-scale facility
              cleaning
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Safety compliance expertise
            </h4>
            <p className="text-gray-600 text-base">
              OSHA-trained teams ensuring all safety protocols and regulations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Specialized chemical solutions
            </h4>
            <p className="text-gray-600 text-base">
              Industrial-strength cleaners for grease, oil, and heavy
              contamination
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <BoltIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Minimal downtime guarantee
            </h4>
            <p className="text-gray-600 text-base">
              Efficient scheduling to minimize operational disruption
            </p>
          </div>
        </div>
      </div>

      {/* Industrial Facility Types */}
      <div className="bg-gradient-to-r from-slate-50 to-zinc-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Industrial Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CubeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Manufacturing Plants
            </h4>
            <p className="text-gray-600 text-sm">
              Production floors, assembly lines, quality control areas
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CogIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Warehouses</h4>
            <p className="text-gray-600 text-sm">
              Storage facilities, distribution centers, logistics hubs
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-zinc-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Processing Facilities
            </h4>
            <p className="text-gray-600 text-sm">
              Food processing, chemical plants, refineries
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BoltIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Power Plants</h4>
            <p className="text-gray-600 text-sm">
              Energy facilities, utilities, infrastructure sites
            </p>
          </div>
        </div>
      </div>

      {/* Industrial Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Industrial Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-slate-100 rounded-full">
              <span className="text-slate-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Facility Assessment & Safety Planning
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of industrial environment, hazards, and
                specialized cleaning requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-gray-100 rounded-full">
              <span className="text-gray-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Heavy-Duty Equipment Deployment
              </h4>
              <p className="text-gray-600">
                Industrial cleaning machinery and specialized tools positioned
                for maximum efficiency
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-zinc-100 rounded-full">
              <span className="text-zinc-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Deep Industrial Cleaning
              </h4>
              <p className="text-gray-600">
                Intensive cleaning of all surfaces using industrial-grade
                chemicals and high-powered equipment
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Quality Control & Compliance Verification
              </h4>
              <p className="text-gray-600">
                Thorough inspection and documentation ensuring all safety and
                cleanliness standards are met
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Industrial Comparison */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Commercial vs. Industrial Cleaning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Limitations
            </h4>
            <div className="space-y-3">
              {[
                "Light-duty equipment only",
                "Basic cleaning chemicals",
                "Limited safety training",
                "No industrial compliance knowledge",
                "Cannot handle heavy contamination",
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
              Industrial Cleaning Benefits
            </h4>
            <div className="space-y-3">
              {[
                "Heavy-duty industrial equipment",
                "Specialized industrial-grade chemicals",
                "OSHA-certified safety training",
                "Full regulatory compliance expertise",
                "Expert handling of severe contamination",
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
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Industrial Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Comprehensive facility safety assessment",
            "Heavy-duty industrial cleaning equipment",
            "Specialized chemical solutions and treatments",
            "OSHA-compliant safety protocols",
            "High-pressure washing and degreasing",
            "Floor stripping, sealing, and maintenance",
            "Overhead structure and ceiling cleaning",
            "Machinery and equipment cleaning",
            "Waste disposal and contamination removal",
            "Air quality improvement services",
            "Compliance documentation and reporting",
            "Preventive maintenance recommendations",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-slate-500 rounded-full">
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
          Why Industrial Cleaning Excellence Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CogIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Operational Efficiency
            </h4>
            <p className="text-gray-600 text-sm">
              Clean facilities operate more efficiently with reduced equipment
              downtime and improved productivity
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-zinc-50 rounded-xl">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Safety Compliance
            </h4>
            <p className="text-gray-600 text-sm">
              Maintain OSHA compliance and reduce workplace accidents through
              professional industrial cleaning
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-zinc-50 to-slate-50 rounded-xl">
            <div className="p-3 bg-zinc-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">Cost Savings</h4>
            <p className="text-gray-600 text-sm">
              Prevent expensive equipment damage and extend facility lifespan
              through proper maintenance cleaning
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Industrial Service Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Daily Maintenance
            </h4>
            <p className="text-gray-600 text-sm">
              Regular cleaning for continuous operations
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Shutdown Cleaning
            </h4>
            <p className="text-gray-600 text-sm">
              Deep cleaning during scheduled downtime
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Emergency Response
            </h4>
            <p className="text-gray-600 text-sm">
              Rapid response for industrial accidents
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
            Industrial-Strength Cleaning Solutions
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't compromise on industrial facility cleanliness. Trust our
          specialized industrial cleaning experts to maintain your facility's
          operational efficiency, safety compliance, and professional standards.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Industrial Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service31;
