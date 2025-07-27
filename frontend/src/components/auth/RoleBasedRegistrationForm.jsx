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

  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Function to check if email is already registered
  const checkEmailAvailability = async (email) => {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/auth/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.available;
      }
    } catch (error) {
      console.warn("Could not check email availability:", error);
    }
    return true; // Assume available if check fails
  };

  // Enhanced email validation with availability check
  const validateEmailField = async (email) => {
    if (!email) {
      return "Email is required";
    }

    if (!validateEmail(email)) {
      return "Please enter a valid email";
    }

    // Check if email is already registered
    const isAvailable = await checkEmailAvailability(email);
    if (!isAvailable) {
      return "An account with this email already exists. Please use a different email or try logging in.";
    }

    return null;
  };

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

  // Handle email blur for real-time validation
  const handleEmailBlur = async (e) => {
    const email = e.target.value.trim();
    if (email && validateEmail(email)) {
      const emailError = await validateEmailField(email);
      if (emailError) {
        setErrors((prev) => ({
          ...prev,
          email: emailError,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }
  };

  const validateCustomerForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "User name is required";
    } else if (formData.userName.trim().length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName.trim())) {
      newErrors.userName =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-()]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-()]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
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
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "Please enter a valid city name";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    } else if (formData.state.trim().length < 2) {
      newErrors.state = "Please enter a valid state";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.postalCode.trim())) {
      newErrors.postalCode =
        "Please enter a valid postal code (e.g., 12345 or 12345-6789)";
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

      // Validate file types and sizes
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      [
        { file: formData.idFront, name: "ID Front" },
        { file: formData.idBack, name: "ID Back" },
        { file: formData.ssnFront, name: "SSN Front" },
        { file: formData.ssnBack, name: "SSN Back" },
      ].forEach(({ file, name }) => {
        if (file) {
          if (!allowedTypes.includes(file.type)) {
            newErrors[
              name.toLowerCase().replace(" ", "")
            ] = `${name} must be an image file (JPEG, PNG, or WebP)`;
          }
          if (file.size > maxSize) {
            newErrors[
              name.toLowerCase().replace(" ", "")
            ] = `${name} file size must be less than 5MB`;
          }
        }
      });

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

    console.log("🔍 Form validation results:", {
      role: selectedRole,
      errors: newErrors,
      errorCount: Object.keys(newErrors).length,
      formData: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        hasDocuments: !!(
          formData.idFront &&
          formData.idBack &&
          formData.ssnFront &&
          formData.ssnBack
        ),
      },
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Clear any previous errors

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
          formDataToSend.append("email", formData.email.trim().toLowerCase());
          formDataToSend.append("password", formData.password);
          formDataToSend.append("firstName", formData.firstName.trim());
          formDataToSend.append("lastName", formData.lastName.trim());
          formDataToSend.append("phone", formData.phone.trim());
          formDataToSend.append("address", formData.address.trim());
          formDataToSend.append("city", formData.city.trim());
          formDataToSend.append("state", formData.state.trim());
          formDataToSend.append("postalCode", formData.postalCode.trim());
          formDataToSend.append(
            "cleaningServices",
            JSON.stringify(formData.cleaningServices)
          );
          formDataToSend.append(
            "cleaningFrequency",
            formData.cleaningFrequency
          );
          formDataToSend.append(
            "preferredHours",
            formData.preferredHours || ""
          );
          formDataToSend.append("message", formData.message || "");

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
            console.log("🚀 Sending freelancer registration request...");
            response = await fetch(`${apiUrl}/auth/register-freelancer`, {
              method: "POST",
              body: formDataToSend,
            });

            console.log(
              "📡 Response received:",
              response.status,
              response.statusText
            );
          } catch (fetchError) {
            console.error("❌ Network error:", fetchError);
            setErrors({
              general:
                "Cannot connect to server. Please check your internet connection and ensure the backend server is running.",
            });
            return;
          }

          let errorData;
          try {
            errorData = await response.json();
            console.log("📄 Response data:", errorData);
          } catch (parseError) {
            console.error("❌ Failed to parse response:", parseError);
            setErrors({
              general: `Server error (${response.status}). Please try again later.`,
            });
            return;
          }

          if (!response.ok) {
            // Handle specific error cases
            let errorMessage = "Registration failed. Please try again.";

            if (response.status === 409) {
              errorMessage =
                "An account with this email already exists. Please use a different email address or try logging in.";
            } else if (response.status === 400) {
              if (errorData.error?.includes("email")) {
                errorMessage = "Please provide a valid email address.";
              } else if (errorData.error?.includes("password")) {
                errorMessage =
                  "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
              } else if (errorData.error?.includes("documents")) {
                errorMessage =
                  "All verification documents (ID front, ID back, SSN front, SSN back) are required.";
              } else {
                errorMessage =
                  errorData.error ||
                  "Invalid registration data. Please check all fields.";
              }
            } else if (response.status === 422) {
              errorMessage =
                errorData.error ||
                "Please check that all required fields are filled correctly.";
            } else if (response.status >= 500) {
              errorMessage =
                "Server error. Please try again later or contact support.";
            } else {
              errorMessage =
                errorData.error ||
                `Error ${response.status}: ${response.statusText}`;
            }

            setErrors({ general: errorMessage });
            return;
          }

          if (errorData.success) {
            console.log("✅ Freelancer registration successful");

            // Automatically log in the user after successful registration
            try {
              const loginResult = await login({
                email: formData.email,
                password: formData.password,
                rememberMe: true, // Keep them logged in
              });

              if (loginResult.success) {
                navigate("/dashboard");
              } else {
                // Fallback: manual token storage if auto-login fails
                localStorage.setItem("token", errorData.token);
                localStorage.setItem("user", JSON.stringify(errorData.user));
                if (errorData.refreshToken) {
                  localStorage.setItem("refreshToken", errorData.refreshToken);
                }
                navigate("/dashboard");
                setTimeout(() => window.location.reload(), 100);
              }
            } catch (authError) {
              console.error("Error with auto-login:", authError);
              setErrors({
                general:
                  "Registration successful! Please log in with your new account.",
              });
            }
          } else {
            setErrors({
              general:
                errorData.error ||
                "Registration completed but login failed. Please try logging in manually.",
            });
          }
        } else {
          // Basic cleaner registration without documents
          const registrationData = {
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phone: formData.phone.trim(),
            role: "cleaner",
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            zipCode: formData.postalCode.trim(), // Backend expects zipCode, not postalCode
            cleaningServices: formData.cleaningServices,
            cleaningFrequency: formData.cleaningFrequency,
            preferredHours: formData.preferredHours || "",
            message: formData.message || "",
          };

          console.log("🚀 Sending basic cleaner registration...");
          console.log("Registration data:", {
            ...registrationData,
            password: "[HIDDEN]",
          });

          const result = await register(registrationData);

          if (result.success) {
            console.log("✅ Basic cleaner registration successful");
            navigate("/dashboard");
          } else {
            console.error("❌ Cleaner registration failed:", result.error);

            // Handle specific error cases for basic cleaner registration
            let errorMessage =
              result.error || "Registration failed. Please try again.";

            if (
              errorMessage.includes("email already exists") ||
              errorMessage.includes("409") ||
              errorMessage.includes("already registered")
            ) {
              errorMessage =
                "An account with this email already exists. Please use a different email address or try logging in.";
            } else if (
              errorMessage.includes("validation") ||
              errorMessage.includes("required")
            ) {
              errorMessage = "Please fill in all required fields correctly.";
            } else if (errorMessage.includes("password")) {
              errorMessage =
                "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
            } else if (errorMessage.includes("email")) {
              errorMessage = "Please provide a valid email address.";
            } else if (
              errorMessage.includes("network") ||
              errorMessage.includes("connect") ||
              errorMessage.includes("fetch")
            ) {
              errorMessage =
                "Cannot connect to server. Please check your internet connection and ensure the backend is running.";
            } else if (
              errorMessage.includes("Role must be either customer or cleaner")
            ) {
              errorMessage =
                "Invalid registration type. Please refresh the page and try again.";
            } else if (
              errorMessage.includes("User with this email already exists")
            ) {
              errorMessage =
                "This email address is already registered. Please use a different email or sign in instead.";
            }

            setErrors({ general: errorMessage });
          }
        }
      }
    } catch (error) {
      console.error("❌ Registration error:", error);

      // Handle different types of errors
      let errorMessage = "Registration failed. Please try again.";

      if (error.message?.includes("fetch")) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
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

            {/* Role Selection Help Text */}
            <div className="mt-3 text-sm text-gray-600">
              {selectedRole === "customer" ? (
                <p className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  You'll be able to book cleaning services and manage your
                  appointments
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="flex items-center">
                    <WrenchScrewdriverIcon className="h-4 w-4 mr-1" />
                    You'll be able to offer cleaning services to customers
                  </p>
                  <p className="text-xs text-gray-500">
                    💡 Upload documents for verification to become a trusted
                    freelancer, or register without documents to start as a
                    basic cleaner
                  </p>
                </div>
              )}
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

            {/* Validation Summary for Development */}
            {import.meta.env.MODE === "development" &&
              Object.keys(errors).length > 1 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Form Validation Issues:
                      </h3>
                      <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                        {Object.entries(errors)
                          .filter(([key]) => key !== "general")
                          .map(([field, error]) => (
                            <li key={field}>
                              {field}: {error}
                            </li>
                          ))}
                      </ul>
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
                      onBlur={handleEmailBlur}
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
                      onBlur={handleEmailBlur}
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
