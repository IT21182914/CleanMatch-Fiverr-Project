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
  createAdminReview,
  updateAdminReview,
  getAdminReviewDashboard,
  getAdminCreatedReviews,
  bulkCreateAdminReviews,
} = require("../controllers/reviewsController");
const { auth, authorize } = require("../middleware/auth");
const { 
  validate, 
  reviewSchema, 
  adminReviewSchema, 
  bulkAdminReviewSchema,
  updateAdminReviewSchema 
} = require("../middleware/validation");

const router = express.Router();

// Public routes
router.get("/cleaner/:cleanerId", getCleanerReviews);

// Customer routes (protected)
router.post("/", auth, authorize(["customer"]), validate(reviewSchema), createReview);
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
router.get("/admin/dashboard", auth, authorize(["admin"]), getAdminReviewDashboard);
router.get("/admin/admin-reviews", auth, authorize(["admin"]), getAdminCreatedReviews);
router.post("/admin/create", auth, authorize(["admin"]), validate(adminReviewSchema), createAdminReview);
router.post("/admin/bulk-create", auth, authorize(["admin"]), validate(bulkAdminReviewSchema), bulkCreateAdminReviews);
router.put("/admin/:id", auth, authorize(["admin"]), validate(updateAdminReviewSchema), updateAdminReview);
router.put(
  "/admin/:id/toggle-visibility",
  auth,
  authorize(["admin"]),
  toggleReviewVisibility
);
router.delete("/admin/:id", auth, authorize(["admin"]), adminDeleteReview);

module.exports = router;
