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
  BuildingLibraryIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service39 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Specialized Library & Archive Cleaning for Knowledge Preservation
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Libraries and archives house irreplaceable knowledge, historical
        documents, and cultural treasures that require specialized care. Our
        expert cleaning services understand the unique needs of these
        environments - from delicate manuscript handling to climate-controlled
        storage areas. We provide comprehensive cleaning that preserves your
        collections while maintaining the quiet, scholarly atmosphere that
        patrons expect for research, study, and discovery.
      </p>

      {/* Library Offer Banner */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-slate-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-500 rounded-full">
            <BuildingLibraryIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Professional Knowledge Institution Care
          </h3>
        </div>
        <p className="text-slate-800 text-xl leading-relaxed">
          Professional library cleaning services for only{" "}
          <span className="font-bold text-3xl text-slate-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Preserve knowledge while maintaining pristine learning environments.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-slate-50 to-blue-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our library cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-slate-500 rounded-full">
            <BookOpenIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Collection preservation expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized knowledge of delicate materials and proper handling
              techniques
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Quiet operation protocols
            </h4>
            <p className="text-gray-600 text-base">
              Minimal noise disruption to maintain peaceful study environments
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Archive-safe cleaning products
            </h4>
            <p className="text-gray-600 text-base">
              Non-damaging, acid-free solutions safe for books and documents
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-gray-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Climate control awareness
            </h4>
            <p className="text-gray-600 text-base">
              Understanding of temperature and humidity requirements for
              preservation
            </p>
          </div>
        </div>
      </div>

      {/* Library Types Section */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Knowledge Institutions We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingLibraryIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Public Libraries
            </h4>
            <p className="text-gray-600 text-sm">
              Community libraries, branch locations, reading rooms
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpenIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Academic Libraries
            </h4>
            <p className="text-gray-600 text-sm">
              University libraries, research facilities, study centers
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <KeyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Archives & Records
            </h4>
            <p className="text-gray-600 text-sm">
              Historical archives, government records, special collections
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Specialized Libraries
            </h4>
            <p className="text-gray-600 text-sm">
              Law libraries, medical libraries, corporate information centers
            </p>
          </div>
        </div>
      </div>

      {/* Library Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Preservation-Focused Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-slate-100 rounded-full">
              <span className="text-slate-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Collection Area Assessment
              </h4>
              <p className="text-gray-600">
                Careful evaluation of collection areas, reading spaces, and
                archive conditions before cleaning begins
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Gentle Dusting & Surface Care
              </h4>
              <p className="text-gray-600">
                Specialized dusting techniques for shelving, books, and delicate
                surfaces using archive-safe methods
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Reading Area & Public Space Cleaning
              </h4>
              <p className="text-gray-600">
                Thorough cleaning of study areas, reading rooms, and patron
                spaces while maintaining quiet operations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-gray-100 rounded-full">
              <span className="text-gray-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Climate & Environment Check
              </h4>
              <p className="text-gray-600">
                Final inspection ensuring proper environmental conditions and
                collection preservation standards are maintained
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Library Cleaning Comparison */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Regular Cleaning vs. Library Preservation Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Generic cleaning products and methods",
                "No collection preservation knowledge",
                "Loud equipment and disruptive operations",
                "No climate control considerations",
                "Basic dusting without material expertise",
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
              Professional Library Care
            </h4>
            <div className="space-y-3">
              {[
                "Archive-safe, preservation-focused cleaning methods",
                "Expert knowledge of collection materials and handling",
                "Quiet, non-disruptive cleaning operations",
                "Climate and environmental preservation awareness",
                "Specialized techniques for books and documents",
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
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Library Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Collection area gentle dusting and maintenance",
            "Reading room and study area deep cleaning",
            "Archive-safe surface cleaning and preservation care",
            "Computer and technology area sanitization",
            "Restroom maintenance and supply management",
            "Floor care appropriate for library environments",
            "Window cleaning for natural light optimization",
            "Entrance and lobby area presentation care",
            "Staff work area and office space cleaning",
            "Climate-controlled storage area maintenance",
            "Quiet operation protocols during all services",
            "Emergency cleaning and preservation response",
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
          Why Professional Library Cleaning Preserves Knowledge and Enhances
          Learning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpenIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Collection Preservation
            </h4>
            <p className="text-gray-600 text-sm">
              Proper cleaning techniques extend the life of books, documents,
              and historical materials
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Enhanced Learning Environment
            </h4>
            <p className="text-gray-600 text-sm">
              Clean, well-maintained spaces promote focus, research, and
              educational success
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-gray-50 rounded-xl">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Community Trust
            </h4>
            <p className="text-gray-600 text-sm">
              Professional maintenance builds patron confidence in your
              institution's care and professionalism
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Library Cleaning Schedules
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
              Daily or weekly cleaning during off-peak hours
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              After-Hours Deep Clean
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning when library is closed
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Special Collections
            </h4>
            <p className="text-gray-600 text-sm">
              Specialized care for rare books and archives
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <BuildingLibraryIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Preserve Knowledge with Professional Library Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your library is a gateway to knowledge and discovery. Let our
          specialized cleaning service maintain the pristine, scholarly
          environment that promotes learning while preserving your valuable
          collections for future generations.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Library Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service39;
