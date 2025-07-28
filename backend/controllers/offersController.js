const { query } = require("../config/database");

/**
 * @desc    Get all active special offers
 * @route   GET /api/offers
 * @access  Public
 */
const getActiveOffers = async (req, res) => {
  try {
    const offersResult = await query(
      `SELECT * FROM special_offers 
       WHERE is_active = true 
       AND (valid_until IS NULL OR valid_until > NOW())
       AND (max_total_uses IS NULL OR current_total_uses < max_total_uses)
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      offers: offersResult.rows,
    });
  } catch (error) {
    console.error("Get active offers error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving offers",
    });
  }
};

/**
 * @desc    Check if user is eligible for first clean offer
 * @route   GET /api/offers/first-clean/eligibility
 * @access  Private (Customers only)
 */
const checkFirstCleanEligibility = async (req, res) => {
  try {
    // Check if user has active membership
    const membershipResult = await query(
      `SELECT * FROM memberships 
       WHERE user_id = $1 AND status = 'active' 
       AND current_period_end > NOW()`,
      [req.user.id]
    );

    if (membershipResult.rows.length === 0) {
      return res.json({
        success: true,
        eligible: false,
        reason: "Active membership required",
      });
    }

    // Check if user has any completed bookings
    const bookingsResult = await query(
      `SELECT COUNT(*) as completed_count
       FROM bookings 
       WHERE customer_id = $1 AND status = 'completed'`,
      [req.user.id]
    );

    const hasCompletedBookings =
      parseInt(bookingsResult.rows[0].completed_count) > 0;

    if (hasCompletedBookings) {
      return res.json({
        success: true,
        eligible: false,
        reason: "Offer is only valid for first-time customers",
      });
    }

    // Check if user has already used the first clean offer
    const offerUsageResult = await query(
      `SELECT uou.* FROM user_offer_usage uou
       JOIN special_offers so ON uou.offer_id = so.id
       WHERE uou.user_id = $1 AND so.offer_type = 'first_clean'`,
      [req.user.id]
    );

    if (offerUsageResult.rows.length > 0) {
      return res.json({
        success: true,
        eligible: false,
        reason: "First clean offer already used",
      });
    }

    // Get the active first clean offer
    const offerResult = await query(
      `SELECT * FROM special_offers 
       WHERE offer_type = 'first_clean' AND is_active = true
       AND (valid_until IS NULL OR valid_until > NOW())
       LIMIT 1`
    );

    if (offerResult.rows.length === 0) {
      return res.json({
        success: true,
        eligible: false,
        reason: "First clean offer is not currently available",
      });
    }

    const offer = offerResult.rows[0];

    res.json({
      success: true,
      eligible: true,
      offer: {
        id: offer.id,
        name: offer.name,
        description: offer.description,
        discountValue: offer.discount_value,
        discountType: offer.discount_type,
        conditions: offer.conditions,
      },
      membership: membershipResult.rows[0],
    });
  } catch (error) {
    console.error("Check first clean eligibility error:", error);
    res.status(500).json({
      success: false,
      error: "Server error checking eligibility",
    });
  }
};

/**
 * @desc    Calculate pricing with first clean offer
 * @route   POST /api/offers/first-clean/calculate
 * @access  Private (Customers only)
 */
const calculateFirstCleanPricing = async (req, res) => {
  try {
    const { serviceId, hours } = req.body;

    if (!serviceId || !hours) {
      return res.status(400).json({
        success: false,
        error: "Service ID and hours are required",
      });
    }

    // Validate hours (2, 3, 4, or 6 only)
    const validHours = [2, 3, 4, 6];
    if (!validHours.includes(parseInt(hours))) {
      return res.status(400).json({
        success: false,
        error: "First clean offer is valid for 2, 3, 4, or 6 hours only",
      });
    }

    // Check eligibility first
    const eligibilityCheck = await checkFirstCleanEligibilityInternal(
      req.user.id
    );
    if (!eligibilityCheck.eligible) {
      return res.status(400).json({
        success: false,
        error: eligibilityCheck.reason,
      });
    }

    // Get service details
    const serviceResult = await query(
      "SELECT * FROM services WHERE id = $1 AND is_active = true",
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    const service = serviceResult.rows[0];
    const originalAmount = parseFloat(service.base_price) * parseInt(hours);
    const offer = eligibilityCheck.offer;

    let finalAmount;
    let discountAmount;

    if (offer.discount_type === "fixed_price") {
      finalAmount = parseFloat(offer.discount_value);
      discountAmount = originalAmount - finalAmount;
    } else if (offer.discount_type === "fixed_amount") {
      discountAmount = parseFloat(offer.discount_value);
      finalAmount = Math.max(0, originalAmount - discountAmount);
    } else if (offer.discount_type === "percentage") {
      discountAmount =
        originalAmount * (parseFloat(offer.discount_value) / 100);
      finalAmount = originalAmount - discountAmount;
    }

    res.json({
      success: true,
      pricing: {
        service: {
          id: service.id,
          name: service.name,
          basePricePerHour: service.base_price,
        },
        calculation: {
          hours: parseInt(hours),
          originalAmount: Math.round(originalAmount * 100) / 100,
          discountAmount: Math.round(discountAmount * 100) / 100,
          finalAmount: Math.round(finalAmount * 100) / 100,
          offerName: offer.name,
          offerType: "first_clean",
        },
        offer: offer,
      },
    });
  } catch (error) {
    console.error("Calculate first clean pricing error:", error);
    res.status(500).json({
      success: false,
      error: "Server error calculating pricing",
    });
  }
};

/**
 * @desc    Record offer usage (internal function)
 * @param   {number} userId
 * @param   {number} offerId
 * @param   {number} bookingId
 * @param   {number} originalAmount
 * @param   {number} finalAmount
 * @param   {number} discountAmount
 */
const recordOfferUsage = async (
  userId,
  offerId,
  bookingId,
  originalAmount,
  finalAmount,
  discountAmount
) => {
  try {
    // Record usage
    await query(
      `INSERT INTO user_offer_usage 
       (user_id, offer_id, booking_id, discount_applied, original_amount, final_amount)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, offerId, bookingId, discountAmount, originalAmount, finalAmount]
    );

    // Update total uses count
    await query(
      `UPDATE special_offers 
       SET current_total_uses = current_total_uses + 1
       WHERE id = $1`,
      [offerId]
    );

    return true;
  } catch (error) {
    console.error("Record offer usage error:", error);
    throw error;
  }
};

