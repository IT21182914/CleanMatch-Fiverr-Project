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
  FilmIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service45 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Film Studio & Production Facility Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Film and television production demands flawless environments where every
        detail matters. Our specialized studio cleaning services ensure pristine
        sets, equipment areas, and production spaces that meet the exacting
        standards of the entertainment industry. From soundstages to
        post-production suites, we maintain immaculate facilities that protect
        expensive equipment, preserve creative environments, and support
        seamless production workflows without disrupting your shooting schedules
        or artistic vision.
      </p>

      {/* Film Studio Offer Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500 rounded-full">
            <FilmIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-900">
            Professional Film Production Environment Care
          </h3>
        </div>
        <p className="text-indigo-800 text-xl leading-relaxed">
          Professional film studio cleaning services for only{" "}
          <span className="font-bold text-3xl text-indigo-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Picture-perfect environments for flawless productions.
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
        Why choose our film studio cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <VideoCameraIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Production-safe cleaning protocols
            </h4>
            <p className="text-gray-600 text-base">
              Specialized techniques that protect sensitive filming and audio
              equipment
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Shoot schedule coordination
            </h4>
            <p className="text-gray-600 text-base">
              Flexible cleaning times that work around production schedules and
              deadlines
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-violet-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Set design preservation
            </h4>
            <p className="text-gray-600 text-base">
              Careful cleaning that maintains set integrity and artistic vision
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Equipment protection expertise
            </h4>
            <p className="text-gray-600 text-base">
              Professional care for cameras, lighting, and production equipment
            </p>
          </div>
        </div>
      </div>

      {/* Production Facility Types Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Production Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FilmIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Film Studios</h4>
            <p className="text-gray-600 text-sm">
              Soundstages, movie sets, production stages
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <VideoCameraIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">TV Studios</h4>
            <p className="text-gray-600 text-sm">
              Television sets, broadcast studios, live production facilities
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CameraIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Post-Production
            </h4>
            <p className="text-gray-600 text-sm">
              Editing suites, color correction rooms, audio mixing facilities
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Creative Spaces
            </h4>
            <p className="text-gray-600 text-sm">
              Green rooms, wardrobe departments, makeup areas
            </p>
          </div>
        </div>
      </div>

      {/* Film Studio Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Production-Focused Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Pre-Production Setup & Equipment Protection
              </h4>
              <p className="text-gray-600">
                Comprehensive facility preparation and equipment protection
                setup before filming begins
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Between-Takes Maintenance
              </h4>
              <p className="text-gray-600">
                Quick, silent cleaning between takes and scenes without
                disrupting production flow
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-violet-100 rounded-full">
              <span className="text-violet-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Set Preservation & Deep Clean
              </h4>
              <p className="text-gray-600">
                Careful preservation of set designs and comprehensive cleaning
                of production areas
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Post-Production Restoration
              </h4>
              <p className="text-gray-600">
                Complete facility restoration and preparation for next
                production with equipment care
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Film Studio Cleaning Comparison */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Basic Cleaning vs. Film Production Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Facility Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Basic cleaning without production awareness",
                "No equipment protection protocols",
                "Disruptive cleaning schedules",
                "No understanding of set requirements",
                "Limited creative environment knowledge",
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
              Professional Film Production Care
            </h4>
            <div className="space-y-3">
              {[
                "Production-coordinated cleaning schedules",
                "Equipment protection and preservation expertise",
                "Silent, non-disruptive cleaning methods",
                "Set design and artistic vision preservation",
                "Film industry experience and understanding",
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
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Film Studio Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Soundstage and filming area deep cleaning",
            "Equipment protection and specialized care",
            "Set design preservation and maintenance",
            "Post-production suite and editing room cleaning",
            "Green room and talent area professional service",
            "Wardrobe and makeup department care",
            "Craft services and catering area cleaning",
            "Production office and administrative space maintenance",
            "Silent cleaning during active filming",
            "Equipment-safe sanitization protocols",
            "Emergency cleaning and spill response",
            "24/7 production schedule coordination",
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
          Why Professional Film Studio Cleaning Enhances Production Quality
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FilmIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Production Excellence
            </h4>
            <p className="text-gray-600 text-sm">
              Pristine environments ensure flawless shots and professional
              production quality
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <VideoCameraIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Equipment Protection
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleaning protects valuable filming equipment and
              extends its operational life
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Creative Support
            </h4>
            <p className="text-gray-600 text-sm">
              Immaculate facilities support artistic vision and creative
              processes without distraction
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Film Production Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Pre-Production</h4>
            <p className="text-gray-600 text-sm">
              Complete facility preparation before filming begins
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              During Production
            </h4>
            <p className="text-gray-600 text-sm">
              Silent maintenance between takes and scenes
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Post-Production
            </h4>
            <p className="text-gray-600 text-sm">
              Complete restoration after filming wraps
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <FilmIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Create Picture-Perfect Productions with Professional Studio Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Every great film deserves a flawless production environment. Let our
          specialized studio cleaning service maintain the pristine conditions
          that support your creative vision and ensure professional production
          quality.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Film Studio Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service45;
