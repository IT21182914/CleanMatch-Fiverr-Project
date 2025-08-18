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
  HomeIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service20 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Your Winter Garden Paradise Awaits
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Transform your greenhouse and winter garden into a thriving botanical
        sanctuary that defies the seasons. Our specialized winter garden
        maintenance team combines horticultural expertise with meticulous
        cleaning services to create the perfect environment where your plants
        flourish year-round, bringing life and beauty to even the coldest
        months.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500 rounded-full">
            <SunIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900">
            Year-Round Garden Care
          </h3>
        </div>
        <p className="text-emerald-800 text-xl leading-relaxed">
          Professional winter garden maintenance for only{" "}
          <span className="font-bold text-3xl text-emerald-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Expert care that keeps your botanical paradise thriving through
          every season.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-emerald-50 to-green-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why trust us with your winter garden sanctuary?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Botanical Expertise
            </h4>
            <p className="text-gray-600 text-base">
              Trained in plant care and greenhouse maintenance best practices
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Climate Control
            </h4>
            <p className="text-gray-600 text-base">
              Expert humidity and temperature management for optimal plant
              health
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Crystal Clear Glass
            </h4>
            <p className="text-gray-600 text-base">
              Specialized glass cleaning for maximum light penetration
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Pest Prevention
            </h4>
            <p className="text-gray-600 text-base">
              Integrated pest management to protect your plant investment
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete Winter Garden Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <SunIcon className="h-5 w-5 text-emerald-500" />
              Plant Health & Care
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Regular watering and feeding schedules</li>
              <li>• Pruning and deadheading maintenance</li>
              <li>• Soil testing and amendment</li>
              <li>• Plant health monitoring and assessment</li>
              <li>• Seasonal plant rotation and care</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-green-500" />
              Environment Maintenance
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Glass panel cleaning inside and out</li>
              <li>• Ventilation system maintenance</li>
              <li>• Humidity and temperature optimization</li>
              <li>• Structural cleaning and upkeep</li>
              <li>• Drainage system maintenance</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-lg mb-3 text-center">
            Garden Types We Specialize In
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Greenhouse Gardens
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Conservatories
            </span>
            <span className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full">
              Sunrooms
            </span>
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
              Indoor Gardens
            </span>
            <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
              Atriums
            </span>
          </div>
        </div>
      </div>

      {/* Seasonal Care Calendar */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-green-900 mb-4 text-center flex items-center justify-center gap-2">
          <SunIcon className="h-6 w-6" />
          Seasonal Care Calendar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl mb-2">🍂</div>
            <h4 className="font-semibold text-green-900 mb-2">
              Fall Preparation
            </h4>
            <p className="text-green-800 text-sm">
              Deep cleaning, plant transition, and winter setup for optimal
              growing conditions
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl mb-2">❄️</div>
            <h4 className="font-semibold text-green-900 mb-2">
              Winter Maintenance
            </h4>
            <p className="text-green-800 text-sm">
              Regular care, climate monitoring, and pest prevention during the
              coldest months
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl mb-2">🌸</div>
            <h4 className="font-semibold text-green-900 mb-2">
              Spring Revival
            </h4>
            <p className="text-green-800 text-sm">
              Intensive care and preparation for the growing season ahead
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl mb-2">☀️</div>
            <h4 className="font-semibold text-green-900 mb-2">
              Summer Optimization
            </h4>
            <p className="text-green-800 text-sm">
              Peak maintenance and care to maximize your garden's summer
              potential
            </p>
          </div>
        </div>
      </div>

      {/* Plant Health Focus */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Comprehensive Plant Health Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <BeakerIcon className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Environmental Control
              </h4>
              <p className="text-blue-800 text-sm">
                Precise humidity, temperature, and air circulation management
                for optimal plant health
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Light Optimization
              </h4>
              <p className="text-blue-800 text-sm">
                Crystal-clear glass maintenance to ensure maximum natural light
                penetration
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Disease Prevention
              </h4>
              <p className="text-blue-800 text-sm">
                Regular monitoring and preventive measures to maintain plant
                health year-round
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <StarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Ready to Create Your Winter Oasis?
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Transform your winter garden into a thriving botanical sanctuary that
          brings joy and life to your home throughout every season of the year.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Garden Service
        </button>
      </div>
    </div>
  );
};

export default Service20;
