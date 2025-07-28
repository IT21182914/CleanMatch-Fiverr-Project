import { Link } from "react-router-dom";
import { ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";

const FormFooter = () => {
  return (
    <>
      {/* Divider */}
      <div className="mt-4 sm:mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="mt-4 sm:mt-6">
        <Link
          to="/login"
          className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
          style={{ "--tw-ring-color": "#6ED1EA" }}
        >
          Sign in to your account
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs text-gray-500">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1" />
            <span>Secure Registration</span>
          </div>
          <div className="flex items-center">
            <SparklesIcon
              className="h-4 w-4 mr-1"
              style={{ color: "#6ED1EA" }}
            />
            <span>Trusted Service</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormFooter;
