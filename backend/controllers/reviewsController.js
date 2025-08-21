const { query } = require("../config/database");

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private (Customers only)
 */
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        error: "Booking ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Verify booking exists and is completed
    const bookingResult = await query(
      `SELECT * FROM bookings 
       WHERE id = $1 AND customer_id = $2 AND status = 'completed'`,
      [bookingId, req.user.id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error:
          "Completed booking not found or you don't have permission to review it",
      });
    }

    const booking = bookingResult.rows[0];

    if (!booking.cleaner_id) {
      return res.status(400).json({
        success: false,
        error: "Cannot review a booking without an assigned cleaner",
      });
    }

    // Check if review already exists
    const existingReviewResult = await query(
      "SELECT * FROM reviews WHERE booking_id = $1 AND customer_id = $2",
      [bookingId, req.user.id]
    );

    if (existingReviewResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "You have already reviewed this booking",
      });
    }

    // Create the review
    const reviewResult = await query(
      `INSERT INTO reviews (booking_id, customer_id, cleaner_id, rating, comment, is_admin_created)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        bookingId,
        req.user.id,
        booking.cleaner_id,
        rating,
        comment || null,
        false,
      ]
    );

    // Update cleaner's average rating
    await updateCleanerRating(booking.cleaner_id);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: reviewResult.rows[0],
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating review",
    });
  }
};

/**
 * @desc    Get reviews for a cleaner
 * @route   GET /api/reviews/cleaner/:cleanerId
 * @access  Public
 */
const getCleanerReviews = async (req, res) => {
  try {
    const { cleanerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get reviews with customer info
    const reviewsResult = await query(
      `SELECT r.*, 
              u.first_name || ' ' || u.last_name as customer_name,
              u.first_name as customer_first_name,
              s.name as service_name
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       JOIN bookings b ON r.booking_id = b.id
       JOIN services s ON b.service_id = s.id
       WHERE r.cleaner_id = $1 AND r.is_visible = true
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [cleanerId, limit, offset]
    );

    // Get total count
    const countResult = await query(
      "SELECT COUNT(*) as total FROM reviews WHERE cleaner_id = $1 AND is_visible = true",
      [cleanerId]
    );

    // Get average rating and stats
    const statsResult = await query(
      `SELECT 
         AVG(rating)::DECIMAL(3,2) as average_rating,
         COUNT(*) as total_reviews,
         COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
         COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
         COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
         COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
         COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
       FROM reviews 
       WHERE cleaner_id = $1 AND is_visible = true`,
      [cleanerId]
    );

    const total = parseInt(countResult.rows[0].total);
    const stats = statsResult.rows[0];

    res.json({
      success: true,
      reviews: reviewsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        averageRating: parseFloat(stats.average_rating) || 0,
        totalReviews: parseInt(stats.total_reviews),
        distribution: {
          5: parseInt(stats.five_star),
          4: parseInt(stats.four_star),
          3: parseInt(stats.three_star),
          2: parseInt(stats.two_star),
          1: parseInt(stats.one_star),
        },
      },
    });
  } catch (error) {
    console.error("Get cleaner reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving reviews",
    });
  }
};

/**
 * @desc    Get customer's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private (Customers only)
 */
const getMyReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviewsResult = await query(
      `SELECT r.*, 
              cleaner.first_name || ' ' || cleaner.last_name as cleaner_name,
              s.name as service_name,
              b.booking_date,
              b.total_amount
       FROM reviews r
       JOIN users cleaner ON r.cleaner_id = cleaner.id
       JOIN bookings b ON r.booking_id = b.id
       JOIN services s ON b.service_id = s.id
       WHERE r.customer_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    const countResult = await query(
      "SELECT COUNT(*) as total FROM reviews WHERE customer_id = $1",
      [req.user.id]
    );

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
    console.error("Get my reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving your reviews",
    });
  }
};

/**
 * @desc    Check if customer can review a booking
 * @route   GET /api/reviews/can-review/:bookingId
 * @access  Private (Customers only)
 */
const canReviewBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check if booking is completed and belongs to customer
    const bookingResult = await query(
      `SELECT b.*, cleaner.first_name || ' ' || cleaner.last_name as cleaner_name
       FROM bookings b
       LEFT JOIN users cleaner ON b.cleaner_id = cleaner.id
       WHERE b.id = $1 AND b.customer_id = $2`,
      [bookingId, req.user.id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check if already reviewed
    const reviewResult = await query(
      "SELECT * FROM reviews WHERE booking_id = $1 AND customer_id = $2",
      [bookingId, req.user.id]
    );

    const canReview =
      booking.status === "completed" &&
      booking.cleaner_id &&
      reviewResult.rows.length === 0;

    res.json({
      success: true,
      canReview,
      reason: !canReview
        ? booking.status !== "completed"
          ? "Booking not completed"
          : !booking.cleaner_id
          ? "No cleaner assigned"
          : "Already reviewed"
        : null,
      booking: {
        id: booking.id,
        status: booking.status,
        cleanerName: booking.cleaner_name,
        hasReview: reviewResult.rows.length > 0,
      },
    });
  } catch (error) {
    console.error("Can review booking error:", error);
    res.status(500).json({
      success: false,
      error: "Server error checking review eligibility",
    });
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private (Customers only)
 */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Verify ownership
    const reviewResult = await query(
      "SELECT * FROM reviews WHERE id = $1 AND customer_id = $2",
      [id, req.user.id]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Review not found or you don't have permission to edit it",
      });
    }

    const review = reviewResult.rows[0];

    // Update review
    const updatedReviewResult = await query(
      `UPDATE reviews 
       SET rating = COALESCE($1, rating),
           comment = COALESCE($2, comment),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [rating, comment, id]
    );

    // Update cleaner's average rating if rating changed
    if (rating && rating !== review.rating) {
      await updateCleanerRating(review.cleaner_id);
    }

    res.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReviewResult.rows[0],
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating review",
    });
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Customers only)
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const reviewResult = await query(
      "SELECT * FROM reviews WHERE id = $1 AND customer_id = $2",
      [id, req.user.id]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Review not found or you don't have permission to delete it",
      });
    }

    const review = reviewResult.rows[0];

    // Delete review
    await query("DELETE FROM reviews WHERE id = $1", [id]);

    // Update cleaner's average rating
    await updateCleanerRating(review.cleaner_id);

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
 * Update cleaner's average rating in users table
 */
const updateCleanerRating = async (cleanerId) => {
  try {
    const ratingResult = await query(
      `SELECT AVG(rating)::DECIMAL(3,2) as avg_rating, COUNT(*) as review_count
       FROM reviews 
       WHERE cleaner_id = $1 AND is_visible = true`,
      [cleanerId]
    );

    const avgRating = parseFloat(ratingResult.rows[0].avg_rating) || 0;
    const reviewCount = parseInt(ratingResult.rows[0].review_count) || 0;

    await query(
      "UPDATE users SET rating = $1, review_count = $2 WHERE id = $3",
      [avgRating, reviewCount, cleanerId]
    );
  } catch (error) {
    console.error("Error updating cleaner rating:", error);
    throw error;
  }
};

// Admin functions

