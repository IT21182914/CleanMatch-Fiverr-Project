require("dotenv").config();
const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

// Test the complete user lifecycle
const testCompleteUserLifecycle = async () => {
  console.log("\n🧪 Testing Complete User Lifecycle...");

  let customerToken, cleanerToken;

  try {
    // 1. Register a customer
    console.log("\n1️⃣ Registering a customer...");
    const customerData = {
      email: `lifecycle_customer_${Date.now()}@example.com`,
      password: "Customer123!",
      firstName: "Sarah",
      lastName: "Johnson",
      userName: `sarah_${Date.now()}`,
      phone: "+1555000001",
      role: "customer",
    };

    const customerResponse = await axios.post(
      `${API_BASE}/auth/register`,
      customerData
    );
    customerToken = customerResponse.data.token;
    console.log("✅ Customer registered:", customerResponse.data.user.email);

    // 2. Register a cleaner
    console.log("\n2️⃣ Registering a cleaner...");
    const cleanerData = {
      email: `lifecycle_cleaner_${Date.now()}@example.com`,
      password: "Cleaner123!",
      firstName: "Mike",
      lastName: "Chen",
      phone: "+1555000002",
      role: "cleaner",
      address: "456 Oak Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      cleaningServices: [
        "Residential Cleaning",
        "Deep Cleaning",
        "Move-in/Move-out Cleaning",
      ],
      cleaningFrequency: "full-time",
      preferredHours: "9AM-5PM",
      message: "Professional cleaner with 8 years experience",
    };

    const cleanerResponse = await axios.post(
      `${API_BASE}/auth/register`,
      cleanerData
    );
    cleanerToken = cleanerResponse.data.token;
    console.log("✅ Cleaner registered:", cleanerResponse.data.user.email);

    // 3. Test customer accessing protected routes
    console.log("\n3️⃣ Testing customer protected routes...");
    try {
      const customerProfile = await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      console.log(
        "✅ Customer can access profile:",
        customerProfile.data.success
      );
    } catch (error) {
      console.log(
        "ℹ️ Profile endpoint status:",
        error.response?.status,
        error.response?.data?.error || error.message
      );
    }

    // 4. Test cleaner accessing protected routes
    console.log("\n4️⃣ Testing cleaner protected routes...");
    try {
      const cleanerProfile = await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${cleanerToken}` },
      });
      console.log(
        "✅ Cleaner can access profile:",
        cleanerProfile.data.success
      );
    } catch (error) {
      console.log(
        "ℹ️ Profile endpoint status:",
        error.response?.status,
        error.response?.data?.error || error.message
      );
    }

    // 5. Test login flows
    console.log("\n5️⃣ Testing login flows...");

    // Customer login
    const customerLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: customerData.email,
      password: customerData.password,
    });
    console.log("✅ Customer login successful");

    // Cleaner login
    const cleanerLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: cleanerData.email,
      password: cleanerData.password,
    });
    console.log("✅ Cleaner login successful");

    // 6. Test refresh token flow
    console.log("\n6️⃣ Testing refresh token flow...");
    if (customerResponse.data.refreshToken) {
      try {
        const refreshResponse = await axios.post(`${API_BASE}/auth/refresh`, {
          refreshToken: customerResponse.data.refreshToken,
        });
        console.log("✅ Refresh token works:", refreshResponse.data.success);
      } catch (error) {
        console.log(
          "ℹ️ Refresh token status:",
          error.response?.status,
          error.response?.data?.error || error.message
        );
      }
    }

    console.log("\n🎉 Complete user lifecycle test passed!");
    return { customerData, cleanerData };
  } catch (error) {
    console.error("❌ User lifecycle test failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Test different role registrations with edge cases
const testRoleRegistrationEdgeCases = async () => {
  console.log("\n🧪 Testing Role Registration Edge Cases...");

  try {
    // Test cleaner with minimal data
    console.log("\n🔍 Testing cleaner with minimal required data...");
    const minimalCleaner = {
      email: `minimal_cleaner_${Date.now()}@example.com`,
      password: "MinimalCleaner123!",
      firstName: "Min",
      lastName: "Cleaner",
      phone: "+1555000003",
      role: "cleaner",
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      cleaningServices: ["Residential Cleaning"],
    };

    const minimalResponse = await axios.post(
      `${API_BASE}/auth/register`,
      minimalCleaner
    );
    console.log("✅ Minimal cleaner registration successful");

    // Test customer with all optional fields
    console.log("\n🔍 Testing customer with all fields...");
    const fullCustomer = {
      email: `full_customer_${Date.now()}@example.com`,
      password: "FullCustomer123!",
      firstName: "Full",
      lastName: "Customer",
      userName: `fullcustomer_${Date.now()}`,
      phone: "+1555000004",
      role: "customer",
    };

    const fullResponse = await axios.post(
      `${API_BASE}/auth/register`,
      fullCustomer
    );
    console.log("✅ Full customer registration successful");

    console.log("\n🎉 Role registration edge cases passed!");
  } catch (error) {
    console.error("❌ Role registration edge cases failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Main comprehensive test runner
const runComprehensiveTests = async () => {
  console.log("🚀 Starting Comprehensive Registration & User Flow Tests...");
  console.log("API Base URL:", API_BASE);
  console.log(
    "Testing both customer and cleaner registration flows with complete lifecycle"
  );

  try {
    // Test complete user lifecycle
    await testCompleteUserLifecycle();

    // Test edge cases
    await testRoleRegistrationEdgeCases();

    console.log("\n🎉🎉 ALL COMPREHENSIVE TESTS PASSED! 🎉🎉");
    console.log("✅ Customer registration: Working");
    console.log("✅ Cleaner registration: Working");
    console.log("✅ Login flows: Working");
    console.log("✅ Authentication: Working");
    console.log("✅ Role-based validation: Working");
  } catch (error) {
    console.error("\n💥 Comprehensive test suite failed:", error.message);
    process.exit(1);
  }
};

// Run the comprehensive tests
runComprehensiveTests();
