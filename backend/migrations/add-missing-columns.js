const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: "db.vywkpkvvcqibfoskbnga.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "Dilan@789",
  ssl: { rejectUnauthorized: false },
});

async function addMissingColumns() {
  console.log("🔧 Adding missing columns to bookings table...");

  try {
    // Add missing columns to bookings table
    const alterTableSQL = `
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS assignment_attempts INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS assigned_by_admin BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS admin_override_reason TEXT;
    `;

    await pool.query(alterTableSQL);
    console.log("✅ Missing columns added to bookings table");

    // Add metadata column to notifications
    const alterNotificationsSQL = `
      ALTER TABLE notifications 
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `;

    await pool.query(alterNotificationsSQL);
    console.log("✅ metadata column added to notifications table");

    // Add last_active and completion_rate to cleaner_profiles
    const alterCleanerProfilesSQL = `
      ALTER TABLE cleaner_profiles 
      ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 0.00;
    `;

    await pool.query(alterCleanerProfilesSQL);
    console.log("✅ Missing columns added to cleaner_profiles table");

    console.log("🎉 All missing columns added successfully!");
  } catch (error) {
    console.error("❌ Error adding columns:", error.message);
  } finally {
    await pool.end();
  }
}

addMissingColumns();
