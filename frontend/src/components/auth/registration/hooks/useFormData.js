import { useState } from "react";

export const useFormData = () => {
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
    zipCode: "",

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

  const resetFormData = () => {
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

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    resetFormData,
    cleaningServiceOptions,
  };
};
