const cron = require("node-cron");
const { query } = require("../config/database");

/**
 * Update expired memberships
 * Runs daily at 2 AM to check for memberships that have passed their period end date
 */
const updateExpiredMemberships = async () => {
  try {
    console.log("🕒 Running membership expiration check...");

    // Find memberships that should be expired
    const expiredMemberships = await query(`
      UPDATE memberships 
      SET status = 'expired', updated_at = CURRENT_TIMESTAMP 
      WHERE status = 'active' 
        AND current_period_end < NOW() 
        AND NOT cancel_at_period_end
      RETURNING id, user_id, plan_name
    `);

    if (expiredMemberships.rows.length > 0) {
      console.log(
        `✅ Updated ${expiredMemberships.rows.length} expired memberships`
      );

      // Optionally, we could send notifications to expired members
      for (const membership of expiredMemberships.rows) {
        // Create a notification for the user about their expired membership
        await query(
          `
          INSERT INTO notifications (user_id, title, message, type)
          VALUES ($1, $2, $3, $4)
        `,
          [
            membership.user_id,
            "Membership Expired",
            `Your ${membership.plan_name} membership has expired. Renew now to continue enjoying member benefits and savings!`,
            "membership_expired",
          ]
        );
      }
    } else {
      console.log("✅ No memberships to expire");
    }

    // Also check for memberships that should be cancelled (cancel_at_period_end = true and period has ended)
    const cancelledMemberships = await query(`
      UPDATE memberships 
      SET status = 'cancelled', end_date = current_period_end, updated_at = CURRENT_TIMESTAMP 
      WHERE status IN ('active', 'trialing') 
        AND cancel_at_period_end = true 
        AND current_period_end < NOW()
      RETURNING id, user_id, plan_name
    `);

    if (cancelledMemberships.rows.length > 0) {
      console.log(
        `✅ Cancelled ${cancelledMemberships.rows.length} memberships at period end`
      );
    }
  } catch (error) {
    console.error("❌ Error updating expired memberships:", error);
  }
};

/**
 * Send membership renewal reminders
 * Runs daily to check for memberships expiring within 3 days
 */
const sendRenewalReminders = async () => {
  try {
    console.log("📧 Checking for membership renewal reminders...");

    // Find active memberships expiring within 3 days
    const expiringMemberships = await query(`
      SELECT m.id, m.user_id, m.plan_name, m.current_period_end, u.first_name, u.email
      FROM memberships m
      JOIN users u ON m.user_id = u.id
      WHERE m.status = 'active'
        AND m.current_period_end > NOW()
        AND m.current_period_end <= NOW() + INTERVAL '3 days'
        AND NOT m.cancel_at_period_end
        AND NOT EXISTS (
          SELECT 1 FROM notifications n 
          WHERE n.user_id = m.user_id 
            AND n.type = 'membership_renewal_reminder'
            AND n.created_at > NOW() - INTERVAL '7 days'
        )
    `);

    if (expiringMemberships.rows.length > 0) {
      console.log(
        `📧 Sending renewal reminders to ${expiringMemberships.rows.length} members`
      );

      for (const membership of expiringMemberships.rows) {
        const expirationDate = new Date(
          membership.current_period_end
        ).toLocaleDateString();

        // Create notification
        await query(
          `
          INSERT INTO notifications (user_id, title, message, type)
          VALUES ($1, $2, $3, $4)
        `,
          [
            membership.user_id,
            "Membership Renewal Reminder",
            `Hi ${membership.first_name}, your ${membership.plan_name} membership expires on ${expirationDate}. Update your payment method to continue enjoying 50% savings on all services!`,
            "membership_renewal_reminder",
          ]
        );
      }
    } else {
      console.log("✅ No renewal reminders needed");
    }
  } catch (error) {
    console.error("❌ Error sending renewal reminders:", error);
  }
};

/**
 * Clean up old membership usage data (optional)
 * Runs monthly to clean up very old membership usage data
 */
const cleanupOldMembershipData = async () => {
  try {
    console.log("🧹 Cleaning up old membership usage data...");

    // Keep only the last 24 months of membership usage data
    const cleanupResult = await query(`
      DELETE FROM membership_usage 
      WHERE created_at < NOW() - INTERVAL '24 months'
    `);

    if (cleanupResult.rowCount > 0) {
      console.log(
        `🧹 Cleaned up ${cleanupResult.rowCount} old membership usage records`
      );
    } else {
      console.log("✅ No old membership usage data to clean up");
    }
  } catch (error) {
    console.error("❌ Error cleaning up old membership data:", error);
  }
};

/**
 * Initialize membership scheduler
 */
const initMembershipScheduler = () => {
  console.log("🚀 Initializing membership scheduler...");

  // Run membership expiration check daily at 2:00 AM
  cron.schedule("0 2 * * *", updateExpiredMemberships, {
    name: "membershipExpirationCheck",
    timezone: "America/New_York",
  });

  // Run renewal reminders daily at 10:00 AM
  cron.schedule("0 10 * * *", sendRenewalReminders, {
    name: "membershipRenewalReminders",
    timezone: "America/New_York",
  });

  // Run cleanup monthly on the 1st at 3:00 AM
  cron.schedule("0 3 1 * *", cleanupOldMembershipData, {
    name: "membershipDataCleanup",
    timezone: "America/New_York",
  });

  console.log("✅ Membership scheduler initialized");

  // Run initial check when server starts (optional)
  setTimeout(() => {
    updateExpiredMemberships();
  }, 5000); // Wait 5 seconds after server start
};

/**
 * Stop membership scheduler (for testing or graceful shutdown)
 */
const stopMembershipScheduler = () => {
  const tasks = cron.getTasks();
  tasks.forEach((task, name) => {
    if (name.includes("membership")) {
      task.stop();
      console.log(`🛑 Stopped scheduler task: ${name}`);
    }
  });
};

module.exports = {
  initMembershipScheduler,
  stopMembershipScheduler,
  updateExpiredMemberships,
  sendRenewalReminders,
  cleanupOldMembershipData,
};
