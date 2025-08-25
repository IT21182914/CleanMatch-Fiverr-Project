const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Configuration
const API_BASE_URL = "http://localhost:5000/api";
const TEST_IMAGE_PATH = path.join(__dirname, "uploads", "documents");

/**
 * Create a test image file for upload testing
 */
function createTestImage(filename) {
  const imagePath = path.join(TEST_IMAGE_PATH, filename);

  // Create a simple SVG image for testing
  const svgContent = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="100" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
  <text x="100" y="50" text-anchor="middle" font-family="Arial" font-size="14">
    Test ${filename}
  </text>
</svg>`.trim();

  // Ensure directory exists
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    fs.mkdirSync(TEST_IMAGE_PATH, { recursive: true });
  }

  // Write the SVG file
  fs.writeFileSync(imagePath, svgContent);
  return imagePath;
}

/**
 * Create test cleaner with documents
 */
async function createTestCleaner() {
  try {
    console.log("🧪 Creating test cleaner with documents...");

    // Create test images
    const testFiles = {
      idFront: createTestImage("test-id-front.svg"),
      idBack: createTestImage("test-id-back.svg"),
      ssnFront: createTestImage("test-ssn-front.svg"),
      ssnBack: createTestImage("test-ssn-back.svg"),
    };

    console.log("📁 Created test files:");
    Object.entries(testFiles).forEach(([key, filepath]) => {
      console.log(`  ${key}: ${path.basename(filepath)}`);
    });

    // Prepare form data
    const formData = new FormData();

    // Add user registration data
    const timestamp = Date.now();
    formData.append("email", `testcleaner${timestamp}@example.com`);
    formData.append("password", "TestPassword123!");
    formData.append("firstName", "Test");
    formData.append("lastName", "Cleaner");
    formData.append("role", "cleaner");
    formData.append("address", "123 Test Street");
    formData.append("city", "Test City");
    formData.append("state", "CA");
    formData.append("zipCode", "90210");
    formData.append(
      "cleaningServices",
      JSON.stringify(["House Cleaning", "Office Cleaning"])
    );
    formData.append("phone", "+1234567890");

    // Add document files
    Object.entries(testFiles).forEach(([key, filepath]) => {
      if (fs.existsSync(filepath)) {
        formData.append(key, fs.createReadStream(filepath));
      }
    });

    console.log("\n📤 Sending registration request with documents...");

    // Make the API request
    const response = await axios.post(
      `${API_BASE_URL}/auth/register-with-documents`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000,
      }
    );

    console.log("✅ Test cleaner created successfully!");
    console.log("📄 User ID:", response.data.user?.id);
    console.log("📄 Email:", response.data.user?.email);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating test cleaner:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Test admin API to fetch pending freelancers
 */
async function testAdminAPI() {
  try {
    console.log("\n🔍 Testing admin API for pending freelancers...");

    // You'll need to get a valid admin token
    // For now, let's test without auth to see the error
    const response = await axios.get(
      `${API_BASE_URL}/admin/freelancers/pending`
    );

    console.log("✅ API Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log(
      "📋 API Error (expected without auth):",
      error.response?.status,
      error.response?.data?.error
    );
  }
}

// Run the tests
async function runTests() {
  try {
    console.log("🚀 Starting document upload tests...\n");

    await createTestCleaner();
    await testAdminAPI();

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.error("❌ Test suite failed:", error);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = {
  createTestCleaner,
  testAdminAPI,
};
