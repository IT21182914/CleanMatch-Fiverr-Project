const { query } = require("../config/database");

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin only)
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get various statistics
    const stats = {};

    // Total users by role
    const userStatsResult = await query(`
      SELECT role, COUNT(*) as count, 
             COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month
      FROM users 
      WHERE is_active = true 
      GROUP BY role
    `);

    stats.users = userStatsResult.rows;

    // Total bookings and revenue
    const bookingStatsResult = await query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as bookings_this_month,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN payment_status = 'paid' AND created_at >= NOW() - INTERVAL '30 days' THEN total_amount ELSE 0 END) as revenue_this_month
      FROM bookings
    `);

    stats.bookings = bookingStatsResult.rows[0];

    // Pending freelancers count
    const pendingFreelancersResult = await query(`
      SELECT COUNT(*) as pending_count
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND cp.background_check_status = 'pending'
        AND cp.id_front_url IS NOT NULL 
        AND cp.id_back_url IS NOT NULL
        AND cp.ssn_front_url IS NOT NULL
        AND cp.ssn_back_url IS NOT NULL
    `);

    stats.pendingFreelancers = parseInt(
      pendingFreelancersResult.rows[0].pending_count
    );

    // Service statistics
    const serviceStatsResult = await query(`
      SELECT 
        s.name,
        s.category,
        COUNT(b.id) as booking_count,
        SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_amount ELSE 0 END) as revenue
      FROM services s
      LEFT JOIN bookings b ON s.id = b.service_id
      WHERE s.is_active = true
      GROUP BY s.id, s.name, s.category
      ORDER BY booking_count DESC
      LIMIT 10
    `);

    stats.topServices = serviceStatsResult.rows;

    // Top cleaners by ratings and jobs
    const topCleanersResult = await query(`
      SELECT 
        u.id, u.first_name, u.last_name,
        cp.rating, cp.total_jobs,
        COUNT(b.id) as bookings_count
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      LEFT JOIN bookings b ON u.id = b.cleaner_id AND b.status = 'completed'
      WHERE u.role = 'cleaner' AND u.is_active = true
      GROUP BY u.id, u.first_name, u.last_name, cp.rating, cp.total_jobs
      ORDER BY cp.rating DESC, cp.total_jobs DESC
      LIMIT 10
    `);

    stats.topCleaners = topCleanersResult.rows;

    // Monthly revenue chart data (last 12 months)
    const monthlyRevenueResult = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as revenue,
        COUNT(*) as bookings
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    stats.monthlyRevenue = monthlyRevenueResult.rows;

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving dashboard stats",
    });
  }
};

/**
 * @desc    Get all users with pagination and filters
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (role) {
      whereConditions.push(`u.role = $${paramCount++}`);
      queryParams.push(role);
    }

    if (status === "active") {
      whereConditions.push(`u.is_active = true`);
    } else if (status === "inactive") {
      whereConditions.push(`u.is_active = false`);
    }

    if (search) {
      whereConditions.push(
        `(u.first_name ILIKE $${paramCount} OR u.last_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const usersQuery = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.role,
        u.is_verified, u.is_active, u.created_at,
        CASE 
          WHEN u.role = 'cleaner' THEN cp.rating
          ELSE NULL
        END as rating,
        CASE 
          WHEN u.role = 'cleaner' THEN cp.total_jobs
          ELSE NULL
        END as total_jobs
      FROM users u
      LEFT JOIN cleaner_profiles cp ON u.id = cp.user_id AND u.role = 'cleaner'
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);

    const usersResult = await query(usersQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `;

    // For count query, we only need the filter parameters, not LIMIT and OFFSET
    const countParams = queryParams.slice(0, -2); // Remove the last 2 params (limit and offset)
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      users: usersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving users",
    });
  }
};

/**
 * @desc    Update user status (activate/deactivate)
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin only)
 */
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "isActive must be a boolean value",
      });
    }

    const updateResult = await query(
      "UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [isActive, id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating user status",
    });
  }
};

/**
 * @desc    Get all bookings with filters
 * @route   GET /api/admin/bookings
 * @access  Private (Admin only)
 */
const getBookings = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (status) {
      whereConditions.push(`b.status = $${paramCount++}`);
      queryParams.push(status);
    }

    if (paymentStatus) {
      whereConditions.push(`b.payment_status = $${paramCount++}`);
      queryParams.push(paymentStatus);
    }

    if (search) {
      whereConditions.push(`(
        customer.first_name ILIKE $${paramCount} OR 
        customer.last_name ILIKE $${paramCount} OR 
        customer.email ILIKE $${paramCount} OR
        cleaner.first_name ILIKE $${paramCount} OR 
        cleaner.last_name ILIKE $${paramCount} OR
        s.name ILIKE $${paramCount}
      )`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const bookingsQuery = `
      SELECT 
        b.id, b.booking_date, b.booking_time, b.duration_hours, b.total_amount,
        b.status, b.payment_status, b.address, b.city, b.state, b.zip_code,
        b.created_at,
        s.name as service_name, s.category as service_category,
        customer.first_name as customer_first_name, customer.last_name as customer_last_name,
        customer.email as customer_email,
        cleaner.first_name as cleaner_first_name, cleaner.last_name as cleaner_last_name,
        cleaner.email as cleaner_email
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

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users customer ON b.customer_id = customer.id
      LEFT JOIN users cleaner ON b.cleaner_id = cleaner.id
      ${whereClause}
    `;

    // For count query, we only need the filter parameters, not LIMIT and OFFSET
    const countParams = queryParams.slice(0, -2); // Remove the last 2 params (limit and offset)
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      bookings: bookingsResult.rows,
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
 * @desc    Get pending freelancers awaiting approval
 * @route   GET /api/admin/freelancers/pending
 * @access  Private (Admin only)
 */
const getPendingFreelancers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get freelancers with uploaded documents that are pending approval
    const freelancersQuery = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.address, u.city, u.state, u.zip_code,
        u.created_at, u.is_active,
        cp.cleaning_services, cp.cleaning_frequency, cp.preferred_hours, cp.message,
        cp.id_front_url, cp.id_back_url, cp.ssn_front_url, cp.ssn_back_url,
        cp.agreement_accepted, cp.terms_1099_accepted, cp.brings_supplies, cp.has_experience,
        cp.background_check_status, cp.created_at as profile_created_at
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND cp.background_check_status = 'pending'
        AND cp.id_front_url IS NOT NULL 
        AND cp.id_back_url IS NOT NULL
        AND cp.ssn_front_url IS NOT NULL
        AND cp.ssn_back_url IS NOT NULL
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const freelancersResult = await query(freelancersQuery, [limit, offset]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND cp.background_check_status = 'pending'
        AND cp.id_front_url IS NOT NULL 
        AND cp.id_back_url IS NOT NULL
        AND cp.ssn_front_url IS NOT NULL
        AND cp.ssn_back_url IS NOT NULL
    `;

    const countResult = await query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      freelancers: freelancersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get pending freelancers error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving pending freelancers",
    });
  }
};

