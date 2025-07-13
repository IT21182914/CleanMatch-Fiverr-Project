const { query } = require("../config/database");

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in miles
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get available cleaners based on location, date, and service requirements
 * @param {Object} bookingDetails - Booking details including location, date, service
 * @returns {Array} Array of matched cleaners sorted by priority
 */
const findAvailableCleaners = async (bookingDetails) => {
  const {
    latitude,
    longitude,
    bookingDate,
    bookingTime,
    durationHours,
    serviceId,
    zipCode,
  } = bookingDetails;

  try {
    // Get all active cleaners with their profiles
    const cleanersQuery = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.latitude,
        u.longitude,
        u.zip_code,
        cp.hourly_rate,
        cp.service_radius,
        cp.rating,
        cp.total_jobs,
        cp.is_available,
        cp.availability_schedule,
        cp.experience_years
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND u.is_active = true 
        AND cp.is_available = true
        AND cp.background_check_status = 'approved'
    `;

    const cleanersResult = await query(cleanersQuery);
    const availableCleaners = [];

    for (const cleaner of cleanersResult.rows) {
      // Check if cleaner is within service radius
      let distance = 0;
      if (cleaner.latitude && cleaner.longitude && latitude && longitude) {
        distance = calculateDistance(
          parseFloat(cleaner.latitude),
          parseFloat(cleaner.longitude),
          parseFloat(latitude),
          parseFloat(longitude)
        );
      } else {
        // Fallback to ZIP code matching if coordinates not available
        if (cleaner.zip_code === zipCode) {
          distance = 5; // Assume 5 miles for same ZIP
        } else {
          distance = 50; // Default high distance for different ZIP
        }
      }

      if (distance <= cleaner.service_radius) {
        // Check availability for the specific date and time
        const isAvailable = await checkCleanerAvailability(
          cleaner.id,
          bookingDate,
          bookingTime,
          durationHours,
          cleaner.availability_schedule
        );

        if (isAvailable) {
          // Calculate matching score
          const matchScore = calculateMatchScore(
            cleaner,
            distance,
            bookingDetails
          );

          availableCleaners.push({
            ...cleaner,
            distance: Math.round(distance * 100) / 100,
            matchScore,
          });
        }
      }
    }

    // Sort by match score (higher is better)
    return availableCleaners.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error("Error finding available cleaners:", error);
    throw error;
  }
};

/**
 * Check if cleaner is available at specific date and time
 * @param {number} cleanerId - Cleaner's user ID
 * @param {string} bookingDate - Date in YYYY-MM-DD format
 * @param {string} bookingTime - Time in HH:MM format
 * @param {number} durationHours - Duration of the booking
 * @param {Object} availabilitySchedule - Cleaner's availability schedule
 * @returns {boolean} True if available, false otherwise
 */
const checkCleanerAvailability = async (
  cleanerId,
  bookingDate,
  bookingTime,
  durationHours,
  availabilitySchedule
) => {
  try {
    // Check for existing bookings at the same time
    const conflictQuery = `
      SELECT id FROM bookings 
      WHERE cleaner_id = $1 
        AND booking_date = $2 
        AND status NOT IN ('cancelled', 'completed')
        AND (
          (booking_time <= $3 AND (booking_time + INTERVAL '1 hour' * duration_hours) > $3)
          OR (booking_time < ($3 + INTERVAL '1 hour' * $4) AND booking_time >= $3)
        )
    `;

    const conflictResult = await query(conflictQuery, [
      cleanerId,
      bookingDate,
      bookingTime,
      durationHours,
    ]);

    if (conflictResult.rows.length > 0) {
      return false; // Has conflicting booking
    }

    // Check against availability schedule
    if (availabilitySchedule) {
      const dayOfWeek = new Date(bookingDate).getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const daySchedule = availabilitySchedule[dayNames[dayOfWeek]];

      if (!daySchedule || !daySchedule.available) {
        return false;
      }

      // Check if booking time falls within available hours
      const bookingHour = parseInt(bookingTime.split(":")[0]);
      const bookingMinute = parseInt(bookingTime.split(":")[1]);
      const bookingTimeInMinutes = bookingHour * 60 + bookingMinute;

      const [startHour, startMinute] = daySchedule.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = daySchedule.endTime.split(":").map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;

      const bookingEndTime = bookingTimeInMinutes + durationHours * 60;

      if (
        bookingTimeInMinutes < startTimeInMinutes ||
        bookingEndTime > endTimeInMinutes
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error checking cleaner availability:", error);
    return false;
  }
};

/**
 * Calculate match score for a cleaner based on various factors
 * @param {Object} cleaner - Cleaner object
 * @param {number} distance - Distance from customer
 * @param {Object} bookingDetails - Booking details
 * @returns {number} Match score (0-100)
 */
const calculateMatchScore = (cleaner, distance, bookingDetails) => {
  let score = 0;

  // Distance score (closer is better) - 30 points max
  const maxDistance = 25; // miles
  const distanceScore = Math.max(
    0,
    ((maxDistance - distance) / maxDistance) * 30
  );
  score += distanceScore;

  // Rating score - 25 points max
  const ratingScore = (cleaner.rating / 5) * 25;
  score += ratingScore;

  // Experience score - 20 points max
  const experienceScore = Math.min(cleaner.experience_years / 10, 1) * 20;
  score += experienceScore;

  // Job completion rate (based on total jobs) - 15 points max
  const jobsScore = Math.min(cleaner.total_jobs / 50, 1) * 15;
  score += jobsScore;

  // Rate competitiveness - 10 points max
  const avgHourlyRate = 25; // Assumed average rate
  const rateScore =
    cleaner.hourly_rate <= avgHourlyRate
      ? 10
      : Math.max(
          0,
          10 - ((cleaner.hourly_rate - avgHourlyRate) / avgHourlyRate) * 5
        );
  score += rateScore;

  return Math.round(score * 100) / 100;
};

/**
 * Auto-assign the best available cleaner to a booking
 * @param {Object} bookingDetails - Booking details
 * @returns {Object} Best matched cleaner or null if none available
 */
const autoAssignCleaner = async (bookingDetails) => {
  try {
    const availableCleaners = await findAvailableCleaners(bookingDetails);

    if (availableCleaners.length === 0) {
      return null;
    }

    // Return the highest scoring cleaner
    return availableCleaners[0];
  } catch (error) {
    console.error("Error in auto-assign cleaner:", error);
    throw error;
  }
};

/**
 * Get cleaner recommendations for manual assignment
 * @param {Object} bookingDetails - Booking details
 * @param {number} limit - Maximum number of recommendations
 * @returns {Array} Array of recommended cleaners
 */
const getCleanerRecommendations = async (bookingDetails, limit = 5) => {
  try {
    const availableCleaners = await findAvailableCleaners(bookingDetails);
    return availableCleaners.slice(0, limit);
  } catch (error) {
    console.error("Error getting cleaner recommendations:", error);
    throw error;
  }
};

module.exports = {
  findAvailableCleaners,
  autoAssignCleaner,
  getCleanerRecommendations,
  calculateDistance,
  checkCleanerAvailability,
  calculateMatchScore,
};
