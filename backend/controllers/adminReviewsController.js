const { query } = require("../config/database");

/**
 * @desc    Get all cleaners for dropdown selection
 * @route   GET /api/admin/reviews/cleaners
 * @access  Private (Admin only)
 */
const getCleaners = async (req, res) => {
  try {
    console.log("🧹 Admin getCleaners controller called");
    console.log("🌍 Environment:", process.env.NODE_ENV || "development");
    console.log("🔗 Database URL exists:", !!process.env.DATABASE_URL);
    console.log(
      "👤 User:",
      req.user
        ? `ID: ${req.user.userId}, Role: ${req.user.role}`
        : "No user info"
    );

    const result = await query(
      `SELECT 
        id, 
        first_name, 
        last_name, 
        email
      FROM users 
      WHERE role = 'cleaner' AND is_active = true
      ORDER BY first_name, last_name`
    );

    console.log(`📊 Found ${result.rows.length} cleaners in database`);

    const cleaners = result.rows.map((cleaner) => ({
      id: cleaner.id,
      name: `${cleaner.first_name} ${cleaner.last_name}`,
      email: cleaner.email,
      rating: 5.0, // Default rating since column doesn't exist
      reviewCount: 0, // Default review count since column doesn't exist
    }));

    console.log("✅ Returning cleaners data:", cleaners.length, "items");

    res.json({
      success: true,
      cleaners,
    });
  } catch (error) {
    console.error("❌ Get cleaners error:", error);
    console.error("❌ Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      error: "Server error retrieving cleaners",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Create a new admin review
 * @route   POST /api/admin/reviews
 * @access  Private (Admin only)
 */
const createAdminReview = async (req, res) => {
  try {
    const { cleanerId, rating, reviewText } = req.body;
    const adminId = req.user.id;

    // Validate required fields
    if (!cleanerId || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        error: "Cleaner ID, rating, and review text are required",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Verify cleaner exists
    const cleanerResult = await query(
      "SELECT id, first_name, last_name FROM users WHERE id = $1 AND role = 'cleaner'",
      [cleanerId]
    );

    if (cleanerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner not found",
      });
    }

    // Create admin review
    const reviewResult = await query(
      `INSERT INTO admin_reviews (cleaner_id, admin_id, rating, review_text, is_visible, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [cleanerId, adminId, rating, reviewText, true]
    );

    const review = reviewResult.rows[0];

    // Update cleaner's combined rating (customer + admin reviews)
    const { updateCleanerRating } = require("./reviewsController");
    await updateCleanerRating(cleanerId);

    // Get admin and cleaner names for response
    const detailsResult = await query(
      `SELECT 
        ar.*,
        u.first_name || ' ' || u.last_name as cleaner_name,
        a.first_name || ' ' || a.last_name as admin_name
      FROM admin_reviews ar
      JOIN users u ON ar.cleaner_id = u.id
      JOIN users a ON ar.admin_id = a.id
      WHERE ar.id = $1`,
      [review.id]
    );

    res.status(201).json({
      success: true,
      message: "Admin review created successfully",
      review: detailsResult.rows[0],
    });
  } catch (error) {
    console.error("Create admin review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating admin review",
    });
  }
};

/**
 * @desc    Get all admin reviews
 * @route   GET /api/admin/reviews
 * @access  Private (Admin only)
 */
const getAdminReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, cleanerId, visible } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (cleanerId) {
      whereConditions.push(`ar.cleaner_id = $${paramCount++}`);
      queryParams.push(cleanerId);
    }

    if (visible !== undefined) {
      whereConditions.push(`ar.is_visible = $${paramCount++}`);
      queryParams.push(visible === "true");
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get reviews with cleaner and admin names
    const reviewsQuery = `
      SELECT 
        ar.*,
        u.first_name || ' ' || u.last_name as cleaner_name,
        u.email as cleaner_email,
        a.first_name || ' ' || a.last_name as admin_name
      FROM admin_reviews ar
      JOIN users u ON ar.cleaner_id = u.id
      JOIN users a ON ar.admin_id = a.id
      ${whereClause}
      ORDER BY ar.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const reviewsResult = await query(reviewsQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM admin_reviews ar 
      JOIN users u ON ar.cleaner_id = u.id 
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams.slice(0, -2));
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
    console.error("Get admin reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving admin reviews",
    });
  }
};

/**
 * @desc    Update an admin review
 * @route   PUT /api/admin/reviews/:id
 * @access  Private (Admin only)
 */
const updateAdminReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText, isVisible } = req.body;

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Check if review exists and belongs to an admin
    const existingReview = await query(
      "SELECT * FROM admin_reviews WHERE id = $1",
      [id]
    );

    if (existingReview.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Admin review not found",
      });
    }

    // Update the review
    const updateResult = await query(
      `UPDATE admin_reviews 
       SET 
         rating = COALESCE($1, rating),
         review_text = COALESCE($2, review_text),
         is_visible = COALESCE($3, is_visible),
         updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [rating, reviewText, isVisible, id]
    );

    // Update cleaner's combined rating (customer + admin reviews)
    const { updateCleanerRating } = require("./reviewsController");
    await updateCleanerRating(existingReview.rows[0].cleaner_id);

    // Get updated review with names
    const detailsResult = await query(
      `SELECT 
        ar.*,
        u.first_name || ' ' || u.last_name as cleaner_name,
        a.first_name || ' ' || a.last_name as admin_name
      FROM admin_reviews ar
      JOIN users u ON ar.cleaner_id = u.id
      JOIN users a ON ar.admin_id = a.id
      WHERE ar.id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: "Admin review updated successfully",
      review: detailsResult.rows[0],
    });
  } catch (error) {
    console.error("Update admin review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating admin review",
    });
  }
};

