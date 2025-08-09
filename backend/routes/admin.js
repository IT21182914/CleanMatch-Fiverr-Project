const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
  getDashboardStats,
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
} = require("../controllers/adminController");
const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get("/dashboard", auth, authorize("admin"), getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filters
// @access  Private (Admin only)
router.get("/users", auth, authorize("admin"), getUsers);

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.put("/users/:id/status", auth, authorize("admin"), updateUserStatus);

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters
// @access  Private (Admin only)
router.get("/bookings", auth, authorize("admin"), getBookings);

// @route   PUT /api/admin/cleaners/:id/background-check
// @desc    Update cleaner background check status
// @access  Private (Admin only)
router.put(
  "/cleaners/:id/background-check",
  auth,
  authorize("admin"),
  updateCleanerBackgroundCheck
);

// @route   GET /api/admin/freelancers/pending
// @desc    Get pending freelancers awaiting approval
// @access  Private (Admin only)
router.get(
  "/freelancers/pending",
  auth,
  authorize("admin"),
  getPendingFreelancers
);

// @route   GET /api/admin/freelancers/:id
// @desc    Get freelancer details by ID
// @access  Private (Admin only)
router.get("/freelancers/:id", auth, authorize("admin"), getFreelancerDetails);

// @route   GET /api/admin/payments
// @desc    Get payment analytics
// @access  Private (Admin only)
router.get("/payments", auth, authorize("admin"), getPayments);

// @route   GET /api/admin/analytics/revenue
// @desc    Get revenue analytics
// @access  Private (Admin only)
router.get("/analytics/revenue", auth, authorize("admin"), getRevenueAnalytics);

// @route   GET /api/admin/reviews
// @desc    Get all reviews for moderation
// @access  Private (Admin only)
router.get("/reviews", auth, authorize("admin"), getReviews);

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete review
// @access  Private (Admin only)
router.delete("/reviews/:id", auth, authorize("admin"), deleteReview);

// @route   GET /api/admin/users-with-membership
// @desc    Get all users with membership status
// @access  Private (Admin only)
router.get(
  "/users-with-membership",
  auth,
  authorize("admin"),
  getUsersWithMembership
);

// @route   PUT /api/admin/memberships/:userId/cancel
// @desc    Cancel user membership (Admin)
// @access  Private (Admin only)
router.put(
  "/memberships/:userId/cancel",
  auth,
  authorize("admin"),
  cancelUserMembership
);

// @route   POST /api/admin/memberships/:userId/grant
// @desc    Grant membership to user (Admin)
// @access  Private (Admin only)
router.post(
  "/memberships/:userId/grant",
  auth,
  authorize("admin"),
  grantUserMembership
);

// @route   GET /api/admin/membership-analytics
// @desc    Get membership analytics for admin
// @access  Private (Admin only)
router.get(
  "/membership-analytics",
  auth,
  authorize("admin"),
  getMembershipAnalytics
);

// @route   GET /api/admin/assignment-metrics
// @desc    Get assignment system metrics and pending bookings
// @access  Private (Admin only)
router.get(
  "/assignment-metrics",
  auth,
  authorize("admin"),
  getAssignmentMetrics
);

module.exports = router;
