const cron = require("node-cron");
const { query } = require("../config/database");
const { sendBookingReminderEmail } = require("./email");
const { initMembershipScheduler } = require("./membershipScheduler");

/**
 * Initialize all cron jobs
 */
const initializeCronJobs = () => {
  if (process.env.ENABLE_CRON_JOBS !== "true") {
    console.log("Cron jobs are disabled");
    return;
  }

  console.log("Initializing cron jobs...");

  // Send booking reminders daily at 9 AM
  cron.schedule("0 9 * * *", sendBookingReminders, {
    scheduled: true,
    timezone: "America/New_York",
  });

  // Update cleaner ratings daily at midnight
  cron.schedule("0 0 * * *", updateCleanerRatings, {
    scheduled: true,
    timezone: "America/New_York",
  });

  // Clean up old notifications weekly on Sunday at 2 AM
  cron.schedule("0 2 * * 0", cleanupOldNotifications, {
    scheduled: true,
    timezone: "America/New_York",
  });

  // Auto-complete overdue bookings daily at 11 PM
  cron.schedule("0 23 * * *", autoCompleteOverdueBookings, {
    scheduled: true,
    timezone: "America/New_York",
  });

  // Initialize membership scheduler
  initMembershipScheduler();

  console.log("✅ Cron jobs initialized successfully");
};

/**
 * Send booking reminders for appointments happening tomorrow
 */
