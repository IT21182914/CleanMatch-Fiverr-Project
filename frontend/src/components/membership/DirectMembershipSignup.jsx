import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import {
  CheckCircleIcon,
  SparklesIcon,
  UserPlusIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { authAPI } from "../../lib/api";

const DirectMembershipSignup = ({
  onClose,
  selectedTier = "supersaver",
  redirectAfterSignup = "/memberships/subscribe",
}) => {
  const [step, setStep] = useState(1); // 1: Registration, 2: Success
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
    marketingEmails: true,
  });

  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      agreeToTerms,
    } = formData;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !agreeToTerms
    ) {
      showToast("Please fill in all required fields", "error");
      return false;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return false;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error");
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Register the user
      await authAPI.register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "customer",
        marketing_emails: formData.marketingEmails,
      });

      // Auto-login after successful registration
      await login(formData.email, formData.password);

      setStep(2);

      // Redirect to membership subscription after a short delay
      setTimeout(() => {
        navigate(redirectAfterSignup, {
          state: {
            selectedTier,
            welcomeMessage:
              "Welcome! Complete your membership subscription below.",
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      showToast(
        error.response?.data?.error || "Registration failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const membershipBenefits = [
    "50% discount on all cleaning services",
    "Priority booking & flexible scheduling",
    "24/7 customer support",
    "Service guarantee",
    "Cancel anytime, no contracts",
  ];

  if (user) {
    // User is already logged in, redirect to membership subscription
    navigate(redirectAfterSignup, { state: { selectedTier } });
    return null;
  }

  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to CleanMatch!
            </h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You'll be redirected
              to complete your membership subscription.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Benefits */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Join SuperSaver Membership</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <SparklesIcon className="h-6 w-6 mr-2" />
                  <span className="text-xl font-bold">
                    Save 50% on Every Service
                  </span>
                </div>
                <p className="text-blue-100">
                  House cleaning: $18/hour instead of $36/hour
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">$59/month</div>
                <p className="text-blue-100">
                  No setup fees • Cancel anytime • Money-back guarantee
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">
                  Your Membership Includes:
                </h3>
                {membershipBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 mr-3 mt-0.5 text-green-300" />
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-300/30">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 mr-2 text-yellow-300" />
                  <span className="font-semibold text-yellow-300">
                    Limited Time Offer
                  </span>
                </div>
                <p className="text-yellow-100 text-sm">
                  Join today and start saving immediately on all cleaning
                  services
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <UserPlusIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">
                Create Your Account
              </h3>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength="6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 mr-2"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    *
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={formData.marketingEmails}
                    onChange={handleInputChange}
                    className="mt-1 mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    Send me promotional emails and cleaning tips
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Create Account & Continue to Membership
                  </div>
                )}
              </Button>

              <div className="flex items-center justify-center text-sm text-gray-500">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                <span>Your information is secure and encrypted</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMembershipSignup;
