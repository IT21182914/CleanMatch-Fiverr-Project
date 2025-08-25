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

    // Ticket statistics for dashboard
    const ticketStatsResult = await query(`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
        COUNT(CASE WHEN status = 'waiting_customer' THEN 1 END) as waiting_customer_tickets,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
        COUNT(CASE WHEN assigned_admin_id IS NULL THEN 1 END) as unassigned_tickets,
        COUNT(CASE WHEN priority = 'urgent' AND status NOT IN ('resolved', 'closed') THEN 1 END) as urgent_tickets,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as tickets_this_week
      FROM tickets
    `);

    stats.tickets = ticketStatsResult.rows[0];

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
    console.log("Admin getUsers called with query:", req.query); // Debug log

    const { role, status, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (role) {
      console.log("Adding role filter:", role); // Debug log
      whereConditions.push(`u.role = $${paramCount++}`);
      queryParams.push(role);
    }

    if (status === "active") {
      console.log("Adding active status filter"); // Debug log
      whereConditions.push(`u.is_active = true`);
    } else if (status === "inactive") {
      console.log("Adding inactive status filter"); // Debug log
      whereConditions.push(`u.is_active = false`);
    }

    if (search) {
      console.log("Adding search filter:", search); // Debug log
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

    console.log("WHERE clause:", whereClause); // Debug log
    console.log("Query params:", queryParams); // Debug log

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
 * @desc    Get cleaner earnings analytics with real payment tracking
 * @route   GET /api/admin/cleaners/earnings
 * @access  Private (Admin only)
 */
const getCleanerEarnings = async (req, res) => {
  try {
    console.log("🔍 Backend - Raw req.query:", req.query); // Debug logging

    const {
      page = 1,
      limit = 20,
      month,
      year = new Date().getFullYear(),
      search,
      sortBy = "monthly_earnings",
      sortOrder = "desc",
    } = req.query;

    console.log("🔍 Backend - Parsed parameters:", {
      // Debug logging
      page,
      limit,
      month,
      year,
      search,
      sortBy,
      sortOrder,
    });

    const offset = (page - 1) * limit;

    let whereConditions = ["u.role = 'cleaner'", "u.is_active = true"];
    let queryParams = [];
    let paramCount = 0;

    // Add search functionality
    if (search) {
      paramCount++;
      whereConditions.push(
        `(u.first_name ILIKE $${paramCount} OR u.last_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
    }

    // Build date filter for specific month/year - using payment creation date instead of booking date
    let dateFilter = "";
    if (month) {
      paramCount++;
      const monthParamIndex = paramCount;
      paramCount++;
      const yearParamIndex = paramCount;

      dateFilter = `AND EXTRACT(MONTH FROM b.updated_at) = $${monthParamIndex} AND EXTRACT(YEAR FROM b.updated_at) = $${yearParamIndex} AND b.payment_status = 'paid'`;
      queryParams.push(parseInt(month));
      queryParams.push(parseInt(year));
    } else {
      // Default to current year if no month specified
      paramCount++;
      const yearParamIndex = paramCount;

      dateFilter = `AND EXTRACT(YEAR FROM b.updated_at) = $${yearParamIndex} AND b.payment_status = 'paid'`;
      queryParams.push(parseInt(year));
    }

    const whereClause = whereConditions.join(" AND ");

    // Validate sort fields
    const validSortFields = [
      "monthly_earnings",
      "total_jobs",
      "avg_rating",
      "name",
      "pending_payout",
    ];
    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : "monthly_earnings";
    const order = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    // Add LIMIT and OFFSET parameters
    paramCount++;
    const limitParamIndex = paramCount;
    paramCount++;
    const offsetParamIndex = paramCount;

    const cleanersEarningsQuery = `
      WITH cleaner_earnings AS (
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          cp.rating as avg_rating,
          cp.total_jobs as lifetime_jobs,
          cp.hourly_rate,
          cp.stripe_account_id,
          -- Current period earnings (based on actual paid transactions)
          COALESCE(SUM(CASE 
            WHEN b.status = 'completed' AND b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN b.total_amount 
            ELSE 0 
          END), 0) as monthly_earnings,
          -- Count of paid jobs in the period
          COUNT(CASE 
            WHEN b.status = 'completed' AND b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN 1 
          END) as period_completed_jobs,
          -- Pending payout (completed but not yet transferred to cleaner)
          COALESCE(SUM(CASE 
            WHEN b.status = 'completed' AND b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN b.total_amount 
            ELSE 0 
          END), 0) as pending_payout,
          -- Total hours worked in period
          COALESCE(SUM(CASE 
            WHEN b.status = 'completed' AND b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN b.duration_hours 
            ELSE 0 
          END), 0) as hours_worked,
          -- Array of transaction IDs for reference
          ARRAY_AGG(
            CASE WHEN b.stripe_payment_intent_id IS NOT NULL AND b.payment_status = 'paid' 
                 THEN b.stripe_payment_intent_id 
                 ELSE NULL 
            END
          ) FILTER (WHERE b.stripe_payment_intent_id IS NOT NULL AND b.payment_status = 'paid') as transaction_ids,
          -- Most recent payment date
          MAX(CASE 
            WHEN b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN b.updated_at 
          END) as last_payment_date
        FROM users u
        JOIN cleaner_profiles cp ON u.id = cp.user_id
        LEFT JOIN bookings b ON u.id = b.cleaner_id ${dateFilter}
        WHERE ${whereClause}
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone, cp.rating, cp.total_jobs, cp.hourly_rate, cp.stripe_account_id
      )
      SELECT *,
        (ce.first_name || ' ' || ce.last_name) as name,
        CASE 
          WHEN ce.hours_worked > 0 THEN ROUND(ce.monthly_earnings / ce.hours_worked, 2)
          ELSE 0 
        END as avg_hourly_earned,
        CASE 
          WHEN ce.transaction_ids IS NOT NULL THEN ARRAY_LENGTH(ce.transaction_ids, 1)
          ELSE 0
        END as total_transactions
      FROM cleaner_earnings ce
      ORDER BY ${sortField === "name" ? "name" : sortField} ${order}
      LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
    `;

    queryParams.push(parseInt(limit));
    queryParams.push(offset);

    console.log("Query params:", queryParams);
    console.log("Param count:", paramCount);
    console.log("Date filter:", dateFilter);
    console.log("WHERE clause:", whereClause);
    // Restart trigger

    const cleanersResult = await query(cleanersEarningsQuery, queryParams);

    // Get total count for pagination - use the same parameters except limit and offset
    const totalCountQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      LEFT JOIN bookings b ON u.id = b.cleaner_id ${dateFilter}
      WHERE ${whereClause}
    `;

    const countParams = queryParams.slice(0, queryParams.length - 2); // Remove limit and offset
    const totalResult = await query(totalCountQuery, countParams);
    const totalCleaners = parseInt(totalResult.rows[0].total);

    // Calculate summary statistics with transaction tracking
    const summaryQuery = `
      SELECT 
        COUNT(DISTINCT u.id) as total_active_cleaners,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN b.total_amount 
          ELSE 0 
        END), 0) as total_earnings,
        COALESCE(AVG(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN b.total_amount 
        END), 0) as avg_job_value,
        COUNT(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN 1 
        END) as total_completed_jobs,
        COUNT(DISTINCT CASE 
          WHEN b.payment_status = 'paid' AND b.stripe_payment_intent_id IS NOT NULL THEN b.stripe_payment_intent_id
        END) as total_transactions
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      LEFT JOIN bookings b ON u.id = b.cleaner_id ${dateFilter}
      WHERE ${whereClause}
    `;

    const summaryResult = await query(summaryQuery, countParams);
    const summary = summaryResult.rows[0];

    res.json({
      success: true,
      data: {
        cleaners: cleanersResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCleaners / limit),
          totalCleaners,
          hasMore: page * limit < totalCleaners,
        },
        summary: {
          totalActiveCleaners: parseInt(summary.total_active_cleaners),
          totalEarnings: parseFloat(summary.total_earnings),
          avgJobValue: parseFloat(summary.avg_job_value),
          totalCompletedJobs: parseInt(summary.total_completed_jobs),
          totalTransactions: parseInt(summary.total_transactions),
          period: month ? `${month}/${year}` : `Year ${year}`,
        },
        filters: {
          month: month ? parseInt(month) : null,
          year: parseInt(year),
          search: search || null,
          sortBy: sortField,
          sortOrder: order,
        },
      },
    });
  } catch (error) {
    console.error("Get cleaner earnings error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving cleaner earnings",
    });
  }
};

/**
 * @desc    Get individual cleaner earnings details
 * @route   GET /api/admin/cleaners/:id/earnings
 * @access  Private (Admin only)
 */
const getCleanerEarningsDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { year = new Date().getFullYear(), includeBookings = "true" } =
      req.query;

    // Get cleaner basic info
    const cleanerResult = await query(
      `
      SELECT 
        u.id, u.first_name, u.last_name, u.email, u.phone, u.created_at,
        cp.rating, cp.total_jobs, cp.hourly_rate, cp.experience_years,
        cp.stripe_account_id, cp.background_check_status
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.id = $1 AND u.role = 'cleaner' AND u.is_active = true
    `,
      [id]
    );

    if (cleanerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner not found",
      });
    }

    const cleaner = cleanerResult.rows[0];

    // Get monthly earnings breakdown for the year
    const monthlyEarningsQuery = `
      SELECT 
        EXTRACT(MONTH FROM b.booking_date) as month,
        COUNT(CASE WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN 1 END) as completed_jobs,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN b.total_amount 
          ELSE 0 
        END), 0) as earnings,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN b.duration_hours 
          ELSE 0 
        END), 0) as hours_worked,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN b.total_amount 
          ELSE 0 
        END), 0) as pending_payout
      FROM bookings b
      WHERE b.cleaner_id = $1 
        AND EXTRACT(YEAR FROM b.booking_date) = $2
      GROUP BY EXTRACT(MONTH FROM b.booking_date)
      ORDER BY month
    `;

    const monthlyResult = await query(monthlyEarningsQuery, [
      id,
      parseInt(year),
    ]);

    // Create array for all 12 months with default values
    const monthlyBreakdown = Array.from({ length: 12 }, (_, index) => {
      const monthData = monthlyResult.rows.find(
        (row) => parseInt(row.month) === index + 1
      );
      return {
        month: index + 1,
        monthName: new Date(2000, index).toLocaleString("default", {
          month: "long",
        }),
        completedJobs: monthData ? parseInt(monthData.completed_jobs) : 0,
        earnings: monthData ? parseFloat(monthData.earnings) : 0,
        hoursWorked: monthData ? parseFloat(monthData.hours_worked) : 0,
        pendingPayout: monthData ? parseFloat(monthData.pending_payout) : 0,
        avgHourlyRate:
          monthData && monthData.hours_worked > 0
            ? parseFloat(
                (
                  parseFloat(monthData.earnings) /
                  parseFloat(monthData.hours_worked)
                ).toFixed(2)
              )
            : 0,
      };
    });

    // Get year totals
    const yearTotalsQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'completed' AND payment_status = 'paid' THEN 1 END) as total_completed_jobs,
        COALESCE(SUM(CASE 
          WHEN status = 'completed' AND payment_status = 'paid' THEN total_amount 
          ELSE 0 
        END), 0) as total_earnings,
        COALESCE(SUM(CASE 
          WHEN status = 'completed' AND payment_status = 'paid' THEN duration_hours 
          ELSE 0 
        END), 0) as total_hours_worked,
        COALESCE(SUM(CASE 
          WHEN status = 'completed' AND payment_status = 'paid' THEN total_amount 
          ELSE 0 
        END), 0) as total_pending_payout
      FROM bookings 
      WHERE cleaner_id = $1 
        AND EXTRACT(YEAR FROM booking_date) = $2
    `;

    const totalsResult = await query(yearTotalsQuery, [id, parseInt(year)]);
    const yearTotals = totalsResult.rows[0];

    let recentBookings = [];
    if (includeBookings === "true") {
      // Get recent bookings with details
      const bookingsQuery = `
        SELECT 
          b.id, b.booking_date, b.booking_time, b.duration_hours, 
          b.total_amount, b.status, b.payment_status, b.transferred_at,
          b.address, b.city, b.state,
          s.name as service_name,
          u.first_name as customer_first_name, u.last_name as customer_last_name
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN users u ON b.customer_id = u.id
        WHERE b.cleaner_id = $1 
          AND EXTRACT(YEAR FROM b.booking_date) = $2
        ORDER BY b.booking_date DESC, b.booking_time DESC
        LIMIT 50
      `;

      const bookingsResult = await query(bookingsQuery, [id, parseInt(year)]);
      recentBookings = bookingsResult.rows;
    }

    res.json({
      success: true,
      data: {
        cleaner: {
          ...cleaner,
          name: `${cleaner.first_name} ${cleaner.last_name}`,
          canReceivePayments: !!cleaner.stripe_account_id,
        },
        earnings: {
          year: parseInt(year),
          monthlyBreakdown,
          yearTotals: {
            completedJobs: parseInt(yearTotals.total_completed_jobs),
            totalEarnings: parseFloat(yearTotals.total_earnings),
            totalHoursWorked: parseFloat(yearTotals.total_hours_worked),
            totalPendingPayout: parseFloat(yearTotals.total_pending_payout),
            avgHourlyEarned:
              yearTotals.total_hours_worked > 0
                ? parseFloat(
                    (
                      parseFloat(yearTotals.total_earnings) /
                      parseFloat(yearTotals.total_hours_worked)
                    ).toFixed(2)
                  )
                : 0,
          },
        },
        recentBookings: includeBookings === "true" ? recentBookings : [],
      },
    });
  } catch (error) {
    console.error("Get cleaner earnings details error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving cleaner earnings details",
    });
  }
};

/**
 * @desc    Get earnings analytics summary
 * @route   GET /api/admin/analytics/earnings
 * @access  Private (Admin only)
 */
const getEarningsAnalytics = async (req, res) => {
  try {
    const { period = "12months", compareYear } = req.query;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Get monthly earnings data for current year
    const monthlyDataQuery = `
      SELECT 
        EXTRACT(MONTH FROM b.booking_date) as month,
        EXTRACT(YEAR FROM b.booking_date) as year,
        COUNT(DISTINCT b.cleaner_id) as active_cleaners,
        COUNT(CASE WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN 1 END) as completed_jobs,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN b.total_amount 
          ELSE 0 
        END), 0) as total_earnings,
        COALESCE(AVG(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN b.total_amount 
        END), 0) as avg_job_value
      FROM bookings b
      JOIN users u ON b.cleaner_id = u.id
      WHERE u.role = 'cleaner' 
        AND b.booking_date >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY EXTRACT(MONTH FROM b.booking_date), EXTRACT(YEAR FROM b.booking_date)
      ORDER BY year, month
    `;

    const monthlyData = await query(monthlyDataQuery);

    // Get top earning cleaners
    const topEarnersQuery = `
      SELECT 
        u.id,
        u.first_name || ' ' || u.last_name as name,
        cp.rating,
        COUNT(CASE WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN 1 END) as completed_jobs,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN b.total_amount 
          ELSE 0 
        END), 0) as total_earnings
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      LEFT JOIN bookings b ON u.id = b.cleaner_id 
        AND EXTRACT(YEAR FROM b.booking_date) = $1
      WHERE u.role = 'cleaner' AND u.is_active = true
      GROUP BY u.id, u.first_name, u.last_name, cp.rating
      HAVING SUM(CASE WHEN b.status = 'completed' AND b.payment_status = 'paid' THEN b.total_amount ELSE 0 END) > 0
      ORDER BY total_earnings DESC
      LIMIT 10
    `;

    const topEarners = await query(topEarnersQuery, [currentYear]);

    // Get overall statistics
    const overallStatsQuery = `
      SELECT 
        COUNT(DISTINCT u.id) as total_active_cleaners,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' 
            AND EXTRACT(MONTH FROM b.booking_date) = $1 
            AND EXTRACT(YEAR FROM b.booking_date) = $2 
          THEN b.total_amount 
          ELSE 0 
        END), 0) as current_month_earnings,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' 
            AND EXTRACT(YEAR FROM b.booking_date) = $2 
          THEN b.total_amount 
          ELSE 0 
        END), 0) as year_to_date_earnings,
        COALESCE(SUM(CASE 
          WHEN b.status = 'completed' AND b.payment_status = 'paid' AND b.transferred_at IS NULL 
          THEN b.total_amount 
          ELSE 0 
        END), 0) as total_pending_payouts
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      LEFT JOIN bookings b ON u.id = b.cleaner_id
      WHERE u.role = 'cleaner' AND u.is_active = true
    `;

    const overallStats = await query(overallStatsQuery, [
      currentMonth,
      currentYear,
    ]);

    res.json({
      success: true,
      data: {
        period: period,
        monthlyData: monthlyData.rows,
        topEarners: topEarners.rows,
        overallStats: overallStats.rows[0],
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Get earnings analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving earnings analytics",
    });
  }
};

/**
 * @desc    Get cleaner transaction details for monthly payouts
 * @route   GET /api/admin/cleaners/:id/transactions
 * @access  Private (Admin only)
 */
const getCleanerTransactionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      month = new Date().getMonth() + 1,
      year = new Date().getFullYear(),
      status = "paid",
    } = req.query;

    // Verify cleaner exists
    const cleanerCheck = await query(
      `SELECT u.first_name, u.last_name, cp.stripe_account_id 
       FROM users u 
       JOIN cleaner_profiles cp ON u.id = cp.user_id 
       WHERE u.id = $1 AND u.role = 'cleaner'`,
      [id]
    );

    if (cleanerCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner not found",
      });
    }

    const cleaner = cleanerCheck.rows[0];

    // Get all paid transactions for the specified month
    const transactionsQuery = `
      SELECT 
        b.id as booking_id,
        b.stripe_payment_intent_id as transaction_id,
        b.total_amount,
        b.booking_date,
        b.booking_time,
        b.duration_hours,
        b.status as booking_status,
        b.payment_status,
        b.updated_at as payment_date,
        b.address,
        b.city,
        b.state,
        s.name as service_name,
        s.category as service_category,
        customer.first_name as customer_first_name,
        customer.last_name as customer_last_name,
        customer.email as customer_email,
        -- Check if this has membership discount applied
        b.membership_discount_applied,
        mu.discount_applied as membership_discount_amount
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users customer ON b.customer_id = customer.id
      LEFT JOIN membership_usage mu ON b.id = mu.booking_id
      WHERE b.cleaner_id = $1 
        AND b.payment_status = $2
        AND b.stripe_payment_intent_id IS NOT NULL
        AND EXTRACT(MONTH FROM b.updated_at) = $3
        AND EXTRACT(YEAR FROM b.updated_at) = $4
        AND b.status = 'completed'
      ORDER BY b.updated_at DESC
    `;

    const transactionsResult = await query(transactionsQuery, [
      id,
      status,
      parseInt(month),
      parseInt(year),
    ]);

    // Calculate totals for the month
    const totalAmount = transactionsResult.rows.reduce(
      (sum, tx) => sum + parseFloat(tx.total_amount),
      0
    );
    const totalHours = transactionsResult.rows.reduce(
      (sum, tx) => sum + parseFloat(tx.duration_hours),
      0
    );
    const totalJobs = transactionsResult.rows.length;

    // Group transactions by service type
    const serviceBreakdown = transactionsResult.rows.reduce((acc, tx) => {
      const serviceName = tx.service_name;
      if (!acc[serviceName]) {
        acc[serviceName] = {
          count: 0,
          totalAmount: 0,
          totalHours: 0,
        };
      }
      acc[serviceName].count++;
      acc[serviceName].totalAmount += parseFloat(tx.total_amount);
      acc[serviceName].totalHours += parseFloat(tx.duration_hours);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        cleaner: {
          id,
          name: `${cleaner.first_name} ${cleaner.last_name}`,
          stripeAccountId: cleaner.stripe_account_id,
          canReceivePayment: !!cleaner.stripe_account_id,
        },
        period: {
          month: parseInt(month),
          year: parseInt(year),
          monthName: new Date(year, month - 1).toLocaleString("default", {
            month: "long",
          }),
        },
        summary: {
          totalJobs,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          totalHours: parseFloat(totalHours.toFixed(2)),
          averageJobValue:
            totalJobs > 0
              ? parseFloat((totalAmount / totalJobs).toFixed(2))
              : 0,
          averageHourlyRate:
            totalHours > 0
              ? parseFloat((totalAmount / totalHours).toFixed(2))
              : 0,
        },
        transactions: transactionsResult.rows.map((tx) => ({
          bookingId: tx.booking_id,
          transactionId: tx.transaction_id,
          amount: parseFloat(tx.total_amount),
          serviceType: tx.service_name,
          serviceCategory: tx.service_category,
          bookingDate: tx.booking_date,
          bookingTime: tx.booking_time,
          duration: parseFloat(tx.duration_hours),
          paymentDate: tx.payment_date,
          customer: {
            name: `${tx.customer_first_name} ${tx.customer_last_name}`,
            email: tx.customer_email,
          },
          location: {
            address: tx.address,
            city: tx.city,
            state: tx.state,
          },
          membershipDiscountApplied: tx.membership_discount_applied || false,
          membershipDiscountAmount: tx.membership_discount_amount
            ? parseFloat(tx.membership_discount_amount)
            : 0,
        })),
        serviceBreakdown: Object.entries(serviceBreakdown).map(
          ([name, data]) => ({
            serviceName: name,
            count: data.count,
            totalAmount: parseFloat(data.totalAmount.toFixed(2)),
            totalHours: parseFloat(data.totalHours.toFixed(2)),
            averageAmount: parseFloat(
              (data.totalAmount / data.count).toFixed(2)
            ),
          })
        ),
      },
    });
  } catch (error) {
    console.error("Get cleaner transaction details error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving transaction details",
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

// ============= ADMIN TICKET MANAGEMENT FUNCTIONS =============

/**
 * @desc    Get tickets for admin dashboard
 * @route   GET /api/admin/tickets
 * @access  Private (Admin only)
 */
const getAdminTickets = async (req, res) => {
  try {
    console.log("🎫 getAdminTickets called with query:", req.query);

    const {
      status = "all",
      priority = "all",
      category = "all",
      assigned = "all",
      page = 1,
      limit = 20,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    console.log("📊 Parsed filter parameters:", {
      status,
      priority,
      category,
      assigned,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    // Build WHERE clause
    if (status !== "all") {
      whereConditions.push(`t.status = $${paramCount++}`);
      queryParams.push(status);
    }

    if (priority !== "all") {
      whereConditions.push(`t.priority = $${paramCount++}`);
      queryParams.push(priority);
    }

    if (category !== "all") {
      whereConditions.push(`t.category = $${paramCount++}`);
      queryParams.push(category);
    }

    if (assigned === "assigned") {
      whereConditions.push(`t.assigned_admin_id IS NOT NULL`);
    } else if (assigned === "unassigned") {
      whereConditions.push(`t.assigned_admin_id IS NULL`);
    } else if (assigned !== "all") {
      whereConditions.push(`t.assigned_admin_id = $${paramCount++}`);
      queryParams.push(assigned);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    console.log("🔍 Built query conditions:", {
      whereConditions,
      queryParams,
      whereClause,
    });

    // Validate sort columns
    const validSortColumns = [
      "created_at",
      "opened_at",
      "priority",
      "status",
      "summary",
    ];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const sortDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const ticketsQuery = `
      SELECT 
        t.*,
        c.first_name as customer_first_name, 
        c.last_name as customer_last_name, 
        c.email as customer_email,
        f.first_name as freelancer_first_name, 
        f.last_name as freelancer_last_name,
        a.first_name as admin_first_name, 
        a.last_name as admin_last_name,
        b.booking_date, 
        b.booking_time,
        s.name as service_name,
        (SELECT COUNT(*) FROM ticket_messages tm WHERE tm.ticket_id = t.id AND tm.is_internal = false) as message_count,
        (SELECT created_at FROM ticket_messages tm WHERE tm.ticket_id = t.id ORDER BY created_at DESC LIMIT 1) as last_message_at
      FROM tickets t
      JOIN users c ON t.customer_id = c.id
      LEFT JOIN users f ON t.freelancer_id = f.id
      LEFT JOIN users a ON t.assigned_admin_id = a.id
      LEFT JOIN bookings b ON t.booking_id = b.id
      LEFT JOIN services s ON b.service_id = s.id
      ${whereClause}
      ORDER BY 
        CASE WHEN t.status = 'open' THEN 0 ELSE 1 END,
        CASE WHEN t.priority = 'urgent' THEN 0 
             WHEN t.priority = 'high' THEN 1 
             WHEN t.priority = 'normal' THEN 2 
             ELSE 3 END,
        t.${sortColumn} ${sortDirection}
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;

    queryParams.push(limit, offset);

    const ticketsResult = await query(ticketsQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tickets t
      ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    const tickets = ticketsResult.rows.map((ticket) => ({
      id: ticket.id,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      summary: ticket.summary,
      description:
        ticket.description.substring(0, 200) +
        (ticket.description.length > 200 ? "..." : ""),
      openedAt: ticket.opened_at,
      firstResponseAt: ticket.first_response_at,
      resolvedAt: ticket.resolved_at,
      closedAt: ticket.closed_at,
      createdAt: ticket.created_at,
      messageCount: parseInt(ticket.message_count),
      lastMessageAt: ticket.last_message_at,
      customer: {
        id: ticket.customer_id,
        firstName: ticket.customer_first_name,
        lastName: ticket.customer_last_name,
        email: ticket.customer_email,
      },
      freelancer: ticket.freelancer_id
        ? {
            id: ticket.freelancer_id,
            firstName: ticket.freelancer_first_name,
            lastName: ticket.freelancer_last_name,
          }
        : null,
      assignedAdmin: ticket.assigned_admin_id
        ? {
            id: ticket.assigned_admin_id,
            firstName: ticket.admin_first_name,
            lastName: ticket.admin_last_name,
          }
        : null,
      booking: ticket.booking_id
        ? {
            id: ticket.booking_id,
            date: ticket.booking_date,
            time: ticket.booking_time,
            serviceName: ticket.service_name,
          }
        : null,
    }));

    res.json({
      success: true,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get admin tickets error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving tickets",
    });
  }
};