const sendBookingReminders = async () => {
  try {
    console.log("Running booking reminders job...");

    // Get bookings for tomorrow that are confirmed
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    const bookingsResult = await query(
      `
      SELECT 
        b.*, 
        customer.first_name as customer_first_name, customer.last_name as customer_last_name,
        customer.email as customer_email, customer.phone as customer_phone,
        cleaner.first_name as cleaner_first_name, cleaner.last_name as cleaner_last_name,
        cleaner.email as cleaner_email, cleaner.phone as cleaner_phone,
        s.name as service_name
      FROM bookings b
      JOIN users customer ON b.customer_id = customer.id
      LEFT JOIN users cleaner ON b.cleaner_id = cleaner.id
      JOIN services s ON b.service_id = s.id
      WHERE b.booking_date = $1 
        AND b.status = 'confirmed'
        AND cleaner.id IS NOT NULL
    `,
      [tomorrowDate]
    );

    console.log(`Found ${bookingsResult.rows.length} bookings for tomorrow`);

    for (const booking of bookingsResult.rows) {
      const customer = {
        first_name: booking.customer_first_name,
        last_name: booking.customer_last_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
      };

      const cleaner = {
        first_name: booking.cleaner_first_name,
        last_name: booking.cleaner_last_name,
        email: booking.cleaner_email,
        phone: booking.cleaner_phone,
      };

      await sendBookingReminderEmail(booking, customer, cleaner);

      // Create notifications
      await query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)
      `,
        [
          booking.customer_id,
          "Booking Reminder",
          `Your cleaning service is scheduled for tomorrow at ${booking.booking_time}`,
          "booking_reminder",
          booking.cleaner_id,
          "Booking Reminder",
          `You have a cleaning appointment tomorrow at ${booking.booking_time}`,
          "booking_reminder",
        ]
      );
    }

    console.log("✅ Booking reminders job completed");
  } catch (error) {
    console.error("❌ Error in booking reminders job:", error);
  }
};

/**
 * Update cleaner ratings based on recent reviews
 */
const updateCleanerRatings = async () => {
  try {
    console.log("Running cleaner ratings update job...");

    const updateQuery = `
      UPDATE cleaner_profiles 
      SET rating = subquery.avg_rating,
          total_jobs = subquery.total_jobs
      FROM (
        SELECT 
          cp.user_id,
          COALESCE(AVG(r.rating), 0) as avg_rating,
          COUNT(DISTINCT b.id) as total_jobs
        FROM cleaner_profiles cp
        LEFT JOIN bookings b ON cp.user_id = b.cleaner_id AND b.status = 'completed'
        LEFT JOIN reviews r ON b.id = r.booking_id AND r.reviewee_id = cp.user_id
        GROUP BY cp.user_id
      ) as subquery
      WHERE cleaner_profiles.user_id = subquery.user_id
    `;

    const result = await query(updateQuery);
    console.log(`✅ Updated ratings for ${result.rowCount} cleaners`);
  } catch (error) {
    console.error("❌ Error in cleaner ratings update job:", error);
  }
};

/**
 * Clean up old notifications (older than 30 days)
 */
const cleanupOldNotifications = async () => {
  try {
    console.log("Running notifications cleanup job...");

    const result = await query(`
      DELETE FROM notifications 
      WHERE created_at < NOW() - INTERVAL '30 days'
    `);

    console.log(`✅ Cleaned up ${result.rowCount} old notifications`);
  } catch (error) {
    console.error("❌ Error in notifications cleanup job:", error);
  }
};

/**
 * Auto-complete bookings that are overdue (24 hours past scheduled end time)
 */
const autoCompleteOverdueBookings = async () => {
  try {
    console.log("Running auto-complete overdue bookings job...");

    const overdueBookingsResult = await query(`
      SELECT id, customer_id, cleaner_id 
      FROM bookings 
      WHERE status = 'in_progress' 
        AND (booking_date + booking_time + INTERVAL '1 hour' * duration_hours + INTERVAL '24 hours') < NOW()
    `);

    console.log(`Found ${overdueBookingsResult.rows.length} overdue bookings`);

    for (const booking of overdueBookingsResult.rows) {
      // Update booking status to completed
      await query(
        `
        UPDATE bookings 
        SET status = 'completed', updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1
      `,
        [booking.id]
      );

      // Create notifications
      if (booking.customer_id) {
        await query(
          `
          INSERT INTO notifications (user_id, title, message, type)
          VALUES ($1, $2, $3, $4)
        `,
          [
            booking.customer_id,
            "Booking Completed",
            "Your cleaning service has been automatically marked as completed. Please rate your experience!",
            "booking_completed",
          ]
        );
      }

      if (booking.cleaner_id) {
        await query(
          `
          INSERT INTO notifications (user_id, title, message, type)
          VALUES ($1, $2, $3, $4)
        `,
          [
            booking.cleaner_id,
            "Booking Completed",
            "Your cleaning service has been automatically marked as completed.",
            "booking_completed",
          ]
        );
      }
    }

    console.log(
      `✅ Auto-completed ${overdueBookingsResult.rows.length} overdue bookings`
    );
  } catch (error) {
    console.error("❌ Error in auto-complete overdue bookings job:", error);
  }
};

/**
 * Generate daily analytics report (can be used for admin dashboard)
 */
const generateDailyAnalytics = async () => {
  try {
    console.log("Generating daily analytics...");

    const today = new Date().toISOString().split("T")[0];

    // Get today's statistics
    const statsResult = await query(
      `
      SELECT 
        COUNT(CASE WHEN created_at::date = $1 THEN 1 END) as new_bookings_today,
        COUNT(CASE WHEN status = 'completed' AND updated_at::date = $1 THEN 1 END) as completed_today,
        SUM(CASE WHEN payment_status = 'paid' AND created_at::date = $1 THEN total_amount ELSE 0 END) as revenue_today,
        COUNT(CASE WHEN status = 'cancelled' AND updated_at::date = $1 THEN 1 END) as cancelled_today
      FROM bookings
    `,
      [today]
    );

    const stats = statsResult.rows[0];

    console.log("📊 Daily Analytics:", {
      newBookings: stats.new_bookings_today,
      completed: stats.completed_today,
      revenue: parseFloat(stats.revenue_today || 0),
      cancelled: stats.cancelled_today,
    });

    // Here you could send this data to an analytics service or dashboard
  } catch (error) {
    console.error("❌ Error generating daily analytics:", error);
  }
};

/**
 * Check for and handle failed payments
 */
const handleFailedPayments = async () => {
  try {
    console.log("Checking for failed payments...");

    // Get bookings with failed payments that are older than 1 hour
    const failedPaymentsResult = await query(`
      SELECT b.*, u.email, u.first_name
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      WHERE b.payment_status = 'failed' 
        AND b.created_at < NOW() - INTERVAL '1 hour'
        AND b.status != 'cancelled'
    `);

    console.log(
      `Found ${failedPaymentsResult.rows.length} bookings with failed payments`
    );

    for (const booking of failedPaymentsResult.rows) {
      // Cancel the booking
      await query(
        `
        UPDATE bookings 
        SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1
      `,
        [booking.id]
      );

      // Create notification
      await query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4)
      `,
        [
          booking.customer_id,
          "Booking Cancelled",
          "Your booking has been cancelled due to payment failure. Please try booking again.",
          "booking_cancelled",
        ]
      );

      console.log(`Cancelled booking ${booking.id} due to failed payment`);
    }
  } catch (error) {
    console.error("❌ Error handling failed payments:", error);
  }
};

module.exports = {
  initializeCronJobs,
  sendBookingReminders,
  updateCleanerRatings,
  cleanupOldNotifications,
  autoCompleteOverdueBookings,
  generateDailyAnalytics,
  handleFailedPayments,
};
