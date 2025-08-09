import { Link } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import PasswordField from "./PasswordField";

const CustomerForm = ({
  formData,
  errors,
  onChange,
  onEmailBlur,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
}) => {
  return (
    <>
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={onChange}
              className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
                errors.firstName ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
              placeholder="First name"
            />
          </div>
          {errors.firstName && (
            <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={onChange}
            className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
              errors.lastName ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* User Name */}
      <div>
        <label
          htmlFor="userName"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          User Name
        </label>
        <input
          id="userName"
          name="userName"
          type="text"
          required
          value={formData.userName}
          onChange={onChange}
          className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
            errors.userName ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
          placeholder="Choose a username"
        />
        {errors.userName && (
          <p className="mt-2 text-sm text-red-600">{errors.userName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={onChange}
            onBlur={onEmailBlur}
            className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
              errors.email ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
            placeholder="Enter your email address"
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Phone Number (International)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PhoneIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={onChange}
            className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
              errors.phone ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        {errors.phone && (
          <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Address Information */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address || ""}
              onChange={onChange}
              className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
                errors.address ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
              placeholder="Enter your address"
            />
          </div>
          {errors.address && (
            <p className="mt-2 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            ZIP Code
          </label>
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            value={formData.zipCode || ""}
            onChange={onChange}
            className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
              errors.zipCode ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
            placeholder="12345"
          />
          {errors.zipCode && (
            <p className="mt-2 text-sm text-red-600">{errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <PasswordField
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Enter your password"
          label="Password"
          error={errors.password}
          showPassword={showPassword}
          onToggleVisibility={onTogglePassword}
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          placeholder="Confirm your password"
          label="Confirm Password"
          error={errors.confirmPassword}
          showPassword={showConfirmPassword}
          onToggleVisibility={onToggleConfirmPassword}
        />
      </div>

      {/* Terms Checkbox */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={onChange}
            className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            I accept the{" "}
            <Link
              to="/terms"
              className="text-cyan-600 hover:text-cyan-500 font-medium"
            >
              Terms & Conditions
            </Link>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
        )}
      </div>
    </>
  );
};

export default CustomerForm;
