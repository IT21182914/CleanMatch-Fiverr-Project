const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
  validate,
  adminTicketStatusSchema,
  adminTicketAssignSchema,
  adminTicketReplySchema,
  adminTicketInvestigateSchema,
  adminTicketResolveSchema,
  adminTicketCloseSchema,
} = require("../middleware/validation");
const {
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
  // Review functions are disabled:
  // getReviews,
  // deleteReview,
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
} = require("../controllers/adminController");

// Admin Reviews Controller (separate from the disabled review system)
const {
  getCleaners,
  createAdminReview,
  getAdminReviews,
  updateAdminReview,
  deleteAdminReview,
  getAdminReviewStats,
} = require("../controllers/adminReviewsController");
const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get("/dashboard", auth, authorize("admin"), getDashboardStats);

// @route   GET /api/admin/users/admins
// @desc    Get admin users for assignment
// @access  Private (Admin only)
router.get("/users/admins", auth, authorize("admin"), getAdminUsers);

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

// @route   GET /api/admin/cleaners/earnings
// @desc    Get cleaner earnings analytics
// @access  Private (Admin only)
router.get("/cleaners/earnings", auth, authorize("admin"), getCleanerEarnings);

// @route   GET /api/admin/cleaners/:id/earnings
// @desc    Get individual cleaner earnings details
// @access  Private (Admin only)
router.get(
  "/cleaners/:id/earnings",
  auth,
  authorize("admin"),
  getCleanerEarningsDetails
);

// @route   GET /api/admin/cleaners/:id/transactions
// @desc    Get cleaner transaction details for monthly payouts
// @access  Private (Admin only)
router.get(
  "/cleaners/:id/transactions",
  auth,
  authorize("admin"),
  getCleanerTransactionDetails
);

// @route   GET /api/admin/analytics/earnings
// @desc    Get earnings analytics summary
// @access  Private (Admin only)
router.get(
  "/analytics/earnings",
  auth,
  authorize("admin"),
  getEarningsAnalytics
);

// @route   GET /api/admin/reviews
// @desc    Get all reviews for moderation - DISABLED
// @access  Private (Admin only)
// router.get("/reviews", auth, authorize("admin"), getReviews);

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete review - DISABLED
// @access  Private (Admin only)
// router.delete("/reviews/:id", auth, authorize("admin"), deleteReview);

// ============= NEW ADMIN REVIEWS SYSTEM (SEPARATE FROM DISABLED SYSTEM) =============

// @route   GET /api/admin/reviews/cleaners
// @desc    Get all cleaners for dropdown selection
// @access  Private (Admin only)
router.get(
  "/reviews/cleaners",
  (req, res, next) => {
    console.log("🔍 Admin cleaners route hit!");
    console.log("Headers:", req.headers.authorization);
    next();
  },
  auth,
  authorize("admin"),
  getCleaners
);

// @route   GET /api/admin/reviews/stats
// @desc    Get admin review statistics
// @access  Private (Admin only)
router.get("/reviews/stats", auth, authorize("admin"), getAdminReviewStats);

// @route   GET /api/admin/reviews
// @desc    Get all admin reviews with pagination
// @access  Private (Admin only)
router.get("/reviews", auth, authorize("admin"), getAdminReviews);

// @route   POST /api/admin/reviews
// @desc    Create a new admin review
// @access  Private (Admin only)
router.post("/reviews", auth, authorize("admin"), createAdminReview);

// @route   PUT /api/admin/reviews/:id
// @desc    Update an admin review
// @access  Private (Admin only)
router.put("/reviews/:id", auth, authorize("admin"), updateAdminReview);

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete an admin review
// @access  Private (Admin only)
router.delete("/reviews/:id", auth, authorize("admin"), deleteAdminReview);

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

// ============= ADMIN TICKET MANAGEMENT ROUTES =============

// @route   GET /api/admin/tickets
// @desc    Get all tickets for admin management
// @access  Private (Admin only)
router.get("/tickets", auth, authorize("admin"), getAdminTickets);

// @route   GET /api/admin/tickets/stats
// @desc    Get ticket statistics
// @access  Private (Admin only)
router.get("/tickets/stats", auth, authorize("admin"), getTicketStats);

// @route   GET /api/admin/tickets/:id
// @desc    Get detailed ticket information for investigation
// @access  Private (Admin only)
router.get("/tickets/:id", auth, authorize("admin"), getTicketDetails);

// @route   PUT /api/admin/tickets/:id/status
// @desc    Update ticket status (Open -> In Progress -> Resolved -> Closed)
// @access  Private (Admin only)
router.put(
  "/tickets/:id/status",
  auth,
  authorize("admin"),
  validate(adminTicketStatusSchema),
  updateTicketStatus
);

// @route   PUT /api/admin/tickets/:id/assign
// @desc    Assign/unassign ticket to admin
// @access  Private (Admin only)
router.put(
  "/tickets/:id/assign",
  auth,
  authorize("admin"),
  validate(adminTicketAssignSchema),
  assignTicket
);

// @route   POST /api/admin/tickets/:id/reply
// @desc    Add admin reply to ticket
// @access  Private (Admin only)
router.post(
  "/tickets/:id/reply",
  auth,
  authorize("admin"),
  validate(adminTicketReplySchema),
  addTicketReply
);

// @route   POST /api/admin/tickets/:id/investigate
// @desc    Record investigation findings and actions taken
// @access  Private (Admin only)
router.post(
  "/tickets/:id/investigate",
  auth,
  authorize("admin"),
  validate(adminTicketInvestigateSchema),
  investigateTicket
);

// @route   POST /api/admin/tickets/:id/resolve
// @desc    Resolve ticket with resolution details
// @access  Private (Admin only)
router.post(
  "/tickets/:id/resolve",
  auth,
  authorize("admin"),
  validate(adminTicketResolveSchema),
  resolveTicket
);

// @route   POST /api/admin/tickets/:id/close
// @desc    Close ticket (final step)
// @access  Private (Admin only)
router.post(
  "/tickets/:id/close",
  auth,
  authorize("admin"),
  validate(adminTicketCloseSchema),
  closeTicket
);

module.exports = router;
