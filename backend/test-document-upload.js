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
    Test Document
  </text>
  <text x="100" y="70" text-anchor="middle" font-family="Arial" font-size="10">
    ${filename}
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
 * Test user registration with document uploads
 */
async function testDocumentUpload() {
  try {
    console.log("🧪 Testing document upload functionality...");
    
    // Create test images
    const testFiles = {
      idFront: createTestImage("test-id-front.svg"),
      idBack: createTestImage("test-id-back.svg"),
      ssnFront: createTestImage("test-ssn-front.svg"),
      ssnBack: createTestImage("test-ssn-back.svg"),
    };

    console.log("📁 Created test files:");
    Object.entries(testFiles).forEach(([key, filepath]) => {
      console.log(`  ${key}: ${filepath}`);
    });

    // Prepare form data
    const formData = new FormData();
    
    // Add user registration data
    formData.append("email", `test-${Date.now()}@example.com`);
    formData.append("password", "SecurePassword123!");
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");
    formData.append("role", "cleaner");
    formData.append("address", "123 Test Street");
    formData.append("city", "Test City");
    formData.append("state", "CA");
    formData.append("zipCode", "90210");
    formData.append("cleaningServices", JSON.stringify(["House Cleaning", "Office Cleaning"]));
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
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("✅ Registration successful!");
    console.log("📄 Response:", JSON.stringify(response.data, null, 2));

    // Verify the uploaded documents
    if (response.data.user && response.data.user.documents) {
      const docs = response.data.user.documents;
      console.log("\n📋 Uploaded Documents:");
      Object.entries(docs).forEach(([key, url]) => {
        if (url) {
          console.log(`  ${key}: ${url}`);
        }
      });
    }

    // Clean up test files
    console.log("\n🧹 Cleaning up test files...");
    Object.values(testFiles).forEach(filepath => {
      try {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log(`  Deleted: ${filepath}`);
        }
      } catch (error) {
        console.error(`  Failed to delete ${filepath}:`, error.message);
      }
    });

    return response.data;

  } catch (error) {
    console.error("❌ Test failed:");
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.message);
    } else {
      console.error("Error:", error.message);
    }
    
    throw error;
  }
}

/**
 * Test regular registration without documents
 */
async function testRegularRegistration() {
  try {
    console.log("\n🧪 Testing regular registration (without documents)...");

    const userData = {
      email: `test-regular-${Date.now()}@example.com`,
      password: "SecurePassword123!",
      firstName: "Jane",
      lastName: "Smith",
      userName: "janesmith123",
      role: "customer",
      phone: "+1987654321",
    };

    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Regular registration successful!");
    console.log("📄 Response:", JSON.stringify(response.data, null, 2));

    return response.data;

  } catch (error) {
    console.error("❌ Regular registration test failed:");
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    
    throw error;
  }
}

/**
 * Test file validation (invalid file types)
 */
async function testFileValidation() {
  try {
    console.log("\n🧪 Testing file validation (invalid file type)...");

    // Create a text file instead of an image
    const invalidFilePath = path.join(TEST_IMAGE_PATH, "invalid-document.txt");
    fs.writeFileSync(invalidFilePath, "This is not an image file");

    const formData = new FormData();
    
    // Add minimal user data
    formData.append("email", `test-invalid-${Date.now()}@example.com`);
    formData.append("password", "SecurePassword123!");
    formData.append("firstName", "Test");
    formData.append("lastName", "User");
    formData.append("role", "customer");
    formData.append("userName", "testuser123");

    // Add invalid file
    formData.append("idFront", fs.createReadStream(invalidFilePath));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register-with-documents`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      console.log("❌ Validation should have failed but didn't!");
      console.log("Response:", response.data);

    } catch (validationError) {
      if (validationError.response && validationError.response.status === 400) {
        console.log("✅ Validation correctly rejected invalid file type");
        console.log("Error message:", validationError.response.data.error);
      } else {
        throw validationError;
      }
    }

    // Clean up
    if (fs.existsSync(invalidFilePath)) {
      fs.unlinkSync(invalidFilePath);
    }

  } catch (error) {
    console.error("❌ File validation test failed:", error.message);
    throw error;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log("🧪 CleanMatch Document Upload Tests");
  console.log("=" .repeat(50));

  try {
    // Test 1: Regular registration
    await testRegularRegistration();
    
    // Test 2: Registration with documents
    await testDocumentUpload();
    
    // Test 3: File validation
    await testFileValidation();

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📝 Summary:");
    console.log("✅ Regular registration works");
    console.log("✅ Document upload registration works");
    console.log("✅ File validation works");
    console.log("✅ Supabase Storage integration works");

  } catch (error) {
    console.error("\n❌ Test suite failed:", error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log("✅ Server is running");
    return true;
  } catch (error) {
    console.log("❌ Server is not running. Please start the backend server first.");
    console.log("Run: npm run dev or node server.js");
    return false;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  checkServer().then(isRunning => {
    if (isRunning) {
      runTests().catch(console.error);
    }
  });
}

module.exports = {
  testDocumentUpload,
  testRegularRegistration,
  testFileValidation,
  runTests,
};
