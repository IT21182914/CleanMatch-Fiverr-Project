require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:5000/api";

// Test customer registration
const testCustomerRegistration = async () => {
  console.log("\n🧪 Testing Customer Registration...");

  try {
    const customerData = {
      email: `customer_${Date.now()}@example.com`,
      password: "Customer123!",
      firstName: "John",
      lastName: "Doe",
      userName: `johndoe_${Date.now()}`,
      phone: "+1234567890",
      role: "customer",
    };

    console.log("Registering customer with data:", {
      ...customerData,
      password: "[HIDDEN]",
    });

    const response = await axios.post(
      `${API_BASE}/auth/register`,
      customerData
    );

    console.log("✅ Customer registration successful!");
    console.log("Response:", {
      success: response.data.success,
      user: response.data.user,
      hasToken: !!response.data.token,
      hasRefreshToken: !!response.data.refreshToken,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Customer registration failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Test cleaner registration
const testCleanerRegistration = async () => {
  console.log("\n🧪 Testing Cleaner Registration...");

  try {
    const cleanerData = {
      email: `cleaner_${Date.now()}@example.com`,
      password: "Cleaner123!",
      firstName: "Jane",
      lastName: "Smith",
      phone: "+1234567891",
      role: "cleaner",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      cleaningServices: ["Residential Cleaning", "Deep Cleaning"],
      cleaningFrequency: "part-time",
      preferredHours: "9AM-5PM",
      message: "Experienced cleaner with 5 years of experience",
    };

    console.log("Registering cleaner with data:", {
      ...cleanerData,
      password: "[HIDDEN]",
    });

    const response = await axios.post(`${API_BASE}/auth/register`, cleanerData);

    console.log("✅ Cleaner registration successful!");
    console.log("Response:", {
      success: response.data.success,
      user: response.data.user,
      hasToken: !!response.data.token,
      hasRefreshToken: !!response.data.refreshToken,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Cleaner registration failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Test freelancer registration with documents
const testFreelancerRegistration = async () => {
  console.log("\n🧪 Testing Freelancer Registration with Documents...");

  try {
    // Create a simple test image buffer
    const createTestImage = () => {
      return Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        "base64"
      );
    };

    const formData = new FormData();

    // Add text fields
    formData.append("email", `freelancer_${Date.now()}@example.com`);
    formData.append("password", "Freelancer123!");
    formData.append("fullName", "Alice Johnson");
    formData.append("phone", "+1234567892");
    formData.append("address", "456 Oak Ave");
    formData.append("city", "Los Angeles");
    formData.append("state", "CA");
    formData.append("postalCode", "90210");
    formData.append(
      "cleaningServices",
      JSON.stringify(["Commercial Cleaning", "Window Cleaning"])
    );
    formData.append("cleaningFrequency", "full-time");
    formData.append("preferredHours", "8AM-6PM");
    formData.append(
      "message",
      "Professional cleaner specializing in commercial spaces"
    );

    // Add file uploads (creating mock files)
    const testImageBuffer = createTestImage();
    formData.append("idFront", testImageBuffer, "id_front.png");
    formData.append("idBack", testImageBuffer, "id_back.png");
    formData.append("ssnFront", testImageBuffer, "ssn_front.png");
    formData.append("ssnBack", testImageBuffer, "ssn_back.png");

    console.log("Registering freelancer with files...");

    const response = await axios.post(
      `${API_BASE}/auth/register-freelancer`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    console.log("✅ Freelancer registration successful!");
    console.log("Response:", {
      success: response.data.success,
      user: response.data.user,
      hasToken: !!response.data.token,
      hasRefreshToken: !!response.data.refreshToken,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Freelancer registration failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Test login functionality
const testLogin = async (email, password, userType) => {
  console.log(`\n🧪 Testing ${userType} Login...`);

  try {
    const loginData = { email, password };

    console.log("Logging in with:", { email, password: "[HIDDEN]" });

    const response = await axios.post(`${API_BASE}/auth/login`, loginData);

    console.log(`✅ ${userType} login successful!`);
    console.log("Response:", {
      success: response.data.success,
      user: response.data.user,
      hasToken: !!response.data.token,
      hasRefreshToken: !!response.data.refreshToken,
    });

    return response.data;
  } catch (error) {
    console.error(`❌ ${userType} login failed:`);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

// Main test runner
const runRegistrationTests = async () => {
  console.log("🚀 Starting Registration Flow Tests...");
  console.log("API Base URL:", API_BASE);

  try {
    // Test customer registration
    const customerResult = await testCustomerRegistration();

    // Test cleaner registration
    const cleanerResult = await testCleanerRegistration();

    // Test freelancer registration
    const freelancerResult = await testFreelancerRegistration();

    // Test login for each user type
    await testLogin(customerResult.user.email, "Customer123!", "Customer");
    await testLogin(cleanerResult.user.email, "Cleaner123!", "Cleaner");
    await testLogin(
      freelancerResult.user.email,
      "Freelancer123!",
      "Freelancer"
    );

    console.log("\n🎉 All registration tests completed successfully!");
  } catch (error) {
    console.error("\n💥 Test suite failed:", error.message);
    process.exit(1);
  }
};

// Run the tests
runRegistrationTests();
