const { query } = require("../config/database");

/**
 * @desc    Get trust indicators for public display
 * @route   GET /api/trust/public
 * @access  Public
 */
const getTrustIndicators = async (req, res) => {
  try {
    // Get active trust badges
    const badgesResult = await query(
      `SELECT id, name, description, image_url, external_url, badge_type
       FROM trust_badges 
       WHERE is_active = true 
       ORDER BY display_order ASC, created_at ASC`
    );

    // Get active testimonials
    const testimonialsResult = await query(
      `SELECT id, customer_name, customer_title, customer_location, content, 
              rating, service_type, image_url, is_featured
       FROM testimonials 
       WHERE is_active = true 
       ORDER BY is_featured DESC, display_order ASC, created_at DESC`
    );

    res.json({
      success: true,
      trustIndicators: {
        badges: badgesResult.rows,
        testimonials: testimonialsResult.rows,
      },
    });
  } catch (error) {
    console.error("Get trust indicators error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving trust indicators",
    });
  }
};

/**
 * @desc    Get featured testimonials only
 * @route   GET /api/trust/testimonials/featured
 * @access  Public
 */
const getFeaturedTestimonials = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const testimonialsResult = await query(
      `SELECT id, customer_name, customer_title, customer_location, content, 
              rating, service_type, image_url
       FROM testimonials 
       WHERE is_active = true AND is_featured = true
       ORDER BY display_order ASC, created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      testimonials: testimonialsResult.rows,
    });
  } catch (error) {
    console.error("Get featured testimonials error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving testimonials",
    });
  }
};

/**
 * @desc    Get trust badges by type
 * @route   GET /api/trust/badges/:type
 * @access  Public
 */
const getBadgesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ["media", "certification", "award", "partner"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid badge type",
      });
    }

    const badgesResult = await query(
      `SELECT id, name, description, image_url, external_url
       FROM trust_badges 
       WHERE is_active = true AND badge_type = $1
       ORDER BY display_order ASC, created_at ASC`,
      [type]
    );

    res.json({
      success: true,
      badges: badgesResult.rows,
    });
  } catch (error) {
    console.error("Get badges by type error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving badges",
    });
  }
};

// Admin functions

/**
 * @desc    Get all trust badges (admin)
 * @route   GET /api/trust/admin/badges
 * @access  Private (Admin only)
 */
const getAllBadges = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, active } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (type) {
      whereConditions.push(`badge_type = $${paramCount++}`);
      queryParams.push(type);
    }

    if (active !== undefined) {
      whereConditions.push(`is_active = $${paramCount++}`);
      queryParams.push(active === "true");
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const badgesQuery = `
      SELECT tb.*, u.first_name || ' ' || u.last_name as created_by_name
      FROM trust_badges tb
      LEFT JOIN users u ON tb.created_by = u.id
      ${whereClause}
      ORDER BY tb.display_order ASC, tb.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const badgesResult = await query(badgesQuery, queryParams);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM trust_badges ${whereClause}`;
    const countResult = await query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      badges: badgesResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all badges error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving badges",
    });
  }
};

/**
 * @desc    Create trust badge (admin)
 * @route   POST /api/trust/admin/badges
 * @access  Private (Admin only)
 */
const createBadge = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      externalUrl,
      badgeType = "media",
      displayOrder = 0,
    } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: "Name and image URL are required",
      });
    }

    const result = await query(
      `INSERT INTO trust_badges 
       (name, description, image_url, external_url, badge_type, display_order, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name,
        description,
        imageUrl,
        externalUrl,
        badgeType,
        displayOrder,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Trust badge created successfully",
      badge: result.rows[0],
    });
  } catch (error) {
    console.error("Create badge error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating badge",
    });
  }
};

/**
 * @desc    Update trust badge (admin)
 * @route   PUT /api/trust/admin/badges/:id
 * @access  Private (Admin only)
 */
