const express = require("express");
const {
  getPublicStats,
  getCoverageAreas,
  getAllStats,
  updateStat,
  resetStatOverride,
  addCoverageArea,
  getAnalyticsDashboard,
} = require("../controllers/statsController");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/public", getPublicStats);
router.get("/coverage", getCoverageAreas);

// Admin routes (protected)
router.get("/admin/all", auth, authorize(["admin"]), getAllStats);
router.put(
  "/admin/:statName",
  auth,
  authorize(["admin"]),
  updateStat
);
router.delete(
  "/admin/:statName/override",
  auth,
  authorize(["admin"]),
  resetStatOverride
);
router.post(
  "/admin/coverage",
  auth,
  authorize(["admin"]),
  addCoverageArea
);
router.get(
  "/admin/analytics",
  auth,
  authorize(["admin"]),
  getAnalyticsDashboard
);

module.exports = router;
