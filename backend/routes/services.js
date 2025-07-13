const express = require("express");
const { query } = require("../config/database");
const { auth, authorize, optionalAuth } = require("../middleware/auth");
const { validate, serviceSchema } = require("../middleware/validation");
const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services
// @access  Public
router.get("/", optionalAuth, async (req, res) => {
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

    const countResult = await query(
      countQuery,
      queryParams.slice(0, paramCount - 2)
    );
    const total = parseInt(countResult.rows[0].total);

    // Get unique categories
    const categoriesResult = await query(
      "SELECT DISTINCT category FROM services WHERE is_active = true ORDER BY category"
    );

    res.json({
      success: true,
      services: servicesResult.rows,
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
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get("/:id", async (req, res) => {
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
      service: serviceResult.rows[0],
    });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving service",
    });
  }
});

// @route   POST /api/services
// @desc    Create new service
// @access  Private (Admin only)
router.post(
  "/",
  auth,
  authorize("admin"),
  validate(serviceSchema),
  async (req, res) => {
    try {
      const { name, description, basePrice, durationHours, category } =
        req.body;

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
  }
);

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private (Admin only)
router.put(
  "/:id",
  auth,
  authorize("admin"),
  validate(serviceSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, basePrice, durationHours, category } =
        req.body;

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
  }
);

// @route   DELETE /api/services/:id
// @desc    Deactivate service (soft delete)
// @access  Private (Admin only)
router.delete("/:id", auth, authorize("admin"), async (req, res) => {
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
});

// @route   GET /api/services/category/:category
// @desc    Get services by category
// @access  Public
router.get("/category/:category", async (req, res) => {
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
      services: servicesResult.rows,
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
});

// @route   GET /api/services/:id/pricing
// @desc    Get service pricing with potential discounts
// @access  Public
router.get("/:id/pricing", async (req, res) => {
  try {
    const { id } = req.params;
    const { hours = 1, membershipTier } = req.query;

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

    // Apply membership discounts
    if (membershipTier) {
      switch (membershipTier.toLowerCase()) {
        case "premium":
          discountAmount = totalPrice * 0.15; // 15% discount
          discountReason = "Premium Membership Discount";
          break;
        case "gold":
          discountAmount = totalPrice * 0.1; // 10% discount
          discountReason = "Gold Membership Discount";
          break;
        case "silver":
          discountAmount = totalPrice * 0.05; // 5% discount
          discountReason = "Silver Membership Discount";
          break;
      }
    }

    // Apply bulk hour discounts
    if (requestedHours >= 4 && !membershipTier) {
      const bulkDiscount = totalPrice * 0.1; // 10% discount for 4+ hours
      if (bulkDiscount > discountAmount) {
        discountAmount = bulkDiscount;
        discountReason = "Bulk Hours Discount (4+ hours)";
      }
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
          discountReason,
          total: Math.round(finalPrice * 100) / 100,
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
});

module.exports = router;
