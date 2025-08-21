const bcrypt = require("bcryptjs");
const { query } = require("../config/database");
const { geocodeAddress, isZipCode } = require("../utils/geocoding");

/**
 * @desc    Get current user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const userResult = await query(
      `SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.role,
        u.profile_image, u.address, u.city, u.state, u.zip_code,
        u.is_verified, u.created_at, u.updated_at
       FROM users u 
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const user = userResult.rows[0];

    // If user is a cleaner, get cleaner profile data
    if (user.role === "cleaner") {
      const cleanerResult = await query(
        `SELECT 
          bio, experience_years, hourly_rate, availability_schedule,
          service_radius, rating, total_jobs, is_available,
          background_check_status, certifications, stripe_account_id
         FROM cleaner_profiles 
         WHERE user_id = $1`,
        [user.id]
      );

      if (cleanerResult.rows.length > 0) {
        user.cleanerProfile = cleanerResult.rows[0];
      }
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving profile",
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, state, zipCode } =
      req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (firstName) {
      updateFields.push(`first_name = $${paramCount++}`);
      values.push(firstName);
    }
    if (lastName) {
      updateFields.push(`last_name = $${paramCount++}`);
      values.push(lastName);
    }
    if (phone) {
      updateFields.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (address) {
      updateFields.push(`address = $${paramCount++}`);
      values.push(address);
    }
    if (city) {
      updateFields.push(`city = $${paramCount++}`);
      values.push(city);
    }
    if (state) {
      updateFields.push(`state = $${paramCount++}`);
      values.push(state);
    }
    if (zipCode) {
      updateFields.push(`zip_code = $${paramCount++}`);
      values.push(zipCode);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No fields to update",
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.id);

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, phone, address, city, state, zip_code, role
    `;

    const result = await query(updateQuery, values);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        phone: result.rows[0].phone,
        address: result.rows[0].address,
        city: result.rows[0].city,
        state: result.rows[0].state,
        zipCode: result.rows[0].zip_code,
        role: result.rows[0].role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating profile",
    });
  }
};

/**
 * @desc    Update cleaner profile
 * @route   PUT /api/users/cleaner-profile
 * @access  Private (Cleaners only)
 */
const updateCleanerProfile = async (req, res) => {
  try {
    const {
      bio,
      experienceYears,
      hourlyRate,
      serviceRadius,
      availabilitySchedule,
      certifications,
    } = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount++}`);
      values.push(bio);
    }
    if (experienceYears !== undefined) {
      updateFields.push(`experience_years = $${paramCount++}`);
      values.push(experienceYears);
    }
    if (hourlyRate !== undefined) {
      updateFields.push(`hourly_rate = $${paramCount++}`);
      values.push(hourlyRate);
    }
    if (serviceRadius !== undefined) {
      updateFields.push(`service_radius = $${paramCount++}`);
      values.push(serviceRadius);
    }
    if (availabilitySchedule !== undefined) {
      updateFields.push(`availability_schedule = $${paramCount++}`);
      values.push(JSON.stringify(availabilitySchedule));
    }
    if (certifications !== undefined) {
      updateFields.push(`certifications = $${paramCount++}`);
      values.push(certifications);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No fields to update",
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.id);

    const updateQuery = `
      UPDATE cleaner_profiles 
      SET ${updateFields.join(", ")}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner profile not found",
      });
    }

    res.json({
      success: true,
      message: "Cleaner profile updated successfully",
      cleanerProfile: result.rows[0],
    });
  } catch (error) {
    console.error("Update cleaner profile error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating cleaner profile",
    });
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 8 characters long",
      });
    }

    // Get current password hash
    const userResult = await query("SELECT password FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedNewPassword, req.user.id]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      error: "Server error changing password",
    });
  }
};

/**
 * @desc    Get user's bookings
 * @route   GET /api/users/bookings
 * @access  Private
 */
const getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    const queryParams = [req.user.id];
    const countQueryParams = [req.user.id];
    let paramCount = 2;

    // Build where clause based on user role
    if (req.user.role === "customer") {
      whereClause = "WHERE b.customer_id = $1";
    } else if (req.user.role === "cleaner") {
      whereClause = "WHERE b.cleaner_id = $1";
    } else {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Add status filter if provided
    if (status) {
      whereClause += ` AND b.status = $${paramCount++}`;
      queryParams.push(status);
      countQueryParams.push(status);
    }

    const bookingsQuery = `
      SELECT 
        b.id, b.booking_date, b.booking_time, b.duration_hours, b.total_amount,
        b.status, b.payment_status, b.special_instructions, b.address, b.city, b.state, b.zip_code,
        b.created_at, b.updated_at,
        (b.booking_date || ' ' || b.booking_time)::timestamp as scheduled_date,
        s.name as service_name, s.category as service_category,
        customer.first_name as customer_first_name, customer.last_name as customer_last_name,
        customer.email as customer_email, customer.phone as customer_phone,
        cleaner.first_name as cleaner_first_name, cleaner.last_name as cleaner_last_name,
        cleaner.email as cleaner_email, cleaner.phone as cleaner_phone
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users customer ON b.customer_id = customer.id
      LEFT JOIN users cleaner ON b.cleaner_id = cleaner.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);

    const bookingsResult = await query(bookingsQuery, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM bookings b
      ${whereClause}
    `;

    const countResult = await query(countQuery, countQueryParams);
    const total = parseInt(countResult.rows[0].total);

    // Transform the booking data to match frontend expectations
    const transformedBookings = bookingsResult.rows.map((booking) => ({
      id: booking.id,
      scheduledDate: booking.scheduled_date,
      bookingDate: booking.booking_date,
      bookingTime: booking.booking_time,
      durationHours: booking.duration_hours,
      totalAmount: booking.total_amount,
      status: booking.status,
      paymentStatus: booking.payment_status,
      specialInstructions: booking.special_instructions,
      address: booking.address,
      city: booking.city,
      state: booking.state,
      zipCode: booking.zip_code,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      service: {
        name: booking.service_name,
        category: booking.service_category,
      },
      customer: {
        firstName: booking.customer_first_name,
        lastName: booking.customer_last_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
      },
      cleaner: booking.cleaner_first_name
        ? {
          firstName: booking.cleaner_first_name,
          lastName: booking.cleaner_last_name,
          email: booking.cleaner_email,
          phone: booking.cleaner_phone,
        }
        : null,
    }));

    res.json({
      success: true,
      data: transformedBookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving bookings",
    });
  }
};

/**
 * @desc    Update cleaner availability status with location
 * @route   PUT /api/users/availability
 * @access  Private (Cleaners only)
 */
const updateCleanerAvailability = async (req, res) => {
  try {
    const { isAvailable, latitude, longitude } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "isAvailable must be a boolean value",
      });
    }

    // If setting to available, require location data
    if (isAvailable && (!latitude || !longitude)) {
      return res.status(400).json({
        success: false,
        error: "Location (latitude and longitude) is required when setting availability to true",
      });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    // Always update availability status
    updateFields.push(`is_available = $${paramCount++}`);
    values.push(isAvailable);

    // Update location if provided and going online
    if (isAvailable && latitude && longitude) {
      updateFields.push(`current_latitude = $${paramCount++}`);
      values.push(latitude);

      updateFields.push(`current_longitude = $${paramCount++}`);
      values.push(longitude);

      updateFields.push(`last_location_update = CURRENT_TIMESTAMP`);

    }

    // Always update last_active when availability changes
    updateFields.push(`last_active = CURRENT_TIMESTAMP`);

    // If going offline, clear location data for privacy
    if (!isAvailable) {
      updateFields.push(`current_latitude = NULL`);
      updateFields.push(`current_longitude = NULL`);
      updateFields.push(`last_location_update = NULL`);
    }

    values.push(req.user.id);

    const updateQuery = `
      UPDATE cleaner_profiles 
      SET ${updateFields.join(", ")}
      WHERE user_id = $${paramCount}
      RETURNING is_available, current_latitude, current_longitude, last_location_update
    `;

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner profile not found",
      });
    }

    res.json({
      success: true,
      message: `Availability ${isAvailable ? "enabled" : "disabled"} successfully`,
      data: {
        isAvailable: result.rows[0].is_available,
        locationUpdated: isAvailable ? !!result.rows[0].last_location_update : false,
        lastLocationUpdate: result.rows[0].last_location_update,
      },
    });
  } catch (error) {
    console.error("Update availability error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating availability",
    });
  }
};

/**
 * @desc    Get user's reviews
 * @route   GET /api/users/reviews
 * @access  Private
 */
