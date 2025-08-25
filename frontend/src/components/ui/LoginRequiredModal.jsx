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
      {/* Light modern layered backdrop with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-[#4EC6E5]/20 to-cyan-50/90 backdrop-blur-3xl"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#4EC6E5]/15 to-[#2BA8CD]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#2BA8CD]/18 to-[#4EC6E5]/12 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Light glass morphism overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/20 via-cyan-50/30 to-white/15"></div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(78, 198, 229, 0.4) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* Final light blur layer for depth */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/10"></div>

      {/* Modal content */}
      <div className="relative bg-white/98 backdrop-blur-lg rounded-3xl shadow-2xl max-w-lg w-full mx-4 animate-in fade-in zoom-in-95 duration-500 ease-out border border-white/40 overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-2 bg-gradient-to-r from-[#4EC6E5] via-[#2BA8CD] to-[#4EC6E5] animate-pulse"></div>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100/80 text-gray-400 hover:text-gray-600 transition-all duration-200 group z-10"
        >
          <XMarkIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </button>{" "}
        {/* Modal content */}
        <div className="px-8 py-10 text-center">
          {/* Modern icon with animated glow */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-[#4EC6E5]/20 to-[#2BA8CD]/30 mb-6 shadow-lg relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4EC6E5]/30 to-[#2BA8CD]/40 blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <ExclamationTriangleIcon className="h-10 w-10 text-[#4EC6E5] relative z-10 drop-shadow-sm" />
          </div>

          {/* Modern title with gradient */}
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Authentication Required
          </h3>

          {/* Subtitle */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#4EC6E5]/10 border border-[#4EC6E5]/20 mb-6">
            <span className="text-sm font-medium text-[#2BA8CD]">
              Secure Login
            </span>
          </div>

          {/* Modern message */}
          <p className="text-gray-600 mb-8 leading-relaxed text-lg font-light max-w-sm mx-auto">
            Sign in to access your account and book this premium cleaning
            service seamlessly.
          </p>

          {/* Modern action buttons */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleLoginClick}
              className="group w-full relative overflow-hidden bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#4EC6E5]/25 transform hover:scale-[1.02] hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In to Continue
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3AA8CC] to-[#1E8BAD] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={handleSignupClick}
              className="group w-full relative overflow-hidden border-2 border-[#4EC6E5]/30 text-[#4EC6E5] py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:border-[#4EC6E5] hover:shadow-lg hover:shadow-[#4EC6E5]/10 transform hover:scale-[1.02] bg-gradient-to-r from-transparent to-transparent hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:text-white"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Create New Account
              </span>
            </button>
          </div>

          {/* Modern info badge */}
          <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
            <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-600 font-medium">
              Secure authentication • Quick redirect back to service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
