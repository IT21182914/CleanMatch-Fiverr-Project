import { useState, useEffect, useRef } from "react";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Input, Checkbox } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import Modal from "../../components/ui/Modal";
import { userAPI } from "../../lib/api";

const Availability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationPermission, setLocationPermission] = useState("unknown");
  const [locationUpdating, setLocationUpdating] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [showCountdown, setShowCountdown] = useState(false);
  const [isFirstLocationUpdate, setIsFirstLocationUpdate] = useState(true);
  const locationIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [schedule, setSchedule] = useState({
    monday: { available: true, startTime: "08:00", endTime: "18:00" },
    tuesday: { available: true, startTime: "08:00", endTime: "18:00" },
    wednesday: { available: true, startTime: "08:00", endTime: "18:00" },
    thursday: { available: true, startTime: "08:00", endTime: "18:00" },
    friday: { available: true, startTime: "08:00", endTime: "18:00" },
    saturday: { available: true, startTime: "09:00", endTime: "17:00" },
    sunday: { available: false, startTime: "09:00", endTime: "17:00" },
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  useEffect(() => {
    fetchAvailability();
    checkLocationPermission();

    // Cleanup intervals on component unmount
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Check initial location permission status
  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission("unsupported");
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      setLocationPermission(permission.state);

      permission.addEventListener("change", () => {
        setLocationPermission(permission.state);
      });
    } catch (error) {
      console.log("Permission API not supported, will request when needed");
      setLocationPermission("unknown");
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          };
          resolve(location);
        },
        (error) => {
          let errorMessage = "Failed to get your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Location access was denied.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Accept cached location up to 1 minute old
        }
      );
    });
  };

  // Update location automatically
  const updateLocationAutomatically = async (immediate = false) => {
    try {
      setLocationUpdating(true);
      const location = await getCurrentLocation();
      setCurrentLocation(location);

      // Update availability with current location
      await userAPI.updateAvailability({
        isAvailable: true,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      console.log(`Location updated ${immediate ? 'immediately' : 'automatically'}:`, location);

      // If this was the first update, mark it as done and start the regular countdown
      if (immediate && isFirstLocationUpdate) {
        setIsFirstLocationUpdate(false);
        startCountdown(); // Start regular 2-minute countdown after first immediate update
      }
    } catch (error) {
      setLocationError(error.message);
      console.error("Auto location update error:", error);
    } finally {
      setLocationUpdating(false);
    }
  };

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(120); // Reset to 2 minutes
    setShowCountdown(true);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Time's up - update location automatically
          updateLocationAutomatically();
          return 120; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000); // Update every second
  };

  // Stop countdown timer
  const stopCountdown = () => {
    setShowCountdown(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  // Start location tracking interval (every 2 minutes)
  const startLocationTracking = async () => {
    // If this is the first time or after page reload, update location immediately
    if (isFirstLocationUpdate) {
      await updateLocationAutomatically(true); // immediate = true
    } else {
      // Otherwise start the regular countdown
      startCountdown();
    }
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    stopCountdown();
    setIsFirstLocationUpdate(true); // Reset for next time they go online
  };

  // Handle location confirmation from modal (only for initial setup)
  const handleLocationConfirmation = async (confirmed) => {
    setShowLocationModal(false);
    setLocationError("");

    if (!confirmed) {
      return;
    }

    try {
      setLocationUpdating(true);
      const location = await getCurrentLocation();
      setCurrentLocation(location);

      // Update availability with current location
      await userAPI.updateAvailability({
        isAvailable: true,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      console.log("Location updated:", location);

      // Mark as first update done and start countdown for regular updates
      setIsFirstLocationUpdate(false);
      startCountdown();
    } catch (error) {
      setLocationError(error.message);
      console.error("Location error:", error);
    } finally {
      setLocationUpdating(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await userAPI.getCleanerProfile();
      const profile = response.data?.user?.cleanerProfile;
      console.log("profile", profile);
      if (profile) {
        setIsAvailable(profile.is_available);

        // If user is already available, start location tracking
        if (profile.is_available) {
          startLocationTracking();
        }

        if (profile.availability_schedule) {
          setSchedule(profile.availability_schedule);
        }
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      setSaving(true);
      setLocationError("");

      if (!isAvailable) {
        // Going online - check location permission first
        if (locationPermission === "denied") {
          setShowLocationModal(true);
          setSaving(false);
          return;
        }

        try {
          setLocationUpdating(true);
          const location = await getCurrentLocation();
          setCurrentLocation(location);

          // Update availability with location
          await userAPI.updateAvailability({
            isAvailable: true,
            latitude: location.latitude,
            longitude: location.longitude,
          });

          setIsAvailable(true);

          // Mark first update as done since we just did it manually
          setIsFirstLocationUpdate(false);
          startCountdown(); // Start the regular countdown

          setSuccessMessage(
            "You are now available for new bookings with location tracking enabled."
          );
        } catch (error) {
          // If location access fails, show modal to ask permission
          if (error.message.includes("denied") || error.message.includes("permission")) {
            setLocationPermission("denied");
            setShowLocationModal(true);
          } else {
            setLocationError(error.message);
          }
          setSaving(false);
          setLocationUpdating(false);
          return;
        } finally {
          setLocationUpdating(false);
        }
      } else {
        // Going offline - no location needed
        await userAPI.updateAvailability({
          isAvailable: false
        });

        setIsAvailable(false);
        stopLocationTracking(); // Stop the interval
        setCurrentLocation({ latitude: null, longitude: null });

        setSuccessMessage("You are now unavailable for new bookings.");
      }

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || "Failed to update availability",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDayToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const validateSchedule = () => {
    const newErrors = {};

    Object.keys(schedule).forEach((day) => {
      if (schedule[day].available) {
        const startTime = schedule[day].startTime;
        const endTime = schedule[day].endTime;

        if (startTime >= endTime) {
          newErrors[day] = "End time must be after start time";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSchedule()) return;

    setSaving(true);
    setSuccessMessage("");

    try {
      await userAPI.updateCleanerProfile({
        availabilitySchedule: schedule,
      });
      setSuccessMessage("Schedule updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || "Failed to update schedule",
      });
    } finally {
      setSaving(false);
    }
  };

  const setQuickSchedule = (type) => {
    const schedules = {
      weekdays: {
        monday: { available: true, startTime: "08:00", endTime: "18:00" },
        tuesday: { available: true, startTime: "08:00", endTime: "18:00" },
        wednesday: { available: true, startTime: "08:00", endTime: "18:00" },
        thursday: { available: true, startTime: "08:00", endTime: "18:00" },
        friday: { available: true, startTime: "08:00", endTime: "18:00" },
        saturday: { available: false, startTime: "09:00", endTime: "17:00" },
        sunday: { available: false, startTime: "09:00", endTime: "17:00" },
      },
      fullTime: {
        monday: { available: true, startTime: "08:00", endTime: "20:00" },
        tuesday: { available: true, startTime: "08:00", endTime: "20:00" },
        wednesday: { available: true, startTime: "08:00", endTime: "20:00" },
        thursday: { available: true, startTime: "08:00", endTime: "20:00" },
        friday: { available: true, startTime: "08:00", endTime: "20:00" },
        saturday: { available: true, startTime: "09:00", endTime: "18:00" },
        sunday: { available: true, startTime: "10:00", endTime: "16:00" },
      },
      partTime: {
        monday: { available: true, startTime: "09:00", endTime: "15:00" },
        tuesday: { available: true, startTime: "09:00", endTime: "15:00" },
        wednesday: { available: true, startTime: "09:00", endTime: "15:00" },
        thursday: { available: true, startTime: "09:00", endTime: "15:00" },
        friday: { available: true, startTime: "09:00", endTime: "15:00" },
        saturday: { available: false, startTime: "09:00", endTime: "17:00" },
        sunday: { available: false, startTime: "09:00", endTime: "17:00" },
      },
    };

    setSchedule(schedules[type]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  return (
    <>
      {/* Location Permission Modal */}
      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Location Access Required"
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPinIcon className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <p className="text-gray-700">
                Location access is required to go online and receive job assignments.
                This helps us match you with nearby customers.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                We'll automatically update your location every 2 minutes while you're available.
                Your location will only be shared with customers when you accept their booking requests.
              </p>
            </div>
          </div>

          {locationError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{locationError}</p>
              <p className="text-xs text-red-500 mt-1">
                Please enable location access in your browser settings and try again.
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleLocationConfirmation(false)}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={() => handleLocationConfirmation(true)}
              className="flex-1"
            >
              <MapPinIcon className="h-4 w-4 mr-2" />
              Allow Location Access
            </Button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Availability Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your availability and working hours to receive job assignments.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {/* General Errors */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Quick Availability Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Availability Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Currently {isAvailable ? "Available" : "Unavailable"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isAvailable
                      ? "You can receive new job assignments based on your schedule below."
                      : "You won't receive any new job assignments until you become available again."}
                  </p>
                </div>
                <Button
                  variant={isAvailable ? "danger" : "success"}
                  loading={saving}
                  onClick={handleAvailabilityToggle}
                  className="flex items-center"
                >
                  {isAvailable ? (
                    <>
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Go Unavailable
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Go Available
                    </>
                  )}
                </Button>
              </div>

              {/* Location Status */}
              {isAvailable && (
                <div className="border-t pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center">
                      {locationUpdating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                      ) : (
                        <MapPinIcon className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {locationUpdating
                            ? (isFirstLocationUpdate ? "Getting your location..." : "Updating Location...")
                            : "Location Tracking Active"
                          }
                        </h4>
                        {showCountdown && !locationUpdating && (
                          <div className="flex items-center space-x-2">
                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Next update: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                            </div>
                          </div>
                        )}
                        {!showCountdown && !locationUpdating && isFirstLocationUpdate && (
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Ready for immediate update
                          </div>
                        )}
                      </div>

                      {currentLocation.latitude && currentLocation.longitude ? (
                        <p className="text-sm text-gray-500 mt-1">
                          Location: {parseFloat(currentLocation.latitude).toFixed(6)}, {parseFloat(currentLocation.longitude).toFixed(6)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">Getting your location...</p>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        {locationUpdating
                          ? (isFirstLocationUpdate
                            ? "Getting your current location..."
                            : "Updating your current location..."
                          )
                          : (isFirstLocationUpdate
                            ? "Location will be updated immediately when you go online"
                            : "Location updates automatically every 2 minutes"
                          )
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Error */}
              {locationError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-start space-x-2">
                    <MapPinIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Location Access Issue</p>
                      <p className="text-sm text-yellow-700">{locationError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLocationConfirmation(true)}
                        className="mt-2"
                      >
                        Retry Location Access
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Weekly Schedule
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickSchedule("weekdays")}
                >
                  Weekdays Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickSchedule("partTime")}
                >
                  Part Time
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickSchedule("fullTime")}
                >
                  Full Time
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              <div className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day.key}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Checkbox
                        label={day.label}
                        checked={schedule[day.key].available}
                        onChange={() => handleDayToggle(day.key)}
                        className="text-lg font-medium"
                      />
                      {schedule[day.key].available && (
                        <span className="text-sm text-green-600 flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Available
                        </span>
                      )}
                    </div>

                    {schedule[day.key].available && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <Input
                            type="time"
                            value={schedule[day.key].startTime}
                            onChange={(e) =>
                              handleTimeChange(
                                day.key,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <Input
                            type="time"
                            value={schedule[day.key].endTime}
                            onChange={(e) =>
                              handleTimeChange(day.key, "endTime", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}

                    {errors[day.key] && (
                      <p className="text-sm text-red-600 mt-2 ml-6">
                        {errors[day.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchAvailability}
                >
                  Reset Changes
                </Button>
                <Button type="submit" loading={saving} disabled={saving}>
                  Save Schedule
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent>
            <div className="flex items-start space-x-3">
              <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Tips for Managing Your Availability
                </h3>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>
                    • Keep your schedule updated to receive more job assignments
                  </li>
                  <li>
                    • Consider offering weekend availability for higher demand
                  </li>
                  <li>
                    • Set realistic time windows that you can consistently
                    maintain
                  </li>
                  <li>• Use the quick schedule options to save time</li>
                  <li>• Toggle availability off when you need time off</li>
                  <li>• Allow location access for better job matching and customer trust</li>
                  <li>• Location updates immediately when you come back online</li>
                  <li>• Your location is updated every 2 minutes while you're available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Availability;