/**
 * @desc    Get detailed ticket information for admin investigation
 * @route   GET /api/admin/tickets/:id
 * @access  Private (Admin only)
 */
const getTicketDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Get comprehensive ticket details
    const ticketResult = await query(
      `
      SELECT 
        t.*,
        c.first_name as customer_first_name, 
        c.last_name as customer_last_name, 
        c.email as customer_email, 
        c.phone as customer_phone,
        c.created_at as customer_since,
        f.first_name as freelancer_first_name, 
        f.last_name as freelancer_last_name,
        f.email as freelancer_email,
        f.phone as freelancer_phone,
        a.first_name as admin_first_name, 
        a.last_name as admin_last_name,
        b.booking_date, 
        b.booking_time, 
        b.address, 
        b.city, 
        b.state, 
        b.zip_code,
        b.total_amount,
        b.payment_status,
        b.status as booking_status,
        s.name as service_name,
        cp.background_check_status,
        cp.rating as freelancer_rating
      FROM tickets t
      JOIN users c ON t.customer_id = c.id
      LEFT JOIN users f ON t.freelancer_id = f.id
      LEFT JOIN users a ON t.assigned_admin_id = a.id
      LEFT JOIN bookings b ON t.booking_id = b.id
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN cleaner_profiles cp ON t.freelancer_id = cp.user_id
      WHERE t.id = $1
    `,
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const ticket = ticketResult.rows[0];

    // Get customer's booking history
    const customerHistoryResult = await query(
      `
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
        AVG(CASE WHEN payment_status = 'paid' THEN total_amount END) as avg_booking_value
      FROM bookings 
      WHERE customer_id = $1
    `,
      [ticket.customer_id]
    );

    // Get customer's previous tickets
    const customerTicketsResult = await query(
      `
      SELECT id, category, status, summary, created_at
      FROM tickets 
      WHERE customer_id = $1 AND id != $2
      ORDER BY created_at DESC 
      LIMIT 5
    `,
      [ticket.customer_id, id]
    );

    // Get freelancer's performance if applicable
    let freelancerHistory = null;
    if (ticket.freelancer_id) {
      const freelancerHistoryResult = await query(
        `
        SELECT 
          COUNT(*) as total_jobs,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs,
          AVG(rating) as avg_rating
        FROM bookings 
        WHERE assigned_cleaner_id = $1 AND rating IS NOT NULL
      `,
        [ticket.freelancer_id]
      );

      const freelancerTicketsResult = await query(
        `
        SELECT id, category, status, summary, created_at
        FROM tickets 
        WHERE freelancer_id = $1 AND id != $2
        ORDER BY created_at DESC 
        LIMIT 5
      `,
        [ticket.freelancer_id, id]
      );

      freelancerHistory = {
        performance: freelancerHistoryResult.rows[0],
        tickets: freelancerTicketsResult.rows,
      };
    }

    // Get ticket messages (including internal notes)
    const messagesResult = await query(
      `
      SELECT 
        tm.*,
        u.first_name, 
        u.last_name, 
        u.role,
        json_agg(
          CASE WHEN ta.id IS NOT NULL THEN
            json_build_object(
              'id', ta.id,
              'filename', ta.original_filename,
              'fileSize', ta.file_size,
              'mimeType', ta.mime_type,
              'fileUrl', ta.file_url
            )
          END
        ) FILTER (WHERE ta.id IS NOT NULL) as attachments
      FROM ticket_messages tm
      JOIN users u ON tm.user_id = u.id
      LEFT JOIN ticket_attachments ta ON tm.id = ta.message_id
      WHERE tm.ticket_id = $1
      GROUP BY tm.id, u.id
      ORDER BY tm.created_at ASC
    `,
      [id]
    );

    // Get ticket timeline
    const timelineResult = await query(
      `
      SELECT 
        tl.*,
        u.first_name, 
        u.last_name, 
        u.role
      FROM ticket_timeline tl
      LEFT JOIN users u ON tl.user_id = u.id
      WHERE tl.ticket_id = $1
      ORDER BY tl.created_at ASC
    `,
      [id]
    );

    const ticketData = {
      id: ticket.id,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      summary: ticket.summary,
      description: ticket.description,
      internalNotes: ticket.internal_notes,
      openedAt: ticket.opened_at,
      firstResponseAt: ticket.first_response_at,
      resolvedAt: ticket.resolved_at,
      closedAt: ticket.closed_at,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      customer: {
        id: ticket.customer_id,
        firstName: ticket.customer_first_name,
        lastName: ticket.customer_last_name,
        email: ticket.customer_email,
        phone: ticket.customer_phone,
        memberSince: ticket.customer_since,
        bookingHistory: customerHistoryResult.rows[0],
        previousTickets: customerTicketsResult.rows,
      },
      freelancer: ticket.freelancer_id
        ? {
            id: ticket.freelancer_id,
            firstName: ticket.freelancer_first_name,
            lastName: ticket.freelancer_last_name,
            email: ticket.freelancer_email,
            phone: ticket.freelancer_phone,
            backgroundCheckStatus: ticket.background_check_status,
            rating: ticket.freelancer_rating,
            history: freelancerHistory,
          }
        : null,
      assignedAdmin: ticket.assigned_admin_id
        ? {
            id: ticket.assigned_admin_id,
            firstName: ticket.admin_first_name,
            lastName: ticket.admin_last_name,
          }
        : null,
      booking: ticket.booking_id
        ? {
            id: ticket.booking_id,
            date: ticket.booking_date,
            time: ticket.booking_time,
            address: ticket.address,
            city: ticket.city,
            state: ticket.state,
            zipCode: ticket.zip_code,
            totalAmount: ticket.total_amount,
            paymentStatus: ticket.payment_status,
            status: ticket.booking_status,
            serviceName: ticket.service_name,
          }
        : null,
      messages: messagesResult.rows.map((msg) => ({
        id: msg.id,
        message: msg.message,
        isInternal: msg.is_internal,
        attachments: msg.attachments || [],
        createdAt: msg.created_at,
        user: {
          firstName: msg.first_name,
          lastName: msg.last_name,
          role: msg.role,
        },
      })),
      timeline: timelineResult.rows.map((tl) => ({
        id: tl.id,
        actionType: tl.action_type,
        oldValue: tl.old_value,
        newValue: tl.new_value,
        description: tl.description,
        createdAt: tl.created_at,
        user: tl.user_id
          ? {
              firstName: tl.first_name,
              lastName: tl.last_name,
              role: tl.role,
            }
          : null,
      })),
    };

    res.json({
      success: true,
      data: ticketData,
    });
  } catch (error) {
    console.error("Get ticket details error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving ticket details",
    });
  }
};

