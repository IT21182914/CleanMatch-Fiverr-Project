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
const { authenticateToken, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/public", getPublicStats);
router.get("/coverage", getCoverageAreas);

// Admin routes (protected)
router.get("/admin/all", authenticateToken, authorize(["admin"]), getAllStats);
router.put(
  "/admin/:statName",
  authenticateToken,
  authorize(["admin"]),
  updateStat
);
router.delete(
  "/admin/:statName/override",
  authenticateToken,
  authorize(["admin"]),
  resetStatOverride
);
router.post(
  "/admin/coverage",
  authenticateToken,
  authorize(["admin"]),
  addCoverageArea
);
router.get(
  "/admin/analytics",
  authenticateToken,
  authorize(["admin"]),
  getAnalyticsDashboard
);

module.exports = router;
