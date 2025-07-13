const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
  validate,
  updateProfileSchema,
  cleanerProfileSchema,
} = require("../middleware/validation");
const {
  getUserProfile,
  updateUserProfile,
  updateCleanerProfile,
  changePassword,
  getUserBookings,
  updateCleanerAvailability,
  getUserReviews,
} = require("../controllers/usersController");
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get("/profile", auth, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, validate(updateProfileSchema), updateUserProfile);

// @route   PUT /api/users/cleaner-profile
// @desc    Update cleaner profile
// @access  Private (Cleaners only)
router.put(
  "/cleaner-profile",
  auth,
  authorize("cleaner"),
  validate(cleanerProfileSchema),
  updateCleanerProfile
);

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", auth, changePassword);

// @route   GET /api/users/bookings
// @desc    Get user's bookings
// @access  Private
router.get("/bookings", auth, getUserBookings);

// @route   PUT /api/users/availability
// @desc    Update cleaner availability status
// @access  Private (Cleaners only)
router.put(
  "/availability",
  auth,
  authorize("cleaner"),
  updateCleanerAvailability
);

// @route   GET /api/users/reviews
// @desc    Get user's reviews
// @access  Private
router.get("/reviews", auth, getUserReviews);

module.exports = router;
