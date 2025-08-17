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

async function createMissingTable() {
  console.log("🔧 Creating missing cleaner_service_areas table...");

  try {
    // Create the missing table
    const createTableSQL = `
      -- Create cleaner service areas table for explicit ZIP code coverage
      CREATE TABLE IF NOT EXISTS cleaner_service_areas (
          id SERIAL PRIMARY KEY,
          cleaner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          zip_code VARCHAR(10),
          zip_prefix VARCHAR(5), -- For area-based matching (first 3 or 2 digits)
          is_primary BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableSQL);
    console.log("✅ cleaner_service_areas table created successfully");

    // Create indexes
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_cleaner_service_areas_cleaner_id ON cleaner_service_areas(cleaner_id);
      CREATE INDEX IF NOT EXISTS idx_cleaner_service_areas_zip_code ON cleaner_service_areas(zip_code);
      CREATE INDEX IF NOT EXISTS idx_cleaner_service_areas_zip_prefix ON cleaner_service_areas(zip_prefix);
    `;

    await pool.query(indexSQL);
    console.log("✅ Indexes created successfully");

    // Populate with existing cleaner data
    const populateSQL = `
      INSERT INTO cleaner_service_areas (cleaner_id, zip_code, zip_prefix, is_primary)
      SELECT DISTINCT 
          u.id,
          u.zip_code,
          LEFT(u.zip_code, 3),
          TRUE
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND u.zip_code IS NOT NULL 
        AND u.is_active = TRUE
      ON CONFLICT DO NOTHING;
    `;

    const result = await pool.query(populateSQL);
    console.log(
      `✅ Populated ${result.rowCount} service areas from existing cleaners`
    );

    console.log("🎉 Missing table fix completed successfully!");
  } catch (error) {
    console.error("❌ Error creating table:", error.message);
  } finally {
    await pool.end();
  }
}

createMissingTable();
