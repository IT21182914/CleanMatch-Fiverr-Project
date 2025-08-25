require("dotenv").config();

async function removeProblemMigration() {
  try {
    const db = require("./config/database");
    const client = await db.pool.connect();

    try {
      console.log("Attempting to remove problematic migration record...");

      // First check if it exists
      const checkResult = await client.query(
        "SELECT name FROM pgmigrations WHERE name = '1755875000000_enhance_reviews_for_company_support'"
      );

      if (checkResult.rows.length > 0) {
        console.log("Found the problematic migration record. Removing it...");

        // Delete the problematic migration record
        const deleteResult = await client.query(
          "DELETE FROM pgmigrations WHERE name = '1755875000000_enhance_reviews_for_company_support'"
        );

        console.log(
          "✅ Successfully removed the problematic migration record!"
        );
        console.log(`Deleted ${deleteResult.rowCount} row(s)`);
      } else {
        console.log("❌ Migration record not found in database.");
      }

      // Show remaining migrations
      const remaining = await client.query(
        "SELECT name FROM pgmigrations ORDER BY name"
      );
      console.log("\nRemaining migrations in database:");
      remaining.rows.forEach((row, i) => console.log(`${i + 1}. ${row.name}`));
    } finally {
      client.release();
    }

    console.log("\n🎉 Database cleaned! You can now run migrations again.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

removeProblemMigration();
