const { query, getClient } = require("../config/database");

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
 * Enhanced cleaner assignment with concurrency control and priority rules
 * Implements ZIP code matching with priority scoring system
 * @param {Object} bookingDetails - Booking details including location, date, service
 * @returns {Array} Array of matched cleaners sorted by enhanced priority
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

  const client = await getClient();

  try {
    // Start transaction for consistency
    await client.query("BEGIN");

    // Enhanced query with better priority scoring
    const cleanersQuery = `
      WITH cleaner_stats AS (
        SELECT 
          cleaner_id,
          COUNT(*) FILTER (WHERE status IN ('confirmed', 'in_progress', 'completed')) as active_jobs,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_jobs,
          AVG(CASE WHEN status = 'completed' THEN 5 ELSE 0 END) as completion_rate,
          MAX(created_at) FILTER (WHERE status IN ('confirmed', 'in_progress', 'completed')) as last_assignment
        FROM bookings 
        WHERE cleaner_id IS NOT NULL 
        GROUP BY cleaner_id
      ),
      service_area_match AS (
        SELECT DISTINCT cleaner_id
        FROM cleaner_service_areas csa
        WHERE csa.zip_code = $1 OR csa.zip_prefix = LEFT($1, 3) OR csa.zip_prefix = LEFT($1, 2)
      )
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
        cp.background_check_status,
        cp.last_active,
        COALESCE(cs.active_jobs, 0) as current_active_jobs,
        COALESCE(cs.completed_jobs, 0) as completed_jobs,
        COALESCE(cs.completion_rate, 0) as completion_rate,
        cs.last_assignment,
        CASE 
          WHEN u.zip_code = $1 THEN 1
          WHEN LEFT(u.zip_code, 3) = LEFT($1, 3) THEN 2
          WHEN LEFT(u.zip_code, 2) = LEFT($1, 2) THEN 3
          ELSE 4
        END as zip_priority,
        CASE WHEN sam.cleaner_id IS NOT NULL THEN true ELSE false END as has_service_area_match
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      LEFT JOIN cleaner_stats cs ON u.id = cs.cleaner_id
      LEFT JOIN service_area_match sam ON u.id = sam.cleaner_id
      WHERE u.role = 'cleaner' 
        AND u.is_active = true 
        AND cp.is_available = true
        AND cp.background_check_status = 'approved'
        AND (cp.last_active IS NULL OR cp.last_active >= NOW() - INTERVAL '30 days')
      ORDER BY 
        zip_priority ASC,
        has_service_area_match DESC,
        current_active_jobs ASC,
        cp.rating DESC,
        last_assignment ASC NULLS FIRST
    `;

    const cleanersResult = await client.query(cleanersQuery, [
      zipCode || "00000",
    ]);
    const availableCleaners = [];

    for (const cleaner of cleanersResult.rows) {
      // Check for concurrent booking conflicts with row locking
      const isAvailable = await checkCleanerAvailabilityWithLock(
        client,
        cleaner.id,
        bookingDate,
        bookingTime,
        durationHours,
        cleaner.availability_schedule
      );

      if (isAvailable) {
        // Calculate distance with ZIP fallback
        const distance = calculateDistanceWithZipFallback(
          parseFloat(cleaner.latitude),
          parseFloat(cleaner.longitude),
          parseFloat(latitude),
          parseFloat(longitude),
          cleaner.zip_code,
          zipCode
        );

        // Skip if outside service radius
        if (distance !== null && distance > cleaner.service_radius) {
          continue;
        }

        // Calculate enhanced priority score
        const priorityScore = calculateEnhancedPriorityScore(
          cleaner,
          distance,
          zipCode,
          bookingDetails
        );

        availableCleaners.push({
          ...cleaner,
          distance: distance ? Math.round(distance * 100) / 100 : null,
          priorityScore,
        });
      }
    }

    await client.query("COMMIT");

    // Sort by priority score (higher is better)
    return availableCleaners.sort((a, b) => b.priorityScore - a.priorityScore);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error finding available cleaners:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Check cleaner availability with row-level locking to prevent race conditions
 * @param {Object} client - Database client with active transaction
 * @param {number} cleanerId - Cleaner's user ID
 * @param {string} bookingDate - Date in YYYY-MM-DD format
 * @param {string} bookingTime - Time in HH:MM format
 * @param {number} durationHours - Duration of the booking
 * @param {Object} availabilitySchedule - Cleaner's availability schedule
 * @returns {boolean} True if available, false otherwise
 */
const checkCleanerAvailabilityWithLock = async (
  client,
  cleanerId,
  bookingDate,
  bookingTime,
  durationHours,
  availabilitySchedule
) => {
  try {
    // Lock cleaner row to prevent concurrent assignments
    await client.query("SELECT id FROM users WHERE id = $1 FOR UPDATE NOWAIT", [
      cleanerId,
    ]);

    // Check for existing bookings at the same time with more precise overlap detection
    const conflictQuery = `
      SELECT id FROM bookings 
      WHERE cleaner_id = $1 
        AND booking_date = $2 
        AND status NOT IN ('cancelled', 'completed', 'no_show')
        AND (
          -- New booking starts during existing booking
          ($3::time >= booking_time AND $3::time < (booking_time + INTERVAL '1 hour' * duration_hours))
          OR
          -- New booking ends during existing booking  
          (($3::time + INTERVAL '1 hour' * $4) > booking_time AND ($3::time + INTERVAL '1 hour' * $4) <= (booking_time + INTERVAL '1 hour' * duration_hours))
          OR
          -- New booking completely encompasses existing booking
          ($3::time <= booking_time AND ($3::time + INTERVAL '1 hour' * $4) >= (booking_time + INTERVAL '1 hour' * duration_hours))
        )
      FOR UPDATE
    `;

    const conflictResult = await client.query(conflictQuery, [
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
    console.error("Error checking cleaner availability with lock:", error);
    return false;
  }
};

/**
 * Calculate enhanced priority score with multiple factors
 * Priority factors (in order of importance):
 * 1. ZIP code match (highest priority)
 * 2. Current workload (lowest active jobs preferred)
 * 3. Rating and experience
 * 4. Distance
 * 5. Availability recency
 * @param {Object} cleaner - Cleaner object with stats
 * @param {number} distance - Distance from customer (miles)
 * @param {string} customerZip - Customer ZIP code
 * @param {Object} bookingDetails - Booking details
 * @returns {number} Priority score (0-1000)
 */
const calculateEnhancedPriorityScore = (
  cleaner,
  distance,
  customerZip,
  bookingDetails
) => {
  let score = 0;

  // 1. ZIP Code Proximity (300 points max - highest priority)
  const zipProximityScore = calculateZipProximityScore(
    customerZip,
    cleaner.zip_code
  );
  score += (zipProximityScore / 100) * 300;

  // 2. Workload Balance (200 points max - prioritize less busy cleaners)
  const maxActiveJobs = 10; // Assume max reasonable active jobs
  const workloadScore =
    Math.max(0, (maxActiveJobs - cleaner.current_active_jobs) / maxActiveJobs) *
    200;
  score += workloadScore;

  // 3. Performance Rating (150 points max)
  const ratingScore = (cleaner.rating / 5) * 150;
  score += ratingScore;

  // 4. Experience (100 points max)
  const experienceScore = Math.min(cleaner.experience_years / 10, 1) * 100;
  score += experienceScore;

  // 5. Distance (100 points max - closer is better)
  if (distance !== null) {
    const maxDistance = 25; // miles
    const distanceScore = Math.max(
      0,
      ((maxDistance - distance) / maxDistance) * 100
    );
    score += distanceScore;
  } else {
    score += 50; // Neutral score if no distance data
  }

  // 6. Availability Recency (50 points max - recently active preferred)
  if (cleaner.last_assignment) {
    const daysSinceLastAssignment =
      (new Date() - new Date(cleaner.last_assignment)) / (1000 * 60 * 60 * 24);
    const recencyScore =
      Math.max(0, (30 - Math.min(daysSinceLastAssignment, 30)) / 30) * 50;
    score += recencyScore;
  } else {
    score += 25; // New cleaners get moderate score
  }

  // 7. Completion Rate Bonus (50 points max)
  const completionScore = (cleaner.completion_rate / 100) * 50;
  score += completionScore;

  // 8. Service Area Match Bonus (50 points)
  if (cleaner.has_service_area_match) {
    score += 50;
  }

  return Math.round(score * 100) / 100;
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
 * Auto-assign the best available cleaner to a booking with notifications
 * Implements transaction safety and notification system
 * @param {Object} bookingDetails - Booking details
 * @returns {Object} Best matched cleaner or null if none available
 */
const autoAssignCleaner = async (bookingDetails) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const availableCleaners = await findAvailableCleaners(bookingDetails);

    if (availableCleaners.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    // Get the highest priority cleaner
    const selectedCleaner = availableCleaners[0];

    // Double-check availability with locking before final assignment
    const stillAvailable = await checkCleanerAvailabilityWithLock(
      client,
      selectedCleaner.id,
      bookingDetails.bookingDate,
      bookingDetails.bookingTime,
      bookingDetails.durationHours,
      selectedCleaner.availability_schedule
    );

    if (!stillAvailable) {
      await client.query("ROLLBACK");
      console.log(
        `Cleaner ${selectedCleaner.id} became unavailable during assignment process`
      );
      return null;
    }

    await client.query("COMMIT");
    return selectedCleaner;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in auto-assign cleaner:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Enhanced auto-assignment with full booking update and notifications
 * @param {number} bookingId - Booking ID to assign cleaner to
 * @param {Object} bookingDetails - Booking details for matching
 * @param {Object} customerInfo - Customer information for notifications
 * @returns {Object} Assignment result with cleaner details or error
 */
const performAutoAssignment = async (
  bookingId,
  bookingDetails,
  customerInfo
) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    // Find and assign cleaner
    const selectedCleaner = await autoAssignCleaner(bookingDetails);

    if (!selectedCleaner) {
      // Mark booking as pending assignment
      await client.query(
        "UPDATE bookings SET status = $1, assignment_attempts = COALESCE(assignment_attempts, 0) + 1 WHERE id = $2",
        ["pending_assignment", bookingId]
      );

      // Create admin alert notification
      await createAdminAlert(client, {
        type: "no_cleaner_available",
        bookingId,
        customerInfo,
        bookingDetails,
        message: `No cleaner available for booking in ZIP ${bookingDetails.zipCode} on ${bookingDetails.bookingDate} at ${bookingDetails.bookingTime}`,
      });

      await client.query("COMMIT");
      return { success: false, reason: "no_cleaner_available" };
    }

    // Update booking with assigned cleaner
    await client.query(
      "UPDATE bookings SET cleaner_id = $1, status = $2, assigned_at = CURRENT_TIMESTAMP WHERE id = $3",
      [selectedCleaner.id, "confirmed", bookingId]
    );

    // Send notifications to both customer and cleaner
    await Promise.all([
      createCustomerNotification(client, customerInfo.id, {
        bookingId,
        cleaner: selectedCleaner,
        bookingDetails,
      }),
      createCleanerNotification(client, selectedCleaner.id, {
        bookingId,
        customer: customerInfo,
        bookingDetails,
      }),
    ]);

    await client.query("COMMIT");
    return {
      success: true,
      cleaner: selectedCleaner,
      assignmentScore: selectedCleaner.priorityScore,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in performAutoAssignment:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Create admin alert for failed assignments
 */
const createAdminAlert = async (client, alertData) => {
  const { type, bookingId, customerInfo, bookingDetails, message } = alertData;

  // Get all admin users
  const adminsResult = await client.query(
    "SELECT id FROM users WHERE role = 'admin' AND is_active = true"
  );

  // Create notification for each admin
  for (const admin of adminsResult.rows) {
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        admin.id,
        "Manual Assignment Required",
        message,
        "admin_alert",
        JSON.stringify({
          bookingId,
          alertType: type,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          zipCode: bookingDetails.zipCode,
          bookingDate: bookingDetails.bookingDate,
          bookingTime: bookingDetails.bookingTime,
        }),
      ]
    );
  }
};

/**
 * Create customer notification for successful assignment
 */
const createCustomerNotification = async (client, customerId, data) => {
  const { bookingId, cleaner, bookingDetails } = data;

  await client.query(
    `INSERT INTO notifications (user_id, title, message, type, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      customerId,
      "Cleaner Assigned",
      `Great news! ${cleaner.first_name} ${cleaner.last_name} has been assigned to your booking on ${bookingDetails.bookingDate} at ${bookingDetails.bookingTime}.`,
      "booking_confirmed",
      JSON.stringify({
        bookingId,
        cleanerId: cleaner.id,
        cleanerName: `${cleaner.first_name} ${cleaner.last_name}`,
        cleanerPhone: cleaner.phone,
        cleanerRating: cleaner.rating,
      }),
    ]
  );
};

/**
 * Create cleaner notification for new assignment
 */
const createCleanerNotification = async (client, cleanerId, data) => {
  const { bookingId, customer, bookingDetails } = data;

  await client.query(
    `INSERT INTO notifications (user_id, title, message, type, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      cleanerId,
      "New Booking Assignment",
      `You have been assigned a new cleaning job for ${bookingDetails.bookingDate} at ${bookingDetails.bookingTime}. Customer: ${customer.firstName} ${customer.lastName}`,
      "new_assignment",
      JSON.stringify({
        bookingId,
        customerName: `${customer.firstName} ${customer.lastName}`,
        address: bookingDetails.address,
        zipCode: bookingDetails.zipCode,
        bookingDate: bookingDetails.bookingDate,
        bookingTime: bookingDetails.bookingTime,
        durationHours: bookingDetails.durationHours,
      }),
    ]
  );
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
  performAutoAssignment,
  getCleanerRecommendations,
  calculateDistance,
  calculateDistanceWithZipFallback,
  calculateZipProximityScore,
  checkCleanerAvailability,
  checkCleanerAvailabilityWithLock,
  calculateMatchScore,
  calculateEnhancedMatchScore,
  calculateEnhancedPriorityScore,
  createAdminAlert,
  createCustomerNotification,
  createCleanerNotification,
};
