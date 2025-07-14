import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { servicesAPI, bookingsAPI } from "../../lib/api";
import { Input, Select, Textarea } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { LoadingCard } from "../../components/ui/Loading";
import { formatCurrency, validateZipCode } from "../../lib/utils";

const BookService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serviceError, setServiceError] = useState(null);
  const [formData, setFormData] = useState({
    serviceId: "",
    scheduledDate: "",
    scheduledTime: "",
    address: "",
    zipCode: "",
    specialInstructions: "",
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

      console.log("Fetching services..."); // Debug log
      const response = await servicesAPI.getAll();
      console.log("Services response:", response); // Debug log

      // Handle different possible response structures
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

      console.log("Parsed services data:", servicesData); // Debug log

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceId) {
      newErrors.serviceId = "Please select a service";
    }

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

    if (!formData.address.trim()) {
      newErrors.address = "Please enter your address";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Please enter your ZIP code";
    } else if (!validateZipCode(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const bookingData = {
        ...formData,
        scheduledDate: `${formData.scheduledDate}T${formData.scheduledTime}`,
      };

      const response = await bookingsAPI.create(bookingData);
      const booking = response.data.data || response.data;

      // Redirect to payment page
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Book a Cleaning Service
        </h1>
        <p className="mt-2 text-gray-600">
          Select your preferred cleaning service and schedule a convenient time.
        </p>
      </div>

      {loading ? (
        <LoadingCard />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            {serviceError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-sm text-red-600">{serviceError}</p>
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
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <Select
                label="Select Service"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                error={errors.serviceId}
                required
              >
                <option value="">
                  {services.length === 0
                    ? "No services available..."
                    : "Choose a cleaning service..."}
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} -{" "}
                    {formatCurrency(
                      service.base_price || service.basePrice || service.price
                    )}
                  </option>
                ))}
              </Select>

              {selectedService && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-medium text-blue-900">
                    {selectedService.name}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {selectedService.description}
                  </p>
                  <p className="text-sm font-medium text-blue-900 mt-2">
                    Starting at{" "}
                    {formatCurrency(
                      selectedService.base_price ||
                        selectedService.basePrice ||
                        selectedService.price
                    )}
                  </p>
                  {selectedService.estimatedDuration && (
                    <p className="text-xs text-blue-600 mt-1">
                      Duration: ~{selectedService.estimatedDuration} minutes
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <Input
                label="Full Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="123 Main St, Apt 4B, City, State"
                required
              />

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

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting || services.length === 0}
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookService;