const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviewsQuery = `
      SELECT 
        r.id, r.rating, r.comment, r.created_at,
        reviewer.first_name as reviewer_first_name, reviewer.last_name as reviewer_last_name,
        b.booking_date, s.name as service_name
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN bookings b ON r.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE r.reviewee_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const reviewsResult = await query(reviewsQuery, [
      req.user.id,
      limit,
      offset,
    ]);

    // Get total count and average rating
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating
      FROM reviews 
      WHERE reviewee_id = $1
    `;

    const statsResult = await query(statsQuery, [req.user.id]);
    const stats = statsResult.rows[0];

    res.json({
      success: true,
      reviews: reviewsResult.rows,
      stats: {
        totalReviews: parseInt(stats.total_reviews),
        averageRating: parseFloat(stats.average_rating) || 0,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(stats.total_reviews),
        pages: Math.ceil(stats.total_reviews / limit),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving reviews",
    });
  }
};

/**
 * @desc    Get nearby available cleaners
 * @route   GET /api/users/nearby-cleaners
 * @access  Private (Customers only)
 */
const getNearbyCleaners = async (req, res) => {
  try {
    const { latitude, longitude, zipCode, radius = 20, serviceType, minRating = 0 } = req.query;

    let customerLat, customerLng, searchMethod, geocodedAddress;

    // Priority 1: Use provided latitude and longitude if available
    if (latitude && longitude) {
      customerLat = parseFloat(latitude);
      customerLng = parseFloat(longitude);

      if (isNaN(customerLat) || isNaN(customerLng)) {
        return res.status(400).json({
          success: false,
          error: "Invalid latitude or longitude format",
        });
      }

      searchMethod = "coordinates";
    }
    // Priority 2: Use zipcode if latitude/longitude not provided
    else if (zipCode) {
      if (!isZipCode(zipCode)) {
        return res.status(400).json({
          success: false,
          error: "Invalid zipcode format. Please provide a valid US zipcode (e.g., 07094) or Canadian postal code.",
        });
      }

      try {
        console.log(`Geocoding zipcode: ${zipCode}`);
        const geocodeResult = await geocodeAddress(zipCode);

        customerLat = geocodeResult.latitude;
        customerLng = geocodeResult.longitude;
        geocodedAddress = geocodeResult.formattedAddress;
        searchMethod = "geocoded";

        console.log(`Geocoded ${zipCode} to coordinates: ${customerLat}, ${customerLng}`);
      } catch (geocodeError) {
        console.error("Geocoding error:", geocodeError.message);
        return res.status(400).json({
          success: false,
          error: `Unable to geocode zipcode: ${geocodeError.message}`,
          details: "Please check the zipcode or provide latitude and longitude instead.",
        });
      }
    }
    // Neither coordinates nor zipcode provided
    else {
      return res.status(400).json({
        success: false,
        error: "Either latitude & longitude OR zipcode is required",
        examples: {
          coordinates: "?latitude=40.7128&longitude=-74.0060&radius=20",
          zipcode: "?zipCode=07094&radius=20"
        }
      });
    }

    const radiusKm = parseFloat(radius);
    const minRatingValue = parseFloat(minRating);

    if (isNaN(radiusKm) || radiusKm <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid radius. Must be a positive number.",
      });
    }

    if (isNaN(minRatingValue) || minRatingValue < 0 || minRatingValue > 5) {
      return res.status(400).json({
        success: false,
        error: "Invalid minimum rating. Must be between 0 and 5.",
      });
    }

    // Build the query with proper distance calculation using the Haversine formula
    let baseQuery = `
      SELECT 
        cp.user_id,
        cp.bio,
        cp.experience_years,
        cp.hourly_rate,
        cp.rating,
        cp.total_jobs,
        cp.current_latitude,
        cp.current_longitude,
        cp.last_location_update,
        cp.last_active,
        cp.service_radius,
        cp.certifications,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.profile_image,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - cp.last_location_update))/60 as minutes_since_last_update,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(cp.current_latitude)) *
            cos(radians(cp.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(cp.current_latitude))
          )
        ) AS distance_km
      FROM cleaner_profiles cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.is_available = true 
        AND cp.current_latitude IS NOT NULL 
        AND cp.current_longitude IS NOT NULL
        AND cp.last_location_update > (CURRENT_TIMESTAMP - INTERVAL '3 minutes')
        AND cp.rating >= $3
        AND (
          6371 * acos(
            cos(radians($1)) * cos(radians(cp.current_latitude)) *
            cos(radians(cp.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(cp.current_latitude))
          )
        ) <= $4
    `;

    const queryParams = [customerLat, customerLng, minRatingValue, radiusKm];
    let paramCount = 5;

    // Add service type filter if specified
    if (serviceType) {
      baseQuery += ` AND $${paramCount} = ANY(cp.cleaning_services)`;
      queryParams.push(serviceType);
      paramCount++;
    }

    baseQuery += `
      ORDER BY distance_km ASC, cp.rating DESC, cp.total_jobs DESC
      LIMIT 50
    `;

    const result = await query(baseQuery, queryParams);

    // Transform the data for frontend
    const nearbyCleaners = result.rows.map(cleaner => ({
      id: cleaner.user_id,
      firstName: cleaner.first_name,
      lastName: cleaner.last_name,
      email: cleaner.email,
      phone: cleaner.phone,
      profileImage: cleaner.profile_image,
      bio: cleaner.bio,
      experienceYears: cleaner.experience_years,
      hourlyRate: cleaner.hourly_rate,
      rating: parseFloat(cleaner.rating) || 0,
      totalJobs: cleaner.total_jobs || 0,
      serviceRadius: cleaner.service_radius,
      certifications: cleaner.certifications,
      distanceKm: parseFloat(cleaner.distance_km).toFixed(2),
      minutesSinceLastUpdate: Math.round(cleaner.minutes_since_last_update || 0),
      isOnline: cleaner.minutes_since_last_update <= 3,
      location: {
        latitude: cleaner.current_latitude,
        longitude: cleaner.current_longitude,
        lastUpdate: cleaner.last_location_update,
      },
    }));

    // Get count by distance ranges for analytics
    const distanceStats = {
      within5km: nearbyCleaners.filter(c => parseFloat(c.distanceKm) <= 5).length,
      within10km: nearbyCleaners.filter(c => parseFloat(c.distanceKm) <= 10).length,
      within20km: nearbyCleaners.filter(c => parseFloat(c.distanceKm) <= 20).length,
      total: nearbyCleaners.length,
    };

    res.json({
      success: true,
      data: nearbyCleaners,
      searchCriteria: {
        latitude: customerLat,
        longitude: customerLng,
        radiusKm,
        serviceType: serviceType || "all",
        minRating: minRatingValue,
        searchMethod, // "coordinates" or "geocoded"
        ...(searchMethod === "geocoded" && {
          originalZipCode: zipCode,
          geocodedAddress: geocodedAddress
        })
      },
      stats: distanceStats,
      message: nearbyCleaners.length > 0
        ? `Found ${nearbyCleaners.length} available cleaners within ${radiusKm}km`
        : `No cleaners available within ${radiusKm}km radius`,
    });

  } catch (error) {
    console.error("Get nearby cleaners error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving nearby cleaners",
    });
  }
};