/**
 * @desc    Update ticket status (Open -> In Progress -> Resolved -> Closed)
 * @route   PUT /api/admin/tickets/:id/status
 * @access  Private (Admin only)
 */
const updateTicketStatus = async (req, res) => {
  const { getClient } = require("../config/database");
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { status, reason } = req.body;

    // Validate status transition
    const validStatuses = [
      "open",
      "in_progress",
      "waiting_customer",
      "resolved",
      "closed",
    ];
    if (!validStatuses.includes(status)) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    // Get current ticket
    const currentTicketResult = await client.query(
      "SELECT * FROM tickets WHERE id = $1",
      [id]
    );

    if (currentTicketResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const currentTicket = currentTicketResult.rows[0];

    // Update ticket status
    let updateQuery = `UPDATE tickets SET status = $1`;
    let queryParams = [status, id];
    let paramCount = 2;

    // Set timestamps based on status
    if (status === "in_progress" && !currentTicket.first_response_at) {
      updateQuery += `, first_response_at = CURRENT_TIMESTAMP`;
    }
    if (status === "resolved" && !currentTicket.resolved_at) {
      updateQuery += `, resolved_at = CURRENT_TIMESTAMP`;
    }
    if (status === "closed" && !currentTicket.closed_at) {
      updateQuery += `, closed_at = CURRENT_TIMESTAMP`;
    }

    updateQuery += ` WHERE id = $${paramCount} RETURNING *`;

    const updatedTicket = await client.query(updateQuery, queryParams);

    // Add timeline entry
    await client.query(
      `
      INSERT INTO ticket_timeline (ticket_id, user_id, action_type, old_value, new_value, description)
      VALUES ($1, $2, 'status_changed', $3, $4, $5)
    `,
      [
        id,
        req.user.id,
        currentTicket.status,
        status,
        reason || `Status updated to ${status}`,
      ]
    );

    // Notify customer about status change (except for internal status changes)
    if (!["waiting_customer"].includes(status)) {
      let notificationMessage = "";
      switch (status) {
        case "in_progress":
          notificationMessage =
            "Your support ticket is now being reviewed by our team.";
          break;
        case "resolved":
          notificationMessage =
            "Your support ticket has been resolved. Please review the solution.";
          break;
        case "closed":
          notificationMessage = "Your support ticket has been closed.";
          break;
      }

      if (notificationMessage) {
        await client.query(
          `
          INSERT INTO notifications (user_id, title, message, type, metadata)
          VALUES ($1, $2, $3, 'ticket_updated', $4)
        `,
          [
            currentTicket.customer_id,
            `Ticket #${id} Updated`,
            notificationMessage,
            JSON.stringify({ ticketId: id, newStatus: status }),
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      data: updatedTicket.rows[0],
      message: `Ticket status updated to ${status}`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update ticket status error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating ticket status",
    });
  }
};

/**
 * @desc    Assign ticket to admin
 * @route   PUT /api/admin/tickets/:id/assign
 * @access  Private (Admin only)
 */
const assignTicket = async (req, res) => {
  const { getClient } = require("../config/database");
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { adminId } = req.body;

    // If adminId is null or 'unassign', unassign the ticket
    const assignToId = adminId === "unassign" ? null : adminId;

    // Validate admin exists if assigning
    if (assignToId) {
      const adminResult = await client.query(
        "SELECT id, first_name, last_name FROM users WHERE id = $1 AND role = 'admin' AND is_active = true",
        [assignToId]
      );

      if (adminResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Admin not found or inactive",
        });
      }
    }

    // Get current assignment
    const currentTicketResult = await client.query(
      "SELECT assigned_admin_id FROM tickets WHERE id = $1",
      [id]
    );

    if (currentTicketResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const currentAssignment = currentTicketResult.rows[0].assigned_admin_id;

    // Update assignment
    const updatedTicket = await client.query(
      "UPDATE tickets SET assigned_admin_id = $1 WHERE id = $2 RETURNING *",
      [assignToId, id]
    );

    // Get admin names for timeline
    const getAdminName = async (adminId) => {
      if (!adminId) return "Unassigned";
      const result = await client.query(
        "SELECT first_name, last_name FROM users WHERE id = $1",
        [adminId]
      );
      if (result.rows.length > 0) {
        return `${result.rows[0].first_name} ${result.rows[0].last_name}`;
      }
      return "Unknown Admin";
    };

    const oldAdminName = await getAdminName(currentAssignment);
    const newAdminName = await getAdminName(assignToId);

    // Add timeline entry
    await client.query(
      `
      INSERT INTO ticket_timeline (ticket_id, user_id, action_type, old_value, new_value, description)
      VALUES ($1, $2, 'assigned', $3, $4, 'Ticket assignment updated')
    `,
      [id, req.user.id, oldAdminName, newAdminName]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      data: updatedTicket.rows[0],
      message: `Ticket ${
        assignToId ? "assigned to" : "unassigned from"
      } ${newAdminName}`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Assign ticket error:", error);
    res.status(500).json({
      success: false,
      error: "Server error assigning ticket",
    });
  }
};

/**
 * @desc    Add admin reply to ticket
 * @route   POST /api/admin/tickets/:id/reply
 * @access  Private (Admin only)
 */
const addTicketReply = async (req, res) => {
  const { getClient } = require("../config/database");
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { message, isInternal = false, updateStatus = null } = req.body;

    // Validate ticket exists
    const ticketResult = await client.query(
      "SELECT customer_id, status FROM tickets WHERE id = $1",
      [id]
    );

    if (ticketResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const ticket = ticketResult.rows[0];

    // Add message
    const messageResult = await client.query(
      `
      INSERT INTO ticket_messages (ticket_id, user_id, message, is_internal)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [id, req.user.id, message, isInternal]
    );

    // Update first response time if this is the first admin response
    const firstResponseResult = await client.query(
      "SELECT first_response_at FROM tickets WHERE id = $1",
      [id]
    );

    if (!firstResponseResult.rows[0].first_response_at && !isInternal) {
      await client.query(
        "UPDATE tickets SET first_response_at = CURRENT_TIMESTAMP WHERE id = $1",
        [id]
      );
    }

    // Update status if requested
    if (updateStatus && updateStatus !== ticket.status) {
      await client.query("UPDATE tickets SET status = $1 WHERE id = $2", [
        updateStatus,
        id,
      ]);

      // Add timeline entry for status change
      await client.query(
        `
        INSERT INTO ticket_timeline (ticket_id, user_id, action_type, old_value, new_value, description)
        VALUES ($1, $2, 'status_changed', $3, $4, 'Status updated with reply')
      `,
        [id, req.user.id, ticket.status, updateStatus]
      );
    }

    // Add timeline entry for message
    await client.query(
      `
      INSERT INTO ticket_timeline (ticket_id, user_id, action_type, description)
      VALUES ($1, $2, 'message_added', $3)
    `,
      [
        id,
        req.user.id,
        isInternal ? "Internal note added" : "Admin reply added",
      ]
    );

    // Notify customer if it's not an internal message
    if (!isInternal) {
      await client.query(
        `
        INSERT INTO notifications (user_id, title, message, type, metadata)
        VALUES ($1, $2, $3, 'ticket_reply', $4)
      `,
        [
          ticket.customer_id,
          `New reply on Ticket #${id}`,
          "An admin has replied to your support ticket.",
          JSON.stringify({ ticketId: id }),
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      data: messageResult.rows[0],
      message: isInternal
        ? "Internal note added successfully"
        : "Reply sent successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Add ticket reply error:", error);
    res.status(500).json({
      success: false,
      error: "Server error adding ticket reply",
    });
  }
};

/**
 * @desc    Get ticket statistics for admin dashboard
 * @route   GET /api/admin/tickets/stats
 * @access  Private (Admin only)
 */
const getTicketStats = async (req, res) => {
  try {
    // General ticket statistics
    const generalStatsResult = await query(`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
        COUNT(CASE WHEN status = 'waiting_customer' THEN 1 END) as waiting_customer_tickets,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
        COUNT(CASE WHEN assigned_admin_id IS NULL THEN 1 END) as unassigned_tickets,
        COUNT(CASE WHEN priority = 'urgent' AND status NOT IN ('resolved', 'closed') THEN 1 END) as urgent_tickets
      FROM tickets
    `);

    // Category breakdown
    const categoryStatsResult = await query(`
      SELECT 
        category,
        COUNT(*) as count,
        COUNT(CASE WHEN status NOT IN ('resolved', 'closed') THEN 1 END) as active_count
      FROM tickets 
      GROUP BY category
      ORDER BY count DESC
    `);

    // SLA performance
    const slaStatsResult = await query(`
      SELECT 
        AVG(EXTRACT(EPOCH FROM (first_response_at - opened_at))/3600) as avg_first_response_hours,
        AVG(EXTRACT(EPOCH FROM (resolved_at - opened_at))/3600) as avg_resolution_hours,
        COUNT(CASE WHEN first_response_at IS NULL AND opened_at < NOW() - INTERVAL '4 hours' THEN 1 END) as overdue_first_response,
        COUNT(CASE WHEN resolved_at IS NULL AND opened_at < NOW() - INTERVAL '24 hours' AND status != 'waiting_customer' THEN 1 END) as overdue_resolution
      FROM tickets 
      WHERE opened_at >= NOW() - INTERVAL '30 days'
    `);

    // Recent activity (last 7 days)
    const recentActivityResult = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as tickets_created
      FROM tickets 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    // Admin workload
    const adminWorkloadResult = await query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        COUNT(t.id) as assigned_tickets,
        COUNT(CASE WHEN t.status NOT IN ('resolved', 'closed') THEN 1 END) as active_tickets
      FROM users u
      LEFT JOIN tickets t ON u.id = t.assigned_admin_id
      WHERE u.role = 'admin' AND u.is_active = true
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY assigned_tickets DESC
    `);

    res.json({
      success: true,
      data: {
        general: generalStatsResult.rows[0],
        categories: categoryStatsResult.rows,
        sla: slaStatsResult.rows[0],
        recentActivity: recentActivityResult.rows,
        adminWorkload: adminWorkloadResult.rows,
      },
    });
  } catch (error) {
    console.error("Get ticket stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving ticket statistics",
    });
  }
};

/**
 * @desc    Investigate ticket - comprehensive review process
 * @route   POST /api/admin/tickets/:id/investigate
 * @access  Private (Admin only)
 */
const investigateTicket = async (req, res) => {
  const { getClient } = require("../config/database");
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { findings, actionsTaken, internalNotes } = req.body;

    // Update ticket with investigation findings
    await client.query(
      `
      UPDATE tickets 
      SET 
        internal_notes = CASE 
          WHEN internal_notes IS NULL OR internal_notes = '' THEN $1 
          ELSE internal_notes || E'\n\n--- Investigation Update ---\n' || $1 
        END,
        status = CASE WHEN status = 'open' THEN 'in_progress' ELSE status END
      WHERE id = $2
    `,
      [findings, id]
    );

    // Add timeline entry
    await client.query(
      `
      INSERT INTO ticket_timeline (ticket_id, user_id, action_type, description)
      VALUES ($1, $2, 'investigated', $3)
    `,
      [id, req.user.id, "Ticket investigation completed"]
    );

    // Add internal message with investigation details
    await client.query(
      `
      INSERT INTO ticket_messages (ticket_id, user_id, message, is_internal)
      VALUES ($1, $2, $3, true)
    `,
      [
        id,
        req.user.id,
        `Investigation Findings:\n${findings}\n\nActions Taken:\n${actionsTaken}\n\nInternal Notes:\n${
          internalNotes || "None"
        }`,
      ]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Ticket investigation completed and recorded",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Investigate ticket error:", error);
    res.status(500).json({
      success: false,
      error: "Server error processing ticket investigation",
    });
  }
};

/**
 * @desc    Resolve ticket with resolution details
 * @route   POST /api/admin/tickets/:id/resolve
 * @access  Private (Admin only)
 */
const resolveTicket = async (req, res) => {
  const { getClient } = require("../config/database");
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { resolution, customerMessage, actionsTaken } = req.body;

    // Update ticket status to resolved
    const updatedTicket = await client.query(
      `
      UPDATE tickets 
      SET 
        status = 'resolved',
        resolved_at = CURRENT_TIMESTAMP,
        internal_notes = CASE 
          WHEN internal_notes IS NULL OR internal_notes = '' THEN $1 
          ELSE internal_notes || E'\n\n--- Resolution ---\n' || $1 
        END
      WHERE id = $2
      RETURNING customer_id
    `,
      [resolution, id]
    );

    if (updatedTicket.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const customerId = updatedTicket.rows[0].customer_id;

    // Add timeline entry
    await client.query(
      `
      INSERT INTO ticket_timeline (ticket_id, user_id, action_type, description)
      VALUES ($1, $2, 'resolved', 'Ticket marked as resolved')
    `,
      [id, req.user.id]
    );

    // Send resolution message to customer
    if (customerMessage) {
      await client.query(
        `
        INSERT INTO ticket_messages (ticket_id, user_id, message, is_internal)
        VALUES ($1, $2, $3, false)
      `,
        [id, req.user.id, customerMessage]
      );

      // Add timeline for customer message
      await client.query(
        `
        INSERT INTO ticket_timeline (ticket_id, user_id, action_type, description)
        VALUES ($1, $2, 'message_added', 'Resolution message sent to customer')
      `,
        [id, req.user.id]
      );
    }

    // Add internal resolution notes
    await client.query(
      `
      INSERT INTO ticket_messages (ticket_id, user_id, message, is_internal)
      VALUES ($1, $2, $3, true)
    `,
      [
        id,
        req.user.id,
        `Resolution Details:\n${resolution}\n\nActions Taken:\n${
          actionsTaken || "Not specified"
        }`,
      ]
    );

    // Notify customer
    await client.query(
      `
      INSERT INTO notifications (user_id, title, message, type, metadata)
      VALUES ($1, $2, $3, 'ticket_resolved', $4)
    `,
      [
        customerId,
        `Ticket #${id} Resolved`,
        "Your support ticket has been resolved. Please check the ticket for details.",
        JSON.stringify({ ticketId: id }),
      ]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Ticket resolved successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Resolve ticket error:", error);
    res.status(500).json({
      success: false,
      error: "Server error resolving ticket",
    });
  }
};

