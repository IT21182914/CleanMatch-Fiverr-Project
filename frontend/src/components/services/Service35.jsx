import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  HeartIcon,
  TrophyIcon,
  StarIcon,
  CalendarDaysIcon,
  BeakerIcon,
  UserGroupIcon,
  HandRaisedIcon,
  LightBulbIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service35 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Healthcare Cleaning That Saves Lives
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Healthcare facilities demand the highest standards of cleanliness and
        infection control. Our specialized hospital and medical practice
        cleaning services combine medical-grade disinfection protocols,
        healthcare compliance expertise, and patient safety focus to create
        sterile, healing environments that protect patients, staff, and visitors
        while meeting strict healthcare regulations and accreditation standards.
      </p>

      {/* Healthcare Offer Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500 rounded-full">
            <PlusCircleIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-900">
            Medical-Grade Cleaning Standards
          </h3>
        </div>
        <p className="text-green-800 text-xl leading-relaxed">
          Professional healthcare facility cleaning for only{" "}
          <span className="font-bold text-3xl text-green-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . Infection control excellence for patient safety.
        </p>
      </div>

      {/* Service Image Display */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="w-full h-auto object-contain bg-gradient-to-br from-green-50 to-emerald-50"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Why choose our healthcare cleaning service?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Medical-grade disinfection
            </h4>
            <p className="text-gray-600 text-base">
              Hospital-level infection control protocols and EPA-approved
              disinfectants
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-500 rounded-full">
            <UserGroupIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Healthcare compliance expertise
            </h4>
            <p className="text-gray-600 text-base">
              OSHA, CDC, and Joint Commission standards compliance assurance
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-500 rounded-full">
            <HeartIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Patient safety priority
            </h4>
            <p className="text-gray-600 text-base">
              Every protocol designed to protect vulnerable patients and prevent
              infections
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-teal-500 rounded-full">
            <HandRaisedIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Trained healthcare staff
            </h4>
            <p className="text-gray-600 text-base">
              Specialized training in healthcare environments and infection
              prevention
            </p>
          </div>
        </div>
      </div>

      {/* Healthcare Areas Section */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Healthcare Facilities We Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <PlusCircleIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Hospitals</h4>
            <p className="text-gray-600 text-sm">
              Patient rooms, ICUs, operating theaters, emergency departments
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Medical Practices
            </h4>
            <p className="text-gray-600 text-sm">
              Clinics, doctor offices, specialist practices
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Diagnostic Centers
            </h4>
            <p className="text-gray-600 text-sm">
              Labs, imaging centers, testing facilities
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Long-term Care</h4>
            <p className="text-gray-600 text-sm">
              Nursing homes, assisted living, rehabilitation centers
            </p>
          </div>
        </div>
      </div>

      {/* Healthcare Cleaning Process */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Our Medical-Grade Cleaning Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Risk Assessment & Protocol Planning
              </h4>
              <p className="text-gray-600">
                Comprehensive evaluation of infection risks, patient
                populations, and regulatory requirements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-emerald-100 rounded-full">
              <span className="text-emerald-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Medical-Grade Disinfection
              </h4>
              <p className="text-gray-600">
                EPA-approved disinfectants applied using hospital-standard
                protocols for maximum pathogen elimination
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-teal-100 rounded-full">
              <span className="text-teal-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Sterile Environment Maintenance
              </h4>
              <p className="text-gray-600">
                Specialized cleaning of critical areas including isolation
                rooms, surgical suites, and ICUs
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Compliance Documentation & Verification
              </h4>
              <p className="text-gray-600">
                Complete documentation and quality assurance meeting all
                healthcare regulatory standards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standard vs Healthcare Comparison */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Commercial Cleaning vs. Healthcare Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Standard Commercial Limitations
            </h4>
            <div className="space-y-3">
              {[
                "Basic disinfection protocols only",
                "No healthcare regulation knowledge",
                "Limited infection control training",
                "Standard commercial products",
                "No medical waste handling expertise",
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
              Healthcare Cleaning Excellence
            </h4>
            <div className="space-y-3">
              {[
                "Medical-grade disinfection protocols",
                "Full healthcare compliance expertise",
                "Specialized infection prevention training",
                "EPA-approved medical disinfectants",
                "Certified medical waste handling",
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Healthcare Cleaning Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Medical-grade surface disinfection protocols",
            "Patient room comprehensive cleaning and sanitization",
            "Operating room and sterile area maintenance",
            "High-touch surface frequent disinfection",
            "Medical equipment and device cleaning",
            "Isolation room specialized cleaning procedures",
            "Restroom deep sanitization and restocking",
            "Floor care with medical-grade disinfectants",
            "Medical waste removal and biohazard handling",
            "Air quality improvement and HVAC cleaning",
            "Healthcare compliance documentation",
            "Emergency spill and contamination response",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 bg-green-500 rounded-full">
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
          Why Healthcare Cleaning Excellence Saves Lives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Patient Safety Protection
            </h4>
            <p className="text-gray-600 text-sm">
              Reduce hospital-acquired infections and protect vulnerable
              patients through medical-grade cleaning
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Regulatory Compliance
            </h4>
            <p className="text-gray-600 text-sm">
              Meet all OSHA, CDC, and accreditation standards with confidence
              and proper documentation
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <LightBulbIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Staff & Visitor Safety
            </h4>
            <p className="text-gray-600 text-sm">
              Create safer healthcare environments for medical staff, patients,
              and visiting families
            </p>
          </div>
        </div>
      </div>

      {/* Service Schedule */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Healthcare Facility Service Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">24/7 Coverage</h4>
            <p className="text-gray-600 text-sm">
              Round-the-clock cleaning for continuous healthcare operations
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Terminal Cleaning
            </h4>
            <p className="text-gray-600 text-sm">
              Deep disinfection after patient discharge or procedures
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HandRaisedIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Emergency Response
            </h4>
            <p className="text-gray-600 text-sm">
              Immediate contamination and biohazard cleanup
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
            Partner With Us for Life-Saving Cleanliness
          </h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Your patients' health and safety depend on the highest standards of
          cleanliness. Trust our healthcare cleaning experts to create sterile,
          healing environments that protect lives and exceed all regulatory
          standards.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Healthcare Cleaning Service
        </button>
      </div>
    </div>
  );
};

export default Service35;
