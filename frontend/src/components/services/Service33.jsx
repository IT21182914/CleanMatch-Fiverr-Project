import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  TrophyIcon,
  StarIcon,
  CalendarDaysIcon,
  BeakerIcon,
  BookOpenIcon,
  UserGroupIcon,
  LightBulbIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service33 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Creating Safe Learning Environments Every Day
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Educational institutions require specialized cleaning that prioritizes
        student health, safety, and conducive learning environments. Our
        comprehensive school and university cleaning services ensure pristine
        classrooms, sanitized common areas, and healthy facilities that support
        academic excellence while meeting strict health department standards and
        educational facility requirements.
      </p>

      {/* Educational Offer Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-full">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">
            Educational Excellence Standards
          </h3>
        </div>
        <p className="text-blue-800 text-xl leading-relaxed">
          Professional educational facility cleaning for only{" "}
          <span className="font-bold text-3xl text-blue-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Safe, healthy learning environments for student success.
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
        Why choose our educational facility cleaning?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Health department compliance
            </h4>
            <p className="text-gray-600 text-base">
              Meeting all educational facility health and safety regulations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <UserGroupIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Child-safe cleaning products
            </h4>
            <p className="text-gray-600 text-base">
              Non-toxic, eco-friendly solutions safe for students of all ages
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Flexible scheduling options
            </h4>
            <p className="text-gray-600 text-base">
              After-hours and weekend cleaning to minimize disruption
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <HeartIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Student wellness focus
            </h4>
            <p className="text-gray-600 text-base">
              Creating healthy environments that support learning and growth
            </p>
          </div>
        </div>
      </div>

      {/* Educational Areas Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Educational Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpenIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Classrooms</h4>
            <p className="text-gray-600 text-sm">
              Learning spaces, lecture halls, seminar rooms
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Common Areas</h4>
            <p className="text-gray-600 text-sm">
              Cafeterias, lobbies, hallways, student lounges
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Specialized Labs
            </h4>
            <p className="text-gray-600 text-sm">
              Science labs, computer rooms, research facilities
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Athletic Facilities
            </h4>
            <p className="text-gray-600 text-sm">
              Gymnasiums, locker rooms, sports complexes
            </p>
          </div>
        </div>
      </div>

      {/* Educational Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Educational Facility Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Health & Safety Assessment
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of all educational spaces with focus on
                student health and safety requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Sanitization & Disinfection
              </h4>
              <p className="text-gray-600">
                Thorough sanitizing of high-touch surfaces, desks, and common
                areas using child-safe products
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-cyan-100 rounded-full">
              <span className="text-cyan-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Specialized Area Cleaning
              </h4>
              <p className="text-gray-600">
                Deep cleaning of labs, cafeterias, restrooms, and athletic
                facilities with appropriate protocols
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Quality Assurance & Documentation
              </h4>
              <p className="text-gray-600">
                Complete inspection and health department compliance
                documentation for peace of mind
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Educational Comparison */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          General Cleaning vs. Educational Facility Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              General Cleaning Approach
            </h4>
            <div className="space-y-3">
              {[
                "Standard commercial cleaning products",
                "Basic sanitization protocols",
                "Limited health regulation knowledge",
                "No child safety considerations",
                "Generic cleaning schedules",
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
              Educational Facility Excellence
            </h4>
            <div className="space-y-3">
              {[
                "Child-safe, non-toxic cleaning products",
                "Enhanced sanitization and disinfection",
                "Full health department compliance",
                "Student wellness-focused approach",
                "Flexible educational scheduling",
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Educational Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Comprehensive classroom cleaning and sanitization",
            "High-touch surface disinfection protocols",
            "Child-safe, non-toxic cleaning products only",
            "Cafeteria and food service area deep cleaning",
            "Restroom sanitization and supply restocking",
            "Laboratory and specialized room cleaning",
            "Athletic facility and locker room service",
            "Floor care including stripping and waxing",
            "Window and glass surface cleaning",
            "Trash removal and recycling management",
            "Health department compliance documentation",
            "Emergency cleaning response services",
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
          Why Educational Cleaning Excellence Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Student Health & Safety
            </h4>
            <p className="text-gray-600 text-sm">
              Clean environments reduce illness spread and create safer learning
              spaces for all students
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <LightBulbIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Enhanced Learning Environment
            </h4>
            <p className="text-gray-600 text-sm">
              Clean, organized spaces improve focus, concentration, and overall
              academic performance
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-purple-50 rounded-xl">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Regulatory Compliance
            </h4>
            <p className="text-gray-600 text-sm">
              Meet all health department standards and educational facility
              regulations with confidence
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Educational Facility Service Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Daily Maintenance
            </h4>
            <p className="text-gray-600 text-sm">
              After-hours classroom and common area cleaning
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Deep Cleaning</h4>
            <p className="text-gray-600 text-sm">
              Weekly comprehensive sanitization service
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Holiday Preparation
            </h4>
            <p className="text-gray-600 text-sm">
              Summer and break period deep cleaning
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
            Invest in Student Success Through Clean Learning Spaces
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Give your students the healthy, safe learning environment they
          deserve. Our educational cleaning services create the foundation for
          academic excellence through professional facility care and student
          wellness focus.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Educational Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service33;
