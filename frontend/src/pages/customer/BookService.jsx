import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { servicesAPI, bookingsAPI } from "../../lib/api";
// import { validateZipCode } from "../../lib/utils";

// Import the new component modules
import ServiceSearch from "../../components/booking/ServiceSearch";
import ServiceDetails from "../../components/booking/ServiceDetails";
import BookingForm from "../../components/booking/BookingForm";
import BookingConfirmation from "../../components/booking/BookingConfirmation";

const BookService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serviceError, setServiceError] = useState(null);
  const [currentView, setCurrentView] = useState("services"); // 'services', 'details', 'booking', 'confirmation'
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialInstructions: "",
    latitude: null,
    longitude: null,
    locationMethod: "gps",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Scroll to top when view changes
  useEffect(() => {
    // Multiple scroll-to-top approaches for maximum compatibility
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Target main element
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.scrollTop = 0;
      }

      // Target scrollable containers
      const scrollableElements = document.querySelectorAll(
        "[data-scroll-container], .overflow-y-auto, .overflow-auto, .min-h-screen"
      );
      scrollableElements.forEach((element) => {
        if (element.scrollTop !== undefined) {
          element.scrollTop = 0;
        }
      });
    };

    // Execute immediately
    scrollToTop();

    // Execute with requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      scrollToTop();
    });

    // Execute with slight delay to ensure DOM is ready
    setTimeout(scrollToTop, 50);
  }, [currentView]);

  // Scroll to top on initial component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Helper function to get form data from URL parameters
  const getFormDataFromURL = () => {
    const urlFormData = {
      scheduledDate: searchParams.get("date") || "",
      scheduledTime: searchParams.get("time") || "",
      address: searchParams.get("address") || "",
      city: searchParams.get("city") || "",
      state: searchParams.get("state") || "",
      zipCode: searchParams.get("zipCode") || "",
      specialInstructions: searchParams.get("instructions") || "",
      latitude: searchParams.get("lat")
        ? parseFloat(searchParams.get("lat"))
        : null,
      longitude: searchParams.get("lng")
        ? parseFloat(searchParams.get("lng"))
        : null,
      locationMethod: searchParams.get("locationMethod") || "gps",
    };
    return urlFormData;
  };

  // Helper function to update URL parameters
  const updateURLParams = (newFormData) => {
    const params = new URLSearchParams(searchParams);

    // Update form data parameters
    if (newFormData.scheduledDate)
      params.set("date", newFormData.scheduledDate);
    else params.delete("date");

    if (newFormData.scheduledTime)
      params.set("time", newFormData.scheduledTime);
    else params.delete("time");

    if (newFormData.address) params.set("address", newFormData.address);
    else params.delete("address");

    if (newFormData.city) params.set("city", newFormData.city);
    else params.delete("city");

    if (newFormData.state) params.set("state", newFormData.state);
    else params.delete("state");

    if (newFormData.zipCode) params.set("zipCode", newFormData.zipCode);
    else params.delete("zipCode");

    if (newFormData.specialInstructions)
      params.set("instructions", newFormData.specialInstructions);
    else params.delete("instructions");

    if (newFormData.latitude)
      params.set("lat", newFormData.latitude.toString());
    else params.delete("lat");

    if (newFormData.longitude)
      params.set("lng", newFormData.longitude.toString());
    else params.delete("lng");

    if (newFormData.locationMethod)
      params.set("locationMethod", newFormData.locationMethod);
    else params.delete("locationMethod");

    // Update current view
    if (currentView !== "services") params.set("view", currentView);
    else params.delete("view");

    // Update selected service
    if (selectedService) params.set("serviceId", selectedService.id.toString());
    else params.delete("serviceId");

    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    // Only initialize form data from URL parameters if we're in booking view
    // This prevents old form data from persisting when selecting a new service
    const viewFromURL = searchParams.get("view");
    if (viewFromURL === "booking") {
      const urlFormData = getFormDataFromURL();
      setFormData(urlFormData);
    }

    // Initialize current view from URL
    if (
      viewFromURL &&
      ["services", "details", "booking", "confirmation"].includes(viewFromURL)
    ) {
      setCurrentView(viewFromURL);
    } else if (serviceId || searchParams.get("serviceId")) {
      setCurrentView("details");
    }

    fetchServices();
  }, [serviceId]);

  // Update URL parameters whenever state changes, but only for booking view
  useEffect(() => {
    if (services.length > 0 && currentView === "booking") {
      // Only update URL with form data when in booking view
      updateURLParams(formData);
    }
  }, [formData, currentView, selectedService, services.length]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setServiceError(null);

      const response = await servicesAPI.getAll();
      let servicesData = [];
      if (response.data?.data) {
        servicesData = response.data.data;
      } else if (response.data?.services) {
        servicesData = response.data.services;
      } else if (response.data) {
        servicesData = response.data;
      } else if (Array.isArray(response)) {
        servicesData = response;
      }

      if (!Array.isArray(servicesData)) {
        throw new Error("Services data is not an array");
      }

      setServices(servicesData);

      // Find and select service from URL parameters (either from route param or search param)
      const targetServiceId = serviceId || searchParams.get("serviceId");
      if (targetServiceId) {
        const service = servicesData.find(
          (s) => s.id === parseInt(targetServiceId)
        );
        if (service) {
          setSelectedService(service);
        }
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServiceError(error.response?.data?.error || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log("Form change:", name, value, type, checked);

    let newFormData;

    // Handle special location object from BookingForm
    if (name === "location" && typeof value === "object") {
      newFormData = {
        ...formData,
        latitude: value.latitude,
        longitude: value.longitude,
      };
    } else {
      newFormData = {
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      };
    }

    setFormData(newFormData);

    // Update URL parameters with new form data
    updateURLParams(newFormData);

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e, submitData = null) => {
    e.preventDefault();

    // Use the submitData passed from BookingForm, which includes validation
    const dataToSubmit = submitData || formData;

    setSubmitting(true);
    try {
      const bookingData = {
        serviceId: selectedService.id,
        bookingDate: dataToSubmit.scheduledDate,
        bookingTime: dataToSubmit.scheduledTime,
        specialInstructions: dataToSubmit.specialInstructions,
        locationMethod: dataToSubmit.locationMethod,
        durationHours: dataToSubmit.workDuration,
      };

      // Add location data based on method
      if (dataToSubmit.locationMethod === "gps") {
        bookingData.latitude = dataToSubmit.latitude;
        bookingData.longitude = dataToSubmit.longitude;
        bookingData.address = dataToSubmit.address;
        bookingData.city = dataToSubmit.city;
        bookingData.state = dataToSubmit.state;
      } else if (dataToSubmit.locationMethod === "postal") {
        bookingData.address = dataToSubmit.address;
        bookingData.city = dataToSubmit.city;
        bookingData.state = dataToSubmit.state;
        bookingData.zipCode = dataToSubmit.zipCode;
      }

      console.log("Submitting booking data:", bookingData);

      const response = await bookingsAPI.create(bookingData);
      const booking = response.data?.data || response.data;

      if (!booking || !booking.id) {
        throw new Error("Invalid booking response - missing booking ID");
      }

      setCurrentView("confirmation");
      toast.success("Booking created successfully!");

      // Scroll to top when showing confirmation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);

      // Navigate to payment after a short delay
      setTimeout(() => {
        navigate(`/payment/${booking.id}`);
      }, 2000);
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error ||
          "Failed to create booking. Please try again.",
      });
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Event handlers for navigation between views
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentView("details");

    // Clear form data when selecting a new service
    const cleanFormData = {
      scheduledDate: "",
      scheduledTime: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      specialInstructions: "",
      latitude: null,
      longitude: null,
      locationMethod: "gps",
    };
    setFormData(cleanFormData);
    setErrors({});

    // Update URL to reflect the selected service and view, clear all other params
    const params = new URLSearchParams();
    params.set("serviceId", service.id.toString());
    params.set("view", "details");
    setSearchParams(params, { replace: true });

    // Scroll to top when selecting a service
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  };

  const handleBookNow = () => {
    setCurrentView("booking");

    // When going to booking view, update URL with current form data
    const params = new URLSearchParams();
    params.set("serviceId", selectedService.id.toString());
    params.set("view", "booking");

    // Add form data to URL parameters for persistence
    if (formData.scheduledDate) params.set("date", formData.scheduledDate);
    if (formData.scheduledTime) params.set("time", formData.scheduledTime);
    if (formData.address) params.set("address", formData.address);
    if (formData.city) params.set("city", formData.city);
    if (formData.state) params.set("state", formData.state);
    if (formData.zipCode) params.set("zipCode", formData.zipCode);
    if (formData.specialInstructions)
      params.set("instructions", formData.specialInstructions);
    if (formData.latitude) params.set("lat", formData.latitude.toString());
    if (formData.longitude) params.set("lng", formData.longitude.toString());
    if (formData.locationMethod)
      params.set("locationMethod", formData.locationMethod);

    setSearchParams(params, { replace: true });

    // Scroll to top when going to booking form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  };

  const handleBackToServices = () => {
    setCurrentView("services");
    setSelectedService(null);

    // Clear form data when going back to services
    const cleanFormData = {
      scheduledDate: "",
      scheduledTime: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      specialInstructions: "",
      latitude: null,
      longitude: null,
      locationMethod: "gps",
    };
    setFormData(cleanFormData);
    setErrors({});

    // Clear all URL parameters when going back to services
    setSearchParams({}, { replace: true });

    // Scroll to top when going back to services
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  };

  const handleBackToDetails = () => {
    setCurrentView("details");

    // When going back to details from booking, clear form data URL parameters
    // but keep the form data in state for when they return to booking
    const params = new URLSearchParams();
    params.set("serviceId", selectedService.id.toString());
    params.set("view", "details");
    setSearchParams(params, { replace: true });

    // Scroll to top when going back to details
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  };

  // Main render function
  return (
    <div className="bg-gradient-to-br from-gray-50 to-cyan-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-1 lg:px-3 py-2">
        {currentView === "services" && (
          <ServiceSearch
            services={services}
            loading={loading}
            serviceError={serviceError}
            onServiceSelect={handleServiceSelect}
            onRetry={fetchServices}
          />
        )}

        {currentView === "details" && selectedService && (
          <ServiceDetails
            service={selectedService}
            onBack={handleBackToServices}
            onBookNow={handleBookNow}
          />
        )}

        {currentView === "booking" && selectedService && (
          <BookingForm
            service={selectedService}
            formData={formData}
            errors={errors}
            submitting={submitting}
            onBack={handleBackToDetails}
            onSubmit={handleSubmit}
            onChange={handleChange}
          />
        )}

        {currentView === "confirmation" && <BookingConfirmation />}
      </div>
    </div>
  );
};

export default BookService;
