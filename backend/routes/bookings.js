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
  assignCleanerToBooking,
  getCleanerRecommendationsForBooking,
  createBookingReview,
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

// @route   POST /api/bookings/:id/assign
// @desc    Manually assign cleaner to booking
// @access  Private (Admin or Customer)
router.post("/:id/assign", auth, assignCleanerToBooking);

// @route   GET /api/bookings/:id/recommendations
// @desc    Get cleaner recommendations for booking
// @access  Private (Admin or Customer)
router.get("/:id/recommendations", auth, getCleanerRecommendationsForBooking);

// @route   POST /api/bookings/:id/review
// @desc    Add review for completed booking
// @access  Private
router.post("/:id/review", auth, validate(reviewSchema), createBookingReview);

module.exports = router;
