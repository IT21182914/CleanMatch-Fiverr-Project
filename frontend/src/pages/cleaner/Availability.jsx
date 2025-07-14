import { useState, useEffect } from "react";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
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
import { userAPI } from "../../lib/api";

const Availability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
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
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await userAPI.getCleanerProfile();
      const profile = response.data.cleanerProfile;

      if (profile) {
        setIsAvailable(profile.is_available);
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
      await userAPI.updateAvailability({ isAvailable: !isAvailable });
      setIsAvailable(!isAvailable);
      setSuccessMessage(
        `You are now ${
          !isAvailable ? "available" : "unavailable"
        } for new bookings.`
      );
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
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Availability;
