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
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getActiveOffers);

// Customer routes (protected)
router.get(
  "/first-clean/eligibility",
  auth,
  authorize(["customer"]),
  checkFirstCleanEligibility
);
router.post(
  "/first-clean/calculate",
  auth,
  authorize(["customer"]),
  calculateFirstCleanPricing
);

// Admin routes (protected)
router.get("/admin/all", auth, authorize(["admin"]), getAllOffers);
router.post("/admin", auth, authorize(["admin"]), createOffer);
router.put("/admin/:id", auth, authorize(["admin"]), updateOffer);
router.delete(
  "/admin/:id",
  auth,
  authorize(["admin"]),
  deleteOffer
);
router.get(
  "/admin/analytics",
  auth,
  authorize(["admin"]),
  getOfferAnalytics
);

module.exports = router;
