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
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back to CleanMatch
          </h2>
          <p className="text-lg text-gray-600">
            Sign in to your account and get back to a spotless home
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pr-10 pl-3 py-3 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex justify-center py-3 text-base font-semibold"
                loading={loading}
                loadingVariant="spinner"
                loadingText="Signing you in..."
                disabled={loading}
              >
                {!loading && (
                  <>
                    Sign in to CleanMatch
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to CleanMatch?
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
              >
                Create your account
              </Link>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center">
                <SparklesIcon className="h-4 w-4 text-yellow-500 mr-1" />
                <span>Trusted Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{" "}
            <Link
              to="/terms"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Benefits Preview */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Why choose CleanMatch?
          </h3>
          <div className="space-y-3">
            {[
              "Book cleaning services in under 2 minutes",
              "Vetted and insured professional cleaners",
              "Satisfaction guarantee on every service",
              "Flexible scheduling that fits your life",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <SparklesIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  New customers save with $19 First Clean
                </p>
                <p className="text-xs text-yellow-700 mt-1">
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
