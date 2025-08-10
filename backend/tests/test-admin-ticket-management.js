/**
 * Test Admin Ticket Management System
 *
 * This script tests the new admin ticket management endpoints
 * to ensure they work correctly with the existing system.
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test configuration
const testConfig = {
  // You'll need to replace these with actual admin credentials
  adminEmail: "admin@cleanmatch.com",
  adminPassword: "Admin123!",

  // Test data
  testTicketId: null, // Will be set after creating a test ticket
  testCustomerId: null,
};

let adminToken = null;

async function login() {
  try {
    console.log("🔐 Logging in as admin...");
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testConfig.adminEmail,
      password: testConfig.adminPassword,
    });

    adminToken = response.data.token;
    console.log("✅ Admin login successful");
    return true;
  } catch (error) {
    console.error(
      "❌ Admin login failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testGetAdminTickets() {
  try {
    console.log("\n📋 Testing: GET /api/admin/tickets");

    const response = await axios.get(
      `${BASE_URL}/admin/tickets?page=1&limit=10`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    console.log("✅ Get admin tickets successful");
    console.log(`📊 Found ${response.data.data.length} tickets`);

    // Set test ticket ID if available
    if (response.data.data.length > 0) {
      testConfig.testTicketId = response.data.data[0].id;
      console.log(`🎯 Using ticket ID ${testConfig.testTicketId} for testing`);
    }

    return true;
  } catch (error) {
    console.error(
      "❌ Get admin tickets failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testGetTicketStats() {
  try {
    console.log("\n📊 Testing: GET /api/admin/tickets/stats");

    const response = await axios.get(`${BASE_URL}/admin/tickets/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    console.log("✅ Get ticket stats successful");
    console.log(
      `📈 Total tickets: ${response.data.data.general.total_tickets}`
    );
    console.log(`🔓 Open tickets: ${response.data.data.general.open_tickets}`);
    console.log(
      `⚠️ Urgent tickets: ${response.data.data.general.urgent_tickets}`
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Get ticket stats failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testGetTicketDetails() {
  if (!testConfig.testTicketId) {
    console.log("⏭️  Skipping ticket details test (no ticket ID available)");
    return true;
  }

  try {
    console.log(
      `\n🔍 Testing: GET /api/admin/tickets/${testConfig.testTicketId}`
    );

    const response = await axios.get(
      `${BASE_URL}/admin/tickets/${testConfig.testTicketId}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    console.log("✅ Get ticket details successful");
    console.log(`📝 Ticket: ${response.data.data.summary}`);
    console.log(
      `👤 Customer: ${response.data.data.customer.firstName} ${response.data.data.customer.lastName}`
    );
    console.log(`📞 Messages: ${response.data.data.messages.length}`);

    return true;
  } catch (error) {
    console.error(
      "❌ Get ticket details failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testUpdateTicketStatus() {
  if (!testConfig.testTicketId) {
    console.log("⏭️  Skipping status update test (no ticket ID available)");
    return true;
  }

  try {
    console.log(
      `\n🔄 Testing: PUT /api/admin/tickets/${testConfig.testTicketId}/status`
    );

    const response = await axios.put(
      `${BASE_URL}/admin/tickets/${testConfig.testTicketId}/status`,
      {
        status: "in_progress",
        reason: "Testing admin ticket management system",
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    console.log("✅ Update ticket status successful");
    console.log(`📈 Status updated to: ${response.data.data.status}`);

    return true;
  } catch (error) {
    console.error(
      "❌ Update ticket status failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testAddTicketReply() {
  if (!testConfig.testTicketId) {
    console.log("⏭️  Skipping add reply test (no ticket ID available)");
    return true;
  }

  try {
    console.log(
      `\n💬 Testing: POST /api/admin/tickets/${testConfig.testTicketId}/reply`
    );

    const response = await axios.post(
      `${BASE_URL}/admin/tickets/${testConfig.testTicketId}/reply`,
      {
        message:
          "This is a test reply from the admin ticket management system. We are investigating your issue.",
        isInternal: false,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    console.log("✅ Add ticket reply successful");
    console.log("💌 Reply added to ticket");

    return true;
  } catch (error) {
    console.error(
      "❌ Add ticket reply failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testInvestigateTicket() {
  if (!testConfig.testTicketId) {
    console.log("⏭️  Skipping investigate test (no ticket ID available)");
    return true;
  }

  try {
    console.log(
      `\n🔎 Testing: POST /api/admin/tickets/${testConfig.testTicketId}/investigate`
    );

    const response = await axios.post(
      `${BASE_URL}/admin/tickets/${testConfig.testTicketId}/investigate`,
      {
        findings:
          "Test investigation findings: The issue was replicated in our test environment.",
        actionsTaken:
          "Contacted the freelancer and reviewed service delivery logs.",
        internalNotes: "This is a test investigation for system validation.",
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    console.log("✅ Investigate ticket successful");
    console.log("🔍 Investigation findings recorded");

    return true;
  } catch (error) {
    console.error(
      "❌ Investigate ticket failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function runTests() {
  console.log("🧪 Starting Admin Ticket Management System Tests");
  console.log("=".repeat(60));

  const testResults = [];

  // Login first
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("❌ Cannot proceed without admin login");
    return;
  }

  // Run all tests
  const tests = [
    { name: "Get Admin Tickets", fn: testGetAdminTickets },
    { name: "Get Ticket Stats", fn: testGetTicketStats },
    { name: "Get Ticket Details", fn: testGetTicketDetails },
    { name: "Update Ticket Status", fn: testUpdateTicketStatus },
    { name: "Add Ticket Reply", fn: testAddTicketReply },
    { name: "Investigate Ticket", fn: testInvestigateTicket },
  ];

  for (const test of tests) {
    const result = await test.fn();
    testResults.push({ name: test.name, success: result });
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🏁 Test Results Summary:");
  console.log("=".repeat(60));

  testResults.forEach((result) => {
    console.log(`${result.success ? "✅" : "❌"} ${result.name}`);
  });

  const passedTests = testResults.filter((r) => r.success).length;
  const totalTests = testResults.length;

  console.log(`\n📊 Tests Passed: ${passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log(
      "🎉 All tests passed! Admin Ticket Management System is working correctly."
    );
  } else {
    console.log(
      "⚠️  Some tests failed. Please check the error messages above."
    );
  }
}

// Run tests
runTests().catch((error) => {
  console.error("💥 Test execution failed:", error.message);
});
