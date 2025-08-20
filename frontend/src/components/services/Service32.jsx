import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  TrophyIcon,
  StarIcon,
  CalendarDaysIcon,
  BeakerIcon,
  KeyIcon,
  HeartIcon,
  CursorArrowRaysIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service32 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Hospitality Excellence Through Pristine Cleanliness
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your hotel guests expect nothing less than perfection. Our comprehensive
        hotel cleaning services ensure every room, lobby, and facility maintains
        the highest standards of cleanliness and presentation. From luxury
        suites to busy common areas, we deliver the meticulous attention to
        detail that keeps guests returning and reviews glowing.
      </p>

      {/* Hospitality Offer Banner */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-rose-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rose-500 rounded-full">
            <BuildingOffice2Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-rose-900">
            Five-Star Hotel Standards
          </h3>
        </div>
        <p className="text-rose-800 text-xl leading-relaxed">
          Professional hotel cleaning services for only{" "}
          <span className="font-bold text-3xl text-rose-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Hospitality-grade cleanliness for exceptional guest experiences.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-rose-50 to-pink-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our hotel cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-rose-500 rounded-full">
            <StarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Five-star hospitality standards
            </h4>
            <p className="text-gray-600 text-base">
              Luxury hotel-grade cleaning protocols for exceptional guest
              satisfaction
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-pink-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              24/7 housekeeping support
            </h4>
            <p className="text-gray-600 text-base">
              Round-the-clock service for continuous guest turnover and needs
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <UserGroupIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Trained hospitality staff
            </h4>
            <p className="text-gray-600 text-base">
              Professional teams with hotel industry experience and guest
              service skills
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-500 rounded-full">
            <HeartIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Guest experience focus
            </h4>
            <p className="text-gray-600 text-base">
              Every detail designed to enhance guest comfort and satisfaction
            </p>
          </div>
        </div>
      </div>

      {/* Hotel Areas Section */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Hotel Areas We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-rose-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <KeyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Guest Rooms</h4>
            <p className="text-gray-600 text-sm">
              Rooms, suites, bathrooms, and private balconies
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOffice2Icon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Public Areas</h4>
            <p className="text-gray-600 text-sm">
              Lobbies, lounges, corridors, and reception areas
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Dining & Events
            </h4>
            <p className="text-gray-600 text-sm">
              Restaurants, bars, banquet halls, conference rooms
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Amenity Areas</h4>
            <p className="text-gray-600 text-sm">
              Spas, fitness centers, pools, and recreational facilities
            </p>
          </div>
        </div>
      </div>

      {/* Hotel Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Hotel Cleaning Excellence Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-rose-100 rounded-full">
              <span className="text-rose-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Guest Experience Assessment
              </h4>
              <p className="text-gray-600">
                Evaluation of all guest touchpoints and areas to ensure premium
                hospitality standards
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-pink-100 rounded-full">
              <span className="text-pink-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Room Turnover Excellence
              </h4>
              <p className="text-gray-600">
                Efficient and thorough room cleaning between guests with luxury
                attention to detail
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Public Area Maintenance
              </h4>
              <p className="text-gray-600">
                Continuous cleaning and maintenance of all public spaces for
                pristine presentation
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Quality Control & Guest Satisfaction
              </h4>
              <p className="text-gray-600">
                Rigorous inspection and quality assurance to exceed guest
                expectations every time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Hotel Comparison */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Standard Cleaning vs. Hotel Service Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Cleaning Approach
            </h4>
            <div className="space-y-3">
              {[
                "Basic room cleaning protocols",
                "Limited hospitality training",
                "Standard commercial products",
                "No guest service awareness",
                "Minimal attention to presentation details",
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
              Hotel Service Excellence
            </h4>
            <div className="space-y-3">
              {[
                "Five-star hospitality cleaning protocols",
                "Comprehensive guest service training",
                "Premium hospitality-grade products",
                "Guest experience-focused approach",
                "Luxury attention to every detail",
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
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Hotel Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Guest room deep cleaning and turnover",
            "Luxury bathroom sanitization and restocking",
            "Linen and towel service management",
            "Public area continuous maintenance",
            "Lobby and reception area excellence",
            "Restaurant and dining area cleaning",
            "Conference and event space preparation",
            "Spa and wellness facility maintenance",
            "Pool and recreational area service",
            "Guest amenity restocking and organization",
            "Emergency spill and incident response",
            "Guest satisfaction quality assurance",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-rose-500 rounded-full">
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
          Why Hotel Cleaning Excellence Drives Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl">
            <div className="p-3 bg-rose-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Enhanced Guest Satisfaction
            </h4>
            <p className="text-gray-600 text-sm">
              Pristine cleanliness directly impacts guest reviews, ratings, and
              return visits
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Competitive Advantage
            </h4>
            <p className="text-gray-600 text-sm">
              Superior cleanliness standards differentiate your hotel from
              competitors
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CursorArrowRaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Operational Efficiency
            </h4>
            <p className="text-gray-600 text-sm">
              Professional service reduces complaints and increases operational
              smoothness
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-rose-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Hotel Service Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Daily Housekeeping
            </h4>
            <p className="text-gray-600 text-sm">
              Continuous room turnover and public area maintenance
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Weekly Deep Clean
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive deep cleaning of all hotel areas
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-rose-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Event Support</h4>
            <p className="text-gray-600 text-sm">
              Special event setup and post-event cleaning
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
            Elevate Your Hotel's Guest Experience
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Create unforgettable stays with our five-star hotel cleaning services.
          Your guests deserve perfection, and we deliver the hospitality
          excellence that turns first-time visitors into loyal customers.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Hotel Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service32;
