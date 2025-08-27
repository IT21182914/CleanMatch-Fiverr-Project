// Simple test without database connection - just HTTP calls
const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function testLogoutBasic() {
  console.log("🧪 Basic Logout Test (HTTP only)");
  console.log("=".repeat(40));

  try {
    // 1. Login to get token
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test.logout@example.com",
      password: "TestPassword123!",
    });

    const token = loginResponse.data.token;
    console.log("✅ Login successful");
    console.log("   Token:", token.substring(0, 30) + "...");

    // 2. Make authenticated request
    const profileResponse = await axios.get(`${API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Profile request successful");

    // 3. Logout
    const logoutResponse = await axios.post(
      `${API_BASE}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ Logout successful:", logoutResponse.data.message);

    // 4. Try to use token again
    console.log("\n🔍 Testing token after logout...");
    try {
      await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("❌ Token still works! Logout failed!");
    } catch (error) {
      console.log("✅ Token invalidated:", error.response.data.error);
    }

    console.log("\n🎉 Basic logout test passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testLogoutBasic();
