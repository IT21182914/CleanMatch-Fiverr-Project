import React from "react";
import {
  XMarkIcon,
  DocumentTextIcon,
  ScaleIcon,
  UserIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ContractorAgreementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                Independent Contractor Agreement 1099
              </h2>
              <p className="text-white/90 text-xs sm:text-sm">
                SIMORGH SERVICE GROUP LLC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)] px-4 sm:px-6 py-4 sm:py-6">
          {/* Parties Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4EC6E5]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Parties
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">
                  SIMORGH SERVICE OWNER:
                </h4>
                <p className="text-slate-700 text-xs sm:text-sm">
                  <strong>Simorgh Service Group LLC</strong>, LLC with its
                  registered office at
                  <strong>
                    {" "}
                    364 E Main Street Suite 1001 Middletown DE- 19709 DELAWARE
                    U.S.A.
                  </strong>
                  , Delaware, hereinafter referred to as{" "}
                  <strong>Simorgh Service</strong>.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">
                  CONTRACTOR:
                </h4>
                <p className="text-slate-700 text-xs sm:text-sm">
                  [Independent Contractor's Full Legal Name/Trade Name (if
                  applicable)], [Independent Contractor's Full Address], located
                  in [Contractor's State] (hereinafter referred to as{" "}
                  <strong>"Contractor"</strong>).
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <DocumentTextIcon className="h-5 w-5 text-[#4EC6E5]" />
              <h3 className="text-lg font-bold text-slate-900">Introduction</h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-slate-700 text-sm leading-relaxed">
                Simorgh Service operates an online platform that connects
                customers' cleaning service requests with independent cleaning
                professionals. Contractor represents that it has the necessary
                skills, experience, and equipment, and agrees to provide
                cleaning services offered through Simorgh Service as an
                independent contractor.
              </p>
            </div>
          </div>

          {/* Key Sections */}
          <div className="space-y-8">
            {/* 1. Simorgh Service's Role */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-[#4EC6E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <h4 className="font-semibold text-slate-900">
                  Simorgh Service's Role
                </h4>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                Simorgh Service is an intermediary that brings clients and
                Contractors together. Simorgh Service is not a direct party to
                the provision of cleaning services and assumes no responsibility
                for the quality, timing or completion of the services provided
                by the Contractor.
              </p>
            </section>

            {/* 2. Independent Contractor Status */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-[#4EC6E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <h4 className="font-semibold text-slate-900">
                  Independent Contractor Status
                </h4>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  The parties expressly acknowledge and agree that the
                  Contractor is an independent contractor and not an employee of
                  Simorgh Service. This Agreement does not create an
                  employer-employee relationship. In particular, the following
                  is confirmed, considering Delaware law:
                </p>
                <ul className="text-slate-700 text-sm space-y-2 list-disc list-inside">
                  <li>
                    The Contractor has significant freedom to determine its own
                    hours and schedule
                  </li>
                  <li>
                    The Contractor has freedom to determine its own cleaning
                    methods and techniques
                  </li>
                  <li>
                    The Contractor is responsible for obtaining and using its
                    own equipment and materials
                  </li>
                  <li>
                    The Contractor has freedom to provide services for multiple
                    customers
                  </li>
                  <li>
                    The Contractor is responsible for its own tax liabilities
                    (income tax, self-employment tax, etc.)
                  </li>
                  <li>
                    Simorgh Service will report payments to the IRS on Form
                    1099-NEC
                  </li>
                </ul>
              </div>
            </section>

            {/* 4. Fees and Payment */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-[#4EC6E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <BanknotesIcon className="h-5 w-5 text-[#4EC6E5]" />
                <h4 className="font-semibold text-slate-900">
                  Fees and Payment
                </h4>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <p className="text-slate-700 text-sm">
                  • Fees paid by customers will be calculated according to rates
                  determined by Simorgh Service
                </p>
                <p className="text-slate-700 text-sm">
                  •{" "}
                  <strong>
                    The payment to be earned by the Contractor is the amount
                    remaining after deducting the 10% commission
                  </strong>{" "}
                  or fee deduction determined by Simorgh Service
                </p>
                <p className="text-slate-700 text-sm">
                  •{" "}
                  <strong>
                    Payments will be made weekly by Simorgh Service every Monday
                  </strong>{" "}
                  after services are completed and approved by the customer
                </p>
              </div>
            </section>

            {/* 6. Contractor's Responsibilities */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-[#4EC6E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </span>
                <ShieldCheckIcon className="h-5 w-5 text-[#4EC6E5]" />
                <h4 className="font-semibold text-slate-900">
                  Contractor's Responsibilities
                </h4>
              </div>
              <ul className="text-slate-700 text-sm space-y-2 list-disc list-inside">
                <li>
                  Perform all services in accordance with applicable laws and
                  professional standards
                </li>
                <li>
                  Be respectful, professional and honest in interactions with
                  customers
                </li>
                <li>
                  Comply with communication rules and procedures determined by
                  Simorgh Service
                </li>
                <li>Take all necessary precautions for safety and health</li>
                <li>
                  Ensure all profile information is accurate and up-to-date
                </li>
              </ul>
            </section>

            {/* 10. Insurance */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-[#4EC6E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  10
                </span>
                <ShieldCheckIcon className="h-5 w-5 text-[#4EC6E5]" />
                <h4 className="font-semibold text-slate-900">Insurance</h4>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-slate-700 text-sm">
                  The Contractor is responsible for maintaining appropriate
                  insurance policies (e.g., general liability insurance)
                  necessary for business operation. If requested by Simorgh
                  Service, the Contractor will provide evidence that such
                  insurance policies are in effect.
                </p>
              </div>
            </section>

            {/* 11. Term and Termination */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-[#4EC6E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  11
                </span>
                <ClockIcon className="h-5 w-5 text-[#4EC6E5]" />
                <h4 className="font-semibold text-slate-900">
                  Term and Termination
                </h4>
              </div>
              <ul className="text-slate-700 text-sm space-y-2 list-disc list-inside">
                <li>
                  Agreement is valid while Contractor continues to use Simorgh
                  Service
                </li>
                <li>
                  Simorgh Service may terminate immediately with written notice
                </li>
                <li>Contractor may terminate by closing the account</li>
                <li>Material breach requires 3 days written notice to cure</li>
              </ul>
            </section>

            {/* 16. Important Prohibitions */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  16
                </span>
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                <h4 className="font-semibold text-red-700">
                  Prohibition on Customer Communication and Non-Simorgh Service
                  Business
                </h4>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-3">
                <p className="text-red-700 text-sm font-medium">
                  <strong>STRICTLY PROHIBITED:</strong>
                </p>
                <ul className="text-red-700 text-sm space-y-2 list-disc list-inside">
                  <li>
                    Contacting customers via phone, email, social media or other
                    direct communication methods
                  </li>
                  <li>
                    Doing business directly with any customer met through
                    Simorgh Service
                  </li>
                  <li>Referring customers to other service providers</li>
                </ul>
                <p className="text-red-700 text-sm font-medium">
                  Violation will result in immediate termination and potential
                  legal action for damages.
                </p>
              </div>
            </section>

            {/* 17. Brand Usage */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-[#4EC6E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  17
                </span>
                <h4 className="font-semibold text-slate-900">Brand Usage</h4>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <p className="text-slate-700 text-sm">
                  • <strong>Logo t-shirts:</strong> Must be worn visibly while
                  providing services (provided for $15)
                </p>
                <p className="text-slate-700 text-sm">
                  • <strong>Vehicle logos:</strong> Must be attached to vehicles
                  used for service (provided for $54)
                </p>
                <p className="text-slate-700 text-sm">
                  • Materials must be returned upon contract termination
                </p>
              </div>
            </section>

            {/* 12. Applicable Law */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-6 h-6 bg-[#4EC6E5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  12
                </span>
                <ScaleIcon className="h-5 w-5 text-[#4EC6E5]" />
                <h4 className="font-semibold text-slate-900">
                  Applicable Law and Dispute Resolution
                </h4>
              </div>
              <p className="text-slate-700 text-sm">
                This Agreement shall be governed by and construed in accordance
                with the laws of the State of Delaware. Any dispute shall be
                resolved in a court of competent jurisdiction in Delaware.
              </p>
            </section>
          </div>

          {/* Electronic Acceptance */}
          <div className="mt-8 mb-6">
            <div className="bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] border border-[#4EC6E5]/30 rounded-lg p-6">
              <h3 className="font-bold text-slate-900 mb-3 text-center">
                Electronic Acceptance
              </h3>
              <p className="text-slate-700 text-sm text-center leading-relaxed">
                By registering for and/or using Simorgh Service, Contractor
                declares that it has read, understood and accepted all the terms
                and conditions of this Independent Contractor Agreement. This
                application has been made online, and the contract is deemed to
                have been signed electronically when the form is sent to us.
              </p>
              <div className="mt-4 text-center">
                <p className="text-[#4EC6E5] font-semibold text-sm">
                  SIMORGH SERVICE GROUP LLC
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4EC6E5]/25 text-sm sm:text-base"
            >
              I Have Read and Understand the Agreement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorAgreementModal;