/**
 * @desc    Internal function to check first clean eligibility
 * @param   {number} userId
 * @returns {object} Eligibility status and offer details
 */
const checkFirstCleanEligibilityInternal = async (userId) => {
  try {
    // Check if user has active membership
    const membershipResult = await query(
      `SELECT * FROM memberships 
       WHERE user_id = $1 AND status = 'active' 
       AND current_period_end > NOW()`,
      [userId]
    );

    if (membershipResult.rows.length === 0) {
      return {
        eligible: false,
        reason: "Active membership required",
      };
    }

    // Check if user has any completed bookings
    const bookingsResult = await query(
      `SELECT COUNT(*) as completed_count
       FROM bookings 
       WHERE customer_id = $1 AND status = 'completed'`,
      [userId]
    );

    const hasCompletedBookings =
      parseInt(bookingsResult.rows[0].completed_count) > 0;

    if (hasCompletedBookings) {
      return {
        eligible: false,
        reason: "Offer is only valid for first-time customers",
      };
    }

    // Check if user has already used the first clean offer
    const offerUsageResult = await query(
      `SELECT uou.* FROM user_offer_usage uou
       JOIN special_offers so ON uou.offer_id = so.id
       WHERE uou.user_id = $1 AND so.offer_type = 'first_clean'`,
      [userId]
    );

    if (offerUsageResult.rows.length > 0) {
      return {
        eligible: false,
        reason: "First clean offer already used",
      };
    }

    // Get the active first clean offer
    const offerResult = await query(
      `SELECT * FROM special_offers 
       WHERE offer_type = 'first_clean' AND is_active = true
       AND (valid_until IS NULL OR valid_until > NOW())
       LIMIT 1`
    );

    if (offerResult.rows.length === 0) {
      return {
        eligible: false,
        reason: "First clean offer is not currently available",
      };
    }

    return {
      eligible: true,
      offer: offerResult.rows[0],
      membership: membershipResult.rows[0],
    };
  } catch (error) {
    console.error("Check first clean eligibility internal error:", error);
    throw error;
  }
};

// Admin functions

/**
 * @desc    Get all offers (admin)
 * @route   GET /api/offers/admin/all
 * @access  Private (Admin only)
 */
