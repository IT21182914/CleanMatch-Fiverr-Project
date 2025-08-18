import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service1 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Always tired of cleaning after a long day?
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Let Simorgh take care of your home so you can come back to a space that
        feels fresh, organized, and welcoming. Whether it's your apartment or
        house, our professional cleaning team makes sure every corner shines.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500 rounded-full">
            <FireIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-900">
            Limited Time Offer
          </h3>
        </div>
        <p className="text-green-800 text-xl leading-relaxed">
          Enjoy our expert cleaning service for only{" "}
          <span className="font-bold text-3xl text-green-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . That's professional-quality cleaning at half the price.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-blue-50 to-cyan-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose Simorgh for your home cleaning?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Skilled cleaners
            </h4>
            <p className="text-gray-600 text-base">
              trained to handle every detail of your home
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Consistent quality
            </h4>
            <p className="text-gray-600 text-base">
              and reliability every time you book
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Flexible scheduling
            </h4>
            <p className="text-gray-600 text-base">to fit your lifestyle</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Premium service
            </h4>
            <p className="text-gray-600 text-base">
              that exceeds expectations every time
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
            Book Now and Experience the Difference
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Say goodbye to stress and hours of cleaning — simply book online and
          enjoy a spotless home without lifting a finger.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Your Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service1;
