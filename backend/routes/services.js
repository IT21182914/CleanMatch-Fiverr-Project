const express = require("express");
const { auth, authorize, optionalAuth } = require("../middleware/auth");
const { validate, serviceSchema } = require("../middleware/validation");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getServicePricing,
} = require("../controllers/servicesController");
const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services
// @access  Public
router.get("/", optionalAuth, getServices);

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get("/:id", getServiceById);

// @route   POST /api/services
// @desc    Create new service
// @access  Private (Admin only)
router.post(
  "/",
  auth,
  authorize("admin"),
  validate(serviceSchema),
  createService
);

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private (Admin only)
router.put(
  "/:id",
  auth,
  authorize("admin"),
  validate(serviceSchema),
  updateService
);

// @route   DELETE /api/services/:id
// @desc    Deactivate service (soft delete)
// @access  Private (Admin only)
router.delete("/:id", auth, authorize("admin"), deleteService);

// @route   GET /api/services/category/:category
// @desc    Get services by category
// @access  Public
router.get("/category/:category", getServicesByCategory);

// @route   GET /api/services/:id/pricing
// @desc    Get service pricing with potential discounts
// @access  Public
router.get("/:id/pricing", getServicePricing);

module.exports = router;
