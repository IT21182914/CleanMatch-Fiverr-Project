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
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service48 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Music Studio & Recording Facility Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Music studios and recording facilities require meticulous cleaning that 
        preserves acoustic integrity while maintaining the pristine environment 
        essential for professional audio production. Our specialized studio cleaning 
        services understand the delicate balance between thorough sanitization and 
        equipment protection. From control rooms to live rooms, we provide 
        comprehensive cleaning with sound-sensitive protocols that ensure optimal 
        recording conditions while protecting valuable audio equipment and instruments.
      </p>

      {/* Studio Offer Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500 rounded-full">
            <MusicalNoteIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-900">
            Professional Audio Production Environment Care
          </h3>
        </div>
        <p className="text-purple-800 text-xl leading-relaxed">
          Professional music studio and recording facility cleaning services for only{" "}
          <span className="font-bold text-3xl text-purple-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Preserve acoustic integrity while maintaining studio excellence.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-purple-50 to-pink-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our music studio cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <MusicalNoteIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Acoustic environment preservation
            </h4>
            <p className="text-gray-600 text-base">
              Cleaning methods that maintain acoustic integrity and sound quality
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-pink-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Equipment protection expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized care for sensitive audio equipment and instruments
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Dust-free environment maintenance
            </h4>
            <p className="text-gray-600 text-base">
              Meticulous cleaning that prevents dust interference with equipment
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-violet-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Session schedule coordination
            </h4>
            <p className="text-gray-600 text-base">
              Flexible timing that works around recording and production schedules
            </p>
          </div>
        </div>
      </div>

      {/* Studio Facility Types Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Music Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Recording Studios</h4>
            <p className="text-gray-600 text-sm">
              Control rooms, live rooms, vocal booths
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Mastering Suites</h4>
            <p className="text-gray-600 text-sm">
              Critical listening rooms, mastering facilities
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Rehearsal Spaces
            </h4>
            <p className="text-gray-600 text-sm">
              Band practice rooms, music schools, performance venues
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Production Facilities
            </h4>
            <p className="text-gray-600 text-sm">
              Audio post-production, sound design studios
            </p>
          </div>
        </div>
      </div>

      {/* Studio Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Specialized Studio Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Equipment Assessment & Protection
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation and protection of all audio equipment, instruments, and sensitive electronics
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-pink-100 rounded-full">
              <span className="text-pink-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Acoustic-Sensitive Surface Care
              </h4>
              <p className="text-gray-600">
                Meticulous cleaning of acoustic panels, soundproofing, and surfaces that affect audio quality
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Dust-Free Environment Creation
              </h4>
              <p className="text-gray-600">
                Specialized cleaning techniques to eliminate dust and particles that could interfere with equipment
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-violet-100 rounded-full">
              <span className="text-violet-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Audio Quality Verification
              </h4>
              <p className="text-gray-600">
                Final inspection ensuring all cleaning maintains optimal acoustic conditions and equipment functionality
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Studio Cleaning Comparison */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Commercial Cleaning vs. Professional Studio Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "No acoustic environment awareness",
                "Generic equipment cleaning methods",
                "Risk of dust redistribution",
                "No audio equipment expertise",
                "Potential sound quality impact",
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
              Professional Studio Care
            </h4>
            <div className="space-y-3">
              {[
                "Acoustic integrity preservation protocols",
                "Specialized audio equipment protection",
                "Dust-free environment maintenance",
                "Audio production expertise understanding",
                "Sound quality enhancement focus",
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
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Studio Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Control room and mixing console care",
            "Live room and recording space cleaning",
            "Vocal booth and isolation room maintenance",
            "Equipment rack and cable management cleaning",
            "Acoustic panel and soundproofing care",
            "Instrument storage area organization",
            "Studio lounge and client area cleaning",
            "Technical equipment ventilation maintenance",
            "Floor care for optimal acoustics",
            "Window and glass surface cleaning",
            "Air filtration system maintenance",
            "Emergency cleaning and session preparation",
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
          Why Professional Studio Cleaning Enhances Audio Excellence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Sound Quality
            </h4>
            <p className="text-gray-600 text-sm">
              Pristine environments ensure optimal acoustic conditions for professional recording
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Equipment Protection
            </h4>
            <p className="text-gray-600 text-sm">
              Specialized cleaning protects valuable audio equipment and extends lifespan
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Professional Image
            </h4>
            <p className="text-gray-600 text-sm">
              Immaculate studios enhance client confidence and professional reputation
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Studio Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Session Breaks</h4>
            <p className="text-gray-600 text-sm">
              Quick cleaning between recording sessions
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Off-Hours Service</h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning when studio is not in use
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Project Preparation</h4>
            <p className="text-gray-600 text-sm">
              Pre-session deep cleaning for important recordings
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <MusicalNoteIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Elevate Your Sound with Professional Studio Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your music studio deserves cleaning services that understand the critical 
          importance of acoustic integrity and equipment protection. Let our specialized 
          team maintain the pristine environment essential for professional audio excellence.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Studio Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service48;
