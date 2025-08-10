const { query, connectDB } = require("../config/database");
const fs = require("fs").promises;
const path = require("path");

/**
 * Migration to set up the ticketing system
 */
const setupTicketSystem = async () => {
  try {
    console.log("🔄 Setting up ticketing system...");

    // Ensure database connection is established
    await connectDB();

    // Read and execute the SQL file
    const sqlPath = path.join(__dirname, "setup-tickets.sql");
    const sqlScript = await fs.readFile(sqlPath, "utf8");

    // Split by semicolons and execute each statement
    const statements = sqlScript
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
      }
    }

    console.log("✅ Ticketing system setup completed successfully");
  } catch (error) {
    console.error("❌ Error setting up ticketing system:", error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  setupTicketSystem()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

module.exports = { setupTicketSystem };
