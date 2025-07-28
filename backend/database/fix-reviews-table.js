require("dotenv").config();
const { Pool } = require("pg");

async function fixReviewsTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔧 Fixing reviews table structure...");

    // Drop the existing reviews table
    await pool.query("DROP TABLE IF EXISTS reviews CASCADE");
    console.log("✅ Dropped existing reviews table");

    // Recreate with correct structure
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(booking_id, customer_id)
      )
    `);
    console.log("✅ Recreated reviews table with correct structure");

    // Create the indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_cleaner_id ON reviews(cleaner_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews(is_visible)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)"
    );
    console.log("✅ Created reviews table indexes");

    console.log("🎉 Reviews table fixed successfully!");
  } catch (error) {
    console.error("❌ Error fixing reviews table:", error.message);
  } finally {
    await pool.end();
  }
}

fixReviewsTable();