/**
 * @desc    Get online cleaners count and stats
 * @route   GET /api/users/online-stats
 * @access  Private
 */
const getOnlineCleanersStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_online,
        AVG(rating) as average_rating,
        COUNT(*) FILTER (WHERE rating >= 4.5) as high_rated_count,
        COUNT(*) FILTER (WHERE experience_years >= 2) as experienced_count,
        MIN(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - last_location_update))/60) as most_recent_update_minutes
      FROM cleaner_profiles cp
      WHERE cp.is_available = true 
        AND cp.current_latitude IS NOT NULL 
        AND cp.current_longitude IS NOT NULL
        AND cp.last_location_update > (CURRENT_TIMESTAMP - INTERVAL '3 minutes')
    `;

    const result = await query(statsQuery);
    const stats = result.rows[0];

    res.json({
      success: true,
      stats: {
        totalOnlineCleaners: parseInt(stats.total_online) || 0,
        averageRating: parseFloat(stats.average_rating) || 0,
        highRatedCleaners: parseInt(stats.high_rated_count) || 0,
        experiencedCleaners: parseInt(stats.experienced_count) || 0,
        mostRecentUpdateMinutes: parseFloat(stats.most_recent_update_minutes) || 0,
      },
      message: `${stats.total_online || 0} cleaners are currently online`,
    });

  } catch (error) {
    console.error("Get online stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving online statistics",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateCleanerProfile,
  changePassword,
  getUserBookings,
  updateCleanerAvailability,
  getUserReviews,
  getNearbyCleaners,
  getOnlineCleanersStats,
};
