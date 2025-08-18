import React from "react";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  HeartIcon,
  FireIcon,
  GlobeAltIcon,
  BeakerIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";

const Service11 = ({ service, handleBookNow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Medical Facility Cleaning You Can Trust
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        When it comes to healthcare environments, cleanliness isn't just about
        appearance—it's about safety, compliance, and patient care. Our
        specialized medical cleaning team understands the critical importance of
        maintaining sterile, hygienic conditions in hospitals, clinics, and
        medical practices.
      </p>

      {/* Limited Time Offer */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-full">
            <HeartIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">
            Healthcare Excellence Package
          </h3>
        </div>
        <p className="text-blue-800 text-xl leading-relaxed">
          Professional medical facility cleaning for only{" "}
          <span className="font-bold text-3xl text-blue-900">
            {service.memberPrice}
          </span>{" "}
          with membership, instead of the regular{" "}
          <span className="line-through text-gray-500 text-lg">
            {service.regularPrice}
          </span>
          . HIPAA-compliant, medical-grade disinfection at an unbeatable price.
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
        Why Choose Our Medical Cleaning Services?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-600 rounded-full">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Medical-Grade Disinfection
            </h4>
            <p className="text-gray-600 text-base">
              EPA-approved disinfectants and hospital-grade cleaning protocols
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-green-500 rounded-full">
            <DocumentCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              HIPAA Compliance
            </h4>
            <p className="text-gray-600 text-base">
              Full compliance with healthcare privacy and security regulations
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-red-500 rounded-full">
            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Biohazard Handling
            </h4>
            <p className="text-gray-600 text-base">
              Safe disposal of medical waste and contaminated materials
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="p-2 bg-cyan-500 rounded-full">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              Sterile Environments
            </h4>
            <p className="text-gray-600 text-base">
              Maintaining the highest standards of cleanliness for patient
              safety
            </p>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Our Medical Cleaning Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckBadgeIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Certified Staff
            </h4>
            <p className="text-gray-600 text-sm">
              All cleaners trained in medical facility protocols and safety
              procedures
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              24/7 Availability
            </h4>
            <p className="text-gray-600 text-sm">
              Emergency cleaning services available around the clock
            </p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Specialized Teams
            </h4>
            <p className="text-gray-600 text-sm">
              Dedicated teams for different types of medical facilities
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <HeartIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Protect Your Patients & Staff</h3>
        </div>
        <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Don't compromise on healthcare hygiene. Book our professional medical
          cleaning service today and ensure your facility meets the highest
          standards of cleanliness and safety.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Medical Cleaning Now
        </button>
      </div>
    </div>
  );
};

export default Service11;
