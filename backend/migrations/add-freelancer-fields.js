const { query } = require("../config/database");

/**
 * Migration to add freelancer-specific fields to users and cleaner_profiles tables
 */
const addFreelancerFields = async () => {
  try {
    console.log("🔄 Adding freelancer fields to database...");

    // Add user_name field to users table
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS user_name VARCHAR(100) UNIQUE
    `);

    // Add freelancer-specific fields to cleaner_profiles table
    await query(`
      ALTER TABLE cleaner_profiles 
      ADD COLUMN IF NOT EXISTS cleaning_services TEXT[],
      ADD COLUMN IF NOT EXISTS cleaning_frequency VARCHAR(50) DEFAULT 'part-time',
      ADD COLUMN IF NOT EXISTS preferred_hours TEXT,
      ADD COLUMN IF NOT EXISTS message TEXT,
      ADD COLUMN IF NOT EXISTS id_front_url TEXT,
      ADD COLUMN IF NOT EXISTS id_back_url TEXT,
      ADD COLUMN IF NOT EXISTS ssn_front_url TEXT,
      ADD COLUMN IF NOT EXISTS ssn_back_url TEXT,
      ADD COLUMN IF NOT EXISTS agreement_accepted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS terms_1099_accepted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS brings_supplies BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS has_experience BOOLEAN DEFAULT FALSE
    `);

    // Create an index on user_name for faster lookups
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_user_name ON users(user_name)
    `);

    console.log("✅ Freelancer fields added successfully");
  } catch (error) {
    console.error("❌ Error adding freelancer fields:", error);
    throw error;
  }
};

module.exports = { addFreelancerFields };
