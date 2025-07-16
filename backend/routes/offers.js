const express = require("express");
const {
  getActiveOffers,
  checkFirstCleanEligibility,
  calculateFirstCleanPricing,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getOfferAnalytics,
} = require("../controllers/offersController");
const { authenticateToken, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getActiveOffers);

// Customer routes (protected)
router.get(
  "/first-clean/eligibility",
  authenticateToken,
  authorize(["customer"]),
  checkFirstCleanEligibility
);
router.post(
  "/first-clean/calculate",
  authenticateToken,
  authorize(["customer"]),
  calculateFirstCleanPricing
);

// Admin routes (protected)
router.get("/admin/all", authenticateToken, authorize(["admin"]), getAllOffers);
router.post("/admin", authenticateToken, authorize(["admin"]), createOffer);
router.put("/admin/:id", authenticateToken, authorize(["admin"]), updateOffer);
router.delete(
  "/admin/:id",
  authenticateToken,
  authorize(["admin"]),
  deleteOffer
);
router.get(
  "/admin/analytics",
  authenticateToken,
  authorize(["admin"]),
  getOfferAnalytics
);

module.exports = router;
