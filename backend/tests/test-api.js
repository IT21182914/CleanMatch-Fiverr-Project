require("dotenv").config();
const axios = require("axios");

const testAPI = async () => {
  try {
    const apiUrl = "http://localhost:5000/api";

    // First, let's login as a customer to get a token
    console.log("1. Logging in as customer...");
    const loginResponse = await axios.post(`${apiUrl}/auth/login`, {
      email: "customer@example.com",
      password: "customer123!",
    });

    const token = loginResponse.data.token;
    console.log("✅ Login successful, token received");

    // Now test the ZIP-based recommendations API
    console.log("\n2. Testing ZIP-based recommendations API...");
    const searchData = {
      zipCode: "10001",
      latitude: 40.7128,
      longitude: -74.006,
      bookingDate: "2025-07-17",
      bookingTime: "10:00",
      durationHours: 2,
      serviceId: 1,
      limit: 10,
      matchingMode: "ai",
    };

    console.log("Search data:", searchData);

    const recommendationsResponse = await axios.post(
      `${apiUrl}/bookings/recommendations-by-zip`,
      searchData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("\n✅ API Response:");
    console.log("Success:", recommendationsResponse.data.success);
    console.log("Total found:", recommendationsResponse.data.data?.totalFound);
    console.log(
      "Recommendations:",
      JSON.stringify(
        recommendationsResponse.data.data?.recommendations,
        null,
        2
      )
    );
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
};

testAPI();
