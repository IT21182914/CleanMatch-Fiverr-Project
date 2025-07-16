require("dotenv").config();
const { query, connectDB } = require("./config/database");

/**
 * Add rating and review_count columns to users table for cleaner ratings
 */
async function addRatingColumns() {
  try {
    console.log("🔧 Adding rating columns to users table...");

    // Initialize database connection
    await connectDB();
    console.log("✅ Database connected");

    // Add rating column if it doesn't exist
    try {
      await query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 0
      `);
      console.log("✅ Added rating column");
    } catch (error) {
      if (!error.message.includes("already exists")) {
        throw error;
      }
      console.log("ℹ️ Rating column already exists");
    }

    // Add review_count column if it doesn't exist
    try {
      await query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0
      `);
      console.log("✅ Added review_count column");
    } catch (error) {
      if (!error.message.includes("already exists")) {
        throw error;
      }
      console.log("ℹ️ Review_count column already exists");
    }

    // Create index for rating lookups
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating)
    `);
    console.log("✅ Added rating index");

    console.log("\n🎉 Rating columns setup completed successfully!");
  } catch (error) {
    console.error("❌ Error adding rating columns:", error);
    throw error;
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  addRatingColumns()
    .then(() => {
      console.log("\n✅ Rating columns setup completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Rating columns setup failed:", error);
      process.exit(1);
    });
}

module.exports = { addRatingColumns };
