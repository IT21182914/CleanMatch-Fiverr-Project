import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { servicesAPI, bookingsAPI } from "../../lib/api";
// import { useAuth } from "../../contexts/AuthContext";
import { Input, Select, Textarea } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { LoadingCard } from "../../components/ui/Loading";
import AICleanerMatcher from "../../components/ai/AICleanerMatcher";
import ServicePricingBanner from "../../components/membership/ServicePricingBanner";
import PricingDisplay from "../../components/booking/PricingDisplay";
import { formatCurrency, validateZipCode } from "../../lib/utils";
import { Brain, MapPin, Calendar, Clock, CreditCard } from "lucide-react";

const EnhancedBookService = () => {
  const [step, setStep] = useState(1); // 1: Service Details, 2: AI Matching, 3: Confirmation
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [formData, setFormData] = useState({
    serviceId: "",
    scheduledDate: "",
    scheduledTime: "",
    durationHours: 2,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: null,
    longitude: null,
    specialInstructions: "",
    autoAssign: false, // We'll use AI matching instead
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    // Try to get user's location
    getCurrentLocation();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data?.data || response.data?.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.log("Location access denied or unavailable:", error);
        }
      );
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.serviceId) newErrors.serviceId = "Please select a service";
    if (!formData.scheduledDate)
      newErrors.scheduledDate = "Please select a date";
    if (!formData.scheduledTime)
      newErrors.scheduledTime = "Please select a time";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!validateZipCode(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }

    // Date validation
    const selectedDate = new Date(formData.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      newErrors.scheduledDate = "Please select a future date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleCleanerSelect = (cleaner) => {
    setSelectedCleaner(cleaner);
    setStep(3);
  };

  const handleBookingSubmit = async () => {
    setSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        cleanerId: selectedCleaner?.id,
        totalAmount: calculateTotalAmount(),
      };

      const response = await bookingsAPI.create(bookingData);

      if (response.data.success) {
        // Navigate to payment page
        navigate(`/customer/payment/${response.data.booking.id}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrors({ submit: "Failed to create booking. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotalAmount = () => {
    const service = services.find((s) => s.id === parseInt(formData.serviceId));
    return service
      ? parseFloat(service.base_price) * formData.durationHours
      : 0;
  };

  const getSelectedService = () => {
    return services.find((s) => s.id === parseInt(formData.serviceId));
  };

  if (loading) {
    return <LoadingCard message="Loading services..." />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center space-x-2 ${
              step >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="font-medium">Service Details</span>
          </div>

          <div
            className={`flex items-center space-x-2 ${
              step >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              <Brain className="w-4 h-4" />
            </div>
            <span className="font-medium">AI Matching</span>
          </div>

          <div
            className={`flex items-center space-x-2 ${
              step >= 3 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              3
            </div>
            <span className="font-medium">Confirmation</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Service Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Your Cleaning Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service *
              </label>
              <Select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                error={errors.serviceId}
              >
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.base_price)}/hour
                  </option>
                ))}
              </Select>
            </div>

            {/* Membership Pricing Banner - Show when service and duration are selected */}
            {formData.serviceId && formData.durationHours && (
              <ServicePricingBanner
                serviceName={getSelectedService()?.name || "this service"}
                hourlyRate={getSelectedService()?.base_price || 36}
                hours={formData.durationHours}
                className="my-6"
              />
            )}

            {/* Pricing Display - Enhanced with membership information */}
            {formData.serviceId && formData.durationHours && (
              <PricingDisplay
                serviceId={formData.serviceId}
                hours={formData.durationHours}
                variant="detailed"
                showMembershipInfo={true}
                showUpgradePrompt={true}
                className="my-6"
              />
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <Input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  error={errors.scheduledDate}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <Input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  error={errors.scheduledTime}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <Select
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                    <option key={hour} value={hour}>
                      {hour} hour{hour > 1 ? "s" : ""}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  error={errors.address}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    error={errors.city}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    error={errors.state}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    error={errors.zipCode}
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <Textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Any specific requirements or instructions for the cleaner..."
                rows={3}
              />
            </div>

            {/* Location Notice */}
            {formData.latitude && formData.longitude && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-800">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    Location detected for better matching
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!formData.serviceId}>
                Continue to AI Matching
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: AI Cleaner Matching */}
      {step === 2 && (
        <AICleanerMatcher
          bookingData={formData}
          onCleanerSelect={handleCleanerSelect}
          onBack={handleBack}
        />
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedCleaner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Booking Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Service Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{getSelectedService()?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>
                    {formData.scheduledDate} at {formData.scheduledTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>
                    {formData.durationHours} hour
                    {formData.durationHours > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>
                    {formData.address}, {formData.city}, {formData.state}{" "}
                    {formData.zipCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Cleaner */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Selected Cleaner</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedCleaner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{selectedCleaner.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>⭐ {selectedCleaner.rating.toFixed(1)}</span>
                    <span>📍 {selectedCleaner.distance} mi away</span>
                    <span>💰 ${selectedCleaner.hourlyRate}/hr</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {selectedCleaner.matchScore.toFixed(1)}% Match
                  </div>
                  <div className="text-xs text-gray-500">AI Score</div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Pricing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service Rate:</span>
                  <span>${selectedCleaner.hourlyRate}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>
                    {formData.durationHours} hour
                    {formData.durationHours > 1 ? "s" : ""}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      selectedCleaner.hourlyRate * formData.durationHours
                    )}
                  </span>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Back to Cleaner Selection
              </Button>
              <Button
                onClick={handleBookingSubmit}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Creating Booking..." : "Proceed to Payment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedBookService;
