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
  // Admin functions are disabled:
  // adminDeleteReview,
  // createAdminReview,
  // updateAdminReview,
  // getAdminReviewDashboard,
  // getAdminCreatedReviews,
  // bulkCreateAdminReviews,
} = require("../controllers/reviewsController");
const { auth, authorize } = require("../middleware/auth");
const {
  validate,
  reviewSchema,
  // Admin validation schemas are disabled:
  // adminReviewSchema,
  // bulkAdminReviewSchema,
  // updateAdminReviewSchema,
} = require("../middleware/validation");

const router = express.Router();

// Public routes
router.get("/", getAllReviews); // Public endpoint to get all reviews
router.get("/cleaner/:cleanerId", getCleanerReviews);

// Customer routes (protected)
router.post(
  "/",
  auth,
  authorize(["customer"]),
  validate(reviewSchema),
  createReview
);
router.get("/my-reviews", auth, authorize(["customer"]), getMyReviews);
router.get(
  "/can-review/:bookingId",
  auth,
  authorize(["customer"]),
  canReviewBooking
);
router.put("/:id", auth, authorize(["customer"]), updateReview);
router.delete("/:id", auth, authorize(["customer"]), deleteReview);

// Admin routes (protected) - DISABLED
// router.get("/admin/all", auth, authorize("admin"), getAllReviews);
// router.get(
//   "/admin/dashboard",
//   auth,
//   authorize("admin"),
//   getAdminReviewDashboard
// );
// router.get(
//   "/admin/admin-reviews",
//   auth,
//   authorize("admin"),
//   getAdminCreatedReviews
// );
// router.post(
//   "/admin/create",
//   auth,
//   authorize("admin"),
//   validate(adminReviewSchema),
//   createAdminReview
// );
// router.post(
//   "/admin/bulk-create",
//   auth,
//   authorize("admin"),
//   validate(bulkAdminReviewSchema),
//   bulkCreateAdminReviews
// );
// router.put(
//   "/admin/:id",
//   auth,
//   authorize("admin"),
//   validate(updateAdminReviewSchema),
//   updateAdminReview
// );
// router.put(
//   "/admin/:id/toggle-visibility",
//   auth,
//   authorize("admin"),
//   toggleReviewVisibility
// );
// router.delete("/admin/:id", auth, authorize("admin"), adminDeleteReview);

// Placeholder route to prevent 404 errors
router.get("/admin/dashboard", auth, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Admin review feature is currently disabled",
    dashboard: {
      statistics: {
        total_reviews: 0,
        admin_reviews: 0,
        customer_reviews: 0,
        visible_reviews: 0,
        hidden_reviews: 0,
        average_rating: 0
      },
      recentActions: [],
      topAdminReviewedCleaners: []
    }
  });
});

module.exports = router;
