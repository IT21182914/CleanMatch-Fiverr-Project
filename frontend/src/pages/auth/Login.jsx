import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { validateEmail } from "../../lib/utils";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrors({ general: result.error });
      }
    } catch {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex flex-col justify-center py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex justify-center">
            <img
              src="/Simorgh-Service-Logo.webp"
              alt="Simorgh Service Logo"
              className="logo-image h-16 w-auto sm:h-20 object-contain hover:scale-105 transition-all duration-300"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back to SIMORGH SERVICE
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Sign in to your account and get back to a spotless home
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-6 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {errors.general}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 mt-6">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Enter your email address"
                  className="pl-10 py-2.5 sm:py-3 text-sm"
                  style={{
                    "--tw-ring-color": "#6ED1EA",
                    "--tw-border-color": "#6ED1EA",
                  }}
                  required
                />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Enter your password"
                  className="pr-10 py-2.5 sm:py-3 text-sm"
                  style={{
                    "--tw-ring-color": "#6ED1EA",
                    "--tw-border-color": "#6ED1EA",
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6 z-10"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium transition-colors duration-200"
                  style={{ color: "#6ED1EA" }}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white rounded-lg"
                style={{ backgroundColor: "#6ED1EA" }}
                loading={loading}
                loadingVariant="dots"
                loadingText="Signing you in..."
                disabled={loading}
              >
                {!loading && (
                  <>
                    Sign in to SIMORGH SERVICE
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to SIMORGH SERVICE?
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 sm:mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                style={{ "--tw-ring-color": "#6ED1EA" }}
              >
                Create your account
              </Link>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1" />
                <span>Secure Login</span>
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
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 text-center px-2">
          <p className="text-xs sm:text-sm text-gray-600">
            By signing in, you agree to our{" "}
            <Link
              to="/terms"
              className="font-medium"
              style={{ color: "#6ED1EA" }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium"
              style={{ color: "#6ED1EA" }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Benefits Preview */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
            Why choose SIMORGH SERVICE?
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              "Book cleaning services in under 2 minutes",
              "Vetted and insured professional cleaners",
              "Satisfaction guarantee on every service",
              "Flexible scheduling that fits your life",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                  style={{ backgroundColor: "#6ED1EA" }}
                ></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {benefit}
                </span>
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
                  New customers save with $19 First Clean
                </p>
                <p className="text-xs text-cyan-700 mt-1">
                  Professional cleaning service starting at just $19 for your
                  first booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
