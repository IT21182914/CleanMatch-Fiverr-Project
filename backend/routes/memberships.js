const express = require("express");
const cors = require("cors");
const { auth, authorize } = require("../middleware/auth");
const {
  getMembershipPlans,
  subscribeToMembership,
  getCurrentMembership,
  cancelMembership,
  reactivateMembership,
  updatePaymentMethod,
  calculateMembershipPricing,
  getMembershipAnalytics,
  getAllMemberships,
  activateMembership,
  calculateMembershipDiscount,
} = require("../controllers/membershipController");

const router = express.Router();

// @route   GET /api/memberships/plans
// @desc    Get all available membership plans
// @access  Public
router.get("/plans", getMembershipPlans);

// @route   POST /api/memberships/subscribe
// @desc    Subscribe to membership
// @access  Private (Customers only)
router.post("/subscribe", auth, authorize("customer"), subscribeToMembership);

// @route   GET /api/memberships/current
// @desc    Get user's current membership
// @access  Private (Customers only)
// Handle preflight requests for this specific route
router.options("/current", cors());
router.get("/current", auth, authorize("customer"), getCurrentMembership);

// @route   PUT /api/memberships/cancel
// @desc    Cancel membership subscription
// @access  Private (Customers only)
router.put("/cancel", auth, authorize("customer"), cancelMembership);

// @route   PUT /api/memberships/reactivate
// @desc    Reactivate cancelled membership
// @access  Private (Customers only)
router.put("/reactivate", auth, authorize("customer"), reactivateMembership);

// @route   PUT /api/memberships/payment-method
// @desc    Update membership payment method
// @access  Private (Customers only)
router.put("/payment-method", auth, authorize("customer"), updatePaymentMethod);

// @route   PUT /api/memberships/activate
// @desc    Activate membership after successful payment
// @access  Private (Customers only)
router.put("/activate", auth, authorize("customer"), activateMembership);

// @route   POST /api/memberships/calculate-discount
// @desc    Calculate discount for a service price
// @access  Public
router.post("/calculate-discount", (req, res) => {
  try {
    const { membershipTier, servicePrice } = req.body;
    
    if (!membershipTier || !servicePrice) {
      return res.status(400).json({
        success: false,
        error: "membershipTier and servicePrice are required",
      });
    }

    const discount = calculateMembershipDiscount(membershipTier, servicePrice);
    
    res.json({
      success: true,
      discount,
    });
  } catch (error) {
    console.error("Calculate discount error:", error);
    res.status(500).json({
      success: false,
      error: "Server error calculating discount",
    });
  }
});

// @route   POST /api/memberships/calculate-pricing
// @desc    Calculate pricing with membership discount
// @access  Private (Customers only)
router.post(
  "/calculate-pricing",
  auth,
  authorize("customer"),
  calculateMembershipPricing
);

// @route   GET /api/memberships/analytics
// @desc    Get membership analytics
// @access  Private (Admin only)
router.get("/analytics", auth, authorize("admin"), getMembershipAnalytics);

// @route   GET /api/memberships/all
// @desc    Get all memberships (admin view)
// @access  Private (Admin only)
router.get("/all", auth, authorize("admin"), getAllMemberships);

module.exports = router;
