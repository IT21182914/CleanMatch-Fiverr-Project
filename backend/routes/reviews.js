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
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/cleaner/:cleanerId", getCleanerReviews);

// Customer routes (protected)
router.post("/", auth, authorize(["customer"]), createReview);
router.get("/my-reviews", auth, authorize(["customer"]), getMyReviews);
router.get(
  "/can-review/:bookingId",
  auth,
  authorize(["customer"]),
  canReviewBooking
);
router.put("/:id", auth, authorize(["customer"]), updateReview);
router.delete("/:id", auth, authorize(["customer"]), deleteReview);

// Admin routes (protected)
router.get("/admin/all", auth, authorize(["admin"]), getAllReviews);
router.put(
  "/admin/:id/toggle-visibility",
  auth,
  authorize(["admin"]),
  toggleReviewVisibility
);
router.delete("/admin/:id", auth, authorize(["admin"]), adminDeleteReview);

module.exports = router;
