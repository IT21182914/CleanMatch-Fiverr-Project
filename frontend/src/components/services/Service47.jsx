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
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service47 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional University & College Campus Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Educational institutions require specialized cleaning services that support 
        learning environments while maintaining the highest standards of health and 
        safety. Our comprehensive campus cleaning services ensure every classroom, 
        dormitory, laboratory, and common area creates an optimal environment for 
        academic excellence. From lecture halls to student centers, we provide 
        thorough cleaning with education-focused protocols that support the diverse 
        needs of modern university and college communities.
      </p>

      {/* Campus Offer Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-full">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">
            Comprehensive Campus Care Excellence
          </h3>
        </div>
        <p className="text-blue-800 text-xl leading-relaxed">
          Professional university and college cleaning services for only{" "}
          <span className="font-bold text-3xl text-blue-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Create optimal learning environments for academic success.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-blue-50 to-indigo-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our university campus cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <AcademicCapIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Educational environment expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized knowledge of campus facilities and academic scheduling
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Laboratory and research facility care
            </h4>
            <p className="text-gray-600 text-base">
              Safe cleaning protocols for scientific and research environments
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              High-traffic area management
            </h4>
            <p className="text-gray-600 text-base">
              Efficient cleaning of busy campus areas with minimal disruption
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-600 rounded-full">
            <HeartIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Student health and safety priority
            </h4>
            <p className="text-gray-600 text-base">
              Health-focused cleaning that supports student wellbeing
            </p>
          </div>
        </div>
      </div>

      {/* Campus Facility Types Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Campus Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Classrooms & Lecture Halls</h4>
            <p className="text-gray-600 text-sm">
              Learning spaces, auditoriums, seminar rooms
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Laboratories</h4>
            <p className="text-gray-600 text-sm">
              Science labs, computer labs, research facilities
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Dormitories
            </h4>
            <p className="text-gray-600 text-sm">
              Student housing, common areas, residential facilities
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Administrative Buildings
            </h4>
            <p className="text-gray-600 text-sm">
              Offices, libraries, student services, admissions
            </p>
          </div>
        </div>
      </div>

      {/* Campus Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Comprehensive Campus Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Academic Schedule Coordination
              </h4>
              <p className="text-gray-600">
                Careful planning with academic calendars to minimize disruption to classes and campus activities
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Specialized Facility Cleaning
              </h4>
              <p className="text-gray-600">
                Tailored cleaning approaches for laboratories, classrooms, dormitories, and common areas
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Health & Safety Focus
              </h4>
              <p className="text-gray-600">
                Thorough sanitization and cleaning protocols that support student and faculty health
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-600/10 rounded-full">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Campus-wide Quality Assurance
              </h4>
              <p className="text-gray-600">
                Comprehensive inspection ensuring all campus areas meet educational facility standards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Campus Cleaning Comparison */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Commercial Cleaning vs. Campus Educational Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Generic office cleaning approach",
                "No academic schedule consideration",
                "Limited laboratory cleaning knowledge",
                "No student health focus",
                "Basic facility maintenance only",
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
              Professional Campus Care
            </h4>
            <div className="space-y-3">
              {[
                "Educational environment specialized protocols",
                "Academic calendar and schedule coordination",
                "Laboratory and research facility expertise",
                "Student health and safety prioritization",
                "Comprehensive campus facility maintenance",
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
      </div>

      {/* What's Included */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Campus Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Classroom and lecture hall deep cleaning",
            "Laboratory and research facility specialized care",
            "Dormitory and residential area maintenance",
            "Library and study space professional cleaning",
            "Student center and common area care",
            "Administrative office cleaning services",
            "Cafeteria and dining facility sanitization",
            "Gymnasium and recreational facility maintenance",
            "Restroom maintenance and supply management",
            "High-traffic corridor and stairway cleaning",
            "Campus event cleanup and preparation",
            "Emergency cleaning and incident response",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-blue-500 rounded-full">
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
          Why Professional Campus Cleaning Enhances Academic Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Learning Environment
            </h4>
            <p className="text-gray-600 text-sm">
              Clean, healthy facilities support optimal learning and academic performance
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Student Wellbeing
            </h4>
            <p className="text-gray-600 text-sm">
              Proper cleaning and sanitization promote student health and campus safety
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Campus Pride
            </h4>
            <p className="text-gray-600 text-sm">
              Well-maintained facilities enhance institutional reputation and campus pride
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Campus Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Academic Year Service</h4>
            <p className="text-gray-600 text-sm">
              Regular maintenance throughout the academic calendar
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Break Period Deep Clean</h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning during semester breaks
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Event Support</h4>
            <p className="text-gray-600 text-sm">
              Special cleaning for campus events and activities
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Enhance Academic Excellence with Professional Campus Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your educational institution deserves cleaning services that understand 
          the unique needs of campus life. Let our specialized team create optimal 
          learning environments that support student success and campus pride.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Campus Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service47;
