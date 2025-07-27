import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  MapPinIcon,
  ArrowRightIcon,
  DocumentIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import { validateEmail, validatePassword } from "../../lib/utils";

const RoleBasedRegistrationForm = () => {
  const [selectedRole, setSelectedRole] = useState("customer");
  const [formData, setFormData] = useState({
    // Common fields
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Customer fields
    firstName: "",
    lastName: "",
    userName: "",

    // Freelancer fields
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    cleaningServices: [],
    cleaningFrequency: "part-time",
    preferredHours: "",
    message: "",
    idFront: null,
    idBack: null,
    ssnFront: null,
    ssnBack: null,

    // Agreement checkboxes
    agreeTerms: false,
    agreeAgreement: false,
    agree1099Terms: false,
    bringSupplies: false,
    hasExperience: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const cleaningServiceOptions = [
    "Residential Cleaning",
    "Commercial Cleaning",
    "Deep Cleaning",
    "Move-in/Move-out Cleaning",
    "Post-Construction Cleaning",
    "Window Cleaning",
    "Carpet Cleaning",
    "Pressure Washing",
  ];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrors({}); // Clear errors when switching roles
    // Reset form data when switching roles
    setFormData((prev) => ({
      ...prev,
      // Reset role-specific fields
      firstName: "",
      lastName: "",
      userName: "",
      fullName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      cleaningServices: [],
      cleaningFrequency: "part-time",
      preferredHours: "",
      message: "",
      idFront: null,
      idBack: null,
      ssnFront: null,
      ssnBack: null,
      agreeTerms: false,
      agreeAgreement: false,
      agree1099Terms: false,
      bringSupplies: false,
      hasExperience: false,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (type === "checkbox") {
      if (name === "cleaningServices") {
        const updatedServices = checked
          ? [...formData.cleaningServices, value]
          : formData.cleaningServices.filter((service) => service !== value);
        setFormData((prev) => ({
          ...prev,
          cleaningServices: updatedServices,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateCustomerForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "User name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must accept the terms & conditions";
    }

    return newErrors;
  };

  const validateFreelancerForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    if (formData.cleaningServices.length === 0) {
      newErrors.cleaningServices =
        "Please select at least one cleaning service";
    }

    if (
      formData.cleaningFrequency === "preferred-hours" &&
      !formData.preferredHours.trim()
    ) {
      newErrors.preferredHours = "Please specify your preferred hours";
    }

    // Documents are required only if user wants to become a verified freelancer
    const wantsToUploadDocs =
      formData.idFront ||
      formData.idBack ||
      formData.ssnFront ||
      formData.ssnBack;

    if (wantsToUploadDocs) {
      // If any document is uploaded, all must be uploaded
      if (!formData.idFront) {
        newErrors.idFront = "ID front image is required for verification";
      }

      if (!formData.idBack) {
        newErrors.idBack = "ID back image is required for verification";
      }

      if (!formData.ssnFront) {
        newErrors.ssnFront = "SSN front image is required for verification";
      }

      if (!formData.ssnBack) {
        newErrors.ssnBack = "SSN back image is required for verification";
      }

      if (!formData.agreeAgreement) {
        newErrors.agreeAgreement = "You must read and accept the agreement";
      }

      if (!formData.agree1099Terms) {
        newErrors.agree1099Terms =
          "You must read and understand the 1099 freelancer agreement";
      }

      if (!formData.bringSupplies) {
        newErrors.bringSupplies =
          "You must confirm that you will bring your own cleaning supplies";
      }

      if (!formData.hasExperience) {
        newErrors.hasExperience =
          "You must confirm that you have experience in cleaning";
      }
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms & conditions";
    }

    return newErrors;
  };

  const validateForm = () => {
    const newErrors =
      selectedRole === "customer"
        ? validateCustomerForm()
        : validateFreelancerForm();

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (selectedRole === "customer") {
        // Customer registration (regular form)
        const registrationData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.userName,
          phone: formData.phone,
          role: "customer",
        };

        const result = await register(registrationData);
        if (result.success) {
          navigate("/dashboard");
        } else {
          setErrors({ general: result.error });
        }
      } else {
        // Check if user wants to upload documents (freelancer) or just register as cleaner
        const hasDocuments =
          formData.idFront &&
          formData.idBack &&
          formData.ssnFront &&
          formData.ssnBack;

        if (hasDocuments) {
          // Full freelancer registration with documents
          const formDataToSend = new FormData();

          // Add text fields
          formDataToSend.append("email", formData.email);
          formDataToSend.append("password", formData.password);
          formDataToSend.append("fullName", formData.fullName);
          formDataToSend.append("phone", formData.phone);
          formDataToSend.append("address", formData.address);
          formDataToSend.append("city", formData.city);
          formDataToSend.append("state", formData.state);
          formDataToSend.append("postalCode", formData.postalCode);
          formDataToSend.append(
            "cleaningServices",
            JSON.stringify(formData.cleaningServices)
          );
          formDataToSend.append(
            "cleaningFrequency",
            formData.cleaningFrequency
          );
          formDataToSend.append("preferredHours", formData.preferredHours);
          formDataToSend.append("message", formData.message);

          // Add file uploads
          formDataToSend.append("idFront", formData.idFront);
          formDataToSend.append("idBack", formData.idBack);
          formDataToSend.append("ssnFront", formData.ssnFront);
          formDataToSend.append("ssnBack", formData.ssnBack);

          // Call freelancer registration endpoint
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000/api";

          let response;
          try {
            response = await fetch(`${apiUrl}/auth/register-freelancer`, {
              method: "POST",
              body: formDataToSend,
            });
          } catch (fetchError) {
            console.error("Network error:", fetchError);
            setErrors({
              general:
                "Cannot connect to server. Please make sure the backend server is running on port 5000.",
            });
            return;
          }

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Registration failed" }));
            throw new Error(
              errorData.error || `HTTP error! status: ${response.status}`
            );
          }

          const result = await response.json();

          if (result.success) {
            // Store authentication data
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            if (result.refreshToken) {
              localStorage.setItem("refreshToken", result.refreshToken);
            }

            // Update auth context
            setUser(result.user);
            setIsAuthenticated(true);
            navigate("/dashboard");
          } else {
            setErrors({
              general: result.error || "Registration failed. Please try again.",
            });
          }
        } else {
          // Basic cleaner registration without documents
          const [firstName, ...lastNameParts] = formData.fullName
            .trim()
            .split(" ");
          const lastName = lastNameParts.join(" ") || "";

          const registrationData = {
            email: formData.email,
            password: formData.password,
            firstName: firstName,
            lastName: lastName,
            phone: formData.phone,
            role: "cleaner",
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.postalCode,
            cleaningServices: formData.cleaningServices,
            cleaningFrequency: formData.cleaningFrequency,
            preferredHours: formData.preferredHours,
            message: formData.message,
          };

          try {
            const result = await register(registrationData);
            if (result.success) {
              navigate("/dashboard");
            } else {
              setErrors({
                general:
                  result.error || "Registration failed. Please try again.",
              });
            }
          } catch (registerError) {
            console.error("Cleaner registration error:", registerError);
            setErrors({
              general:
                "Cannot connect to server. Please make sure the backend server is running.",
            });
          }
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex flex-col justify-center py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex justify-center">
            <img
              src="/Simorgh-Service-Logo.webp"
              alt="Simorgh Service Logo"
              className="h-16 w-auto sm:h-20 object-contain hover:scale-105 transition-all duration-300"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Join CleanMatch Today
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Choose your role and create your account
          </p>
        </div>

        {/* Role Selection Buttons */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => handleRoleChange("customer")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                  selectedRole === "customer"
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <UserIcon className="h-5 w-5 inline mr-2" />
                Customer (User)
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("freelancer")}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                  selectedRole === "freelancer"
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <WrenchScrewdriverIcon className="h-5 w-5 inline mr-2" />
                Freelancer (Cleaner/Agency)
              </button>
            </div>
          </div>
        </div>

        {/* Registration Form */}
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

            {/* Customer Form */}
            {selectedRole === "customer" && (
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
                        onChange={handleChange}
                        className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
                          errors.firstName
                            ? "border-red-300"
                            : "border-gray-300"
                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                        placeholder="First name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.firstName}
                      </p>
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
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
                        errors.lastName ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                      placeholder="Last name"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.lastName}
                      </p>
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
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
                      errors.userName ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                    placeholder="Choose a username"
                  />
                  {errors.userName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.userName}
                    </p>
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full pr-10 pl-3 py-2.5 sm:py-3 border ${
                          errors.password ? "border-red-300" : "border-gray-300"
                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
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
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full pr-10 pl-3 py-2.5 sm:py-3 border ${
                          errors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Freelancer Form */}
            {selectedRole === "freelancer" && (
              <>
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
                        errors.fullName ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full pr-10 pl-3 py-2.5 sm:py-3 border ${
                          errors.password ? "border-red-300" : "border-gray-300"
                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
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
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full pr-10 pl-3 py-2.5 sm:py-3 border ${
                          errors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
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
                      onChange={handleChange}
                      className={`appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
                        errors.address ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                      placeholder="123 Main St"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.address}
                    </p>
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
                        onChange={handleChange}
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
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
                        errors.state ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.state}
                      </p>
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
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-2.5 sm:py-3 border ${
                        errors.postalCode ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
                      placeholder="12345"
                    />
                    {errors.postalCode && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.postalCode}
                      </p>
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
                          onChange={handleChange}
                          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {service}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.cleaningServices && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.cleaningServices}
                    </p>
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
                        onChange={handleChange}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Part Time
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="cleaningFrequency"
                        value="full-time"
                        checked={formData.cleaningFrequency === "full-time"}
                        onChange={handleChange}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Full Time
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="cleaningFrequency"
                        value="preferred-hours"
                        checked={
                          formData.cleaningFrequency === "preferred-hours"
                        }
                        onChange={handleChange}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Preferred Hours
                      </span>
                    </label>
                  </div>

                  {formData.cleaningFrequency === "preferred-hours" && (
                    <div className="mt-3">
                      <input
                        name="preferredHours"
                        type="text"
                        value={formData.preferredHours}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-3 py-2.5 border ${
                          errors.preferredHours
                            ? "border-red-300"
                            : "border-gray-300"
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
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-colors duration-200"
                    placeholder="Tell us about your cleaning experience and why you'd like to join CleanMatch..."
                  />
                </div>

                {/* ID & SSN Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID & SSN Upload (Optional - for verified freelancer status)
                  </label>
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Optional:</span> Upload
                      documents to become a verified freelancer. You can
                      register as a cleaner without documents and upload them
                      later.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        ID Front
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="idFront"
                          accept="image/*"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                        />
                        <DocumentIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.idFront && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.idFront}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        ID Back
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="idBack"
                          accept="image/*"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                        />
                        <DocumentIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.idBack && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.idBack}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        SSN Front
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="ssnFront"
                          accept="image/*"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                        />
                        <DocumentIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.ssnFront && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.ssnFront}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        SSN Back
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="ssnBack"
                          accept="image/*"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                        />
                        <DocumentIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.ssnBack && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.ssnBack}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Required Checkboxes */}
                <div className="space-y-3">
                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-cyan-600 hover:text-cyan-500 font-medium"
                        >
                          terms & conditions
                        </Link>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.agreeTerms}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeAgreement"
                        checked={formData.agreeAgreement}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I have read and accept the agreement
                      </span>
                    </label>
                    {errors.agreeAgreement && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.agreeAgreement}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agree1099Terms"
                        checked={formData.agree1099Terms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I have read and understand the 1099 freelancer agreement
                        and all Terms
                      </span>
                    </label>
                    {errors.agree1099Terms && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.agree1099Terms}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="bringSupplies"
                        checked={formData.bringSupplies}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I will bring my own cleaning supplies
                      </span>
                    </label>
                    {errors.bringSupplies && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bringSupplies}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="hasExperience"
                        checked={formData.hasExperience}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I have experience in the field of cleaning
                      </span>
                    </label>
                    {errors.hasExperience && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.hasExperience}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex justify-center py-2.5 sm:py-3 text-sm sm:text-base font-semibold"
                loading={loading}
                loadingVariant="spinner"
                loadingText="Creating your account..."
                disabled={loading}
              >
                {!loading && (
                  <>
                    Create Account
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
          </form>

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
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 text-center px-2">
          <p className="text-xs sm:text-sm text-gray-600">
            By creating an account, you agree to our{" "}
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
            {selectedRole === "customer"
              ? "What you'll get with CleanMatch"
              : "Benefits of joining as a Freelancer"}
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {(selectedRole === "customer"
              ? [
                  "Access to vetted and insured professional cleaners",
                  "Flexible scheduling that fits your lifestyle",
                  "Satisfaction guarantee on every service",
                  "Easy booking and payment through our platform",
                ]
              : [
                  "Access to a large customer base",
                  "Flexible work schedule and location",
                  "Competitive earnings and regular payments",
                  "Professional support and training resources",
                ]
            ).map((benefit, index) => (
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
                  {selectedRole === "customer"
                    ? "New customers get $19 First Clean"
                    : "Start earning immediately"}
                </p>
                <p className="text-xs text-cyan-700 mt-1">
                  {selectedRole === "customer"
                    ? "Start your cleaning journey with a special introductory rate"
                    : "Join our network of professional cleaners and start taking jobs today"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedRegistrationForm;
