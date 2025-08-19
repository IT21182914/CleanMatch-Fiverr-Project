import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  TrophyIcon,
  StarIcon,
  HomeIcon,
  CalendarDaysIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service24 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Restore Your Paving Stones to Their Original Beauty
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Transform weathered driveways, walkways, and patios with our specialized
        paving stone cleaning and restoration services. Our expert team combines
        advanced pressure washing techniques with professional-grade treatments
        to bring back the vibrant appearance and structural integrity of your
        outdoor surfaces.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-stone-50 to-gray-50 border-l-4 border-stone-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-stone-500 rounded-full">
            <Squares2X2Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-stone-900">
            Premium Stone Restoration
          </h3>
        </div>
        <p className="text-stone-800 text-xl leading-relaxed">
          Professional paving stone cleaning for only{" "}
          <span className="font-bold text-3xl text-stone-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Restore your outdoor surfaces to their original stunning condition.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-stone-50 to-gray-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our paving stone cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Professional pressure washing
            </h4>
            <p className="text-gray-600 text-base">
              High-powered equipment removes deep-seated dirt and grime
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Advanced stain removal
            </h4>
            <p className="text-gray-600 text-base">
              Specialized treatments for oil, rust, and organic stains
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Protective sealing service
            </h4>
            <p className="text-gray-600 text-base">
              Premium sealants to protect against future staining and weather
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Complete restoration
            </h4>
            <p className="text-gray-600 text-base">
              Full surface renewal bringing back original color and texture
            </p>
          </div>
        </div>
      </div>

      {/* Service Areas Section */}
      <div className="bg-gradient-to-r from-stone-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Areas We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-stone-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Driveways</h4>
            <p className="text-gray-600 text-sm">
              Complete driveway restoration and cleaning
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Squares2X2Icon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Patios & Decks</h4>
            <p className="text-gray-600 text-sm">
              Outdoor entertainment area restoration
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Walkways</h4>
            <p className="text-gray-600 text-sm">
              Pathway cleaning and safety restoration
            </p>
          </div>
        </div>
      </div>

      {/* Restoration Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Restoration Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-stone-100 rounded-full">
              <span className="text-stone-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Surface Assessment
              </h4>
              <p className="text-gray-600">
                Thorough evaluation of stone condition, staining, and structural
                integrity
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Pre-Treatment Application
              </h4>
              <p className="text-gray-600">
                Specialized cleaners applied to break down stains and buildup
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Professional Pressure Washing
              </h4>
              <p className="text-gray-600">
                High-pressure cleaning to remove all dirt, grime, and stains
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Sealing & Protection
              </h4>
              <p className="text-gray-600">
                Premium sealant application for long-lasting protection and
                enhanced appearance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Before & After Benefits */}
      <div className="bg-gradient-to-r from-gray-50 to-stone-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Transform Your Outdoor Space
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Before Our Service
            </h4>
            <div className="space-y-3">
              {[
                "Stained and discolored stones",
                "Moss and algae growth",
                "Oil and rust stains",
                "Weathered appearance",
                "Slippery surfaces",
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
              After Our Service
            </h4>
            <div className="space-y-3">
              {[
                "Vibrant, original colors restored",
                "Clean, moss-free surfaces",
                "Stain-free appearance",
                "Protected against weather",
                "Safe, non-slip surfaces",
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
      <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Service Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Professional assessment and quote",
            "Eco-friendly pre-treatment",
            "High-pressure washing service",
            "Specialized stain removal",
            "Sand refilling between stones",
            "Premium sealing treatment",
            "Clean-up and debris removal",
            "Satisfaction guarantee",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-stone-500 rounded-full">
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
          Why Invest in Paving Stone Restoration?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-stone-50 to-gray-50 rounded-xl">
            <div className="p-3 bg-stone-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Increase Property Value
            </h4>
            <p className="text-gray-600 text-sm">
              Well-maintained outdoor surfaces significantly enhance your
              property's curb appeal and market value
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Extend Surface Life
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleaning and sealing protects your investment and
              extends the lifespan of your paving stones
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Safety & Beauty
            </h4>
            <p className="text-gray-600 text-sm">
              Clean surfaces are safer to walk on and create a beautiful first
              impression for visitors
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
            Transform Your Outdoor Space Today
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't let weathered paving stones diminish your property's appeal.
          Schedule our professional restoration service and watch your outdoor
          surfaces return to their stunning original condition.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Paving Stone Restoration
        </button>
      </div>
    </div>
  );
};

export default Service24;
