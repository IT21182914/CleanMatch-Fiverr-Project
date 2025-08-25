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
      {/* Clean & Fresh backdrop perfect for cleaning service */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/95 via-blue-50/85 to-cyan-100/90 backdrop-blur-3xl"></div>

      {/* Floating cleaning bubbles effect - More visible */}
      <div className="absolute top-20 left-16 w-40 h-40 bg-gradient-to-br from-[#4EC6E5]/60 to-white/70 rounded-full blur-3xl animate-bounce opacity-80"></div>
      <div className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-br from-[#2BA8CD]/55 to-white/65 rounded-full blur-2xl animate-pulse delay-500 opacity-75"></div>
      <div className="absolute bottom-40 left-32 w-28 h-28 bg-gradient-to-br from-cyan-300/50 to-white/60 rounded-full blur-xl animate-bounce delay-1000 opacity-70"></div>
      <div className="absolute bottom-20 right-32 w-36 h-36 bg-gradient-to-br from-[#4EC6E5]/50 to-sky-200/60 rounded-full blur-2xl animate-pulse delay-1500 opacity-75"></div>
      <div className="absolute top-1/2 left-20 w-24 h-24 bg-gradient-to-br from-blue-200/55 to-white/70 rounded-full blur-xl animate-bounce delay-2000 opacity-70"></div>

      {/* Additional floating bubbles with different animations - More visible */}
      <div
        className="absolute top-16 left-1/2 w-20 h-20 bg-gradient-to-br from-white/60 to-[#4EC6E5]/50 rounded-full blur-lg animate-spin opacity-70"
        style={{ animationDuration: "15s" }}
      ></div>
      <div
        className="absolute bottom-16 right-1/2 w-16 h-16 bg-gradient-to-br from-cyan-200/55 to-white/60 rounded-full blur-md animate-bounce opacity-75"
        style={{ animationDelay: "2.5s" }}
      ></div>
      <div
        className="absolute top-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-[#2BA8CD]/50 to-white/55 rounded-full blur-sm animate-pulse opacity-80"
        style={{ animationDelay: "3s" }}
      ></div>

      {/* Floating cleaning icons/shapes - More visible */}
      <div
        className="absolute top-12 right-1/4 w-8 h-8 bg-[#4EC6E5]/70 rounded-sm blur-sm animate-bounce rotate-45 opacity-60"
        style={{ animationDelay: "1s", animationDuration: "3s" }}
      ></div>
      <div
        className="absolute bottom-12 left-1/3 w-6 h-12 bg-cyan-300/60 rounded-full blur-sm animate-pulse opacity-70"
        style={{ animationDelay: "1.8s" }}
      ></div>
      <div
        className="absolute top-1/4 right-12 w-10 h-4 bg-white/70 rounded-full blur-sm animate-bounce opacity-65"
        style={{ animationDelay: "2.2s" }}
      ></div>

      {/* Sparkle/shine effects for cleanliness - Brighter */}
      <div className="absolute top-24 right-16 w-4 h-4 bg-white/95 rounded-full animate-ping delay-300 opacity-90"></div>
      <div className="absolute bottom-32 left-24 w-3 h-3 bg-[#4EC6E5]/80 rounded-full animate-ping delay-700 opacity-85"></div>
      <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-cyan-300/70 rounded-full animate-ping delay-1100 opacity-80"></div>
      <div className="absolute bottom-1/3 right-20 w-3 h-3 bg-white/90 rounded-full animate-ping delay-1400 opacity-85"></div>

      {/* More sparkle effects - Brighter and more visible */}
      <div
        className="absolute top-8 left-1/3 w-2 h-2 bg-white/95 rounded-full animate-ping opacity-90"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="absolute bottom-8 right-1/4 w-3 h-3 bg-[#4EC6E5]/85 rounded-full animate-ping opacity-90"
        style={{ animationDelay: "2.8s" }}
      ></div>
      <div
        className="absolute top-2/3 left-8 w-2.5 h-2.5 bg-cyan-400/80 rounded-full animate-ping opacity-85"
        style={{ animationDelay: "1.6s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-white/95 rounded-full animate-ping opacity-90"
        style={{ animationDelay: "3.2s" }}
      ></div>

      {/* Animated wave effects - More visible */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 left-0 w-full h-64 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-y-3 animate-pulse opacity-40"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute -bottom-32 right-0 w-full h-48 bg-gradient-to-l from-transparent via-[#4EC6E5]/20 to-transparent -skew-y-2 animate-pulse opacity-35"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        ></div>
      </div>

      {/* Floating particles - More visible */}
      <div
        className="absolute top-20 left-8 w-2 h-2 bg-[#4EC6E5]/70 rounded-full animate-bounce opacity-80"
        style={{ animationDuration: "4s", animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-24 right-8 w-1.5 h-1.5 bg-white/85 rounded-full animate-bounce opacity-75"
        style={{ animationDuration: "5s", animationDelay: "2.5s" }}
      ></div>
      <div
        className="absolute top-1/2 right-4 w-2 h-2 bg-cyan-300/60 rounded-full animate-bounce opacity-70"
        style={{ animationDuration: "3.5s", animationDelay: "0.8s" }}
      ></div>

      {/* Clean glass morphism overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/30 via-sky-50/20 to-cyan-50/25"></div>

      {/* Subtle cleaning-themed pattern */}
      <div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `radial-gradient(circle at 4px 4px, rgba(78, 198, 229, 0.3) 1px, transparent 0), 
                           radial-gradient(circle at 20px 20px, rgba(255, 255, 255, 0.4) 0.5px, transparent 0)`,
          backgroundSize: "40px 40px, 60px 60px",
        }}
      ></div>

      {/* Final pristine overlay */}
      <div className="absolute inset-0 backdrop-blur-lg bg-white/8"></div>

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
