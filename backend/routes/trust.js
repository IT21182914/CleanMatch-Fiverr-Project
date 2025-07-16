const express = require("express");
const {
  getTrustIndicators,
  getFeaturedTestimonials,
  getBadgesByType,
  getAllBadges,
  createBadge,
  updateBadge,
  deleteBadge,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  importTestimonialFromReview,
} = require("../controllers/trustController");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/public", getTrustIndicators);
router.get("/testimonials/featured", getFeaturedTestimonials);
router.get("/badges/:type", getBadgesByType);

// Admin routes for badges
router.get(
  "/admin/badges",
  auth,
  authorize(["admin"]),
  getAllBadges
);
router.post(
  "/admin/badges",
  auth,
  authorize(["admin"]),
  createBadge
);
router.put(
  "/admin/badges/:id",
  auth,
  authorize(["admin"]),
  updateBadge
);
router.delete(
  "/admin/badges/:id",
  auth,
  authorize(["admin"]),
  deleteBadge
);

// Admin routes for testimonials
router.get(
  "/admin/testimonials",
  auth,
  authorize(["admin"]),
  getAllTestimonials
);
router.post(
  "/admin/testimonials",
  auth,
  authorize(["admin"]),
  createTestimonial
);
router.put(
  "/admin/testimonials/:id",
  auth,
  authorize(["admin"]),
  updateTestimonial
);
router.delete(
  "/admin/testimonials/:id",
  auth,
  authorize(["admin"]),
  deleteTestimonial
);
router.post(
  "/admin/testimonials/import/:reviewId",
  auth,
  authorize(["admin"]),
  importTestimonialFromReview
);

module.exports = router;
