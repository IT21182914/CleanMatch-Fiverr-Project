const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
  validate,
  bookingSchema,
  reviewSchema,
} = require("../middleware/validation");
const {
  createBooking,
  getBookingById,
  updateBookingStatus,
  acceptBookingRequest,
  rejectBookingRequest,
  updateBookingPaymentStatus,
  assignCleanerToBooking,
  getCleanerRecommendationsForBooking,
  getZipBasedRecommendations,
  createBookingReview,
  retryAutoAssignment,
  getBookingAssignmentStatus,
  getNearbyCleanersForBooking,
} = require("../controllers/bookingsController");
const router = express.Router();

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private (Customers only)
router.post(
  "/",
  auth,
  authorize("customer"),
  validate(bookingSchema),
  createBooking
);

// @route   GET /api/bookings/:id
// @desc    Get booking details
// @access  Private
router.get("/:id", auth, getBookingById);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put("/:id/status", auth, updateBookingStatus);

// @route   POST /api/bookings/:id/accept
// @desc    Accept booking request (Cleaner only)
// @access  Private (Cleaner only)
router.post("/:id/accept", auth, authorize("cleaner"), acceptBookingRequest);

// @route   POST /api/bookings/:id/reject
// @desc    Reject booking request (Cleaner only)
// @access  Private (Cleaner only)
router.post("/:id/reject", auth, authorize("cleaner"), rejectBookingRequest);

// @route   PUT /api/bookings/:id/payment_status
// @desc    Update booking payment status
// @access  Private
router.put("/:id/payment-status", auth, updateBookingPaymentStatus);

// @route   POST /api/bookings/:id/assign
// @desc    Manually assign cleaner to booking
// @access  Private (Admin or Customer)
router.post("/:id/assign", auth, assignCleanerToBooking);

// @route   PUT /api/bookings/:id/assign
// @desc    Request/assign cleaner to booking (alternative route)
// @access  Private (Admin or Customer)
router.put("/:id/assign", auth, assignCleanerToBooking);

// @route   POST /api/bookings/:id/retry-assignment
// @desc    Retry auto-assignment for pending bookings
// @access  Private (Admin only)
router.post(
  "/:id/retry-assignment",
  auth,
  authorize("admin"),
  retryAutoAssignment
);

// @route   GET /api/bookings/:id/assignment-status
// @desc    Get booking assignment status and metrics
// @access  Private (Admin or Customer)
router.get("/:id/assignment-status", auth, getBookingAssignmentStatus);

// @route   GET /api/bookings/:id/recommendations
// @desc    Get cleaner recommendations for booking
// @access  Private (Admin or Customer)
router.get("/:id/recommendations", auth, getCleanerRecommendationsForBooking);

// @route   POST /api/bookings/recommendations-by-zip
// @desc    Get cleaner recommendations with ZIP code priority
// @access  Private (Customers/Admins)
router.post("/recommendations-by-zip", auth, getZipBasedRecommendations);

// @route   POST /api/bookings/:id/review
// @desc    Add review for completed booking
// @access  Private
router.post("/:id/review", auth, validate(reviewSchema), createBookingReview);

// @route   GET /api/bookings/:id/nearby-cleaners
// @desc    Get nearby cleaners for booking after payment
// @access  Private
router.get("/:id/nearby-cleaners", auth, getNearbyCleanersForBooking);

module.exports = router;
