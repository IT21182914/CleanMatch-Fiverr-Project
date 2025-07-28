require("dotenv").config();
const { query, connectDB } = require("../config/database");

const checkCleaners = async () => {
  try {
    await connectDB();

    console.log("Checking users with cleaner role:");
    const cleaners = await query(`
      SELECT id, first_name, last_name, email, zip_code, is_active 
      FROM users 
      WHERE role = 'cleaner'
    `);
    console.log("Cleaners in users table:", cleaners.rows);

    console.log("\nChecking cleaner profiles:");
    const profiles = await query(`
      SELECT cp.*, u.first_name, u.last_name, u.email, u.zip_code
      FROM cleaner_profiles cp
      JOIN users u ON cp.user_id = u.id
    `);
    console.log("Cleaner profiles:", profiles.rows);

    console.log("\nChecking cleaner availability for sample booking:");
    const testBooking = {
      zipCode: "10001",
      bookingDate: "2025-07-17",
      bookingTime: "10:00",
      durationHours: 2,
    };

    const availableCleaners = await query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.zip_code,
        cp.hourly_rate,
        cp.service_radius,
        cp.rating,
        cp.total_jobs,
        cp.is_available,
        cp.background_check_status
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND u.is_active = true 
        AND cp.is_available = true
        AND cp.background_check_status = 'approved'
    `);

    console.log("Available cleaners for booking:", availableCleaners.rows);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkCleaners();
