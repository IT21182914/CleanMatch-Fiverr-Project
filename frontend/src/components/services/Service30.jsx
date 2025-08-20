import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  BoltIcon,
  TrophyIcon,
  StarIcon,
  CalendarDaysIcon,
  BeakerIcon,
  LightBulbIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service30 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Emergency Cleaning When You Need It Most
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Life doesn't wait for convenient moments, and neither should
        professional cleaning help. Our 24/7 emergency cleaning services provide
        immediate response to urgent situations, unexpected events, and
        last-minute needs with the same quality and attention to detail you'd
        expect from scheduled services, available around the clock when
        emergencies strike.
      </p>

      {/* Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500 rounded-full">
            <ExclamationTriangleIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-red-900">
            24/7 Emergency Response
          </h3>
        </div>
        <p className="text-red-800 text-xl leading-relaxed">
          Immediate emergency cleaning services for only{" "}
          <span className="font-bold text-3xl text-red-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Professional help available 24 hours a day, 7 days a week.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-red-50 to-orange-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our emergency cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <BoltIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Rapid response guarantee
            </h4>
            <p className="text-gray-600 text-base">
              Professional team on-site within 2 hours of your emergency call
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <PhoneIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              24/7 availability
            </h4>
            <p className="text-gray-600 text-base">
              Round-the-clock service for weekends, holidays, and late nights
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <HandRaisedIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Specialized crisis cleaning
            </h4>
            <p className="text-gray-600 text-base">
              Expert handling of floods, spills, accidents, and urgent
              situations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Full insurance coverage
            </h4>
            <p className="text-gray-600 text-base">
              Complete protection and liability coverage for emergency
              situations
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Situations Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Emergency Situations We Handle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Water Damage</h4>
            <p className="text-gray-600 text-sm">
              Floods, leaks, burst pipes, and water emergencies
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FireIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fire & Smoke</h4>
            <p className="text-gray-600 text-sm">
              Fire damage, smoke odors, and soot cleanup
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Spills & Accidents
            </h4>
            <p className="text-gray-600 text-sm">
              Chemical spills, accidents, and hazardous cleanup
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Last-Minute Events
            </h4>
            <p className="text-gray-600 text-sm">
              Unexpected guests, urgent events, and time-critical cleaning
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Response Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Emergency Response Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-red-100 rounded-full">
              <span className="text-red-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Immediate Response & Assessment
              </h4>
              <p className="text-gray-600">
                24/7 hotline receives your call and dispatches the nearest
                emergency team within minutes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-orange-100 rounded-full">
              <span className="text-orange-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Rapid On-Site Arrival
              </h4>
              <p className="text-gray-600">
                Professional emergency team arrives within 2 hours with
                specialized equipment and supplies
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Crisis Containment & Cleanup
              </h4>
              <p className="text-gray-600">
                Immediate action to contain damage and begin professional
                emergency cleaning procedures
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Complete Restoration & Follow-up
              </h4>
              <p className="text-gray-600">
                Thorough cleaning and restoration with follow-up services to
                ensure complete recovery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Regular vs Emergency Comparison */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Regular Cleaning vs. Emergency Response
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Regular Cleaning Limitations
            </h4>
            <div className="space-y-3">
              {[
                "Scheduled appointments only",
                "Business hours availability",
                "Standard cleaning protocols",
                "No crisis management training",
                "Limited emergency equipment",
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
              Emergency Service Benefits
            </h4>
            <div className="space-y-3">
              {[
                "24/7 immediate availability",
                "Round-the-clock emergency response",
                "Specialized crisis cleaning protocols",
                "Emergency-trained professional teams",
                "Advanced emergency cleaning equipment",
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
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Emergency Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "24/7 emergency hotline and dispatch",
            "Rapid 2-hour response guarantee",
            "Specialized emergency cleaning equipment",
            "Crisis containment and damage control",
            "Professional hazmat and safety protocols",
            "Water damage and flood cleanup services",
            "Fire and smoke damage restoration",
            "Chemical spill and accident cleanup",
            "Last-minute event preparation services",
            "Emergency disinfection and sanitization",
            "Insurance documentation and reporting",
            "Follow-up services and quality assurance",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-red-500 rounded-full">
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
          Why Emergency Cleaning Services Matter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BoltIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Immediate Action
            </h4>
            <p className="text-gray-600 text-sm">
              Fast response prevents minor problems from becoming major
              disasters and costly damage
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <LightBulbIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Expert Crisis Management
            </h4>
            <p className="text-gray-600 text-sm">
              Professional teams trained specifically in emergency situations
              and crisis response protocols
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-red-50 rounded-xl">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">Peace of Mind</h4>
            <p className="text-gray-600 text-sm">
              Know that professional help is always available when unexpected
              cleaning emergencies arise
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Response Times */}
      <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Emergency Response Timeframes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BoltIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Critical Emergency
            </h4>
            <p className="text-gray-600 text-sm">
              Within 1 hour for severe situations
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Standard Emergency
            </h4>
            <p className="text-gray-600 text-sm">
              Within 2 hours for urgent cleaning needs
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Last-Minute Service
            </h4>
            <p className="text-gray-600 text-sm">
              Same-day service for urgent events
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
            Emergency Help Is Just One Call Away
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't let cleaning emergencies overwhelm you. Our 24/7 emergency
          response team is standing by to handle any crisis with professional
          expertise and rapid response when you need it most.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Call Emergency Service Now
        </button>
      </div>
    </div>
  );
};

export default Service30;
