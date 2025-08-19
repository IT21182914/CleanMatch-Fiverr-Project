import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  TrophyIcon,
  StarIcon,
  HomeIcon,
  CalendarDaysIcon,
  BeakerIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service28 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Transform Every Floor to Perfection
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Your floors are the foundation of your space's beauty and cleanliness. 
        Our comprehensive floor cleaning service specializes in all surface types, 
        from luxurious hardwood to durable tile, elegant marble to cozy carpet. 
        We combine advanced techniques with surface-specific treatments to restore 
        and maintain the pristine condition of every floor in your property.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-l-4 border-slate-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-500 rounded-full">
            <Squares2X2Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Complete Floor Care Solutions
          </h3>
        </div>
        <p className="text-slate-800 text-xl leading-relaxed">
          Professional floor cleaning for all surfaces for only{" "}
          <span className="font-bold text-3xl text-slate-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Expert care for every type of flooring in your space.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-slate-50 to-gray-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our floor cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-slate-500 rounded-full">
            <SwatchIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              All floor types expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized knowledge and techniques for every flooring material
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Deep sanitization process
            </h4>
            <p className="text-gray-600 text-base">
              Advanced cleaning methods that eliminate germs and bacteria
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Professional stain removal
            </h4>
            <p className="text-gray-600 text-base">
              Expert treatment of tough stains and stubborn spots
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Protective coating application
            </h4>
            <p className="text-gray-600 text-base">
              Surface protection to maintain cleanliness and extend floor life
            </p>
          </div>
        </div>
      </div>

      {/* Floor Types Section */}
      <div className="bg-gradient-to-r from-slate-50 to-stone-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Floor Types We Master
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Squares2X2Icon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Hardwood Floors</h4>
            <p className="text-gray-600 text-sm">
              Oak, maple, cherry, and exotic wood species
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SwatchIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Tile & Stone</h4>
            <p className="text-gray-600 text-sm">
              Ceramic, porcelain, marble, granite, and natural stone
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Carpet & Rugs</h4>
            <p className="text-gray-600 text-sm">
              All carpet types, area rugs, and delicate textiles
            </p>
          </div>
        </div>
      </div>

      {/* Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Comprehensive Floor Care Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-slate-100 rounded-full">
              <span className="text-slate-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Floor Assessment & Material Identification
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of floor types, condition, and specific cleaning requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Pre-Treatment & Stain Analysis
              </h4>
              <p className="text-gray-600">
                Targeted pre-treatment of stains and high-traffic areas with specialized solutions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Deep Cleaning & Sanitization
              </h4>
              <p className="text-gray-600">
                Surface-specific deep cleaning methods with professional-grade equipment
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Protection & Finishing
              </h4>
              <p className="text-gray-600">
                Application of protective coatings and finishes to maintain long-lasting cleanliness
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specialized Treatments */}
      <div className="bg-gradient-to-r from-stone-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Specialized Floor Treatments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Hardwood & Laminate
            </h4>
            <div className="space-y-3">
              {[
                "Wood-safe cleaning solutions",
                "Grain-following cleaning techniques",
                "Moisture-controlled methods",
                "Protective polish application"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-amber-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Tile & Natural Stone
            </h4>
            <div className="space-y-3">
              {[
                "Grout deep cleaning and sealing",
                "Stone-safe chemical treatments",
                "High-pressure cleaning systems",
                "Anti-bacterial sanitization"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-blue-500 rounded-full">
                    <CheckBadgeIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Carpet & Textiles
            </h4>
            <div className="space-y-3">
              {[
                "Steam cleaning extraction",
                "Fabric-safe stain removal",
                "Deodorization treatments",
                "Fiber protection application"
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
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Luxury & Specialty Floors
            </h4>
            <div className="space-y-3">
              {[
                "Marble and granite restoration",
                "Persian rug specialist care",
                "Antique floor preservation",
                "Custom maintenance programs"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-purple-500 rounded-full">
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
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Floor Care Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Professional floor assessment and material identification",
            "Surface-specific cleaning solutions and techniques",
            "Advanced stain removal and spot treatment",
            "Deep sanitization and bacteria elimination",
            "Protective coating and finish application",
            "Grout cleaning and sealing (tile floors)",
            "Equipment and debris cleanup",
            "Floor care maintenance recommendations"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-slate-500 rounded-full">
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
          Benefits of Professional Floor Cleaning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-stone-50 rounded-xl">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Enhanced Beauty
            </h4>
            <p className="text-gray-600 text-sm">
              Restore your floors' original luster and beauty 
              with professional cleaning techniques
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Health & Hygiene
            </h4>
            <p className="text-gray-600 text-sm">
              Eliminate allergens, bacteria, and germs 
              for a healthier living environment
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Extended Lifespan
            </h4>
            <p className="text-gray-600 text-sm">
              Professional care extends floor life and 
              protects your flooring investment
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Recommended Cleaning Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">High-Traffic Areas</h4>
            <p className="text-gray-600 text-sm mb-4">Weekly deep cleaning for entrances, hallways, and common areas</p>
            <div className="text-sm text-gray-500">Maintains appearance and hygiene</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border-2 border-slate-200">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SwatchIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Regular Living Spaces</h4>
            <p className="text-gray-600 text-sm mb-4">Monthly professional cleaning for bedrooms, living rooms</p>
            <div className="text-sm text-slate-600 font-semibold">Most Popular</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Specialty Floors</h4>
            <p className="text-gray-600 text-sm mb-4">Quarterly care for luxury and delicate flooring materials</p>
            <div className="text-sm text-gray-500">Preserves value and beauty</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <GlobeAltIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Experience the Difference Clean Floors Make
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Transform your space with floors that shine, feel fresh, and stay 
          beautiful longer. Our expert team brings professional results to 
          every surface, giving you floors you'll be proud to show off.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Floor Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service28;
