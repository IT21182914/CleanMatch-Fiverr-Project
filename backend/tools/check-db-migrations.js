require("dotenv").config();

async function checkDatabaseMigrations() {
  try {
    // Import the database configuration
    const db = require("./config/database");

    // Connect to the database
    const client = await db.pool.connect();

    try {
      // Query the migrations table
      const result = await client.query(
        "SELECT name, run_on FROM pgmigrations ORDER BY name"
      );

      console.log("Migrations recorded in database:");
      console.log("================================");
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.name} | ${row.run_on}`);
      });

      // Check if the problematic migration exists
      const problematic = result.rows.find(
        (row) =>
          row.name === "1755875000000_enhance_reviews_for_company_support"
      );
      if (problematic) {
        console.log("\n🔍 Found the problematic migration in database!");
        console.log(
          "This migration was recorded as run but the file doesn't exist in filesystem."
        );
      }
    } finally {
      client.release();
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkDatabaseMigrations();
