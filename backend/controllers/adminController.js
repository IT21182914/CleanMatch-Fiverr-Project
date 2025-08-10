const { query } = require("../config/database");

/**
 * @desc    Get admin users for assignment
 * @route   GET /api/admin/users/admins
 * @access  Private (Admin only)
 */
const getAdminUsers = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, first_name, last_name, email 
       FROM users 
       WHERE role = 'admin' AND is_active = true 
       ORDER BY first_name, last_name`
    );

    res.json({
      success: true,
      data: result.rows.map((admin) => ({
        id: admin.id,
        name: `${admin.first_name} ${admin.last_name}`,
        email: admin.email,
      })),
    });
  } catch (error) {
    console.error("Get admin users error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving admin users",
    });
  }
};

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
 * @desc    Get all users with membership status
 * @route   GET /api/admin/users-with-membership
 * @access  Private (Admin only)
 */
const getUsersWithMembership = async (req, res) => {
  try {
    const {
      role,
      status,
      page = 1,
      limit = 20,
      search,
      membershipStatus,
    } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (role) {
      whereConditions.push(`ums.role = $${paramCount++}`);
      queryParams.push(role);
    }

    if (status === "active") {
      whereConditions.push(`ums.user_active = true`);
    } else if (status === "inactive") {
      whereConditions.push(`ums.user_active = false`);
    }

    if (membershipStatus) {
      whereConditions.push(`ums.effective_status = $${paramCount++}`);
      queryParams.push(membershipStatus);
    }

    if (search) {
      whereConditions.push(
        `(ums.first_name ILIKE $${paramCount} OR ums.last_name ILIKE $${paramCount} OR ums.email ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get users with membership status using the view
    const usersQuery = `
      SELECT * FROM user_membership_status ums
      ${whereClause}
      ORDER BY ums.user_id DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const usersResult = await query(usersQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_membership_status ums
      ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams.slice(0, -2));
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
    console.error("Get users with membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving users with membership data",
    });
  }
};

/**
 * @desc    Cancel user membership (Admin)
 * @route   PUT /api/admin/memberships/:userId/cancel
 * @access  Private (Admin only)
 */
const cancelUserMembership = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason = "Admin cancellation", immediate = false } = req.body;

    // Get user's active membership
    const membershipResult = await query(
      "SELECT * FROM memberships WHERE user_id = $1 AND status IN ('active', 'trialing')",
      [userId]
    );

    if (membershipResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No active membership found for this user",
      });
    }

    const membership = membershipResult.rows[0];

    if (immediate) {
      // Cancel immediately
      if (membership.stripe_subscription_id) {
        const { stripe } = require("../utils/stripe");
        await stripe.subscriptions.cancel(membership.stripe_subscription_id, {
          prorate: true,
        });
      }

      await query(
        `UPDATE memberships 
         SET status = 'cancelled', 
             end_date = CURRENT_TIMESTAMP,
             cancel_at_period_end = false,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [membership.id]
      );
    } else {
      // Cancel at period end
      if (membership.stripe_subscription_id) {
        const { stripe } = require("../utils/stripe");
        await stripe.subscriptions.update(membership.stripe_subscription_id, {
          cancel_at_period_end: true,
          metadata: { cancellation_reason: reason },
        });
      }

      await query(
        `UPDATE memberships 
         SET cancel_at_period_end = true, 
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [membership.id]
      );
    }

    res.json({
      success: true,
      message: immediate
        ? "Membership cancelled immediately"
        : "Membership will cancel at the end of the current period",
    });
  } catch (error) {
    console.error("Cancel user membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error cancelling membership",
    });
  }
};

/**
 * @desc    Grant membership to user (Admin)
 * @route   POST /api/admin/memberships/:userId/grant
 * @access  Private (Admin only)
 */
const grantUserMembership = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      durationMonths = 1,
      reason = "Admin granted membership",
      trialDays = 0,
    } = req.body;

    // Check if user exists and is a customer
    const userResult = await query(
      "SELECT * FROM users WHERE id = $1 AND role = 'customer' AND is_active = true",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Customer not found or inactive",
      });
    }

    // Check if user already has an active membership
    const existingMembership = await query(
      "SELECT * FROM memberships WHERE user_id = $1 AND status IN ('active', 'trialing')",
      [userId]
    );

    if (existingMembership.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User already has an active membership",
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    let status = "active";
    let trialEnd = null;

    if (trialDays > 0) {
      status = "trialing";
      trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + trialDays);
    }

    // Create membership record
    const membershipResult = await query(
      `INSERT INTO memberships (
        user_id, plan_name, tier, monthly_fee, discount_percentage,
        status, start_date, current_period_start, current_period_end,
        trial_end, auto_renewal
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        userId,
        "SuperSaver Monthly",
        "supersaver",
        59.0,
        50.0,
        status,
        startDate,
        startDate,
        endDate,
        trialEnd,
        false, // Admin granted memberships don't auto-renew unless user sets up payment
      ]
    );

    res.status(201).json({
      success: true,
      message: `Membership granted successfully for ${durationMonths} months`,
      membership: membershipResult.rows[0],
    });
  } catch (error) {
    console.error("Grant user membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error granting membership",
    });
  }
};

