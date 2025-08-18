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
  HeartIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service22 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Home is Where Clean Begins
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your home should be your sanctuary—a place where you can relax, recharge, 
        and create memories with loved ones. Our residential cleaning service brings 
        professional-quality care to every corner of your living space, from cozy 
        apartments to spacious family homes, ensuring your personal haven always 
        feels fresh, welcoming, and perfectly maintained.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-rose-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rose-500 rounded-full">
            <HomeIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-rose-900">
            Complete Home Care
          </h3>
        </div>
        <p className="text-rose-800 text-xl leading-relaxed">
          Professional residential cleaning for only{" "}
          <span className="font-bold text-3xl text-rose-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Transform your living space into the perfect home sanctuary you deserve.
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
        Why families choose our residential care?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-rose-500 rounded-full">
            <HeartIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Family-Focused Care
            </h4>
            <p className="text-gray-600 text-base">
              Understanding of family life and child-safe cleaning practices
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-pink-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Trusted Professionals
            </h4>
            <p className="text-gray-600 text-base">
              Background-checked team members you can trust in your home
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Flexible Scheduling
            </h4>
            <p className="text-gray-600 text-base">
              Service times that work around your family's busy schedule
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-indigo-500 rounded-full">
            <TrophyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Consistent Quality
            </h4>
            <p className="text-gray-600 text-base">
              Same high standards every visit, every room, every time
            </p>
          </div>
        </div>
      </div>

      {/* Additional Service Details */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete Residential Cleaning Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-rose-500" />
              Living Areas & Bedrooms
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Dusting all surfaces and furniture</li>
              <li>• Vacuuming carpets and rugs</li>
              <li>• Mopping hard floors thoroughly</li>
              <li>• Cleaning mirrors and glass surfaces</li>
              <li>• Organizing and tidying personal spaces</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-pink-500" />
              Kitchen & Bathroom Focus
            </h4>
            <ul className="text-gray-600 space-y-2 ml-7">
              <li>• Deep kitchen cleaning and sanitization</li>
              <li>• Bathroom disinfection and polishing</li>
              <li>• Appliance cleaning inside and out</li>
              <li>• Tile and grout restoration</li>
              <li>• Fixture polishing and maintenance</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 text-lg mb-3 text-center">
            Home Types We Service
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full">Single Family Homes</span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">Apartments</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Condominiums</span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Townhouses</span>
            <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full">Lofts & Studios</span>
          </div>
        </div>
      </div>

      {/* Family Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center flex items-center justify-center gap-2">
          <HeartIcon className="h-6 w-6" />
          Made for Family Life
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">
              <ShieldCheckIcon className="h-10 w-10 text-blue-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Child-Safe Products</h4>
            <p className="text-blue-800 text-sm">Non-toxic, family-friendly cleaning solutions safe around children and pets</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">
              <HomeIcon className="h-10 w-10 text-blue-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Respect Your Space</h4>
            <p className="text-blue-800 text-sm">Careful attention to personal belongings and family spaces</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">
              <ClockIcon className="h-10 w-10 text-blue-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Time for Family</h4>
            <p className="text-blue-800 text-sm">More quality time with loved ones instead of household chores</p>
          </div>
        </div>
      </div>

      {/* Service Frequency Options */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-green-900 mb-6 text-center">
          Cleaning Schedule That Works for You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <CalendarDaysIcon className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Regular Service</h4>
              <p className="text-green-800 text-sm">Weekly, bi-weekly, or monthly cleaning schedules to maintain your home consistently</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Special Occasions</h4>
              <p className="text-green-800 text-sm">One-time deep cleaning for holidays, parties, or when you need extra help</p>
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
            Ready to Come Home to Clean?
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Let us handle the cleaning so you can focus on what matters most—enjoying 
          your beautifully maintained home with family and friends.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Home Cleaning
        </button>
      </div>
    </div>
  );
};

export default Service22;
