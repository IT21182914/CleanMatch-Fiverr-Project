const express = require("express");
const {
  createReview,
  getCleanerReviews,
  getMyReviews,
  canReviewBooking,
  updateReview,
  deleteReview,
  getAllReviews,
  toggleReviewVisibility,
  adminDeleteReview,
} = require("../controllers/reviewsController");
const { authenticateToken, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/cleaner/:cleanerId", getCleanerReviews);

// Customer routes (protected)
router.post("/", authenticateToken, authorize(["customer"]), createReview);
router.get(
  "/my-reviews",
  authenticateToken,
  authorize(["customer"]),
  getMyReviews
);
router.get(
  "/can-review/:bookingId",
  authenticateToken,
  authorize(["customer"]),
  canReviewBooking
);
router.put("/:id", authenticateToken, authorize(["customer"]), updateReview);
router.delete("/:id", authenticateToken, authorize(["customer"]), deleteReview);

// Admin routes (protected)
router.get(
  "/admin/all",
  authenticateToken,
  authorize(["admin"]),
  getAllReviews
);
router.put(
  "/admin/:id/toggle-visibility",
  authenticateToken,
  authorize(["admin"]),
  toggleReviewVisibility
);
router.delete(
  "/admin/:id",
  authenticateToken,
  authorize(["admin"]),
  adminDeleteReview
);

module.exports = router;
