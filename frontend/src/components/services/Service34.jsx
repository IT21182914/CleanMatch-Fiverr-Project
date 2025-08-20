import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  SunIcon,
  TrophyIcon,
  StarIcon,
  CalendarDaysIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  CloudIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service34 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Maritime Excellence for Your Luxury Vessel
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your yacht or ship deserves specialized marine cleaning that understands
        the unique challenges of saltwater environments, luxury marine finishes,
        and maritime regulations. Our comprehensive yacht and ship cleaning
        services combine marine expertise with luxury care standards to maintain
        your vessel's pristine condition, protect valuable marine equipment, and
        ensure optimal performance on every voyage.
      </p>

      {/* Maritime Offer Banner */}
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border-l-4 border-cyan-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500 rounded-full">
            <SunIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-cyan-900">
            Premium Marine Care Services
          </h3>
        </div>
        <p className="text-cyan-800 text-xl leading-relaxed">
          Professional yacht and ship cleaning for only{" "}
          <span className="font-bold text-3xl text-cyan-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Marine-grade cleaning for luxury vessel excellence.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-cyan-50 to-teal-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our marine cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-cyan-500 rounded-full">
            <MapIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Marine environment expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized knowledge of saltwater effects and marine cleaning
              requirements
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-teal-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Marine-grade products only
            </h4>
            <p className="text-gray-600 text-base">
              Eco-friendly solutions safe for marine life and luxury finishes
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Equipment protection focus
            </h4>
            <p className="text-gray-600 text-base">
              Specialized care for marine electronics, engines, and luxury
              fittings
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-500 rounded-full">
            <StarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Luxury vessel standards
            </h4>
            <p className="text-gray-600 text-base">
              White-glove service meeting the highest yacht and ship care
              expectations
            </p>
          </div>
        </div>
      </div>

      {/* Vessel Types Section */}
      <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Vessels We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SunIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Luxury Yachts</h4>
            <p className="text-gray-600 text-sm">
              Private yachts, mega yachts, super yachts
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Commercial Ships
            </h4>
            <p className="text-gray-600 text-sm">
              Cruise ships, cargo vessels, ferry boats
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-sky-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ArrowPathIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Sailboats & Catamarans
            </h4>
            <p className="text-gray-600 text-sm">
              Racing yachts, cruising sailboats, luxury catamarans
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Sport & Fishing Boats
            </h4>
            <p className="text-gray-600 text-sm">
              Sport fishing vessels, speedboats, recreational craft
            </p>
          </div>
        </div>
      </div>

      {/* Marine Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Professional Marine Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-cyan-100 rounded-full">
              <span className="text-cyan-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Marine Vessel Assessment
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of vessel type, marine finishes,
                equipment, and specific care requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-teal-100 rounded-full">
              <span className="text-teal-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Hull & Exterior Deep Cleaning
              </h4>
              <p className="text-gray-600">
                Professional hull cleaning, deck scrubbing, and exterior
                detailing using marine-safe products
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-sky-100 rounded-full">
              <span className="text-sky-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Interior & Equipment Care
              </h4>
              <p className="text-gray-600">
                Luxury interior cleaning, galley service, and careful
                maintenance of marine electronics and equipment
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Protection & Final Inspection
              </h4>
              <p className="text-gray-600">
                Application of marine protectants, quality inspection, and
                preparation for your next voyage
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Land vs Marine Comparison */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Standard Cleaning vs. Marine Vessel Care
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Cleaning Limitations
            </h4>
            <div className="space-y-3">
              {[
                "No marine environment understanding",
                "Standard products harmful to marine life",
                "No saltwater corrosion knowledge",
                "Lack of marine equipment expertise",
                "No understanding of maritime regulations",
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
              Marine Cleaning Excellence
            </h4>
            <div className="space-y-3">
              {[
                "Expert marine environment knowledge",
                "Eco-friendly marine-safe products only",
                "Saltwater and corrosion protection expertise",
                "Specialized marine equipment care",
                "Full maritime compliance understanding",
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
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Marine Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Professional hull cleaning and detailing",
            "Deck scrubbing and non-slip treatment",
            "Luxury interior cleaning and care",
            "Galley and head (bathroom) deep cleaning",
            "Marine electronics and equipment protection",
            "Upholstery and fabric care services",
            "Window and porthole crystal clear cleaning",
            "Stainless steel polishing and protection",
            "Bilge cleaning and maintenance",
            "Canvas and sail cleaning services",
            "Eco-friendly marine waste disposal",
            "Pre and post-voyage preparation services",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-cyan-500 rounded-full">
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
          Why Professional Marine Cleaning Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Vessel Protection
            </h4>
            <p className="text-gray-600 text-sm">
              Protect your valuable marine investment from saltwater damage and
              environmental elements
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-sky-50 rounded-xl">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Performance Excellence
            </h4>
            <p className="text-gray-600 text-sm">
              Clean hulls and maintained equipment ensure optimal vessel
              performance and fuel efficiency
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl">
            <div className="p-3 bg-sky-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CloudIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Environmental Responsibility
            </h4>
            <p className="text-gray-600 text-sm">
              Eco-friendly marine products protect ocean ecosystems while
              maintaining vessel excellence
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-cyan-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Marine Vessel Service Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ArrowPathIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Weekly Maintenance
            </h4>
            <p className="text-gray-600 text-sm">
              Regular cleaning for frequently used vessels
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Seasonal Service
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive pre and post-season preparation
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Voyage Preparation
            </h4>
            <p className="text-gray-600 text-sm">
              Pre-departure detailing and post-voyage care
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
            Set Sail with Confidence in Your Pristine Vessel
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your yacht or ship deserves marine cleaning expertise that understands
          the ocean environment. Trust our professional marine team to maintain
          your vessel's luxury standards and peak performance on every voyage.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Marine Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service34;
