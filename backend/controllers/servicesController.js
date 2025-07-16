const { query } = require("../config/database");

/**
 * @desc    Get all active services
 * @route   GET /api/services
 * @access  Public
 */
const getServices = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE is_active = true";
    const queryParams = [];
    let paramCount = 1;

    if (category) {
      whereClause += ` AND category = $${paramCount++}`;
      queryParams.push(category);
    }

    const servicesQuery = `
      SELECT 
        id, name, description, base_price, duration_hours, category, created_at
      FROM services
      ${whereClause}
      ORDER BY category, name
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);

    const servicesResult = await query(servicesQuery, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM services
      ${whereClause}
    `;

    // For count query, we only need the filter parameters, not LIMIT and OFFSET
    const countParams = queryParams.slice(0, -2); // Remove the last 2 params (limit and offset)
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Get unique categories
    const categoriesResult = await query(
      "SELECT DISTINCT category FROM services WHERE is_active = true ORDER BY category"
    );

    res.json({
      success: true,
      data: servicesResult.rows,
      categories: categoriesResult.rows.map((row) => row.category),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving services",
    });
  }
};

/**
 * @desc    Get service by ID
 * @route   GET /api/services/:id
 * @access  Public
 */
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const serviceResult = await query(
      "SELECT * FROM services WHERE id = $1 AND is_active = true",
      [id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    res.json({
      success: true,
      data: serviceResult.rows[0],
    });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving service",
    });
  }
};

/**
 * @desc    Create new service
 * @route   POST /api/services
 * @access  Private (Admin only)
 */
const createService = async (req, res) => {
  try {
    const { name, description, basePrice, durationHours, category } = req.body;

    const serviceResult = await query(
      `INSERT INTO services (name, description, base_price, duration_hours, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, basePrice, durationHours, category]
    );

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: serviceResult.rows[0],
    });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating service",
    });
  }
};

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private (Admin only)
 */
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, basePrice, durationHours, category } = req.body;

    const updateResult = await query(
      `UPDATE services 
       SET name = $1, description = $2, base_price = $3, duration_hours = $4, 
           category = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, description, basePrice, durationHours, category, id]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      service: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating service",
    });
  }
};

/**
 * @desc    Deactivate service (soft delete)
 * @route   DELETE /api/services/:id
 * @access  Private (Admin only)
 */
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const updateResult = await query(
      "UPDATE services SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service deactivated successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deactivating service",
    });
  }
};

/**
 * @desc    Get services by category
 * @route   GET /api/services/category/:category
 * @access  Public
 */
const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const servicesResult = await query(
      `SELECT id, name, description, base_price, duration_hours, category, created_at
       FROM services
       WHERE category = $1 AND is_active = true
       ORDER BY name
       LIMIT $2 OFFSET $3`,
      [category, limit, offset]
    );

    // Get total count for pagination
    const countResult = await query(
      "SELECT COUNT(*) as total FROM services WHERE category = $1 AND is_active = true",
      [category]
    );

    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: servicesResult.rows,
      category,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get services by category error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving services by category",
    });
  }
};

/**
 * @desc    Get service pricing with potential discounts
 * @route   GET /api/services/:id/pricing
 * @access  Public
 */
const getServicePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { hours = 1, userId } = req.query;

    const serviceResult = await query(
      "SELECT id, name, base_price, duration_hours FROM services WHERE id = $1 AND is_active = true",
      [id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    const service = serviceResult.rows[0];
    const basePrice = parseFloat(service.base_price);
    const requestedHours = parseInt(hours);

    // Calculate base pricing
    let totalPrice = basePrice * requestedHours;
    let discountAmount = 0;
    let discountReason = null;
    let membershipTier = null;

    // Check for active membership if userId is provided
    if (userId) {
      const membershipResult = await query(
        `SELECT * FROM memberships 
         WHERE user_id = $1 AND status = 'active' 
         AND current_period_end > NOW() AND cancel_at_period_end = false`,
        [userId]
      );

      if (membershipResult.rows.length > 0) {
        const membership = membershipResult.rows[0];
        membershipTier = membership.tier;
        const membershipDiscount = parseFloat(membership.discount_percentage);
        discountAmount = totalPrice * (membershipDiscount / 100);
        discountReason = `${membership.plan_name} ${membershipDiscount}% Discount`;
      }
    }

    // Apply bulk hour discounts if no membership discount
    if (requestedHours >= 4 && discountAmount === 0) {
      const bulkDiscount = totalPrice * 0.1; // 10% discount for 4+ hours
      discountAmount = bulkDiscount;
      discountReason = "Bulk Hours Discount (4+ hours)";
    }

    const finalPrice = totalPrice - discountAmount;

    res.json({
      success: true,
      pricing: {
        service: {
          id: service.id,
          name: service.name,
          basePricePerHour: basePrice,
          standardDuration: service.duration_hours,
        },
        calculation: {
          requestedHours,
          subtotal: totalPrice,
          discountAmount: Math.round(discountAmount * 100) / 100,
          discountPercentage:
            discountAmount > 0
              ? Math.round((discountAmount / totalPrice) * 100 * 100) / 100
              : 0,
          discountReason,
          total: Math.round(finalPrice * 100) / 100,
          membershipTier,
          hasMembership: membershipTier !== null,
        },
      },
    });
  } catch (error) {
    console.error("Get service pricing error:", error);
    res.status(500).json({
      success: false,
      error: "Server error calculating service pricing",
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getServicePricing,
};
