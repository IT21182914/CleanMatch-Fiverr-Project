const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendAnnouncement,
  getNotificationStats,
} = require("../controllers/notificationsController");
const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get("/", auth, getUserNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put("/:id/read", auth, markNotificationAsRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put("/read-all", auth, markAllNotificationsAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete("/:id", auth, deleteNotification);

// @route   POST /api/notifications/announcement
// @desc    Send system-wide announcement
// @access  Private (Admin only)
router.post("/announcement", auth, authorize("admin"), sendAnnouncement);

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private (Admin only)
router.get("/stats", auth, authorize("admin"), getNotificationStats);

module.exports = router;
