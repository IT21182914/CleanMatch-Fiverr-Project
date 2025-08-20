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
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service38 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Premium Retail Store Cleaning for Customer Experience Excellence
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your retail space is where first impressions become lasting relationships 
        and sales decisions are made. Our specialized retail cleaning services ensure 
        every customer enters a pristine, welcoming environment that reflects your 
        brand quality. From high-traffic areas to detailed product displays, we maintain 
        the immaculate presentation that drives customer confidence, enhances shopping 
        experiences, and ultimately increases your sales performance.
      </p>

      {/* Retail Offer Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500 rounded-full">
            <BuildingStorefrontIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900">
            Professional Retail Environment Care
          </h3>
        </div>
        <p className="text-emerald-800 text-xl leading-relaxed">
          Professional retail cleaning services for only{" "}
          <span className="font-bold text-3xl text-emerald-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Pristine retail environment that drives customer satisfaction and sales.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-emerald-50 to-teal-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our retail cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-500 rounded-full">
            <CurrencyDollarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Sales-focused cleaning approach
            </h4>
            <p className="text-gray-600 text-base">
              Every detail designed to enhance customer experience and drive purchases
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-teal-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Off-hours service scheduling
            </h4>
            <p className="text-gray-600 text-base">
              Flexible timing to minimize disruption to business operations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-cyan-500 rounded-full">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Brand image enhancement
            </h4>
            <p className="text-gray-600 text-base">
              Professional presentation that reflects your brand quality and values
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Customer safety priority
            </h4>
            <p className="text-gray-600 text-base">
              Safe, healthy shopping environment with proper sanitization protocols
            </p>
          </div>
        </div>
      </div>

      {/* Retail Types Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Retail Establishments We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingStorefrontIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fashion & Apparel</h4>
            <p className="text-gray-600 text-sm">
              Clothing stores, boutiques, shoe shops, accessory retailers
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Electronics & Tech</h4>
            <p className="text-gray-600 text-sm">
              Electronics stores, phone shops, computer retailers, gaming stores
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Beauty & Wellness
            </h4>
            <p className="text-gray-600 text-sm">
              Cosmetics, salons, spas, health and beauty retailers
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Home & Lifestyle
            </h4>
            <p className="text-gray-600 text-sm">
              Furniture stores, home decor, kitchenware, lifestyle boutiques
            </p>
          </div>
        </div>
      </div>

      {/* Retail Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Strategic Retail Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-emerald-100 rounded-full">
              <span className="text-emerald-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Customer Area Deep Clean
              </h4>
              <p className="text-gray-600">
                Thorough cleaning of all customer-facing areas including sales floors, fitting rooms, and product displays
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-teal-100 rounded-full">
              <span className="text-teal-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Window & Display Enhancement
              </h4>
              <p className="text-gray-600">
                Professional window cleaning and product display maintenance for maximum visual appeal
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-cyan-100 rounded-full">
              <span className="text-cyan-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                High-Traffic Surface Care
              </h4>
              <p className="text-gray-600">
                Specialized attention to floors, counters, and high-touch areas with appropriate cleaning solutions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Final Presentation Check
              </h4>
              <p className="text-gray-600">
                Complete quality inspection ensuring every area meets professional retail standards for opening
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic vs Retail Cleaning Comparison */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Basic Cleaning vs. Retail Excellence Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Basic floor cleaning and trash removal",
                "No customer experience focus",
                "Generic cleaning approach for all areas",
                "Limited attention to brand presentation",
                "No sales environment understanding",
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
              Professional Retail Care
            </h4>
            <div className="space-y-3">
              {[
                "Customer experience-focused cleaning approach",
                "Brand image enhancement and presentation care",
                "Specialized retail environment expertise",
                "Sales-driving cleanliness standards",
                "Strategic timing to maximize business impact",
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
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Retail Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Sales floor deep cleaning and maintenance",
            "Window cleaning for maximum visibility and appeal",
            "Product display dusting and organization support",
            "Fitting room and customer area sanitization",
            "Checkout counter and POS system area cleaning",
            "Floor care for all surface types and traffic patterns",
            "Restroom maintenance and supply restocking",
            "Storage and back-office area cleaning",
            "Entrance and storefront presentation care",
            "High-touch surface sanitization protocols",
            "Trash removal and recycling management",
            "Emergency cleaning and spill response",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-emerald-500 rounded-full">
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
          Why Professional Retail Cleaning Drives Business Growth
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CurrencyDollarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Increased Sales
            </h4>
            <p className="text-gray-600 text-sm">
              Clean, organized retail environment directly influences customer purchasing decisions
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Brand Reputation
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleanliness enhances brand image and customer trust in your products
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-green-50 rounded-xl">
            <div className="p-3 bg-cyan-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Customer Loyalty
            </h4>
            <p className="text-gray-600 text-sm">
              Exceptional shopping environment encourages repeat visits and customer recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Retail Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Daily Maintenance</h4>
            <p className="text-gray-600 text-sm">
              Regular cleaning to maintain pristine customer environment
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">After-Hours Deep Clean</h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning when store is closed for business
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Special Events</h4>
            <p className="text-gray-600 text-sm">
              Pre and post event cleaning for sales, launches, and promotions
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <BuildingStorefrontIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Transform Your Retail Success with Professional Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your customers make buying decisions within moments of entering your store. 
          Let our professional cleaning service create the pristine environment that 
          drives sales, enhances your brand, and keeps customers coming back.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Retail Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service38;
