import { SparklesIcon } from "@heroicons/react/24/outline";

const RegistrationBenefits = ({ selectedRole }) => {
  return (
    <div className="mt-6 sm:mt-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
        {selectedRole === "customer"
          ? "What you'll get with SIMORGH SERVICE"
          : "Benefits of joining as a Freelancer"}
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {(selectedRole === "customer"
          ? [
              "Access to vetted and insured professional cleaners",
              "Flexible scheduling that fits your lifestyle",
              "Satisfaction guarantee on every service",
              "Easy booking and payment through our platform",
            ]
          : [
              "Access to a large customer base",
              "Flexible work schedule and location",
              "Competitive earnings and regular payments",
              "Professional support and training resources",
            ]
        ).map((benefit, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-2 h-2 rounded-full mr-2 sm:mr-3 flex-shrink-0"
              style={{ backgroundColor: "#6ED1EA" }}
            ></div>
            <span className="text-xs sm:text-sm text-gray-600">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
        <div className="flex items-center">
          <SparklesIcon
            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
            style={{ color: "#6ED1EA" }}
          />
          <div>
            <p className="text-xs sm:text-sm font-semibold text-cyan-800">
              {selectedRole === "customer"
                ? "New customers get $19 First Clean"
                : "Start earning immediately"}
            </p>
            <p className="text-xs text-cyan-700 mt-1">
              {selectedRole === "customer"
                ? "Start your cleaning journey with a special introductory rate"
                : "Join our network of professional cleaners and start taking jobs today"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationBenefits;
