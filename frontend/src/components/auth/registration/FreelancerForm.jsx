import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import PasswordField from "./PasswordField";
import DocumentUploadSection from "./DocumentUploadSection";

const FreelancerForm = ({
  formData,
  errors,
  onChange,
  onEmailBlur,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  onShowAgreementModal,
  cleaningServiceOptions,
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

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Phone Number
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
            placeholder="(555) 123-4567"
          />
        </div>
        {errors.phone && (
          <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
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

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HomeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={onChange}
            className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
              errors.address ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
            placeholder="123 Main St"
          />
        </div>
        {errors.address && (
          <p className="mt-2 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            City
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={onChange}
              className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
                errors.city ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
              placeholder="New York"
            />
          </div>
          {errors.city && (
            <p className="mt-2 text-sm text-red-600">{errors.city}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            required
            value={formData.state}
            onChange={onChange}
            className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
              errors.state ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
            placeholder="NY"
          />
          {errors.state && (
            <p className="mt-2 text-sm text-red-600">{errors.state}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Postal Code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            required
            value={formData.postalCode}
            onChange={onChange}
            className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
              errors.postalCode ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
            placeholder="12345"
          />
          {errors.postalCode && (
            <p className="mt-2 text-sm text-red-600">{errors.postalCode}</p>
          )}
        </div>
      </div>

      {/* Cleaning Services Offered */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cleaning Services Offered
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {cleaningServiceOptions.map((service) => (
            <label key={service} className="flex items-center">
              <input
                type="checkbox"
                name="cleaningServices"
                value={service}
                checked={formData.cleaningServices.includes(service)}
                onChange={onChange}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{service}</span>
            </label>
          ))}
        </div>
        {errors.cleaningServices && (
          <p className="mt-2 text-sm text-red-600">{errors.cleaningServices}</p>
        )}
      </div>

      {/* Cleaning Frequency */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cleaning Frequency
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="cleaningFrequency"
              value="part-time"
              checked={formData.cleaningFrequency === "part-time"}
              onChange={onChange}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Part Time</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="cleaningFrequency"
              value="full-time"
              checked={formData.cleaningFrequency === "full-time"}
              onChange={onChange}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Full Time</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="cleaningFrequency"
              value="preferred-hours"
              checked={formData.cleaningFrequency === "preferred-hours"}
              onChange={onChange}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Preferred Hours</span>
          </label>
        </div>

        {formData.cleaningFrequency === "preferred-hours" && (
          <div className="mt-3">
            <input
              name="preferredHours"
              type="text"
              value={formData.preferredHours}
              onChange={onChange}
              className={`appearance-none relative block w-full px-3 py-2.5 border ${
                errors.preferredHours ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-colors duration-200`}
              placeholder="e.g., Weekdays 9am-3pm"
            />
            {errors.preferredHours && (
              <p className="mt-1 text-sm text-red-600">
                {errors.preferredHours}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={onChange}
          className="appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-colors duration-200"
          placeholder="Tell us about your cleaning experience and why you'd like to join SIMORGH SERVICE..."
        />
      </div>

      {/* Document Upload Section */}
      <DocumentUploadSection errors={errors} onChange={onChange} />

      {/* Required Checkboxes */}
      <div className="space-y-3">
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
              I agree to the terms & conditions
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
          )}
        </div>

        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agreeAgreement"
              checked={formData.agreeAgreement}
              onChange={onChange}
              className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              I have read and accept the agreement
            </span>
          </label>
          {errors.agreeAgreement && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeAgreement}</p>
          )}
        </div>

        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agree1099Terms"
              checked={formData.agree1099Terms}
              onChange={onChange}
              className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              I have read and understand the{" "}
              <button
                type="button"
                onClick={onShowAgreementModal}
                className="text-cyan-600 hover:text-cyan-500 font-medium underline"
              >
                1099 freelancer agreement, Privacy and Terms of Use
              </button>{" "}
              of Simorgh Service Group LLC and I agree to all of their Terms.
            </span>
          </label>
          {errors.agree1099Terms && (
            <p className="mt-1 text-sm text-red-600">{errors.agree1099Terms}</p>
          )}
        </div>

        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="bringSupplies"
              checked={formData.bringSupplies}
              onChange={onChange}
              className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              I will bring my own cleaning supplies
            </span>
          </label>
          {errors.bringSupplies && (
            <p className="mt-1 text-sm text-red-600">{errors.bringSupplies}</p>
          )}
        </div>

        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="hasExperience"
              checked={formData.hasExperience}
              onChange={onChange}
              className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              I have experience in the field of cleaning
            </span>
          </label>
          {errors.hasExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.hasExperience}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default FreelancerForm;
