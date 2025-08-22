const { query } = require("./config/database");

async function createAdminReviewsTable() {
  try {
    console.log("🔧 Creating admin_reviews table...");

    // Create the table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_reviews (
        id SERIAL PRIMARY KEY,
        cleaner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        is_visible BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
      )
    `);

    console.log("✅ Table admin_reviews created successfully");

    // Create indexes
    await query(
      "CREATE INDEX IF NOT EXISTS idx_admin_reviews_cleaner_id ON admin_reviews(cleaner_id)"
    );
    await query(
      "CREATE INDEX IF NOT EXISTS idx_admin_reviews_admin_id ON admin_reviews(admin_id)"
    );
    await query(
      "CREATE INDEX IF NOT EXISTS idx_admin_reviews_created_at ON admin_reviews(created_at)"
    );
    await query(
      "CREATE INDEX IF NOT EXISTS idx_admin_reviews_is_visible ON admin_reviews(is_visible)"
    );

    console.log("✅ Indexes created successfully");
    console.log("🎉 Admin reviews table setup complete!");
  } catch (error) {
    console.error("❌ Error creating admin_reviews table:", error);
  }

  process.exit(0);
}

createAdminReviewsTable();