const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      imageUrl,
      externalUrl,
      badgeType,
      displayOrder,
      isActive,
    } = req.body;

    const result = await query(
      `UPDATE trust_badges 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           image_url = COALESCE($3, image_url),
           external_url = COALESCE($4, external_url),
           badge_type = COALESCE($5, badge_type),
           display_order = COALESCE($6, display_order),
           is_active = COALESCE($7, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        name,
        description,
        imageUrl,
        externalUrl,
        badgeType,
        displayOrder,
        isActive,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Badge not found",
      });
    }

    res.json({
      success: true,
      message: "Trust badge updated successfully",
      badge: result.rows[0],
    });
  } catch (error) {
    console.error("Update badge error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating badge",
    });
  }
};

/**
 * @desc    Delete trust badge (admin)
 * @route   DELETE /api/trust/admin/badges/:id
 * @access  Private (Admin only)
 */
const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM trust_badges WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Badge not found",
      });
    }

    res.json({
      success: true,
      message: "Trust badge deleted successfully",
    });
  } catch (error) {
    console.error("Delete badge error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting badge",
    });
  }
};

/**
 * @desc    Get all testimonials (admin)
 * @route   GET /api/trust/admin/testimonials
 * @access  Private (Admin only)
 */
const getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 20, featured, active, source } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (featured !== undefined) {
      whereConditions.push(`t.is_featured = $${paramCount++}`);
      queryParams.push(featured === "true");
    }

    if (active !== undefined) {
      whereConditions.push(`t.is_active = $${paramCount++}`);
      queryParams.push(active === "true");
    }

    if (source) {
      whereConditions.push(`t.source = $${paramCount++}`);
      queryParams.push(source);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const testimonialsQuery = `
      SELECT t.*, 
             u.first_name || ' ' || u.last_name as created_by_name,
             r.rating as original_rating
      FROM testimonials t
      LEFT JOIN users u ON t.created_by = u.id
      LEFT JOIN reviews r ON t.source_review_id = r.id
      ${whereClause}
      ORDER BY t.is_featured DESC, t.display_order ASC, t.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const testimonialsResult = await query(testimonialsQuery, queryParams);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM testimonials t ${whereClause}`;
    const countResult = await query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      testimonials: testimonialsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all testimonials error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving testimonials",
    });
  }
};

/**
 * @desc    Create testimonial (admin)
 * @route   POST /api/trust/admin/testimonials
 * @access  Private (Admin only)
 */
const createTestimonial = async (req, res) => {
  try {
    const {
      customerName,
      customerTitle,
      customerLocation,
      content,
      rating,
      serviceType,
      imageUrl,
      isFeatured = false,
      displayOrder = 0,
    } = req.body;

    if (!customerName || !content) {
      return res.status(400).json({
        success: false,
        error: "Customer name and content are required",
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    const result = await query(
      `INSERT INTO testimonials 
       (customer_name, customer_title, customer_location, content, rating, 
        service_type, image_url, is_featured, display_order, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        customerName,
        customerTitle,
        customerLocation,
        content,
        rating,
        serviceType,
        imageUrl,
        isFeatured,
        displayOrder,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial: result.rows[0],
    });
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating testimonial",
    });
  }
};

/**
 * @desc    Update testimonial (admin)
 * @route   PUT /api/trust/admin/testimonials/:id
 * @access  Private (Admin only)
 */
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerTitle,
      customerLocation,
      content,
      rating,
      serviceType,
      imageUrl,
      isFeatured,
      isActive,
      displayOrder,
    } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    const result = await query(
      `UPDATE testimonials 
       SET customer_name = COALESCE($1, customer_name),
           customer_title = COALESCE($2, customer_title),
           customer_location = COALESCE($3, customer_location),
           content = COALESCE($4, content),
           rating = COALESCE($5, rating),
           service_type = COALESCE($6, service_type),
           image_url = COALESCE($7, image_url),
           is_featured = COALESCE($8, is_featured),
           is_active = COALESCE($9, is_active),
           display_order = COALESCE($10, display_order),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        customerName,
        customerTitle,
        customerLocation,
        content,
        rating,
        serviceType,
        imageUrl,
        isFeatured,
        isActive,
        displayOrder,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Testimonial not found",
      });
    }

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial: result.rows[0],
    });
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating testimonial",
    });
  }
};

/**
 * @desc    Delete testimonial (admin)
 * @route   DELETE /api/trust/admin/testimonials/:id
 * @access  Private (Admin only)
 */
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM testimonials WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Testimonial not found",
      });
    }

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting testimonial",
    });
  }
};

/**
 * @desc    Import testimonial from review (admin)
 * @route   POST /api/trust/admin/testimonials/import/:reviewId
 * @access  Private (Admin only)
 */
const importTestimonialFromReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isFeatured = false, displayOrder = 0 } = req.body;

    // Get review details
    const reviewResult = await query(
      `SELECT r.*, 
              customer.first_name || ' ' || customer.last_name as customer_name,
              customer.city || ', ' || customer.state as customer_location,
              s.name as service_name
       FROM reviews r
       JOIN users customer ON r.customer_id = customer.id
       JOIN bookings b ON r.booking_id = b.id
       JOIN services s ON b.service_id = s.id
       WHERE r.id = $1 AND r.comment IS NOT NULL AND r.comment != ''`,
      [reviewId]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Review not found or has no comment",
      });
    }

    const review = reviewResult.rows[0];

    // Check if already imported
    const existingResult = await query(
      "SELECT id FROM testimonials WHERE source_review_id = $1",
      [reviewId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Review already imported as testimonial",
      });
    }

    // Create testimonial
    const result = await query(
      `INSERT INTO testimonials 
       (customer_name, customer_location, content, rating, service_type, 
        is_featured, display_order, source, source_review_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'review', $8, $9) RETURNING *`,
      [
        review.customer_name,
        review.customer_location,
        review.comment,
        review.rating,
        review.service_name,
        isFeatured,
        displayOrder,
        reviewId,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Testimonial imported from review successfully",
      testimonial: result.rows[0],
    });
  } catch (error) {
    console.error("Import testimonial from review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error importing testimonial",
    });
  }
};

module.exports = {
  getTrustIndicators,
  getFeaturedTestimonials,
  getBadgesByType,
  getAllBadges,
  createBadge,
  updateBadge,
  deleteBadge,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  importTestimonialFromReview,
};
