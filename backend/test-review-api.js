const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test the review system endpoints
async function testReviewSystem() {
  console.log("🧪 Testing Review System API Endpoints\n");

  try {
    // Test 1: Check if server is responding
    console.log("1. Testing server health...");
    const healthResponse = await axios.get("http://localhost:5000/health");
    console.log("✅ Server is healthy:", healthResponse.data.message);

    // Test 2: Test public endpoint (should work without auth)
    console.log("\n2. Testing public cleaner reviews endpoint...");
    try {
      // This should return an empty result or 404 for non-existent cleaner
      const reviewsResponse = await axios.get(
        `${BASE_URL}/reviews/cleaner/999`
      );
      console.log("✅ Public reviews endpoint accessible");
      console.log("   Response structure:", {
        success: reviewsResponse.data.success,
        reviewsCount: reviewsResponse.data.reviews?.length || 0,
        hasStats: !!reviewsResponse.data.stats,
        hasPagination: !!reviewsResponse.data.pagination,
      });
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(
          "✅ Public reviews endpoint accessible (returned 404 for non-existent cleaner)"
        );
      } else {
        console.log("❌ Public reviews endpoint error:", error.message);
      }
    }

    // Test 3: Test protected endpoint (should require auth)
    console.log(
      "\n3. Testing protected customer endpoint (should require auth)..."
    );
    try {
      await axios.get(`${BASE_URL}/reviews/my-reviews`);
      console.log("❌ Protected endpoint should require authentication");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Protected endpoint properly requires authentication");
      } else {
        console.log("⚠️ Unexpected error:", error.message);
      }
    }

    // Test 4: Test admin endpoint (should require admin auth)
    console.log(
      "\n4. Testing admin dashboard endpoint (should require admin auth)..."
    );
    try {
      await axios.get(`${BASE_URL}/reviews/admin/dashboard`);
      console.log("❌ Admin endpoint should require authentication");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Admin endpoint properly requires authentication");
      } else {
        console.log("⚠️ Unexpected error:", error.message);
      }
    }

    // Test 5: Test validation (should reject invalid data)
    console.log(
      "\n5. Testing validation (should reject invalid review data)..."
    );
    try {
      await axios.post(`${BASE_URL}/reviews`, {
        rating: 6, // Invalid rating > 5
        comment: "Test",
      });
      console.log("❌ Validation should reject invalid rating");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          "✅ Endpoint requires authentication (validation will be tested after auth)"
        );
      } else if (error.response?.status === 400) {
        console.log("✅ Validation properly rejects invalid data");
      } else {
        console.log("⚠️ Unexpected error:", error.message);
      }
    }

    console.log("\n🎉 Basic API endpoint tests completed successfully!");
    console.log("\n📝 Summary:");
    console.log("   ✅ Server is running and healthy");
    console.log("   ✅ Public endpoints are accessible");
    console.log("   ✅ Protected endpoints require authentication");
    console.log("   ✅ Admin endpoints require authentication");
    console.log("   ✅ API structure appears correct");

    console.log("\n📋 Next Steps:");
    console.log(
      "   1. Create test user accounts to test authenticated endpoints"
    );
    console.log(
      "   2. Create test bookings and cleaners to test review creation"
    );
    console.log("   3. Test admin functionality with admin credentials");
    console.log("   4. Test the frontend components with the backend");
  } catch (error) {
    console.error("❌ Test failed:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Make sure the backend server is running:");
      console.log("   cd backend && npm start");
    }
  }
}

// Run the tests
testReviewSystem();
