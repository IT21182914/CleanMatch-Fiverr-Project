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
  BuildingOfficeIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service50 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Professional Automotive Service Center & Garage Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Automotive service centers and garages require specialized cleaning that
        handles grease, oil, automotive chemicals, and heavy-duty equipment
        while maintaining a professional customer environment. Our comprehensive
        automotive facility cleaning services ensure service bays, customer
        areas, and administrative spaces meet the highest standards of
        cleanliness and safety. From hydraulic lift areas to customer waiting
        rooms, we provide thorough cleaning with automotive-specific protocols
        that support both operational efficiency and customer satisfaction.
      </p>

      {/* Automotive Offer Banner */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-l-4 border-slate-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-500 rounded-full">
            <TruckIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Complete Automotive Facility Care
          </h3>
        </div>
        <p className="text-slate-800 text-xl leading-relaxed">
          Professional automotive service center and garage cleaning services
          for only{" "}
          <span className="font-bold text-3xl text-slate-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Maintain professional standards and customer satisfaction.
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
        Why choose our automotive facility cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-slate-500 rounded-full">
            <TruckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Automotive-specific cleaning expertise
            </h4>
            <p className="text-gray-600 text-base">
              Specialized knowledge of automotive fluids, chemicals, and
              equipment
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-gray-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Heavy-duty degreasing capabilities
            </h4>
            <p className="text-gray-600 text-base">
              Professional removal of grease, oil, and automotive residues
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-zinc-500 rounded-full">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Customer area focus
            </h4>
            <p className="text-gray-600 text-base">
              Professional presentation that enhances customer confidence
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-stone-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Service schedule coordination
            </h4>
            <p className="text-gray-600 text-base">
              Flexible timing that works around automotive service operations
            </p>
          </div>
        </div>
      </div>

      {/* Automotive Facility Types Section */}
      <div className="bg-gradient-to-r from-slate-50 to-zinc-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Automotive Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TruckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Auto Repair Shops
            </h4>
            <p className="text-gray-600 text-sm">
              Service bays, lift areas, tool storage, customer areas
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Dealership Service Centers
            </h4>
            <p className="text-gray-600 text-sm">
              Service departments, customer lounges, parts areas
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-zinc-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Quick Lube Centers
            </h4>
            <p className="text-gray-600 text-sm">
              Oil change bays, waiting areas, cashier stations
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-stone-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FireIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Specialty Shops
            </h4>
            <p className="text-gray-600 text-sm">
              Tire shops, transmission shops, body shops, detail centers
            </p>
          </div>
        </div>
      </div>

      {/* Automotive Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Specialized Automotive Facility Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-slate-100 rounded-full">
              <span className="text-slate-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Service Bay Preparation & Assessment
              </h4>
              <p className="text-gray-600">
                Evaluation of service areas, equipment positioning, and
                preparation for heavy-duty cleaning procedures
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-gray-100 rounded-full">
              <span className="text-gray-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Heavy-Duty Degreasing & Equipment Care
              </h4>
              <p className="text-gray-600">
                Professional removal of automotive fluids, grease, and residues
                from lifts, tools, and work surfaces
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-zinc-100 rounded-full">
              <span className="text-zinc-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Customer Area Professional Cleaning
              </h4>
              <p className="text-gray-600">
                Thorough cleaning of waiting areas, reception, and
                customer-facing spaces for professional presentation
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-stone-100 rounded-full">
              <span className="text-stone-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Safety & Quality Verification
              </h4>
              <p className="text-gray-600">
                Final inspection ensuring all areas meet automotive industry
                standards and customer expectations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Automotive Cleaning Comparison */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Commercial Cleaning vs. Automotive Facility Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "No automotive fluid expertise",
                "Limited heavy-duty degreasing capability",
                "Generic equipment cleaning methods",
                "No automotive industry knowledge",
                "Basic customer area maintenance",
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
                "Specialized automotive fluid handling",
                "Professional heavy-duty degreasing systems",
                "Automotive equipment cleaning expertise",
                "Industry-specific safety knowledge",
                "Customer satisfaction focus",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-slate-500 rounded-full">
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
          Complete Automotive Facility Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Service bay and lift area deep cleaning",
            "Tool and equipment degreasing and maintenance",
            "Customer waiting area professional cleaning",
            "Reception and cashier area maintenance",
            "Parts storage and inventory area cleaning",
            "Administrative office cleaning services",
            "Break room and employee facility care",
            "Restroom maintenance and supply management",
            "Floor care for automotive surfaces",
            "Window and glass surface cleaning",
            "Emergency spill cleanup and response",
            "Automotive waste disposal coordination",
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
          Why Professional Automotive Cleaning Drives Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Customer Confidence
            </h4>
            <p className="text-gray-600 text-sm">
              Clean facilities build trust and confidence in your automotive
              services
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-zinc-50 rounded-xl">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Safety Standards
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleaning maintains safety standards and reduces
              workplace hazards
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-zinc-50 to-stone-50 rounded-xl">
            <div className="p-3 bg-zinc-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Professional Image
            </h4>
            <p className="text-gray-600 text-sm">
              Well-maintained facilities enhance reputation and attract more
              customers
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Automotive Facility Cleaning Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Daily Service</h4>
            <p className="text-gray-600 text-sm">
              Regular cleaning during off-hours or slow periods
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-gray-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Weekend Deep Clean
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning when shop is closed
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-slate-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <StarIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Emergency Service
            </h4>
            <p className="text-gray-600 text-sm">
              Quick response for spills and urgent cleaning needs
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
            Drive Success with Professional Automotive Facility Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your automotive business deserves cleaning services that understand
          the unique challenges of service environments. Let our specialized
          team maintain the clean, professional facility that drives customer
          confidence and business success.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Automotive Facility Cleaning
        </button>
      </div>
    </div>
  );
};

export default Service50;