/**
 * @desc    Get all reviews (admin)
 * @route   GET /api/reviews/admin/all
 * @access  Private (Admin only)
 */
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, cleanerId, rating, visible } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (cleanerId) {
      whereConditions.push(`r.cleaner_id = $${paramCount++}`);
      queryParams.push(cleanerId);
    }

    if (rating) {
      whereConditions.push(`r.rating = $${paramCount++}`);
      queryParams.push(rating);
    }

    if (visible !== undefined) {
      whereConditions.push(`r.is_visible = $${paramCount++}`);
      queryParams.push(visible === "true");
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const reviewsQuery = `
      SELECT r.*, 
             customer.first_name || ' ' || customer.last_name as customer_name,
             cleaner.first_name || ' ' || cleaner.last_name as cleaner_name,
             s.name as service_name,
             b.booking_date,
             b.total_amount
      FROM reviews r
      JOIN users customer ON r.customer_id = customer.id
      JOIN users cleaner ON r.cleaner_id = cleaner.id
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
    console.error("Get all reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving reviews",
    });
  }
};

/**
 * @desc    Toggle review visibility (admin)
 * @route   PUT /api/reviews/admin/:id/toggle-visibility
 * @access  Private (Admin only)
 */
const toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    const reviewResult = await query("SELECT * FROM reviews WHERE id = $1", [
      id,
    ]);

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    const review = reviewResult.rows[0];
    const newVisibility = !review.is_visible;

    await query(
      "UPDATE reviews SET is_visible = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [newVisibility, id]
    );

    // Update cleaner rating since visibility changed
    await updateCleanerRating(review.cleaner_id);

    res.json({
      success: true,
      message: `Review ${newVisibility ? "shown" : "hidden"} successfully`,
    });
  } catch (error) {
    console.error("Toggle review visibility error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating review visibility",
    });
  }
};

/**
 * @desc    Delete review (admin)
 * @route   DELETE /api/reviews/admin/:id
 * @access  Private (Admin only)
 */
const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const reviewResult = await query("SELECT * FROM reviews WHERE id = $1", [
      id,
    ]);

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    const review = reviewResult.rows[0];

    await query("DELETE FROM reviews WHERE id = $1", [id]);

    // Update cleaner rating
    await updateCleanerRating(review.cleaner_id);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting review",
    });
  }
};

/**
 * @desc    Create admin review for marketing/growth purposes
 * @route   POST /api/reviews/admin/create
 * @access  Private (Admin only)
 */
const createAdminReview = async (req, res) => {
  try {
    const {
      cleanerId,
      rating,
      comment,
      customerName,
      serviceName,
      adminNotes,
    } = req.body;

    if (!cleanerId || !rating) {
      return res.status(400).json({
        success: false,
        error: "Cleaner ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Verify cleaner exists
    const cleanerResult = await query(
      "SELECT * FROM users WHERE id = $1 AND role = 'cleaner'",
      [cleanerId]
    );

    if (cleanerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner not found",
      });
    }

    // Create a synthetic customer for the admin review if customerName is provided
    let customerId = null;
    if (customerName) {
      // Check if a synthetic customer with this name already exists
      const existingCustomer = await query(
        "SELECT id FROM users WHERE first_name = $1 AND role = 'admin_synthetic_customer'",
        [customerName.split(" ")[0]]
      );

      if (existingCustomer.rows.length > 0) {
        customerId = existingCustomer.rows[0].id;
      } else {
        // Create synthetic customer
        const nameParts = customerName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "Customer";

        const customerResult = await query(
          `INSERT INTO users (
            first_name, last_name, email, role, is_active, created_at
          ) VALUES ($1, $2, $3, 'admin_synthetic_customer', false, CURRENT_TIMESTAMP)
          RETURNING id`,
          [firstName, lastName, `synthetic_${Date.now()}@adminreview.local`]
        );
        customerId = customerResult.rows[0].id;
      }
    }

    // Create the admin review
    const reviewResult = await query(
      `INSERT INTO reviews (
        customer_id, cleaner_id, rating, comment, 
        is_admin_created, admin_created_by, admin_notes, is_verified, is_visible
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        customerId,
        cleanerId,
        rating,
        comment || null,
        true,
        req.user.id,
        adminNotes || null,
        true,
        true,
      ]
    );

    // Log the admin action
    await logAdminReviewAction(
      reviewResult.rows[0].id,
      req.user.id,
      "create",
      null,
      {
        rating,
        comment,
        cleanerId,
        customerName,
        serviceName,
      },
      `Admin created review for marketing purposes`
    );

    // Update cleaner's average rating
    await updateCleanerRating(cleanerId);

    res.status(201).json({
      success: true,
      message: "Admin review created successfully",
      review: {
        ...reviewResult.rows[0],
        customer_name: customerName || "Anonymous Customer",
        service_name: serviceName || "General Cleaning",
      },
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
 * @desc    Update admin review
 * @route   PUT /api/reviews/admin/:id
 * @access  Private (Admin only)
 */
const updateAdminReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, adminNotes, isVisible } = req.body;

    // Get existing review
    const existingReview = await query(
      "SELECT * FROM reviews WHERE id = $1 AND is_admin_created = true",
      [id]
    );

    if (existingReview.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Admin review not found",
      });
    }

    const oldValues = existingReview.rows[0];

    // Update the review
    const updateResult = await query(
      `UPDATE reviews 
       SET rating = COALESCE($1, rating),
           comment = COALESCE($2, comment),
           admin_notes = COALESCE($3, admin_notes),
           is_visible = COALESCE($4, is_visible),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND is_admin_created = true
       RETURNING *`,
      [rating, comment, adminNotes, isVisible, id]
    );

    // Log the admin action
    await logAdminReviewAction(
      id,
      req.user.id,
      "update",
      oldValues,
      { rating, comment, adminNotes, isVisible },
      `Admin updated review`
    );

    // Update cleaner's average rating if rating changed
    if (rating && rating !== oldValues.rating) {
      await updateCleanerRating(oldValues.cleaner_id);
    }

    res.json({
      success: true,
      message: "Admin review updated successfully",
      review: updateResult.rows[0],
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
 * @desc    Get admin review management dashboard
 * @route   GET /api/reviews/admin/dashboard
 * @access  Private (Admin only)
 */
const getAdminReviewDashboard = async (req, res) => {
  try {
    // Get review statistics
    const stats = await query(`
      SELECT 
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN is_admin_created = true THEN 1 END) as admin_reviews,
        COUNT(CASE WHEN is_admin_created = false THEN 1 END) as customer_reviews,
        COUNT(CASE WHEN is_visible = true THEN 1 END) as visible_reviews,
        COUNT(CASE WHEN is_visible = false THEN 1 END) as hidden_reviews,
        AVG(rating)::DECIMAL(3,2) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews
    `);

    // Get recent admin actions
    const recentActions = await query(`
      SELECT 
        ara.*, 
        u.first_name || ' ' || u.last_name as admin_name,
        r.rating,
        cleaner.first_name || ' ' || cleaner.last_name as cleaner_name
      FROM admin_review_audit ara
      JOIN users u ON ara.admin_id = u.id
      LEFT JOIN reviews r ON ara.review_id = r.id
      LEFT JOIN users cleaner ON r.cleaner_id = cleaner.id
      ORDER BY ara.created_at DESC
      LIMIT 20
    `);

    // Get cleaners with most admin reviews
    const topAdminReviewedCleaners = await query(`
      SELECT 
        u.id,
        u.first_name || ' ' || u.last_name as cleaner_name,
        COUNT(*) as admin_review_count,
        AVG(r.rating)::DECIMAL(3,2) as admin_avg_rating
      FROM reviews r
      JOIN users u ON r.cleaner_id = u.id
      WHERE r.is_admin_created = true AND r.is_visible = true
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY admin_review_count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      dashboard: {
        statistics: stats.rows[0],
        recentActions: recentActions.rows,
        topAdminReviewedCleaners: topAdminReviewedCleaners.rows,
      },
    });
  } catch (error) {
    console.error("Get admin review dashboard error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving admin dashboard",
    });
  }
};

/**
 * @desc    Get all admin-created reviews
 * @route   GET /api/reviews/admin/admin-reviews
 * @access  Private (Admin only)
 */
const getAdminCreatedReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, cleanerId } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ["r.is_admin_created = true"];
    let queryParams = [];
    let paramCount = 1;

    if (cleanerId) {
      whereConditions.push(`r.cleaner_id = $${paramCount++}`);
      queryParams.push(cleanerId);
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    const reviewsQuery = `
      SELECT 
        r.*,
        cleaner.first_name || ' ' || cleaner.last_name as cleaner_name,
        customer.first_name || ' ' || customer.last_name as customer_name,
        admin.first_name || ' ' || admin.last_name as admin_created_by_name
      FROM reviews r
      JOIN users cleaner ON r.cleaner_id = cleaner.id
      LEFT JOIN users customer ON r.customer_id = customer.id
      LEFT JOIN users admin ON r.admin_created_by = admin.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const reviewsResult = await query(reviewsQuery, queryParams);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM reviews r ${whereClause}`;
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
    console.error("Get admin created reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving admin reviews",
    });
  }
};

/**
 * @desc    Bulk create admin reviews for a cleaner
 * @route   POST /api/reviews/admin/bulk-create
 * @access  Private (Admin only)
 */
const bulkCreateAdminReviews = async (req, res) => {
  try {
    const { cleanerId, reviews: reviewsData, adminNotes } = req.body;

    if (!cleanerId || !reviewsData || !Array.isArray(reviewsData)) {
      return res.status(400).json({
        success: false,
        error: "Cleaner ID and reviews array are required",
      });
    }

    // Verify cleaner exists
    const cleanerResult = await query(
      "SELECT * FROM users WHERE id = $1 AND role = 'cleaner'",
      [cleanerId]
    );

    if (cleanerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner not found",
      });
    }

    const createdReviews = [];

    // Create each review
    for (const reviewData of reviewsData) {
      const { rating, comment, customerName } = reviewData;

      if (!rating || rating < 1 || rating > 5) {
        continue; // Skip invalid ratings
      }

      // Create synthetic customer if needed
      let customerId = null;
      if (customerName) {
        const nameParts = customerName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "Customer";

        const customerResult = await query(
          `INSERT INTO users (
            first_name, last_name, email, role, is_active, created_at
          ) VALUES ($1, $2, $3, 'admin_synthetic_customer', false, CURRENT_TIMESTAMP)
          RETURNING id`,
          [
            firstName,
            lastName,
            `synthetic_${Date.now()}_${Math.random()}@adminreview.local`,
          ]
        );
        customerId = customerResult.rows[0].id;
      }

      // Create the review
      const reviewResult = await query(
        `INSERT INTO reviews (
          customer_id, cleaner_id, rating, comment, 
          is_admin_created, admin_created_by, admin_notes, is_verified, is_visible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          customerId,
          cleanerId,
          rating,
          comment || null,
          true,
          req.user.id,
          adminNotes || "Bulk created for marketing purposes",
          true,
          true,
        ]
      );

      createdReviews.push({
        ...reviewResult.rows[0],
        customer_name: customerName || "Anonymous Customer",
      });

      // Log the admin action
      await logAdminReviewAction(
        reviewResult.rows[0].id,
        req.user.id,
        "create",
        null,
        { rating, comment, cleanerId, customerName },
        `Bulk created admin review`
      );
    }

    // Update cleaner's average rating
    await updateCleanerRating(cleanerId);

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdReviews.length} admin reviews`,
      reviews: createdReviews,
    });
  } catch (error) {
    console.error("Bulk create admin reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating admin reviews",
    });
  }
};

/**
 * Helper function to log admin review actions
 */
const logAdminReviewAction = async (
  reviewId,
  adminId,
  action,
  oldValues,
  newValues,
  reason
) => {
  try {
    await query(
      `INSERT INTO admin_review_audit (
        review_id, admin_id, action, old_values, new_values, reason
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        reviewId,
        adminId,
        action,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        reason,
      ]
    );
  } catch (error) {
    console.error("Error logging admin review action:", error);
    // Don't throw error as this is not critical
  }
};

module.exports = {
  createReview,
  getCleanerReviews,
  getMyReviews,
  canReviewBooking,
  updateReview,
  deleteReview,
  updateCleanerRating,
  getAllReviews,
  toggleReviewVisibility,
  // Admin review functions are disabled
  // adminDeleteReview,
  // createAdminReview,
  // updateAdminReview,
  // getAdminReviewDashboard,
  // getAdminCreatedReviews,
  // bulkCreateAdminReviews,
};
