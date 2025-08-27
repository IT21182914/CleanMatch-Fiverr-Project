const cron = require("node-cron");
const { cleanupExpiredTokens } = require("../utils/tokenBlacklist");

/**
 * Set up background tasks for token management
 */
const setupTokenCleanupTasks = () => {
  // Clean up expired blacklisted tokens every hour
  cron.schedule("0 * * * *", async () => {
    console.log("🧹 Running token cleanup task...");
    try {
      await cleanupExpiredTokens();
    } catch (error) {
      console.error("❌ Token cleanup task failed:", error);
    }
  });

  console.log("✅ Token cleanup background tasks initialized");
};

module.exports = {
  setupTokenCleanupTasks,
};
