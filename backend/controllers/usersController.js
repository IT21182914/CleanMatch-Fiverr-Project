const bcrypt = require("bcryptjs");
const { query } = require("../config/database");

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
 * @desc    Update cleaner availability status
 * @route   PUT /api/users/availability
 * @access  Private (Cleaners only)
 */
const updateCleanerAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "isAvailable must be a boolean value",
      });
    }

    await query(
      "UPDATE cleaner_profiles SET is_available = $1 WHERE user_id = $2",
      [isAvailable, req.user.id]
    );

    res.json({
      success: true,
      message: `Availability ${
        isAvailable ? "enabled" : "disabled"
      } successfully`,
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

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateCleanerProfile,
  changePassword,
  getUserBookings,
  updateCleanerAvailability,
  getUserReviews,
};