/**
 * @desc    Get membership analytics for admin
 * @route   GET /api/admin/membership-analytics
 * @access  Private (Admin only)
 */
const getMembershipAnalytics = async (req, res) => {
  try {
    // Overall membership statistics
    const overallStats = await query(`
      SELECT 
        COUNT(*) as total_memberships,
        COUNT(CASE WHEN effective_status = 'active' THEN 1 END) as active_memberships,
        COUNT(CASE WHEN effective_status = 'trialing' THEN 1 END) as trial_memberships,
        COUNT(CASE WHEN effective_status = 'expired' THEN 1 END) as expired_memberships,
        COUNT(CASE WHEN effective_status = 'cancelled' THEN 1 END) as cancelled_memberships,
        COUNT(CASE WHEN effective_status = 'past_due' THEN 1 END) as past_due_memberships,
        SUM(CASE WHEN effective_status = 'active' THEN monthly_fee ELSE 0 END) as monthly_recurring_revenue,
        AVG(CASE WHEN effective_status IN ('active', 'trialing') THEN total_savings ELSE 0 END) as avg_member_savings
      FROM user_membership_status
      WHERE membership_id IS NOT NULL
    `);

    // Member distribution by signup date (last 12 months)
    const membershipGrowth = await query(`
      SELECT 
        DATE_TRUNC('month', membership_start) as month,
        COUNT(*) as new_memberships,
        COUNT(CASE WHEN effective_status = 'active' THEN 1 END) as active_members
      FROM user_membership_status
      WHERE membership_id IS NOT NULL 
        AND membership_start >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', membership_start)
      ORDER BY month
    `);

    // Usage statistics
    const usageStats = await query(`
      SELECT 
        COUNT(CASE WHEN usage_count > 0 THEN 1 END) as members_with_usage,
        COUNT(CASE WHEN usage_count = 0 THEN 1 END) as members_no_usage,
        AVG(usage_count) as avg_bookings_per_member,
        SUM(total_savings) as total_platform_savings
      FROM user_membership_status
      WHERE membership_id IS NOT NULL AND effective_status IN ('active', 'trialing')
    `);

    // Customer types breakdown
    const customerBreakdown = await query(`
      SELECT 
        COUNT(CASE WHEN membership_id IS NULL THEN 1 END) as non_members,
        COUNT(CASE WHEN membership_id IS NOT NULL THEN 1 END) as members,
        COUNT(*) as total_customers
      FROM user_membership_status
      WHERE role = 'customer'
    `);

    res.json({
      success: true,
      analytics: {
        overallStats: overallStats.rows[0],
        membershipGrowth: membershipGrowth.rows,
        usageStats: usageStats.rows[0],
        customerBreakdown: customerBreakdown.rows[0],
      },
    });
  } catch (error) {
    console.error("Get membership analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving membership analytics",
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

/**
 * @desc    Get assignment system metrics and pending bookings
 * @route   GET /api/admin/assignment-metrics
 * @access  Private (Admin only)
 */
const getAssignmentMetrics = async (req, res) => {
  try {
    // Get overall assignment statistics
    const assignmentStats = await query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'confirmed' AND cleaner_id IS NOT NULL THEN 1 END) as assigned_bookings,
        COUNT(CASE WHEN status = 'pending_assignment' THEN 1 END) as pending_assignment,
        COUNT(CASE WHEN assigned_by_admin = true THEN 1 END) as admin_assigned,
        AVG(assignment_attempts) as avg_assignment_attempts,
        COUNT(CASE WHEN assignment_attempts > 1 THEN 1 END) as required_retry
      FROM bookings 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    // Get assignment success rate by ZIP code
    const zipCodeStats = await query(`
      SELECT 
        zip_code,
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN cleaner_id IS NOT NULL THEN 1 END) as assigned_bookings,
        ROUND(
          (COUNT(CASE WHEN cleaner_id IS NOT NULL THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
          2
        ) as assignment_success_rate
      FROM bookings 
      WHERE created_at >= NOW() - INTERVAL '30 days'
        AND zip_code IS NOT NULL
      GROUP BY zip_code
      HAVING COUNT(*) >= 3
      ORDER BY assignment_success_rate ASC, total_bookings DESC
      LIMIT 20
    `);

    // Get pending assignments that need admin attention
    const pendingAssignments = await query(`
      SELECT 
        b.id,
        b.created_at,
        b.booking_date,
        b.booking_time,
        b.zip_code,
        b.assignment_attempts,
        b.total_amount,
        u.first_name || ' ' || u.last_name as customer_name,
        u.email as customer_email,
        s.name as service_name
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN services s ON b.service_id = s.id
      WHERE b.status = 'pending_assignment'
        AND b.created_at >= NOW() - INTERVAL '7 days'
      ORDER BY b.created_at ASC
      LIMIT 50
    `);

    // Get cleaner availability by ZIP code
    const cleanerAvailability = await query(`
      WITH zip_areas AS (
        SELECT DISTINCT zip_code
        FROM bookings 
        WHERE zip_code IS NOT NULL 
          AND created_at >= NOW() - INTERVAL '30 days'
      ),
      cleaner_coverage AS (
        SELECT 
          za.zip_code,
          COUNT(DISTINCT u.id) as available_cleaners,
          COUNT(DISTINCT csa.cleaner_id) as explicit_coverage
        FROM zip_areas za
        LEFT JOIN cleaner_service_areas csa ON za.zip_code = csa.zip_code
        LEFT JOIN users u ON (
          (u.zip_code = za.zip_code OR LEFT(u.zip_code, 3) = LEFT(za.zip_code, 3))
          AND u.role = 'cleaner' 
          AND u.is_active = true
        )
        LEFT JOIN cleaner_profiles cp ON u.id = cp.user_id AND cp.is_available = true
        GROUP BY za.zip_code
      )
      SELECT * FROM cleaner_coverage
      WHERE available_cleaners = 0 OR available_cleaners < 3
      ORDER BY available_cleaners ASC, zip_code
      LIMIT 20
    `);

    // Get top performing cleaners by assignment success and ratings
    const topCleaners = await query(`
      SELECT 
        u.id,
        u.first_name || ' ' || u.last_name as name,
        u.zip_code,
        cp.rating,
        cp.total_jobs,
        COUNT(b.id) as recent_bookings,
        COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_recently,
        cp.completion_rate,
        cp.last_active
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      LEFT JOIN bookings b ON u.id = b.cleaner_id AND b.created_at >= NOW() - INTERVAL '30 days'
      WHERE u.role = 'cleaner' 
        AND u.is_active = true
        AND cp.is_available = true
      GROUP BY u.id, u.first_name, u.last_name, u.zip_code, cp.rating, cp.total_jobs, cp.completion_rate, cp.last_active
      ORDER BY cp.rating DESC, completed_recently DESC, cp.completion_rate DESC
      LIMIT 10
    `);

    // Get assignment timeline (last 7 days)
    const assignmentTimeline = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN cleaner_id IS NOT NULL THEN 1 END) as assigned_bookings,
        COUNT(CASE WHEN status = 'pending_assignment' THEN 1 END) as pending_assignments,
        COUNT(CASE WHEN assigned_by_admin = true THEN 1 END) as admin_assignments
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: {
        overview: assignmentStats.rows[0],
        zipCodePerformance: zipCodeStats.rows,
        pendingAssignments: pendingAssignments.rows,
        underservedAreas: cleanerAvailability.rows,
        topPerformers: topCleaners.rows,
        timeline: assignmentTimeline.rows,
        insights: {
          assignmentSuccessRate:
            (assignmentStats.rows[0].assigned_bookings /
              assignmentStats.rows[0].total_bookings) *
            100,
          areasNeedingAttention: cleanerAvailability.rows.length,
          adminInterventionRate:
            (assignmentStats.rows[0].admin_assigned /
              assignmentStats.rows[0].total_bookings) *
            100,
          avgRetryAttempts: assignmentStats.rows[0].avg_assignment_attempts,
        },
        recommendations: generateAssignmentRecommendations(
          assignmentStats.rows[0],
          zipCodeStats.rows,
          cleanerAvailability.rows
        ),
      },
    });
  } catch (error) {
    console.error("Get assignment metrics error:", error);
    res.status(500).json({
      success: false,
      error: "Server error getting assignment metrics",
    });
  }
};

