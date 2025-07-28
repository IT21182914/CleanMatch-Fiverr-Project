require("dotenv").config();
const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

// Test basic cleaner registration (without documents)
const testBasicCleanerRegistration = async () => {
  console.log("\n🧪 Testing Basic Cleaner Registration (No Documents)...");

  try {
    const cleanerData = {
      email: `basic_cleaner_${Date.now()}@example.com`,
      password: "Cleaner123!",
      firstName: "Bob",
      lastName: "Wilson",
      phone: "+1234567893",
      role: "cleaner",
      address: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      cleaningServices: ["Residential Cleaning", "Deep Cleaning"],
      cleaningFrequency: "part-time",
      preferredHours: "Weekends",
      message: "Looking to start my cleaning career",
    };

    console.log("Registering basic cleaner with data:", {
      ...cleanerData,
      password: "[HIDDEN]",
    });

    const response = await axios.post(`${API_BASE}/auth/register`, cleanerData);

    console.log("✅ Basic cleaner registration successful!");
    console.log("Response:", {
      success: response.data.success,
      user: response.data.user,
      hasToken: !!response.data.token,
      hasRefreshToken: !!response.data.refreshToken,
    });

    // Test login
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: cleanerData.email,
      password: cleanerData.password,
    });

    console.log("✅ Basic cleaner login successful!");
    console.log("Login response:", {
      success: loginResponse.data.success,
      user: loginResponse.data.user,
      hasToken: !!loginResponse.data.token,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Basic cleaner registration failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Test validation errors
const testValidationErrors = async () => {
  console.log("\n🧪 Testing Validation Errors...");

  try {
    // Test missing required fields
    const invalidData = {
      email: "invalid-email",
      password: "123", // Too short
      role: "customer",
      // Missing firstName, lastName, etc.
    };

    await axios.post(`${API_BASE}/auth/register`, invalidData);
    console.log("❌ Should have failed validation!");
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log("✅ Validation working correctly:");
      console.log("Error:", error.response.data.error);
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }

  try {
    // Test duplicate email
    const duplicateData = {
      email: "duplicate@example.com",
      password: "Password123!",
      firstName: "Test",
      lastName: "User",
      userName: "testuser",
      phone: "+1234567890",
      role: "customer",
    };

    // Register once
    await axios.post(`${API_BASE}/auth/register`, duplicateData);

    // Try to register again with same email
    await axios.post(`${API_BASE}/auth/register`, duplicateData);
    console.log("❌ Should have failed duplicate email check!");
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log("✅ Duplicate email check working correctly:");
      console.log("Error:", error.response.data.error);
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }
};

// Main test runner
const runEnhancedRegistrationTests = async () => {
  console.log("🚀 Starting Enhanced Registration Flow Tests...");
  console.log("API Base URL:", API_BASE);

  try {
    // Test basic cleaner registration
    await testBasicCleanerRegistration();

    // Test validation
    await testValidationErrors();

    console.log("\n🎉 Enhanced registration tests completed successfully!");
  } catch (error) {
    console.error("\n💥 Test suite failed:", error.message);
    process.exit(1);
  }
};

// Run the tests
runEnhancedRegistrationTests();
