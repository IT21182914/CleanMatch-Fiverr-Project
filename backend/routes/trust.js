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
const { authenticateToken, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/public", getTrustIndicators);
router.get("/testimonials/featured", getFeaturedTestimonials);
router.get("/badges/:type", getBadgesByType);

// Admin routes for badges
router.get(
  "/admin/badges",
  authenticateToken,
  authorize(["admin"]),
  getAllBadges
);
router.post(
  "/admin/badges",
  authenticateToken,
  authorize(["admin"]),
  createBadge
);
router.put(
  "/admin/badges/:id",
  authenticateToken,
  authorize(["admin"]),
  updateBadge
);
router.delete(
  "/admin/badges/:id",
  authenticateToken,
  authorize(["admin"]),
  deleteBadge
);

// Admin routes for testimonials
router.get(
  "/admin/testimonials",
  authenticateToken,
  authorize(["admin"]),
  getAllTestimonials
);
router.post(
  "/admin/testimonials",
  authenticateToken,
  authorize(["admin"]),
  createTestimonial
);
router.put(
  "/admin/testimonials/:id",
  authenticateToken,
  authorize(["admin"]),
  updateTestimonial
);
router.delete(
  "/admin/testimonials/:id",
  authenticateToken,
  authorize(["admin"]),
  deleteTestimonial
);
router.post(
  "/admin/testimonials/import/:reviewId",
  authenticateToken,
  authorize(["admin"]),
  importTestimonialFromReview
);

module.exports = router;
