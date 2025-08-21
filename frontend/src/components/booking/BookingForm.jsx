import { useState } from "react";
import { toast } from "react-hot-toast";
import {
    ArrowLeftIcon,
    MapPinIcon,
    InformationCircleIcon,
    CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../ui/Card";
import { Input, Select, Textarea } from "../ui/Form";
import Button from "../ui/Button";
import { formatCurrency, validateZipCode } from "../../lib/utils";
import { getServiceImage } from "../../utils/serviceImages";
import LazyImage from "../ui/LazyImage";
import DatePicker from "../ui/DatePicker";

const BookingForm = ({
    service,
    formData,
    errors,
    submitting,
    onBack,
    onSubmit,
    onChange,
}) => {
    const [gpsPermissionStatus, setGpsPermissionStatus] = useState("unknown"); // unknown, granted, denied, prompt
    const [isCollectingLocation, setIsCollectingLocation] = useState(false);

    // Use locationMethod from formData instead of local state
    const locationMethod = formData.locationMethod || "gps";

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
    tomorrow.setDate(tomorrow.getDate());
    const minDate = tomorrow.toISOString().split("T")[0];

    const handleLocationDetection = async () => {
        try {
            setIsCollectingLocation(true);

            // Check if geolocation is supported
            if (!navigator.geolocation) {
                toast.error("Geolocation is not supported by this browser.");
                onChange({
                    target: {
                        name: 'locationMethod',
                        value: 'postal'
                    }
                });
                setIsCollectingLocation(false);
                return;
            }

            // Alert user about location collection
            toast.loading("Collecting your location data for better service...", { id: "location-collecting" });

            // Check permission status if available
            if (navigator.permissions) {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                setGpsPermissionStatus(permission.state);

                if (permission.state === 'denied') {
                    toast.error("Location access denied. Please enable location services or use postal code method.", { id: "location-collecting" });
                    onChange({
                        target: {
                            name: 'locationMethod',
                            value: 'postal'
                        }
                    });
                    setIsCollectingLocation(false);
                    return;
                }
            }

            // Request location with user consent
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const updatedFormData = {
                        ...formData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    // Trigger onChange with updated location data
                    onChange({
                        target: {
                            name: 'location',
                            value: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                        }
                    });

                    setGpsPermissionStatus("granted");
                    setIsCollectingLocation(false);
                    toast.success("Location collected successfully! No need to collect again unless you move.", { id: "location-collecting" });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setGpsPermissionStatus("denied");
                    setIsCollectingLocation(false);
                    toast.error("Failed to collect location. Please use postal code method instead.", { id: "location-collecting" });
                    onChange({
                        target: {
                            name: 'locationMethod',
                            value: 'postal'
                        }
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        } catch (error) {
            console.error("Location detection error:", error);
            setIsCollectingLocation(false);
            toast.error("Failed to access location services.");
            onChange({
                target: {
                    name: 'locationMethod',
                    value: 'postal'
                }
            });
        }
    };

    const handleLocationMethodChange = (method) => {
        onChange({
            target: {
                name: 'locationMethod',
                value: method
            }
        });
        // Don't automatically trigger GPS detection when selecting the method
        // User must explicitly click "Get My Location" button
    };

    const validateForm = () => {
        const newErrors = {};

        // Common validations
        if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date';
        if (!formData.scheduledTime) newErrors.scheduledTime = 'Please select a time';

        // Location method specific validations
        if (locationMethod === 'gps') {
            // GPS method requires: GPS coordinates + full address + city + state
            if (!formData.latitude || !formData.longitude) {
                newErrors.location = 'Please collect your GPS location by clicking "Get My Location"';
            }
            if (!formData.address) newErrors.address = 'Full address is required with GPS method';
            if (!formData.city) newErrors.city = 'City is required with GPS method';
            if (!formData.state) newErrors.state = 'State is required with GPS method';
        } else if (locationMethod === 'postal') {
            // Postal method requires: full address + city + state + postal code
            if (!formData.address) newErrors.address = 'Full address is required';
            if (!formData.city) newErrors.city = 'City is required';
            if (!formData.state) newErrors.state = 'State is required';
            if (!formData.zipCode) newErrors.zipCode = 'Postal code is required';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            // Show error for the first validation issue
            const firstError = Object.values(validationErrors)[0];
            toast.error(firstError);
            console.log(firstError)
            return;
        }

        // Add location method to form data
        const submitData = {
            ...formData,
            locationMethod
        };

        onSubmit(e, submitData);
    };

    if (!service) return null;

    return (
        <div className="mx-auto space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Service Details
            </Button>

            {/* Service Summary */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <LazyImage
                                src={getServiceImage(service.name)}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                fallbackSrc="/services/1/House & Apartment Cleaning.png"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-lg font-bold text-cyan-600">
                                {formatCurrency(service.base_price || service.basePrice || service.price)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Schedule Your Service</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                                    Preferred Date
                                </label>
                                <DatePicker
                                    name="scheduledDate"
                                    value={formData.scheduledDate}
                                    onChange={onChange}
                                    error={errors.scheduledDate}
                                    min={minDate}
                                    required
                                />
                            </div>

                            <Select
                                label="Preferred Time"
                                name="scheduledTime"
                                value={formData.scheduledTime}
                                onChange={onChange}
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

                        {/* Location Method Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-900 mb-3 block">
                                    <MapPinIcon className="h-4 w-4 inline mr-1" />
                                    Location Method
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="locationMethod"
                                            value="gps"
                                            checked={locationMethod === 'gps'}
                                            onChange={(e) => handleLocationMethodChange(e.target.value)}
                                            className="mr-3 text-cyan-600 focus:ring-cyan-500"
                                        />
                                        <span className="text-sm flex-1">
                                            <span className="font-medium">Use GPS Location</span>
                                            <span className="text-green-600 ml-2">(Recommended)</span>
                                            <br />
                                            <span className="text-gray-500 text-xs">Most accurate for finding nearby cleaners + full address required</span>
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="locationMethod"
                                            value="postal"
                                            checked={locationMethod === 'postal'}
                                            onChange={(e) => handleLocationMethodChange(e.target.value)}
                                            className="mr-3 text-cyan-600 focus:ring-cyan-500"
                                        />
                                        <span className="text-sm flex-1">
                                            <span className="font-medium">Use Postal Code</span>
                                            <br />
                                            <span className="text-gray-500 text-xs">Enter your address details and postal code</span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* GPS Location */}
                            {locationMethod === 'gps' && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <MapPinIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                <span className="font-medium text-blue-900">GPS Location</span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleLocationDetection}
                                                disabled={isCollectingLocation}
                                            >
                                                {isCollectingLocation ? 'Collecting...' : 'Get My Location'}
                                            </Button>
                                        </div>

                                        <p className="text-sm text-blue-700 mb-2">
                                            Click "Get My Location" to allow us to collect your GPS coordinates once.
                                            You'll also need to provide your full address below.
                                        </p>

                                        {gpsPermissionStatus === 'granted' && formData.latitude && formData.longitude ? (
                                            <div className="text-sm text-green-700 font-medium bg-green-50 border border-green-200 rounded p-2">
                                                ✓ GPS Location collected: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                                            </div>
                                        ) : gpsPermissionStatus === 'denied' ? (
                                            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
                                                ✗ Location access denied. Please enable location services in your browser settings or use postal code method.
                                            </div>
                                        ) : isCollectingLocation ? (
                                            <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                                                ⏳ Collecting your location...
                                            </div>
                                        ) : null}

                                        {errors.location && (
                                            <p className="text-sm text-red-600 mt-2">{errors.location}</p>
                                        )}
                                    </div>

                                    {/* Address fields for GPS users */}
                                    <div className="space-y-4">
                                        <Input
                                            label="Full Address"
                                            name="address"
                                            value={formData.address}
                                            onChange={onChange}
                                            error={errors.address}
                                            placeholder="123 Main St, Apt 4B"
                                            required
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input
                                                label="City"
                                                name="city"
                                                value={formData.city}
                                                onChange={onChange}
                                                error={errors.city}
                                                placeholder="City"
                                                required
                                            />
                                            <Input
                                                label="State"
                                                name="state"
                                                value={formData.state}
                                                onChange={onChange}
                                                error={errors.state}
                                                placeholder="State"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Postal Code Method */}
                            {locationMethod === 'postal' && (
                                <div className="space-y-4">
                                    <Input
                                        label="Full Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={onChange}
                                        error={errors.address}
                                        placeholder="123 Main St, Apt 4B"
                                        required
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={onChange}
                                            error={errors.city}
                                            placeholder="City"
                                            required
                                        />
                                        <Input
                                            label="State"
                                            name="state"
                                            value={formData.state}
                                            onChange={onChange}
                                            error={errors.state}
                                            placeholder="State"
                                            required
                                        />
                                    </div>
                                    <Input
                                        label="ZIP/Postal Code"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={onChange}
                                        error={errors.zipCode}
                                        placeholder="12345 or A1B 2C3"
                                        required
                                    />
                                    <p className="text-sm text-gray-600">
                                        We'll use your postal code and address details to find nearby service providers.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Special Instructions */}
                        <Textarea
                            label="Special Instructions (Optional)"
                            name="specialInstructions"
                            value={formData.specialInstructions}
                            onChange={onChange}
                            error={errors.specialInstructions}
                            placeholder="Any special requests or areas that need extra attention..."
                            rows={3}
                        />

                        {/* Important Information */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <InformationCircleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                                <div className="text-sm text-yellow-700">
                                    <p className="font-medium mb-2">Important Information:</p>
                                    <ul className="space-y-1">
                                        <li>• GPS location: We collect your coordinates once + you provide full address details</li>
                                        <li>• Postal code: You provide full address details + postal code for service location</li>
                                        <li>• Our cleaners arrive within a 2-hour window</li>
                                        <li>• You'll receive a confirmation call 24 hours before</li>
                                        <li>• Free rescheduling up to 24 hours in advance</li>
                                        <li>• Payment is processed after service completion</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onBack}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                loading={submitting}
                                loadingText="Creating Booking..."
                                disabled={submitting}
                                className="px-8"
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingForm;