/**
 * @desc    Close ticket (final step)
 * @route   POST /api/admin/tickets/:id/close
 * @access  Private (Admin only)
 */
const closeTicket = async (req, res) => {
  const { getClient } = require("../config/database");
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { reason } = req.body;

    // Update ticket status to closed
    const updatedTicket = await client.query(
      `
      UPDATE tickets 
      SET 
        status = 'closed',
        closed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING customer_id
    `,
      [id]
    );

    if (updatedTicket.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const customerId = updatedTicket.rows[0].customer_id;

    // Add timeline entry
    await client.query(
      `
      INSERT INTO ticket_timeline (ticket_id, user_id, action_type, description)
      VALUES ($1, $2, 'closed', $3)
    `,
      [id, req.user.id, reason || "Ticket closed"]
    );

    // Notify customer
    await client.query(
      `
      INSERT INTO notifications (user_id, title, message, type, metadata)
      VALUES ($1, $2, $3, 'ticket_closed', $4)
    `,
      [
        customerId,
        `Ticket #${id} Closed`,
        "Your support ticket has been closed.",
        JSON.stringify({ ticketId: id }),
      ]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Ticket closed successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Close ticket error:", error);
    res.status(500).json({
      success: false,
      error: "Server error closing ticket",
    });
  }
};

/**
 * @desc    Get combined customer and admin reviews for a specific cleaner
 * @route   GET /api/admin/cleaners/:id/reviews
 * @access  Private (Admin only)
 */
const getCleanerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, type = "all" } = req.query;
    const offset = (page - 1) * limit;

    // Verify cleaner exists
    const cleanerCheck = await query(
      `SELECT u.first_name, u.last_name, u.email, cp.rating, cp.total_jobs 
       FROM users u 
       JOIN cleaner_profiles cp ON u.id = cp.user_id 
       WHERE u.id = $1 AND u.role = 'cleaner'`,
      [id]
    );

    if (cleanerCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner not found",
      });
    }

    const cleaner = cleanerCheck.rows[0];

    // Get combined reviews using UNION to merge customer and admin reviews
    let reviewQuery = ``;
    let countQuery = ``;
    let queryParams = [id];

    if (type === "customer") {
      // Only customer reviews
      reviewQuery = `
        SELECT 
          r.id,
          r.rating,
          r.comment,
          r.created_at,
          'customer' as review_type,
          u.first_name as reviewer_name,
          u.email as reviewer_email,
          COALESCE(b.service_type, 'N/A') as service_type,
          COALESCE(b.service_category, 'N/A') as service_category
        FROM reviews r
        JOIN users u ON r.customer_id = u.id
        LEFT JOIN bookings b ON r.booking_id = b.id
        WHERE r.cleaner_id = $1
        ORDER BY r.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      countQuery = `
        SELECT COUNT(*) as total
        FROM reviews r
        WHERE r.cleaner_id = $1
      `;

      queryParams.push(limit, offset);
    } else if (type === "admin") {
      // Only admin reviews
      reviewQuery = `
        SELECT 
          ar.id,
          ar.rating,
          ar.review_text as comment,
          ar.created_at,
          'admin' as review_type,
          'Admin' as reviewer_name,
          'admin@cleanmatch.com' as reviewer_email,
          'N/A' as service_category,
          'Admin Review' as service_type
        FROM admin_reviews ar
        WHERE ar.cleaner_id = $1
        ORDER BY ar.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      countQuery = `
        SELECT COUNT(*) as total
        FROM admin_reviews ar
        WHERE ar.cleaner_id = $1
      `;

      queryParams.push(limit, offset);
    } else {
      // Combined reviews (default)
      reviewQuery = `
        (
          SELECT 
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            'customer' as review_type,
            u.first_name as reviewer_name,
            u.email as reviewer_email,
            COALESCE(b.service_type, 'N/A') as service_type,
            COALESCE(b.service_category, 'N/A') as service_category
          FROM reviews r
          JOIN users u ON r.customer_id = u.id
          LEFT JOIN bookings b ON r.booking_id = b.id
          WHERE r.cleaner_id = $1
        )
        UNION ALL
        (
          SELECT 
            ar.id,
            ar.rating,
            ar.review_text as comment,
            ar.created_at,
            'admin' as review_type,
            'Admin' as reviewer_name,
            'admin@cleanmatch.com' as reviewer_email,
            'N/A' as service_type,
            'Admin Review' as service_category
          FROM admin_reviews ar
          WHERE ar.cleaner_id = $1
        )
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;

      countQuery = `
        SELECT 
          (SELECT COUNT(*) FROM reviews WHERE cleaner_id = $1) + 
          (SELECT COUNT(*) FROM admin_reviews WHERE cleaner_id = $1) as total
      `;

      queryParams.push(limit, offset);
    }

    // Get reviews
    const reviewsResult = await query(reviewQuery, queryParams);
    const countResult = await query(countQuery, [id]);

    const totalReviews = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalReviews / limit);

    // Get rating breakdown
    const ratingBreakdownQuery = `
      SELECT 
        rating,
        COUNT(*) as count,
        'customer' as type
      FROM reviews 
      WHERE cleaner_id = $1 
      GROUP BY rating
      UNION ALL
      SELECT 
        rating,
        COUNT(*) as count,
        'admin' as type
      FROM admin_reviews 
      WHERE cleaner_id = $1 
      GROUP BY rating
      ORDER BY rating DESC
    `;

    const ratingBreakdownResult = await query(ratingBreakdownQuery, [id]);

    // Process rating breakdown
    const breakdown = {};
    let customerTotal = 0,
      adminTotal = 0;

    for (let i = 1; i <= 5; i++) {
      breakdown[i] = { customer: 0, admin: 0, total: 0 };
    }

    ratingBreakdownResult.rows.forEach((row) => {
      const rating = row.rating;
      const count = parseInt(row.count);

      breakdown[rating][row.type] = count;
      breakdown[rating].total += count;

      if (row.type === "customer") customerTotal += count;
      if (row.type === "admin") adminTotal += count;
    });

    res.json({
      success: true,
      data: {
        cleaner: {
          id: parseInt(id),
          name: `${cleaner.first_name} ${cleaner.last_name}`,
          email: cleaner.email,
          averageRating: cleaner.rating ? parseFloat(cleaner.rating) : null,
          totalJobs: cleaner.total_jobs || 0,
        },
        reviews: reviewsResult.rows.map((row) => ({
          id: row.id,
          rating: row.rating,
          comment: row.comment,
          reviewType: row.review_type,
          reviewerName: row.reviewer_name,
          reviewerEmail: row.reviewer_email,
          serviceType: row.service_type,
          serviceCategory: row.service_category,
          createdAt: row.created_at,
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalReviews,
          limit: parseInt(limit),
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        summary: {
          totalCustomerReviews: customerTotal,
          totalAdminReviews: adminTotal,
          totalCombinedReviews: customerTotal + adminTotal,
          averageRating: cleaner.rating ? parseFloat(cleaner.rating) : null,
        },
        ratingBreakdown: breakdown,
      },
    });
  } catch (error) {
    console.error("Get cleaner reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving cleaner reviews",
    });
  }
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
  // Cleaner earnings tracking
  getCleanerEarnings,
  getCleanerEarningsDetails,
  getCleanerTransactionDetails,
  getEarningsAnalytics,
  getCleanerReviews,
  // Ticket management functions
  getAdminTickets,
  getTicketDetails,
  updateTicketStatus,
  assignTicket,
  addTicketReply,
  getTicketStats,
  investigateTicket,
  resolveTicket,
  closeTicket,
};
