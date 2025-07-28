const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function runMigration() {
  // Construct DATABASE_URL from individual variables if not provided
  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl && process.env.DATABASE_HOST) {
    const host = process.env.DATABASE_HOST;
    const port = process.env.DATABASE_PORT || 5432;
    const database = process.env.DATABASE_NAME;
    const user = process.env.DATABASE_USER;
    const password = process.env.DATABASE_PASSWORD;

    databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  // Determine SSL configuration
  let sslConfig = false;
  if (
    databaseUrl &&
    (databaseUrl.includes("supabase.co") ||
      databaseUrl.includes("amazonaws.com") ||
      databaseUrl.includes("render.com") ||
      databaseUrl.includes("heroku.com") ||
      process.env.NODE_ENV === "production")
  ) {
    sslConfig = { rejectUnauthorized: false };
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslConfig,
  });

  try {
    console.log("🔄 Connecting to database...");
    await pool.connect();
    console.log("✅ Connected to database");

    // Read the migration SQL file
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "add_missing_columns.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("🔄 Running migration to add missing columns...");
    await pool.query(migrationSQL);
    console.log("✅ Migration completed successfully");

    // Verify the columns exist
    console.log("🔄 Verifying columns...");
    const userColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY column_name
    `);

    const cleanerColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cleaner_profiles' 
      ORDER BY column_name
    `);

    console.log(
      "📊 Users table columns:",
      userColumns.rows.map((r) => r.column_name)
    );
    console.log(
      "📊 Cleaner profiles table columns:",
      cleanerColumns.rows.map((r) => r.column_name)
    );

    console.log("✅ Database migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
