import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  KeyIcon,
  TrophyIcon,
  StarIcon,
  HomeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service18 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Hospitality Excellence at Every Level
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your hotel's reputation depends on immaculate cleanliness and
        exceptional guest experiences. Our professional hospitality cleaning
        team understands the unique demands of the hotel industry, delivering
        consistent, high-quality service that exceeds guest expectations and
        maintains your establishment's prestigious reputation.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500 rounded-full">
            <KeyIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900">
            Premium Hotel Service
          </h3>
        </div>
        <p className="text-amber-800 text-xl leading-relaxed">
          Professional hotel cleaning services for only{" "}
          <span className="font-bold text-3xl text-amber-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Hospitality-grade cleaning that ensures 5-star guest satisfaction.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-amber-50 to-yellow-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why hotels trust our hospitality expertise?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-amber-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Hotel Standards
            </h4>
            <p className="text-gray-600 text-base">
              Trained in hospitality industry cleaning protocols and guest
              expectations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              24/7 Availability
            </h4>
            <p className="text-gray-600 text-base">
              Round-the-clock service to match your hotel's operational needs
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Guest Focus
            </h4>
            <p className="text-gray-600 text-base">
              Understanding of guest privacy and minimal disruption protocols
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <TrophyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Quality Assurance
            </h4>
            <p className="text-gray-600 text-base">
              Rigorous quality checks to maintain your hotel's reputation
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete Hotel Cleaning Solutions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <KeyIcon className="h-5 w-5 text-amber-500" />
              Guest Room Services
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Room turnover and preparation</li>
              <li>• Bathroom deep sanitization</li>
              <li>• Bed making and linen changes</li>
              <li>• Carpet vacuuming and spot cleaning</li>
              <li>• Amenity restocking and arrangement</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-blue-500" />
              Common Areas & Facilities
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Lobby and reception area maintenance</li>
              <li>• Restaurant and bar cleaning</li>
              <li>• Conference room preparation</li>
              <li>• Fitness center and pool areas</li>
              <li>• Elevator and hallway upkeep</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-lg mb-3 text-center">
            Hotel Types We Service
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              Luxury Hotels
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              Business Hotels
            </span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              Boutique Properties
            </span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
              Resort Hotels
            </span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
              Extended Stay
            </span>
          </div>
        </div>
      </div>

      {/* Guest Satisfaction Focus */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center flex items-center justify-center gap-2">
          <StarIcon className="h-6 w-6" />
          Guest Satisfaction Guaranteed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🏨</div>
            <h4 className="font-semibold text-blue-900 mb-2">
              First Impressions
            </h4>
            <p className="text-blue-800 text-sm">
              Spotless lobbies and common areas that wow guests from arrival
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🛏️</div>
            <h4 className="font-semibold text-blue-900 mb-2">
              Room Perfection
            </h4>
            <p className="text-blue-800 text-sm">
              Every room cleaned to luxury standards with attention to detail
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h4 className="font-semibold text-blue-900 mb-2">5-Star Reviews</h4>
            <p className="text-blue-800 text-sm">
              Consistent cleanliness that generates positive guest feedback
            </p>
          </div>
        </div>
      </div>

      {/* Scheduling Options */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-green-900 mb-6 text-center">
          Flexible Service Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <CalendarDaysIcon className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">
                Daily Housekeeping
              </h4>
              <p className="text-green-800 text-sm">
                Regular daily cleaning schedules adapted to your occupancy rates
                and check-in/out times
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClockIcon className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">
                Emergency Response
              </h4>
              <p className="text-green-800 text-sm">
                Quick response cleaning for unexpected situations and
                last-minute guest requests
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
            Ready to Elevate Your Hotel's Standards?
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Partner with us to provide your guests with an exceptional hospitality
          experience built on pristine cleanliness and attention to detail.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Hotel Service
        </button>
      </div>
    </div>
  );
};

export default Service18;
