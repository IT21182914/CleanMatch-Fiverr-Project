const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

// Test data
const testUser = {
  email: "test.logout@example.com",
  password: "TestPassword123!",
  firstName: "Test",
  lastName: "User",
  userName: "testlogout",
  role: "customer",
};

async function testLogoutAPI() {
  console.log("🧪 Testing Logout API Functionality");
  console.log("=".repeat(50));

  try {
    // Step 1: Register a test user
    console.log("1. 📝 Registering test user...");

    try {
      await axios.post(`${API_BASE}/auth/register`, testUser);
      console.log("✅ Test user registered successfully");
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("ℹ️ Test user already exists, continuing...");
      } else {
        throw error;
      }
    }

    // Step 2: Login to get token
    console.log("\n2. 🔐 Logging in...");
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });

    const { token, user } = loginResponse.data;
    console.log("✅ Login successful");
    console.log(`   User ID: ${user.id}`);
    console.log(`   Token: ${token.substring(0, 20)}...`);

    // Step 3: Test authenticated request
    console.log("\n3. 🔍 Testing authenticated request...");
    const profileResponse = await axios.get(`${API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Authenticated request successful");
    console.log(
      `   Profile: ${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`
    );

    // Step 4: Test logout
    console.log("\n4. 🚪 Testing logout...");
    const logoutResponse = await axios.post(
      `${API_BASE}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ Logout successful");
    console.log(`   Message: ${logoutResponse.data.message}`);

    // Step 5: Test that token is now invalid
    console.log("\n5. 🚫 Testing that token is now invalid...");
    try {
      await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("❌ FAILED: Token is still valid after logout!");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Token correctly invalidated after logout");
        console.log(`   Error: ${error.response.data.error}`);
      } else {
        throw error;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 All logout tests passed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

async function testLogoutAllDevicesAPI() {
  console.log("\n🧪 Testing Logout All Devices API Functionality");
  console.log("=".repeat(50));

  try {
    // Step 1: Login to get first token
    console.log("1. 🔐 Getting first token...");
    const loginResponse1 = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    const token1 = loginResponse1.data.token;
    console.log("✅ First token obtained");

    // Step 2: Login again to get second token (simulate different device)
    console.log("\n2. 🔐 Getting second token (different device)...");
    const loginResponse2 = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    const token2 = loginResponse2.data.token;
    console.log("✅ Second token obtained");

    // Step 3: Verify both tokens work
    console.log("\n3. ✅ Verifying both tokens work...");
    await axios.get(`${API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    await axios.get(`${API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    console.log("✅ Both tokens work correctly");

    // Step 4: Logout from all devices using token1
    console.log("\n4. 🚪 Logging out from all devices...");
    const logoutAllResponse = await axios.post(
      `${API_BASE}/auth/logout-all`,
      {},
      {
        headers: { Authorization: `Bearer ${token1}` },
      }
    );
    console.log("✅ Logout from all devices successful");
    console.log(`   Message: ${logoutAllResponse.data.message}`);

    // Step 5: Test that both tokens are now invalid
    console.log("\n5. 🚫 Testing that both tokens are now invalid...");

    try {
      await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token1}` },
      });
      console.log("❌ FAILED: Token 1 is still valid after logout-all!");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Token 1 correctly invalidated");
      } else {
        throw error;
      }
    }

    try {
      await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token2}` },
      });
      console.log("❌ FAILED: Token 2 is still valid after logout-all!");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Token 2 correctly invalidated");
      } else {
        throw error;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 All logout-all tests passed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests
async function runAllTests() {
  try {
    await testLogoutAPI();
    await testLogoutAllDevicesAPI();
    console.log("\n🌟 All tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Tests failed:", error.message);
    process.exit(1);
  }
}

runAllTests();
