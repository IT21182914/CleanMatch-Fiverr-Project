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
 * Calculate ZIP code proximity score
 * @param {string} customerZip - Customer's ZIP code
 * @param {string} cleanerZip - Cleaner's ZIP code
 * @returns {number} Proximity score (0-100)
 */
const calculateZipProximityScore = (customerZip, cleanerZip) => {
  if (!customerZip || !cleanerZip) return 0;

  // Exact match gets highest score
  if (customerZip === cleanerZip) return 100;

  // Check if ZIP codes are in same area (first 3 digits)
  const customerPrefix = customerZip.substring(0, 3);
  const cleanerPrefix = cleanerZip.substring(0, 3);

  if (customerPrefix === cleanerPrefix) return 75;

  // Check regional proximity (first 2 digits)
  const customerRegion = customerZip.substring(0, 2);
  const cleanerRegion = cleanerZip.substring(0, 2);

  if (customerRegion === cleanerRegion) return 50;

  // Different regions get low score
  return 25;
};

/**
 * Enhanced distance calculation with ZIP code fallback
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @param {string} zip1 - ZIP code 1 (fallback)
 * @param {string} zip2 - ZIP code 2 (fallback)
 * @returns {number} Distance in miles
 */
const calculateDistanceWithZipFallback = (
  lat1,
  lon1,
  lat2,
  lon2,
  zip1,
  zip2
) => {
  // If coordinates are available, use precise calculation
  if (lat1 && lon1 && lat2 && lon2) {
    return calculateDistance(lat1, lon1, lat2, lon2);
  }

  // Fallback to ZIP-based distance estimation
  if (zip1 && zip2) {
    const zipScore = calculateZipProximityScore(zip1, zip2);
    if (zipScore === 100) return 2; // Same ZIP ~2 miles
    if (zipScore === 75) return 8; // Same area ~8 miles
    if (zipScore === 50) return 15; // Same region ~15 miles
    return 25; // Different region ~25 miles
  }

  return null; // No location data available
};

/**
 * Get available cleaners based on location, date, and service requirements
 * Enhanced with ZIP code priority matching
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
    // Get all active cleaners with their profiles, prioritizing ZIP code matches
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
        cp.experience_years,
        CASE 
          WHEN u.zip_code = $1 THEN 1
          WHEN LEFT(u.zip_code, 3) = LEFT($1, 3) THEN 2
          WHEN LEFT(u.zip_code, 2) = LEFT($1, 2) THEN 3
          ELSE 4
        END as zip_priority
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND u.is_active = true 
        AND cp.is_available = true
        AND cp.background_check_status = 'approved'
      ORDER BY zip_priority ASC, cp.rating DESC
    `;

    const cleanersResult = await query(cleanersQuery, [zipCode || "00000"]);
    const availableCleaners = [];

    for (const cleaner of cleanersResult.rows) {
      // Calculate distance with ZIP fallback
      const distance = calculateDistanceWithZipFallback(
        parseFloat(cleaner.latitude),
        parseFloat(cleaner.longitude),
        parseFloat(latitude),
        parseFloat(longitude),
        cleaner.zip_code,
        zipCode
      );

      if (distance === null || distance > cleaner.service_radius) {
        continue; // Skip if no location data or outside service radius
      }

      // Check availability for the specific date and time
      const isAvailable = await checkCleanerAvailability(
        cleaner.id,
        bookingDate,
        bookingTime,
        durationHours,
        cleaner.availability_schedule
      );

      if (isAvailable) {
        // Calculate ZIP proximity score
        const zipProximityScore = calculateZipProximityScore(
          zipCode,
          cleaner.zip_code
        );

        // Calculate enhanced matching score
        const matchScore = calculateEnhancedMatchScore(
          cleaner,
          distance,
          zipProximityScore,
          bookingDetails
        );

        availableCleaners.push({
          ...cleaner,
          distance: Math.round(distance * 100) / 100,
          zipProximityScore,
          matchScore,
        });
      }
    }

    // Sort by ZIP proximity first, then match score
    return availableCleaners.sort((a, b) => {
      if (a.zipProximityScore !== b.zipProximityScore) {
        return b.zipProximityScore - a.zipProximityScore;
      }
      return b.matchScore - a.matchScore;
    });
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
 * Enhanced match score calculation with ZIP code proximity
 * @param {Object} cleaner - Cleaner object
 * @param {number} distance - Distance from customer
 * @param {number} zipProximityScore - ZIP code proximity score (0-100)
 * @param {Object} bookingDetails - Booking details
 * @returns {number} Enhanced match score (0-100)
 */
const calculateEnhancedMatchScore = (
  cleaner,
  distance,
  zipProximityScore,
  bookingDetails
) => {
  let score = 0;

  // ZIP code proximity bonus - 25 points max (highest priority)
  score += (zipProximityScore / 100) * 25;

  // Distance score (closer is better) - 20 points max (reduced from 30)
  const maxDistance = 25; // miles
  const distanceScore = Math.max(
    0,
    ((maxDistance - distance) / maxDistance) * 20
  );
  score += distanceScore;

  // Rating score - 20 points max
  const ratingScore = (cleaner.rating / 5) * 20;
  score += ratingScore;

  // Experience score - 15 points max
  const experienceScore = Math.min(cleaner.experience_years / 10, 1) * 15;
  score += experienceScore;

  // Job completion rate (based on total jobs) - 10 points max
  const jobsScore = Math.min(cleaner.total_jobs / 50, 1) * 10;
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
  calculateDistanceWithZipFallback,
  calculateZipProximityScore,
  checkCleanerAvailability,
  calculateMatchScore,
  calculateEnhancedMatchScore,
};
