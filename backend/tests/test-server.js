require("dotenv").config();
const request = require("supertest");

// Basic health check test
const testHealthCheck = async () => {
  try {
    console.log("🧪 Testing CleanMatch Backend...\n");

    // Import app after env is loaded
    const app = require("../server");

    console.log("Testing health endpoint...");
    const response = await request(app).get("/health");

    if (response.status === 200) {
      console.log("✅ Health check passed");
      console.log("Response:", response.body);
    } else {
      console.log("❌ Health check failed");
      console.log("Status:", response.status);
      console.log("Response:", response.body);
    }

    console.log("\n🎉 Basic server test completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error.message);

    if (error.message.includes("listen EADDRINUSE")) {
      console.log(
        "💡 Tip: Port 5000 is already in use. Try stopping other servers or change PORT in .env"
      );
    } else if (error.message.includes("connect ECONNREFUSED")) {
      console.log(
        "💡 Tip: Database connection failed. Check your database configuration in .env"
      );
    }

    process.exit(1);
  }
};

// Only run test if called directly
if (require.main === module) {
  testHealthCheck();
}

module.exports = { testHealthCheck };
