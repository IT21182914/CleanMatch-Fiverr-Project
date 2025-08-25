import React from "react";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const LoginRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Store the current service page in sessionStorage to redirect back after login
    const currentPath = window.location.pathname;
    sessionStorage.setItem("redirectAfterLogin", "/book");
    sessionStorage.setItem("servicePageBeforeLogin", currentPath);

    // Navigate to login page
    navigate("/customer/login");
    onClose();
  };

  const handleSignupClick = () => {
    // Store the current service page in sessionStorage to redirect back after signup
    const currentPath = window.location.pathname;
    sessionStorage.setItem("redirectAfterLogin", "/book");
    sessionStorage.setItem("servicePageBeforeLogin", currentPath);

    // Navigate to signup page
    navigate("/customer/register");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative animate-in fade-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Modal content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#4EC6E5]/10 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-[#4EC6E5]" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Login Required
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Please log in to your account to book this cleaning service. It only
            takes a moment!
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full bg-[#4EC6E5] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#3AA8CC] transition-colors"
            >
              Log In to Book Service
            </button>

            <button
              onClick={handleSignupClick}
              className="w-full border-2 border-[#4EC6E5] text-[#4EC6E5] py-3 px-4 rounded-xl font-semibold hover:bg-[#4EC6E5] hover:text-white transition-colors"
            >
              Create New Account
            </button>
          </div>

          {/* Additional info */}
          <p className="text-sm text-gray-500 mt-4">
            Don't worry! We'll bring you right back to book this service after
            you log in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
