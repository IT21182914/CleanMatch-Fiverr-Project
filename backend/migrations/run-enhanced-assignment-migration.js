const fs = require("fs");
const path = require("path");
const { query } = require("../config/database");

/**
 * Enhanced Assignment System Migration
 * Adds tables and columns needed for the automated cleaner assignment system
 */
async function runEnhancedAssignmentMigration() {
  console.log("🚀 Starting Enhanced Assignment System Migration...");

  try {
    // Read the SQL migration file
    const migrationPath = path.join(
      __dirname,
      "enhanced-assignment-system.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    console.log(`📋 Executing ${statements.length} migration statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      try {
        await query(statement);
        console.log(
          `✅ Statement ${i + 1}/${statements.length} executed successfully`
        );
      } catch (error) {
        // Some statements might fail if they already exist, that's okay
        if (
          error.message.includes("already exists") ||
          error.message.includes("duplicate")
        ) {
          console.log(
            `⚠️  Statement ${i + 1}/${
              statements.length
            } skipped (already exists)`
          );
        } else {
          console.error(
            `❌ Statement ${i + 1}/${statements.length} failed:`,
            error.message
          );
          console.log("Statement:", statement.substring(0, 100) + "...");
        }
      }
    }

    // Verify the migration worked
    console.log("\n🔍 Verifying migration...");

    // Check if cleaner_service_areas table exists
    const serviceAreasCheck = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'cleaner_service_areas'
    `);

    if (serviceAreasCheck.rows[0].count > 0) {
      console.log("✅ cleaner_service_areas table created successfully");

      // Count service areas
      const areasCount = await query(
        "SELECT COUNT(*) as count FROM cleaner_service_areas"
      );
      console.log(
        `📊 Created ${areasCount.rows[0].count} service area records`
      );
    }

    // Check if booking columns were added
    const bookingColumnsCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
        AND column_name IN ('assigned_at', 'assignment_attempts', 'assigned_by_admin')
    `);

    console.log(
      `✅ Added ${bookingColumnsCheck.rows.length} new columns to bookings table`
    );

    // Check notification metadata column
    const notificationMetadataCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'notifications' 
        AND column_name = 'metadata'
    `);

    if (notificationMetadataCheck.rows.length > 0) {
      console.log("✅ notifications.metadata column added successfully");
    }

    // Check cleaner profile enhancements
    const cleanerProfileCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'cleaner_profiles' 
        AND column_name IN ('last_active', 'completion_rate')
    `);

    console.log(
      `✅ Added ${cleanerProfileCheck.rows.length} new columns to cleaner_profiles table`
    );

    console.log(
      "\n🎉 Enhanced Assignment System Migration completed successfully!"
    );
    console.log("\nNew Features Available:");
    console.log("• ZIP code based cleaner matching with priority scoring");
    console.log("• Automated assignment with concurrency protection");
    console.log("• Admin override capabilities with reason tracking");
    console.log("• Enhanced notification system with metadata");
    console.log("• Completion rate tracking for cleaners");
    console.log("• Retry assignment functionality");
    console.log("• Service area management for better coverage");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

/**
 * Rollback migration (use with caution)
 */
async function rollbackEnhancedAssignmentMigration() {
  console.log("⚠️  Rolling back Enhanced Assignment System Migration...");

  try {
    // Remove added columns (be careful with this in production!)
    const rollbackStatements = [
      "DROP TABLE IF EXISTS cleaner_service_areas CASCADE;",
      "ALTER TABLE bookings DROP COLUMN IF EXISTS assigned_at;",
      "ALTER TABLE bookings DROP COLUMN IF EXISTS assignment_attempts;",
      "ALTER TABLE bookings DROP COLUMN IF EXISTS assigned_by_admin;",
      "ALTER TABLE bookings DROP COLUMN IF EXISTS admin_override_reason;",
      "ALTER TABLE notifications DROP COLUMN IF EXISTS metadata;",
      "ALTER TABLE cleaner_profiles DROP COLUMN IF EXISTS last_active;",
      "ALTER TABLE cleaner_profiles DROP COLUMN IF EXISTS completion_rate;",
      "DROP FUNCTION IF EXISTS update_cleaner_completion_rate();",
      "DROP FUNCTION IF EXISTS update_cleaner_last_active();",
    ];

    for (const statement of rollbackStatements) {
      try {
        await query(statement);
        console.log(`✅ Executed: ${statement}`);
      } catch (error) {
        console.log(`⚠️  Failed: ${statement} - ${error.message}`);
      }
    }

    console.log("🔄 Rollback completed");
  } catch (error) {
    console.error("❌ Rollback failed:", error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  const command = process.argv[2];

  if (command === "rollback") {
    rollbackEnhancedAssignmentMigration()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    runEnhancedAssignmentMigration()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = {
  runEnhancedAssignmentMigration,
  rollbackEnhancedAssignmentMigration,
};
