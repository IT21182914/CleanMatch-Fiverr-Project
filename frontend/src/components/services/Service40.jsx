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
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service40 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Automotive Dealership & Service Center Cleaning
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your automotive facility is where customers make significant purchasing
        decisions and trust you with their valuable vehicles. Our specialized
        dealership cleaning services ensure every showroom floor, service bay,
        and customer area reflects the professionalism and quality your brand
        represents. From pristine vehicle displays to spotless service areas, we
        maintain the immaculate environment that builds customer confidence and
        drives sales success.
      </p>

      {/* Automotive Offer Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500 rounded-full">
            <TruckIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-red-900">
            Elite Automotive Facility Care
          </h3>
        </div>
        <p className="text-red-800 text-xl leading-relaxed">
          Professional automotive cleaning services for only{" "}
          <span className="font-bold text-3xl text-red-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Pristine facilities that drive customer confidence and sales.
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
        Why choose our automotive facility cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Showroom presentation expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized techniques for vehicle displays and high-gloss
              surfaces
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Service bay deep cleaning
            </h4>
            <p className="text-gray-600 text-base">
              Industrial-strength cleaning for automotive work environments
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-amber-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Flexible operational scheduling
            </h4>
            <p className="text-gray-600 text-base">
              Service timing that works around your business and customer hours
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Brand image enhancement
            </h4>
            <p className="text-gray-600 text-base">
              Professional cleanliness that reflects your dealership's quality
              standards
            </p>
          </div>
        </div>
      </div>

      {/* Automotive Facility Areas Section */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Automotive Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Showrooms</h4>
            <p className="text-gray-600 text-sm">
              Vehicle displays, customer areas, sales floors
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Service Centers
            </h4>
            <p className="text-gray-600 text-sm">
              Repair bays, service areas, parts departments
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Customer Lounges
            </h4>
            <p className="text-gray-600 text-sm">
              Waiting areas, reception, customer service desks
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TruckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Lot & Exterior Areas
            </h4>
            <p className="text-gray-600 text-sm">
              Parking areas, exterior displays, entrance ways
            </p>
          </div>
        </div>
      </div>

      {/* Automotive Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Comprehensive Automotive Facility Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-red-100 rounded-full">
              <span className="text-red-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Showroom & Display Area Perfection
              </h4>
              <p className="text-gray-600">
                Meticulous cleaning of vehicle displays, showroom floors, and
                customer presentation areas for maximum visual impact
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-orange-100 rounded-full">
              <span className="text-orange-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Service Bay Industrial Cleaning
              </h4>
              <p className="text-gray-600">
                Heavy-duty cleaning of service areas, equipment, and work spaces
                with automotive-specific products and methods
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-amber-100 rounded-full">
              <span className="text-amber-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Customer Experience Areas
              </h4>
              <p className="text-gray-600">
                Thorough cleaning and maintenance of waiting areas, lounges, and
                all customer-facing spaces
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Exterior & Final Quality Check
              </h4>
              <p className="text-gray-600">
                Complete exterior area maintenance and comprehensive quality
                assurance for customer-ready presentation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Automotive Cleaning Comparison */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Regular Cleaning vs. Automotive Facility Excellence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Basic floor cleaning and trash removal",
                "No automotive environment expertise",
                "Generic products for all surface types",
                "Limited understanding of customer presentation",
                "No industrial cleaning capabilities",
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
              Professional Automotive Care
            </h4>
            <div className="space-y-3">
              {[
                "Specialized showroom and vehicle display cleaning",
                "Automotive industry expertise and standards",
                "Industrial-strength products for service areas",
                "Customer experience and sales environment focus",
                "Heavy-duty equipment and professional techniques",
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
          Complete Automotive Facility Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Showroom floor and vehicle display area cleaning",
            "Service bay deep cleaning and degreasing",
            "Customer lounge and waiting area maintenance",
            "Reception and sales desk professional cleaning",
            "Parts department organization and cleaning",
            "Restroom maintenance and supply management",
            "Window and glass surface cleaning throughout",
            "Floor care for all surface types and traffic patterns",
            "Exterior entrance and lot area maintenance",
            "Office space and administrative area cleaning",
            "Emergency spill cleanup and maintenance response",
            "Brand presentation and image enhancement focus",
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
          Why Professional Automotive Cleaning Drives Business Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TruckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Increased Sales
            </h4>
            <p className="text-gray-600 text-sm">
              Immaculate showrooms and professional presentation directly
              influence customer purchasing decisions
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">Brand Trust</h4>
            <p className="text-gray-600 text-sm">
              Professional facility maintenance builds customer confidence in
              your service quality and reliability
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Competitive Edge
            </h4>
            <p className="text-gray-600 text-sm">
              Superior facility presentation sets you apart from competitors and
              attracts quality customers
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Automotive Facility Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Daily Maintenance
            </h4>
            <p className="text-gray-600 text-sm">
              Regular showroom and customer area upkeep
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              After-Hours Service
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning when dealership is closed
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Service Bay Deep Clean
            </h4>
            <p className="text-gray-600 text-sm">
              Intensive industrial cleaning for work areas
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <TruckIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Drive Your Success with Professional Automotive Facility Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your automotive facility is where trust and major investments meet.
          Let our professional cleaning service maintain the pristine
          environment that builds customer confidence, showcases your vehicles,
          and drives sales success.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Automotive Facility Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service40;