/**
 * @desc    Delete an admin review
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private (Admin only)
 */
const deleteAdminReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if review exists
    const existingReview = await query(
      "SELECT * FROM admin_reviews WHERE id = $1",
      [id]
    );

    if (existingReview.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Admin review not found",
      });
    }

    // Delete the review
    await query("DELETE FROM admin_reviews WHERE id = $1", [id]);

    // Update cleaner's combined rating (customer + admin reviews)
    const { updateCleanerRating } = require("./reviewsController");
    await updateCleanerRating(existingReview.rows[0].cleaner_id);

    res.json({
      success: true,
      message: "Admin review deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting admin review",
    });
  }
};

/**
 * @desc    Get admin review statistics
 * @route   GET /api/admin/reviews/stats
 * @access  Private (Admin only)
 */
const getAdminReviewStats = async (req, res) => {
  try {
    // Get basic statistics
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN is_visible = true THEN 1 END) as visible_reviews,
        COUNT(CASE WHEN is_visible = false THEN 1 END) as hidden_reviews,
        AVG(rating)::DECIMAL(3,2) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM admin_reviews
    `);

    // Get top reviewed cleaners
    const topCleanersResult = await query(`
      SELECT 
        u.id,
        u.first_name || ' ' || u.last_name as cleaner_name,
        COUNT(ar.id) as admin_review_count,
        AVG(ar.rating)::DECIMAL(3,2) as avg_admin_rating
      FROM admin_reviews ar
      JOIN users u ON ar.cleaner_id = u.id
      WHERE ar.is_visible = true
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY admin_review_count DESC, avg_admin_rating DESC
      LIMIT 10
    `);

    // Get recent reviews
    const recentReviewsResult = await query(`
      SELECT 
        ar.id,
        ar.rating,
        ar.created_at,
        u.first_name || ' ' || u.last_name as cleaner_name,
        a.first_name || ' ' || a.last_name as admin_name
      FROM admin_reviews ar
      JOIN users u ON ar.cleaner_id = u.id
      JOIN users a ON ar.admin_id = a.id
      ORDER BY ar.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        overview: statsResult.rows[0],
        topCleaners: topCleanersResult.rows,
        recentReviews: recentReviewsResult.rows,
      },
    });
  } catch (error) {
    console.error("Get admin review stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving admin review statistics",
    });
  }
};

/**
 * @desc    Get visible admin reviews for public display (Home page)
 * @route   GET /api/admin/reviews/public
 * @access  Public
 */
const getPublicAdminReviews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const reviewsResult = await query(
      `SELECT 
        ar.rating,
        ar.review_text,
        ar.created_at,
        u.first_name || ' ' || u.last_name as cleaner_name
      FROM admin_reviews ar
      JOIN users u ON ar.cleaner_id = u.id
      WHERE ar.is_visible = true
      ORDER BY ar.created_at DESC
      LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      reviews: reviewsResult.rows,
    });
  } catch (error) {
    console.error("Get public admin reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving public admin reviews",
    });
  }
};

module.exports = {
  getCleaners,
  createAdminReview,
  getAdminReviews,
  updateAdminReview,
  deleteAdminReview,
  getAdminReviewStats,
  getPublicAdminReviews,
};
