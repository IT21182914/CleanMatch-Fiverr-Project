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
    "Cleaning of the house and apartment",
    "Deep Cleaning",
    "Office Cleaning",
    "Move in & out Cleaning",
    "Glass and Window Cleaning",
    "Disinfect cleaning",
    "Maid service",
    "Event cleaning",
    "Construction cleaning",
    "Shop and Store Cleaning",
    "Hospital & Practice Cleaning",
    "Pool Cleaning",
    "Housekeeping Services",
    "Private Jet & Aircraft Cleaning",
    "Yacht and Ship Cleaning",
    "Weeds Cutting & Mowing",
    "Industrial Cleaning",
    "Hotel Service",
    "Winter Services",
    "Winter garden cleaning",
    "Roof and terrace cleaning",
    "Residential cleaning",
    "Maintenance cleaning",
    "Paving stone cleaning",
    "Parquet cleaning",
    "Facade cleaning",
    "Caretaker service",
    "Floor cleaning",
    "Luxury Villa cleaning and maintenance",
    "Security Services",
    "Carpet and Rug Cleaning",
    "Upholstery Cleaning",
    "Car Cleaning (Inside and Out)",
    "Computer & Printer Cleaning",
    "Laundry and Ironing Service",
    "Kitchen Deep Cleaning",
    "Billboard Cleaning",
    "Ventilation and Filter Cleaning",
    "Sauna deep cleaning",
    "Emergency cleaning services 24/7",
    "Mold Removal",
    "Pest Control",
    "Janitorial Cleaning",
    "Tile Deep Cleaning (Horizontal & Vertical)",
    "Commercial Cleaning",
    "Warehouse Cleaning",
    "School & University Hall Cleaning",
    "Sports Center Cleaning",
    "Staircase Cleaning",
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
