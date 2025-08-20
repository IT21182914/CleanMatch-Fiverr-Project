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
  AcademicCapIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service43 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Specialized Daycare & Childcare Center Cleaning Services
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Children's safety and health are the highest priority in any childcare
        environment. Our specialized daycare cleaning services ensure every
        classroom, play area, and facility space maintains the highest standards
        of cleanliness and hygiene. From toddler rooms to outdoor playgrounds,
        we provide comprehensive cleaning using child-safe products and methods
        that create the secure, healthy environment parents trust and children
        deserve for their early learning and development.
      </p>

      {/* Childcare Offer Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-500 rounded-full">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-yellow-900">
            Professional Childcare Environment Care
          </h3>
        </div>
        <p className="text-yellow-800 text-xl leading-relaxed">
          Professional daycare cleaning services for only{" "}
          <span className="font-bold text-3xl text-yellow-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Safe, healthy environments where children thrive and parents trust.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-yellow-50 to-amber-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our daycare cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-yellow-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Child-safe cleaning products
            </h4>
            <p className="text-gray-600 text-base">
              Non-toxic, eco-friendly solutions safe for children's health and
              development
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-amber-500 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Health department compliance
            </h4>
            <p className="text-gray-600 text-base">
              Meeting all childcare facility health and safety regulations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-orange-500 rounded-full">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Child development environment focus
            </h4>
            <p className="text-gray-600 text-base">
              Cleaning methods that support learning and developmental
              activities
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Naptime and after-hours service
            </h4>
            <p className="text-gray-600 text-base">
              Quiet cleaning during rest periods and comprehensive after-hours
              deep cleaning
            </p>
          </div>
        </div>
      </div>

      {/* Childcare Areas Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Childcare Areas We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Classrooms</h4>
            <p className="text-gray-600 text-sm">
              Learning areas, activity rooms, educational spaces
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Play Areas</h4>
            <p className="text-gray-600 text-sm">
              Indoor playrooms, toy areas, creative spaces
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Nap & Rest Areas
            </h4>
            <p className="text-gray-600 text-sm">
              Sleep rooms, quiet zones, rest spaces
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-red-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Dining & Kitchen Areas
            </h4>
            <p className="text-gray-600 text-sm">
              Eating areas, kitchen facilities, food preparation zones
            </p>
          </div>
        </div>
      </div>

      {/* Daycare Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Child-Safe Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Child-Safe Product Application
              </h4>
              <p className="text-gray-600">
                Application of non-toxic, eco-friendly cleaning products safe
                for children's health and development
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-amber-100 rounded-full">
              <span className="text-amber-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Play Area & Toy Sanitization
              </h4>
              <p className="text-gray-600">
                Comprehensive cleaning and sanitization of toys, play equipment,
                and learning materials
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-orange-100 rounded-full">
              <span className="text-orange-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                High-Touch Surface Disinfection
              </h4>
              <p className="text-gray-600">
                Thorough disinfection of door handles, light switches, tables,
                and all frequently touched surfaces
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-red-100 rounded-full">
              <span className="text-red-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Health Compliance Verification
              </h4>
              <p className="text-gray-600">
                Final inspection ensuring all childcare health department
                standards are met and documented
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Childcare Cleaning Comparison */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Regular Cleaning vs. Child-Safe Childcare Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Cleaning
            </h4>
            <div className="space-y-3">
              {[
                "Generic cleaning products and chemicals",
                "No child safety considerations",
                "Limited health regulation knowledge",
                "Basic sanitization protocols",
                "No toy or play equipment expertise",
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
              Professional Childcare Care
            </h4>
            <div className="space-y-3">
              {[
                "Child-safe, non-toxic cleaning products exclusively",
                "Child health and development priority focus",
                "Full childcare health department compliance",
                "Advanced sanitization for disease prevention",
                "Specialized toy and equipment cleaning expertise",
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
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Daycare Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Classroom and learning area deep cleaning",
            "Play area and toy sanitization services",
            "Nap room and rest area maintenance",
            "Kitchen and dining area food-safe cleaning",
            "Bathroom and diaper changing area sanitization",
            "High-touch surface disinfection protocols",
            "Floor care safe for crawling and playing",
            "Art and craft area specialized cleaning",
            "Outdoor playground equipment maintenance",
            "Emergency cleaning and spill response",
            "Health department compliance documentation",
            "Parent communication and transparency reports",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-yellow-500 rounded-full">
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
          Why Professional Daycare Cleaning Protects Children and Builds Parent
          Trust
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Child Health Protection
            </h4>
            <p className="text-gray-600 text-sm">
              Professional cleaning significantly reduces illness transmission
              and creates healthier environments
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
            <div className="p-3 bg-amber-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Parent Confidence
            </h4>
            <p className="text-gray-600 text-sm">
              Pristine facilities build parent trust and confidence in your
              childcare quality and safety standards
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
            <div className="p-3 bg-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Enhanced Learning
            </h4>
            <p className="text-gray-600 text-sm">
              Clean, organized environments support optimal learning and child
              development activities
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-yellow-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Flexible Daycare Cleaning Schedules
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
              Regular cleaning during naptime and breaks
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              After-Hours Deep Clean
            </h4>
            <p className="text-gray-600 text-sm">
              Comprehensive cleaning when daycare is closed
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Health Emergency
            </h4>
            <p className="text-gray-600 text-sm">
              Emergency sanitization for illness outbreaks
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            Protect Every Child with Professional Daycare Cleaning
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Children deserve the safest, cleanest environment for learning and
          growth. Let our specialized daycare cleaning service maintain the
          healthy facilities that protect children's health and give parents
          complete peace of mind.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Daycare Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service43;