/**
 * @desc    Get freelancer details by ID
 * @route   GET /api/admin/freelancers/:id
 * @access  Private (Admin only)
 */
const getFreelancerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const freelancerQuery = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.address, u.city, u.state, u.zip_code,
        u.created_at, u.is_active, u.is_verified,
        cp.cleaning_services, cp.cleaning_frequency, cp.preferred_hours, cp.message,
        cp.id_front_url, cp.id_back_url, cp.ssn_front_url, cp.ssn_back_url,
        cp.agreement_accepted, cp.terms_1099_accepted, cp.brings_supplies, cp.has_experience,
        cp.background_check_status, cp.bio, cp.experience_years, cp.hourly_rate,
        cp.rating, cp.total_jobs, cp.is_available, cp.created_at as profile_created_at
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.id = $1 AND u.role = 'cleaner'
    `;

    const freelancerResult = await query(freelancerQuery, [id]);

    if (freelancerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Freelancer not found",
      });
    }

    res.json({
      success: true,
      freelancer: freelancerResult.rows[0],
    });
  } catch (error) {
    console.error("Get freelancer details error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving freelancer details",
    });
  }
};

/**
 * @desc    Update cleaner background check status
 * @route   PUT /api/admin/cleaners/:id/background-check
 * @access  Private (Admin only)
 */
const updateCleanerBackgroundCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid background check status",
      });
    }

    // Update the background check status
    const updateResult = await query(
      "UPDATE cleaner_profiles SET background_check_status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2",
      [status, id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner not found",
      });
    }

    // If approved, also activate the user account
    if (status === "approved") {
      await query(
        "UPDATE users SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        [id]
      );
    }

    // Get user details for notification
    const userResult = await query(
      "SELECT email, first_name, last_name FROM users WHERE id = $1",
      [id]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];

      // Create notification message based on status
      let notificationTitle, notificationMessage;
      if (status === "approved") {
        notificationTitle = "🎉 Freelancer Application Approved!";
        notificationMessage =
          "Congratulations! Your freelancer application has been approved. You can now start receiving job assignments.";
      } else if (status === "rejected") {
        notificationTitle = "Application Update";
        notificationMessage = `Your freelancer application requires attention. ${
          notes || "Please contact support for more information."
        }`;
      }

      // Insert notification for the user
      if (notificationTitle) {
        await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
          [id, notificationTitle, notificationMessage, "freelancer_status"]
        );
      }
    }

    res.json({
      success: true,
      message: `Freelancer application ${
        status === "approved" ? "approved" : status
      } successfully`,
      status,
    });
  } catch (error) {
    console.error("Update background check error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating background check status",
    });
  }
};

/**
 * @desc    Get payment analytics
 * @route   GET /api/admin/payments
 * @access  Private (Admin only)
 */
const getPayments = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ["b.payment_status = $1"];
    let queryParams = ["paid"];
    let paramCount = 2;

    if (startDate) {
      whereConditions.push(`b.created_at >= $${paramCount++}`);
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push(`b.created_at <= $${paramCount++}`);
      queryParams.push(endDate);
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    // Get payment transactions
    const paymentsQuery = `
      SELECT 
        b.id, b.total_amount, b.created_at, b.stripe_payment_intent_id,
        customer.first_name as customer_first_name, customer.last_name as customer_last_name,
        cleaner.first_name as cleaner_first_name, cleaner.last_name as cleaner_last_name,
        s.name as service_name
      FROM bookings b
      JOIN users customer ON b.customer_id = customer.id
      LEFT JOIN users cleaner ON b.cleaner_id = cleaner.id
      JOIN services s ON b.service_id = s.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);

    const paymentsResult = await query(paymentsQuery, queryParams);

    // Get payment summary
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_transaction
      FROM bookings b
      ${whereClause}
    `;

    // For summary query, we only need the filter parameters, not LIMIT and OFFSET
    const summaryParams = queryParams.slice(0, -2); // Remove the last 2 params (limit and offset)
    const summaryResult = await query(summaryQuery, summaryParams);

    res.json({
      success: true,
      payments: paymentsResult.rows,
      summary: summaryResult.rows[0],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(summaryResult.rows[0].total_transactions),
        pages: Math.ceil(summaryResult.rows[0].total_transactions / limit),
      },
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving payments",
    });
  }
};

/**
 * @desc    Get revenue analytics
 * @route   GET /api/admin/analytics/revenue
 * @access  Private (Admin only)
 */
const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = "monthly", year } = req.query;

    let dateFormat;
    let whereClause = "WHERE payment_status = 'paid'";

    if (year) {
      whereClause += ` AND EXTRACT(YEAR FROM created_at) = ${year}`;
    }

    switch (period) {
      case "daily":
        dateFormat = "DATE(created_at)";
        break;
      case "weekly":
        dateFormat = "DATE_TRUNC('week', created_at)";
        break;
      case "monthly":
        dateFormat = "DATE_TRUNC('month', created_at)";
        break;
      case "yearly":
        dateFormat = "DATE_TRUNC('year', created_at)";
        break;
      default:
        dateFormat = "DATE_TRUNC('month', created_at)";
    }

    const revenueQuery = `
      SELECT 
        ${dateFormat} as period,
        SUM(total_amount) as revenue,
        COUNT(*) as transactions,
        AVG(total_amount) as average_transaction
      FROM bookings
      ${whereClause}
      GROUP BY ${dateFormat}
      ORDER BY period
    `;

    const revenueResult = await query(revenueQuery);

    res.json({
      success: true,
      analytics: revenueResult.rows,
    });
  } catch (error) {
    console.error("Get revenue analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving revenue analytics",
    });
  }
};

/**
 * @desc    Get all reviews for moderation
 * @route   GET /api/admin/reviews
 * @access  Private (Admin only)
 */
const getReviews = async (req, res) => {
  try {
    const { rating, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (rating) {
      whereConditions.push(`r.rating = $${paramCount++}`);
      queryParams.push(rating);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const reviewsQuery = `
      SELECT 
        r.id, r.rating, r.comment, r.created_at,
        reviewer.first_name as reviewer_first_name, reviewer.last_name as reviewer_last_name,
        reviewee.first_name as reviewee_first_name, reviewee.last_name as reviewee_last_name,
        b.id as booking_id, s.name as service_name
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN users reviewee ON r.reviewee_id = reviewee.id
      JOIN bookings b ON r.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);

    const reviewsResult = await query(reviewsQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      ${whereClause}
    `;

    // For count query, we only need the filter parameters, not LIMIT and OFFSET
    const countParams = queryParams.slice(0, -2); // Remove the last 2 params (limit and offset)
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      reviews: reviewsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
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
 * @desc    Delete review
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private (Admin only)
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteResult = await query("DELETE FROM reviews WHERE id = $1", [id]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting review",
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getBookings,
  updateCleanerBackgroundCheck,
  getPendingFreelancers,
  getFreelancerDetails,
  getPayments,
  getRevenueAnalytics,
  getReviews,
  deleteReview,
};
