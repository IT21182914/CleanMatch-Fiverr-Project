const axios = require("axios");
const { connectDB, query } = require("../config/database");

const API_BASE = "http://localhost:5000/api";

// Test data
const testUser = {
  email: "test.logout@example.com",
  password: "TestPassword123!",
};

async function debugLogoutAll() {
  console.log("🔍 Debugging Logout All Devices Functionality");
  console.log("=".repeat(60));

  try {
    // Connect to database
    await connectDB();

    // Login to get a token
    console.log("1. 🔐 Logging in...");
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });

    const { token, user } = loginResponse.data;
    console.log("✅ Login successful, User ID:", user.id);

    // Check user's token_invalidation_date before logout-all
    console.log(
      "\n2. 🔍 Checking token_invalidation_date before logout-all..."
    );
    const userBefore = await query(
      "SELECT token_invalidation_date FROM users WHERE id = $1",
      [user.id]
    );
    console.log(
      "   token_invalidation_date before:",
      userBefore.rows[0].token_invalidation_date
    );

    // Call logout-all
    console.log("\n3. 🚪 Calling logout-all...");
    await axios.post(
      `${API_BASE}/auth/logout-all`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ Logout-all successful");

    // Check user's token_invalidation_date after logout-all
    console.log("\n4. 🔍 Checking token_invalidation_date after logout-all...");
    const userAfter = await query(
      "SELECT token_invalidation_date FROM users WHERE id = $1",
      [user.id]
    );
    console.log(
      "   token_invalidation_date after:",
      userAfter.rows[0].token_invalidation_date
    );

    // Decode the token to see when it was issued
    const jwt = require("jsonwebtoken");
    const decoded = jwt.decode(token);
    const tokenIssuedAt = new Date(decoded.iat * 1000);
    console.log("\n5. 🕒 Token timing analysis:");
    console.log("   Token issued at:", tokenIssuedAt);
    console.log(
      "   Token invalidation date:",
      userAfter.rows[0].token_invalidation_date
    );
    console.log(
      "   Token issued before invalidation?",
      tokenIssuedAt < userAfter.rows[0].token_invalidation_date
    );
  } catch (error) {
    console.error("\n❌ Debug failed:", error.response?.data || error.message);
  }
}

debugLogoutAll();
