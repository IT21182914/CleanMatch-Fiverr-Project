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
  MusicalNoteIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service42 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Elite Entertainment Venue & Concert Hall Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Entertainment venues and concert halls create magical experiences that
        bring people together through music, theater, and performance. Our
        specialized venue cleaning services ensure every seat, stage, and
        backstage area maintains the pristine condition that enhances every
        performance. From intimate theaters to grand concert halls, we provide
        comprehensive cleaning that preserves venue acoustics, protects
        expensive equipment, and creates the perfect atmosphere for
        unforgettable entertainment experiences.
      </p>

      {/* Entertainment Offer Banner */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-500 rounded-full">
            <MusicalNoteIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-pink-900">
            Professional Entertainment Venue Care
          </h3>
        </div>
        <p className="text-pink-800 text-xl leading-relaxed">
          Professional entertainment venue cleaning for only{" "}
          <span className="font-bold text-3xl text-pink-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Create the perfect atmosphere for every performance.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-pink-50 to-purple-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our entertainment venue cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-pink-500 rounded-full">
            <MicrophoneIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Acoustic environment preservation
            </h4>
            <p className="text-gray-600 text-base">
              Specialized cleaning techniques that maintain optimal sound
              quality
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Equipment-safe cleaning protocols
            </h4>
            <p className="text-gray-600 text-base">
              Expert care for sensitive audio, lighting, and stage equipment
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-violet-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Show schedule coordination
            </h4>
            <p className="text-gray-600 text-base">
              Flexible cleaning schedules that work around performances and
              rehearsals
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <StarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              VIP and backstage expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized care for artist areas, green rooms, and premium spaces
            </p>
          </div>
        </div>
      </div>

      {/* Venue Types Section */}
      <div className="bg-gradient-to-r from-pink-50 to-violet-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Entertainment Venues We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Concert Halls</h4>
            <p className="text-gray-600 text-sm">
              Symphony halls, opera houses, music venues
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MicrophoneIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Theaters</h4>
            <p className="text-gray-600 text-sm">
              Playhouses, drama theaters, performing arts centers
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Event Venues</h4>
            <p className="text-gray-600 text-sm">
              Conference halls, banquet facilities, event centers
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-indigo-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Specialty Venues
            </h4>
            <p className="text-gray-600 text-sm">
              Comedy clubs, nightclubs, intimate performance spaces
            </p>
          </div>
        </div>
      </div>

      {/* Entertainment Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Performance-Focused Venue Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-pink-100 rounded-full">
              <span className="text-pink-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Pre-Show Preparation & Setup
              </h4>
              <p className="text-gray-600">
                Comprehensive venue preparation including seating areas, stage
                cleaning, and equipment protection
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Intermission Quick Maintenance
              </h4>
              <p className="text-gray-600">
                Rapid cleaning and restocking services during show intermissions
                and breaks
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-violet-100 rounded-full">
              <span className="text-violet-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Post-Performance Deep Clean
              </h4>
              <p className="text-gray-600">
                Thorough cleaning after events including audience areas,
                backstage, and equipment sanitization
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Venue Restoration & Final Prep
              </h4>
              <p className="text-gray-600">
                Complete venue restoration and preparation for the next
                performance with quality assurance check
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Entertainment Cleaning Comparison */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Basic Cleaning vs. Entertainment Venue Expertise
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Event Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Basic cleaning without performance considerations",
                "No equipment protection knowledge",
                "Limited understanding of acoustic environments",
                "Generic approach to all venue types",
                "No show schedule coordination",
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
              Professional Entertainment Care
            </h4>
            <div className="space-y-3">
              {[
                "Performance-optimized cleaning protocols",
                "Expert audio and lighting equipment protection",
                "Acoustic environment preservation expertise",
                "Venue-specific cleaning approaches and techniques",
                "Show schedule and production coordination",
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
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Entertainment Venue Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Audience seating and theater area deep cleaning",
            "Stage and performance area specialized maintenance",
            "Backstage and artist area professional cleaning",
            "Audio and lighting equipment protection cleaning",
            "VIP and premium seating area care",
            "Lobby and concession area maintenance",
            "Restroom and public facility deep cleaning",
            "Dressing room and green room services",
            "Emergency cleaning during intermissions",
            "Equipment-safe sanitization protocols",
            "Acoustic environment preservation care",
            "Post-event restoration and setup services",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-pink-500 rounded-full">
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
          Why Professional Entertainment Venue Cleaning Enhances Every
          Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Enhanced Experience
            </h4>
            <p className="text-gray-600 text-sm">
              Pristine venues create the perfect atmosphere for memorable
              performances and audience enjoyment
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Equipment Protection
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleaning protects valuable audio, lighting, and stage
              equipment investments
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl">
            <div className="p-3 bg-violet-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Professional Reputation
            </h4>
            <p className="text-gray-600 text-sm">
              Immaculate venues attract top performers and build lasting
              reputation for excellence
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Entertainment Venue Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Pre-Show Preparation
            </h4>
            <p className="text-gray-600 text-sm">
              Complete venue preparation before performances
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Intermission Service
            </h4>
            <p className="text-gray-600 text-sm">
              Quick maintenance during show breaks
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-pink-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Post-Event Restoration
            </h4>
            <p className="text-gray-600 text-sm">
              Complete cleaning and venue restoration after shows
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
            Create Perfect Performances with Professional Venue Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Every great performance deserves a perfect venue. Let our specialized
          entertainment cleaning service maintain the pristine environment that
          enhances every show and creates unforgettable experiences for artists
          and audiences.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Entertainment Venue Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service42;
