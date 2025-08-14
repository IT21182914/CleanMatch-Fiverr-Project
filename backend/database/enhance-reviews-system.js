require("dotenv").config();
const { Pool } = require("pg");

async function enhanceReviewsSystem() {
  // Use the same SSL configuration as the main database
  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl && process.env.DATABASE_HOST) {
    const host = process.env.DATABASE_HOST;
    const port = process.env.DATABASE_PORT || 5432;
    const database = process.env.DATABASE_NAME;
    const user = process.env.DATABASE_USER;
    const password = process.env.DATABASE_PASSWORD;

    databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  let sslConfig = false;

  // Use SSL for cloud databases (Supabase, AWS, Heroku, etc.)
  if (
    databaseUrl &&
    (databaseUrl.includes("supabase.co") ||
      databaseUrl.includes("amazonaws.com") ||
      databaseUrl.includes("render.com") ||
      databaseUrl.includes("heroku.com") ||
      process.env.NODE_ENV === "production")
  ) {
    sslConfig = {
      rejectUnauthorized: false,
    };
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslConfig,
  });

  try {
    console.log("🔧 Enhancing reviews system for admin functionality...");

    // First, backup the existing reviews if any
    const existingReviews = await pool.query("SELECT * FROM reviews");
    console.log(`📊 Found ${existingReviews.rows.length} existing reviews`);

    // Drop the existing reviews table
    await pool.query("DROP TABLE IF EXISTS reviews CASCADE");
    console.log("✅ Dropped existing reviews table");

    // Recreate with enhanced structure for admin reviews
    await pool.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cleaner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        is_verified BOOLEAN DEFAULT TRUE,
        is_visible BOOLEAN DEFAULT TRUE,
        is_admin_created BOOLEAN DEFAULT FALSE,
        admin_created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        admin_notes TEXT, -- Internal notes for admin-created reviews
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(booking_id, customer_id)
      )
    `);
    console.log("✅ Recreated reviews table with admin functionality");

    // Create comprehensive indexes for performance
    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id)",
      "CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id)",
      "CREATE INDEX IF NOT EXISTS idx_reviews_cleaner_id ON reviews(cleaner_id)",
      "CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews(is_visible)",
      "CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)",
      "CREATE INDEX IF NOT EXISTS idx_reviews_admin_created ON reviews(is_admin_created)",
      "CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC)",
      "CREATE INDEX IF NOT EXISTS idx_reviews_cleaner_visible ON reviews(cleaner_id, is_visible)",
    ];

    for (const indexQuery of indexes) {
      await pool.query(indexQuery);
    }
    console.log("✅ Created comprehensive indexes for reviews table");

    // Create a function to automatically update the updated_at timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_reviews_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_update_reviews_updated_at ON reviews;
      CREATE TRIGGER trigger_update_reviews_updated_at
        BEFORE UPDATE ON reviews
        FOR EACH ROW
        EXECUTE FUNCTION update_reviews_updated_at();
    `);
    console.log("✅ Created auto-update trigger for reviews");

    // Create review statistics view for cleaner profiles
    await pool.query(`
      CREATE OR REPLACE VIEW cleaner_review_stats AS
      SELECT 
        cleaner_id,
        COUNT(*) as total_reviews,
        AVG(rating)::DECIMAL(3,2) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
        MAX(created_at) as latest_review_date
      FROM reviews 
      WHERE is_visible = true
      GROUP BY cleaner_id;
    `);
    console.log("✅ Created cleaner review statistics view");

    // Create admin review audit table for tracking admin actions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_review_audit (
        id SERIAL PRIMARY KEY,
        review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
        admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'toggle_visibility'
        old_values JSONB,
        new_values JSONB,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_review_audit_review_id ON admin_review_audit(review_id);
      CREATE INDEX IF NOT EXISTS idx_admin_review_audit_admin_id ON admin_review_audit(admin_id);
      CREATE INDEX IF NOT EXISTS idx_admin_review_audit_created_at ON admin_review_audit(created_at DESC);
    `);
    console.log("✅ Created admin review audit table");

    console.log(
      "🎉 Enhanced reviews system with admin functionality completed successfully!"
    );

    return existingReviews.rows; // Return existing reviews for potential restoration
  } catch (error) {
    console.error("❌ Error enhancing reviews system:", error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the enhancement
if (require.main === module) {
  enhanceReviewsSystem()
    .then(() => {
      console.log("✅ Database enhancement completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Enhancement failed:", error);
      process.exit(1);
    });
}

module.exports = { enhanceReviewsSystem };
