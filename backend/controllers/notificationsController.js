const { query } = require("../config/database");

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE user_id = $1";
    const queryParams = [req.user.id];
    let paramCount = 2;

    if (unread_only === "true") {
      whereClause += " AND is_read = false";
    }

    const notificationsQuery = `
      SELECT id, title, message, type, is_read, created_at
      FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);

    const notificationsResult = await query(notificationsQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notifications
      ${whereClause}
    `;

    // For count query, we only need the filter parameters, not LIMIT and OFFSET
    const countParams = queryParams.slice(0, -2); // Remove the last 2 params (limit and offset)
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Get unread count
    const unreadCountResult = await query(
      "SELECT COUNT(*) as unread FROM notifications WHERE user_id = $1 AND is_read = false",
      [req.user.id]
    );
    const unreadCount = parseInt(unreadCountResult.rows[0].unread);

    res.json({
      success: true,
      notifications: notificationsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving notifications",
    });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updateResult = await query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating notification",
    });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false",
      [req.user.id]
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating notifications",
    });
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteResult = await query(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting notification",
    });
  }
};

/**
 * @desc    Create notification (internal function)
 * @param   {number} userId - User ID to send notification to
 * @param   {string} title - Notification title
 * @param   {string} message - Notification message
 * @param   {string} type - Notification type
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (userId, title, message, type) => {
  try {
    const result = await query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, title, message, type]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * @desc    Send system-wide announcement (Admin only)
 * @route   POST /api/notifications/announcement
 * @access  Private (Admin only)
 */
const sendAnnouncement = async (req, res) => {
  try {
    const { title, message, userRole = "all" } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: "Title and message are required",
      });
    }

    // Get target users based on role filter
    let userQuery = "SELECT id FROM users WHERE is_active = true";
    const queryParams = [];

    if (userRole !== "all") {
      userQuery += " AND role = $1";
      queryParams.push(userRole);
    }

    const usersResult = await query(userQuery, queryParams);
    const userIds = usersResult.rows.map((user) => user.id);

    // Create notifications for all target users
    const notificationPromises = userIds.map((userId) =>
      createNotification(userId, title, message, "announcement")
    );

    await Promise.all(notificationPromises);

    res.json({
      success: true,
      message: `Announcement sent to ${userIds.length} users`,
      recipientCount: userIds.length,
    });
  } catch (error) {
    console.error("Send announcement error:", error);
    res.status(500).json({
      success: false,
      error: "Server error sending announcement",
    });
  }
};

/**
 * @desc    Get notification statistics (Admin only)
 * @route   GET /api/notifications/stats
 * @access  Private (Admin only)
 */
const getNotificationStats = async (req, res) => {
  try {
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_notifications,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread_notifications,
        COUNT(CASE WHEN type = 'booking_reminder' THEN 1 END) as booking_reminders,
        COUNT(CASE WHEN type = 'booking_completed' THEN 1 END) as booking_completed,
        COUNT(CASE WHEN type = 'announcement' THEN 1 END) as announcements,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as last_24_hours
      FROM notifications
    `);

    const typeStatsResult = await query(`
      SELECT 
        type,
        COUNT(*) as count,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count
      FROM notifications
      GROUP BY type
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      stats: statsResult.rows[0],
      typeBreakdown: typeStatsResult.rows,
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving notification statistics",
    });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification,
  sendAnnouncement,
  getNotificationStats,
};
