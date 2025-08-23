const { query } = require("../config/database");

async function setupAdminReviewsTable() {
  try {
    console.log("🔧 Setting up admin_reviews table...");

    // Create admin_reviews table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS admin_reviews (
        id SERIAL PRIMARY KEY,
        cleaner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        is_visible BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes if they don't exist
    await query(`
      CREATE INDEX IF NOT EXISTS idx_admin_reviews_cleaner_id ON admin_reviews(cleaner_id)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_admin_reviews_admin_id ON admin_reviews(admin_id)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_admin_reviews_created_at ON admin_reviews(created_at)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_admin_reviews_is_visible ON admin_reviews(is_visible)
    `);

    console.log("✅ Admin reviews table setup complete!");

    // Check if there are any cleaners to add sample data
    const cleanersResult = await query(
      "SELECT id, first_name, last_name FROM users WHERE role = 'cleaner' LIMIT 3"
    );

    if (cleanersResult.rows.length > 0) {
      console.log("📝 Adding sample admin reviews...");

      // Check if sample data already exists
      const existingReviews = await query(
        "SELECT COUNT(*) as count FROM admin_reviews"
      );

      if (parseInt(existingReviews.rows[0].count) === 0) {
        // Add sample reviews for the first few cleaners
        const sampleReviews = [
          {
            cleaner_id: cleanersResult.rows[0].id,
            rating: 5,
            review_text:
              "Exceptional service! This cleaner consistently delivers outstanding results with attention to detail that exceeds expectations. Highly recommended for anyone seeking professional cleaning services.",
          },
          {
            cleaner_id: cleanersResult.rows[0].id,
            rating: 5,
            review_text:
              "Reliable, professional, and thorough. Our office has never looked better since we started using this cleaning service. The team is punctual and takes great care with our equipment.",
          },
        ];

        if (cleanersResult.rows.length > 1) {
          sampleReviews.push({
            cleaner_id: cleanersResult.rows[1].id,
            rating: 4,
            review_text:
              "Great cleaning service with consistent quality. The cleaner is always on time and does an excellent job. Very satisfied with the results and would recommend to others.",
          });
        }

        if (cleanersResult.rows.length > 2) {
          sampleReviews.push({
            cleaner_id: cleanersResult.rows[2].id,
            rating: 5,
            review_text:
              "Outstanding cleaning service! Professional, efficient, and trustworthy. My home always feels fresh and spotless after their visit. Couldn't be happier with the service.",
          });
        }

        // Get an admin user to assign as creator
        const adminResult = await query(
          "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        );

        if (adminResult.rows.length > 0) {
          const adminId = adminResult.rows[0].id;

          for (const review of sampleReviews) {
            await query(
              `INSERT INTO admin_reviews (cleaner_id, admin_id, rating, review_text, is_visible, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
              [
                review.cleaner_id,
                adminId,
                review.rating,
                review.review_text,
                true,
              ]
            );
          }

          console.log(`✅ Added ${sampleReviews.length} sample admin reviews!`);
        } else {
          console.log("⚠️ No admin users found, skipping sample data creation");
        }
      } else {
        console.log(
          "ℹ️ Admin reviews table already contains data, skipping sample creation"
        );
      }
    } else {
      console.log("⚠️ No cleaners found, skipping sample data creation");
    }
  } catch (error) {
    console.error("❌ Error setting up admin_reviews table:", error);
    throw error;
  }
}

// Run the setup if this script is called directly
if (require.main === module) {
  const { connectDB } = require("../config/database");

  async function run() {
    try {
      await connectDB();
      await setupAdminReviewsTable();
      console.log("🎉 Setup complete!");
      process.exit(0);
    } catch (error) {
      console.error("Setup failed:", error);
      process.exit(1);
    }
  }

  run();
}

module.exports = { setupAdminReviewsTable };