const getAllOffers = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (type) {
      whereConditions.push(`offer_type = $${paramCount++}`);
      queryParams.push(type);
    }

    if (status !== undefined) {
      whereConditions.push(`is_active = $${paramCount++}`);
      queryParams.push(status === "active");
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const offersQuery = `
      SELECT so.*, 
             u.first_name || ' ' || u.last_name as created_by_name,
             (SELECT COUNT(*) FROM user_offer_usage uou WHERE uou.offer_id = so.id) as times_used
      FROM special_offers so
      LEFT JOIN users u ON so.created_by = u.id
      ${whereClause}
      ORDER BY so.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const offersResult = await query(offersQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM special_offers so
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      offers: offersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all offers error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving offers",
    });
  }
};

/**
 * @desc    Create new offer (admin)
 * @route   POST /api/offers/admin
 * @access  Private (Admin only)
 */
const createOffer = async (req, res) => {
  try {
    const {
      name,
      description,
      offerType,
      discountType,
      discountValue,
      conditions = {},
      validUntil,
      maxUsesPerUser = 1,
      maxTotalUses,
    } = req.body;

    if (!name || !offerType || !discountType || !discountValue) {
      return res.status(400).json({
        success: false,
        error:
          "Name, offer type, discount type, and discount value are required",
      });
    }

    const result = await query(
      `INSERT INTO special_offers 
       (name, description, offer_type, discount_type, discount_value, conditions, 
        valid_until, max_uses_per_user, max_total_uses, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        name,
        description,
        offerType,
        discountType,
        discountValue,
        JSON.stringify(conditions),
        validUntil || null,
        maxUsesPerUser,
        maxTotalUses || null,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      offer: result.rows[0],
    });
  } catch (error) {
    console.error("Create offer error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating offer",
    });
  }
};

/**
 * @desc    Update offer (admin)
 * @route   PUT /api/offers/admin/:id
 * @access  Private (Admin only)
 */
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      discountType,
      discountValue,
      conditions,
      isActive,
      validUntil,
      maxUsesPerUser,
      maxTotalUses,
    } = req.body;

    const result = await query(
      `UPDATE special_offers 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           discount_type = COALESCE($3, discount_type),
           discount_value = COALESCE($4, discount_value),
           conditions = COALESCE($5, conditions),
           is_active = COALESCE($6, is_active),
           valid_until = COALESCE($7, valid_until),
           max_uses_per_user = COALESCE($8, max_uses_per_user),
           max_total_uses = COALESCE($9, max_total_uses),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        name,
        description,
        discountType,
        discountValue,
        conditions ? JSON.stringify(conditions) : null,
        isActive,
        validUntil,
        maxUsesPerUser,
        maxTotalUses,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Offer not found",
      });
    }

    res.json({
      success: true,
      offer: result.rows[0],
    });
  } catch (error) {
    console.error("Update offer error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating offer",
    });
  }
};

/**
 * @desc    Delete offer (admin)
 * @route   DELETE /api/offers/admin/:id
 * @access  Private (Admin only)
 */
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM special_offers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Offer not found",
      });
    }

    res.json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.error("Delete offer error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting offer",
    });
  }
};

/**
 * @desc    Get offer analytics (admin)
 * @route   GET /api/offers/admin/analytics
 * @access  Private (Admin only)
 */
const getOfferAnalytics = async (req, res) => {
  try {
    // Total offer statistics
    const totalStatsResult = await query(`
      SELECT 
        COUNT(*) as total_offers,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_offers,
        SUM(current_total_uses) as total_redemptions,
        SUM(CASE WHEN offer_type = 'first_clean' THEN current_total_uses ELSE 0 END) as first_clean_redemptions
      FROM special_offers
    `);

    // Usage by offer type
    const typeStatsResult = await query(`
      SELECT 
        so.offer_type,
        COUNT(so.id) as offer_count,
        SUM(so.current_total_uses) as total_uses,
        SUM(uou.discount_applied) as total_discount_given
      FROM special_offers so
      LEFT JOIN user_offer_usage uou ON so.id = uou.offer_id
      GROUP BY so.offer_type
      ORDER BY total_uses DESC
    `);

    // Monthly usage trends
    const monthlyUsageResult = await query(`
      SELECT 
        DATE_TRUNC('month', used_at) as month,
        COUNT(*) as redemptions,
        SUM(discount_applied) as total_discounts,
        so.offer_type
      FROM user_offer_usage uou
      JOIN special_offers so ON uou.offer_id = so.id
      WHERE used_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', used_at), so.offer_type
      ORDER BY month, so.offer_type
    `);

    // Top offers by usage
    const topOffersResult = await query(`
      SELECT 
        so.name,
        so.offer_type,
        so.current_total_uses,
        SUM(uou.discount_applied) as total_discount_given
      FROM special_offers so
      LEFT JOIN user_offer_usage uou ON so.id = uou.offer_id
      GROUP BY so.id, so.name, so.offer_type, so.current_total_uses
      ORDER BY so.current_total_uses DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      analytics: {
        totalStats: totalStatsResult.rows[0],
        typeStats: typeStatsResult.rows,
        monthlyUsage: monthlyUsageResult.rows,
        topOffers: topOffersResult.rows,
      },
    });
  } catch (error) {
    console.error("Get offer analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving analytics",
    });
  }
};

module.exports = {
  getActiveOffers,
  checkFirstCleanEligibility,
  calculateFirstCleanPricing,
  recordOfferUsage,
  checkFirstCleanEligibilityInternal,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getOfferAnalytics,
};