/**
 * Generate actionable recommendations based on assignment metrics
 */
const generateAssignmentRecommendations = (overall, zipStats, availability) => {
  const recommendations = [];

  // Low assignment success rate
  if (overall.assigned_bookings / overall.total_bookings < 0.8) {
    recommendations.push({
      priority: "high",
      category: "coverage",
      message:
        "Overall assignment success rate is below 80%. Consider recruiting cleaners in underserved areas.",
      action:
        "Review ZIP codes with low assignment rates and targeted cleaner recruitment.",
    });
  }

  // High admin intervention
  if (overall.admin_assigned / overall.total_bookings > 0.2) {
    recommendations.push({
      priority: "medium",
      category: "automation",
      message:
        "High manual assignment rate indicates automatic matching needs improvement.",
      action:
        "Review matching algorithm parameters and cleaner availability settings.",
    });
  }

  // Areas with no coverage
  const noCoverageAreas = availability.filter(
    (area) => area.available_cleaners === 0
  );
  if (noCoverageAreas.length > 0) {
    recommendations.push({
      priority: "high",
      category: "coverage",
      message: `${noCoverageAreas.length} ZIP codes have no available cleaners.`,
      action: `Recruit cleaners in: ${noCoverageAreas
        .slice(0, 5)
        .map((a) => a.zip_code)
        .join(", ")}`,
    });
  }

  // Low coverage areas
  const lowCoverageAreas = availability.filter(
    (area) => area.available_cleaners > 0 && area.available_cleaners < 3
  );
  if (lowCoverageAreas.length > 0) {
    recommendations.push({
      priority: "medium",
      category: "coverage",
      message: `${lowCoverageAreas.length} ZIP codes have limited cleaner coverage.`,
      action:
        "Consider expanding service areas for existing cleaners or recruit additional cleaners.",
    });
  }

  // High retry rate
  if (overall.avg_assignment_attempts > 1.5) {
    recommendations.push({
      priority: "medium",
      category: "efficiency",
      message:
        "High average assignment attempts suggest availability checking issues.",
      action:
        "Review cleaner availability schedules and real-time status updates.",
    });
  }

  return recommendations;
};

module.exports = {
  getDashboardStats,
  getAdminUsers,
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
  getUsersWithMembership,
  cancelUserMembership,
  grantUserMembership,
  getMembershipAnalytics,
  getAssignmentMetrics,
};
