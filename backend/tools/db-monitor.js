#!/usr/bin/env node

require("dotenv").config();
const { connectDB, query } = require("../config/database");

async function checkConnection() {
  try {
    await connectDB();
    const result = await query("SELECT NOW(), version()");

    console.log("✅ Database connection successful");
    console.log("🕐 Server time:", result.rows[0].now);
    console.log("📊 Database version:", result.rows[0].version.split(" ")[0]);

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

async function monitorConnection() {
  console.log("🔍 Starting database connection monitor...\n");

  const interval = setInterval(async () => {
    const isConnected = await checkConnection();

    if (!isConnected) {
      console.log("🔄 Attempting to reconnect...");
    }

    console.log("---");
  }, 10000); // Check every 10 seconds

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    clearInterval(interval);
    console.log("\n✅ Database monitor stopped");
    process.exit(0);
  });
}

// Run initial check
checkConnection().then((success) => {
  if (success) {
    monitorConnection();
  } else {
    console.log("❌ Initial connection failed. Exiting...");
    process.exit(1);
  }
});
