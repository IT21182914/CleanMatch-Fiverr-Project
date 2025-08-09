import {
  validateEmail,
  validatePassword,
  validateZipCode,
} from "../../../../lib/utils";

export const useFormValidation = () => {
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

  const validateCustomerForm = (formData) => {
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

    // Validate zipCode if provided (optional for customers)
    if (formData.zipCode && formData.zipCode.trim()) {
      if (!validateZipCode(formData.zipCode.trim())) {
        newErrors.zipCode =
          "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
      }
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must accept the terms & conditions";
    }

    return newErrors;
  };

  const validateFreelancerForm = (formData) => {
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

  const validateForm = (selectedRole, formData) => {
    const newErrors =
      selectedRole === "customer"
        ? validateCustomerForm(formData)
        : validateFreelancerForm(formData);

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

    return newErrors;
  };

  return {
    validateEmailField,
    validateForm,
    checkEmailAvailability,
  };
};
