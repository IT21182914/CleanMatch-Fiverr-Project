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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5]/20 via-[#2BA8CD]/30 to-slate-900/40 backdrop-blur-md"></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-300 border border-white/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Modal content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/20 mb-4 shadow-lg">
            <ExclamationTriangleIcon className="h-8 w-8 text-[#4EC6E5]" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Login Required
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Please log in to your account to book this cleaning service. It only
            takes a moment!
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#3AA8CC] hover:to-[#1E8BAD] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Log In to Book Service
            </button>

            <button
              onClick={handleSignupClick}
              className="w-full border-2 border-[#4EC6E5] text-[#4EC6E5] py-3 px-4 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:text-white transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              Create New Account
            </button>
          </div>

          {/* Additional info */}
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            Don't worry! We'll bring you right back to book this service after
            you log in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
