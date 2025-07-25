import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  CheckCircleIcon,
  StarIcon,
  InformationCircleIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { servicesAPI, bookingsAPI } from "../../lib/api";
import { Input, Select, Textarea } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { LoadingCard, LoadingGrid } from "../../components/ui/Loading";
import { formatCurrency, validateZipCode } from "../../lib/utils";
import { getServiceImage } from "../../utils/serviceImages";
import LazyImage from "../../components/ui/LazyImage";

const BookService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serviceError, setServiceError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [formData, setFormData] = useState({
    serviceId: "",
    scheduledDate: "",
    scheduledTime: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialInstructions: "",
    homeSize: "",
    bedrooms: "2",
    bathrooms: "2",
    pets: false,
    frequency: "one-time",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

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
    } catch (error) {
      console.error("Error fetching services:", error);
      setServiceError(error.response?.data?.error || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddOnToggle = (addOnId, price) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [addOnId]: prev[addOnId] ? null : { id: addOnId, price },
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.serviceId) {
        newErrors.serviceId = "Please select a service";
      }
      if (!formData.homeSize) {
        newErrors.homeSize = "Please select your home size";
      }
    }

    if (step === 2) {
      if (!formData.scheduledDate) {
        newErrors.scheduledDate = "Please select a date";
      } else {
        const selectedDate = new Date(formData.scheduledDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.scheduledDate = "Please select a future date";
        }
      }

      if (!formData.scheduledTime) {
        newErrors.scheduledTime = "Please select a time";
      }
    }

    if (step === 3) {
      if (!formData.address.trim()) {
        newErrors.address = "Please enter your address";
      }
      if (!formData.city.trim()) {
        newErrors.city = "Please enter your city";
      }
      if (!formData.state.trim()) {
        newErrors.state = "Please enter your state";
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = "Please enter your ZIP code";
      } else if (!validateZipCode(formData.zipCode)) {
        newErrors.zipCode = "Please enter a valid ZIP code";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setSubmitting(true);
    try {
      const bookingData = {
        serviceId: formData.serviceId,
        bookingDate: formData.scheduledDate,
        bookingTime: formData.scheduledTime,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        specialInstructions: formData.specialInstructions,
        durationHours: 2,
        homeSize: formData.homeSize,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        pets: formData.pets,
        frequency: formData.frequency,
        addOns: Object.values(selectedAddOns).filter(Boolean),
      };

      const response = await bookingsAPI.create(bookingData);
      const booking = response.data?.data || response.data;

      if (!booking || !booking.id) {
        throw new Error("Invalid booking response - missing booking ID");
      }

      navigate(`/payment/${booking.id}`);
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error ||
          "Failed to create booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find(
    (service) => service.id === parseInt(formData.serviceId)
  );

  // Mock add-ons data (would come from API in real app)
  const availableAddOns = [
    { id: 1, name: "Inside oven cleaning", price: 25 },
    { id: 2, name: "Inside refrigerator", price: 20 },
    { id: 3, name: "Interior window cleaning", price: 30 },
    { id: 4, name: "Garage cleaning", price: 50 },
    { id: 5, name: "Basement cleaning", price: 40 },
    { id: 6, name: "Cabinet interior cleaning", price: 35 },
  ];

  // Calculate total price
  const calculateTotal = () => {
    const basePrice =
      selectedService?.base_price ||
      selectedService?.basePrice ||
      selectedService?.price ||
      0;
    const addOnTotal = Object.values(selectedAddOns)
      .filter(Boolean)
      .reduce((sum, addOn) => sum + addOn.price, 0);

    // Home size multiplier
    const sizeMultipliers = {
      small: 1,
      medium: 1.25,
      large: 1.5,
      xlarge: 2,
    };
    const multiplier = sizeMultipliers[formData.homeSize] || 1;

    return basePrice * multiplier + addOnTotal;
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      );
      timeSlots.push({ value: time, label: displayTime });
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const steps = [
    { number: 1, title: "Service & Details", icon: SparklesIcon },
    { number: 2, title: "Date & Time", icon: CalendarDaysIcon },
    { number: 3, title: "Address & Confirmation", icon: MapPinIcon },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Book Your Cleaning Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get professional cleaning with our easy 3-step booking process
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mt-8 flex justify-center">
            <nav className="flex space-x-4 sm:space-x-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center ${
                        index > 0 ? "ml-4 sm:ml-8" : ""
                      }`}
                    >
                      {index > 0 && (
                        <div
                          className={`hidden sm:block w-8 h-0.5 mr-4 ${
                            isCompleted ? "bg-cyan-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                      <div
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                          isActive
                            ? "bg-cyan-500 text-white"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-400 border border-gray-300"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="hidden sm:inline font-medium text-sm">
                          {step.title}
                        </span>
                        <span className="sm:hidden font-medium text-sm">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-6">
            <LoadingCard variant="form" />
            <LoadingCard variant="services" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  {serviceError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <InformationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-sm text-red-600">{serviceError}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={fetchServices}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-600">{errors.general}</p>
                      </div>
                    )}

                    {/* Step 1: Service Selection */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Choose Your Service
                          </h2>

                          <div className="grid grid-cols-1 gap-4">
                            {services.map((service) => (
                              <div
                                key={service.id}
                                className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                  formData.serviceId === service.id.toString()
                                    ? "border-cyan-500 bg-cyan-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    serviceId: service.id.toString(),
                                  }))
                                }
                              >
                                <div className="flex">
                                  {/* Service Image */}
                                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                                    <LazyImage
                                      src={getServiceImage(service.name)}
                                      alt={service.name}
                                      className=""
                                      aspectRatio="w-full h-full"
                                      fallbackSrc="/services/1/House & Apartment Cleaning.png"
                                    />
                                  </div>

                                  {/* Service Details */}
                                  <div className="flex-1 p-4 flex items-center justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-gray-900">
                                        {service.name}
                                      </h3>
                                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {service.description}
                                      </p>
                                      <p className="text-lg font-bold text-cyan-600 mt-2">
                                        Starting at{" "}
                                        {formatCurrency(
                                          service.base_price ||
                                            service.basePrice ||
                                            service.price
                                        )}
                                      </p>
                                    </div>
                                    <div
                                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 ${
                                        formData.serviceId ===
                                        service.id.toString()
                                          ? "border-cyan-500 bg-cyan-500"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {formData.serviceId ===
                                        service.id.toString() && (
                                        <CheckCircleIcon className="h-4 w-4 text-white" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {errors.serviceId && (
                            <p className="text-sm text-red-600 mt-2">
                              {errors.serviceId}
                            </p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Home Details
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select
                              label="Home Size"
                              name="homeSize"
                              value={formData.homeSize}
                              onChange={handleChange}
                              error={errors.homeSize}
                              required
                            >
                              <option value="">Select size...</option>
                              <option value="small">
                                Small (under 1,000 sq ft)
                              </option>
                              <option value="medium">
                                Medium (1,000-2,000 sq ft)
                              </option>
                              <option value="large">
                                Large (2,000-3,000 sq ft)
                              </option>
                              <option value="xlarge">
                                Extra Large (over 3,000 sq ft)
                              </option>
                            </Select>

                            <Select
                              label="Bedrooms"
                              name="bedrooms"
                              value={formData.bedrooms}
                              onChange={handleChange}
                            >
                              <option value="1">1 Bedroom</option>
                              <option value="2">2 Bedrooms</option>
                              <option value="3">3 Bedrooms</option>
                              <option value="4">4 Bedrooms</option>
                              <option value="5+">5+ Bedrooms</option>
                            </Select>

                            <Select
                              label="Bathrooms"
                              name="bathrooms"
                              value={formData.bathrooms}
                              onChange={handleChange}
                            >
                              <option value="1">1 Bathroom</option>
                              <option value="2">2 Bathrooms</option>
                              <option value="3">3 Bathrooms</option>
                              <option value="4">4 Bathrooms</option>
                              <option value="5+">5+ Bathrooms</option>
                            </Select>

                            <Select
                              label="Cleaning Frequency"
                              name="frequency"
                              value={formData.frequency}
                              onChange={handleChange}
                            >
                              <option value="one-time">
                                One-time cleaning
                              </option>
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                            </Select>
                          </div>

                          <div className="mt-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="pets"
                                checked={formData.pets}
                                onChange={handleChange}
                                className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                I have pets in my home
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Add-ons Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Premium Add-ons (Optional)
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availableAddOns.map((addOn) => (
                              <div
                                key={addOn.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                  selectedAddOns[addOn.id]
                                    ? "border-cyan-500 bg-cyan-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() =>
                                  handleAddOnToggle(addOn.id, addOn.price)
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {addOn.name}
                                    </p>
                                    <p className="text-sm text-cyan-600">
                                      +{formatCurrency(addOn.price)}
                                    </p>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      selectedAddOns[addOn.id]
                                        ? "border-cyan-500 bg-cyan-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {selectedAddOns[addOn.id] && (
                                      <CheckCircleIcon className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Choose Date & Time
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <Input
                              label="Preferred Date"
                              name="scheduledDate"
                              type="date"
                              value={formData.scheduledDate}
                              onChange={handleChange}
                              error={errors.scheduledDate}
                              min={minDate}
                              required
                            />
                          </div>

                          <div>
                            <Select
                              label="Preferred Time"
                              name="scheduledTime"
                              value={formData.scheduledTime}
                              onChange={handleChange}
                              error={errors.scheduledTime}
                              required
                            >
                              <option value="">Select time...</option>
                              {timeSlots.map((slot) => (
                                <option key={slot.value} value={slot.value}>
                                  {slot.label}
                                </option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                            <div className="text-sm text-blue-700">
                              <p className="font-medium">Good to know:</p>
                              <ul className="mt-1 space-y-1">
                                <li>
                                  • Our cleaners arrive within a 2-hour window
                                </li>
                                <li>
                                  • You'll receive a confirmation call 24 hours
                                  before
                                </li>
                                <li>
                                  • Reschedule or cancel up to 24 hours in
                                  advance
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Address & Confirmation */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Address & Final Details
                        </h2>

                        <Input
                          label="Full Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          error={errors.address}
                          placeholder="123 Main St, Apt 4B"
                          required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            error={errors.city}
                            placeholder="City"
                            required
                          />

                          <Input
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            error={errors.state}
                            placeholder="State"
                            required
                          />
                        </div>

                        <Input
                          label="ZIP Code"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          error={errors.zipCode}
                          placeholder="12345"
                          required
                        />

                        <Textarea
                          label="Special Instructions (Optional)"
                          name="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={handleChange}
                          error={errors.specialInstructions}
                          placeholder="Any special requests or areas that need extra attention..."
                          rows={3}
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-gray-200">
                      <div>
                        {currentStep > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                          >
                            Previous
                          </Button>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => navigate("/dashboard")}
                        >
                          Cancel
                        </Button>

                        {currentStep < 3 ? (
                          <Button
                            type="button"
                            variant="navy"
                            onClick={handleNext}
                          >
                            Next Step
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            variant="primary"
                            loading={submitting}
                            loadingVariant="spinner"
                            loadingText="Processing..."
                            disabled={submitting || services.length === 0}
                          >
                            Continue to Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <CreditCardIcon className="h-5 w-5 mr-2 text-cyan-500" />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedService ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {selectedService.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedService.description}
                          </p>
                        </div>

                        {formData.homeSize && (
                          <div className="flex justify-between text-sm">
                            <span>Home size:</span>
                            <span className="capitalize">
                              {formData.homeSize}
                            </span>
                          </div>
                        )}

                        {formData.scheduledDate && (
                          <div className="flex justify-between text-sm">
                            <span>Date:</span>
                            <span>
                              {new Date(
                                formData.scheduledDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {formData.scheduledTime && (
                          <div className="flex justify-between text-sm">
                            <span>Time:</span>
                            <span>
                              {
                                timeSlots.find(
                                  (slot) =>
                                    slot.value === formData.scheduledTime
                                )?.label
                              }
                            </span>
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <div className="flex justify-between">
                            <span>Base service:</span>
                            <span>
                              {formatCurrency(
                                selectedService.base_price ||
                                  selectedService.basePrice ||
                                  selectedService.price
                              )}
                            </span>
                          </div>

                          {Object.values(selectedAddOns)
                            .filter(Boolean)
                            .map((addOn) => (
                              <div
                                key={addOn.id}
                                className="flex justify-between text-sm text-gray-600"
                              >
                                <span>Add-on:</span>
                                <span>+{formatCurrency(addOn.price)}</span>
                              </div>
                            ))}

                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total:</span>
                              <span className="text-yellow-600">
                                {formatCurrency(calculateTotal())}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium text-yellow-800">
                              Satisfaction Guaranteed
                            </span>
                          </div>
                          <p className="text-yellow-700 mt-1">
                            Not happy? We'll return within 24 hours to re-clean
                            for free.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <HomeIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>Select a service to see pricing</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookService;
