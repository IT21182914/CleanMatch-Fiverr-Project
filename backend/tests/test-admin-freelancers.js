require("dotenv").config();
const axios = require("axios");

const API_BASE = "http://localhost:5000/api";
let adminToken = null;

// Test admin login and get token
const testAdminLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: "admin@cleanmatch.com", // Update with actual admin email
      password: "Admin123!", // Update with actual admin password
    });

    if (response.data.success) {
      adminToken = response.data.token;
      console.log("✅ Admin login successful");
      return true;
    }
  } catch (error) {
    console.error(
      "❌ Admin login failed:",
      error.response?.data || error.message
    );
    return false;
  }
};

// Test getting pending freelancers
const testGetPendingFreelancers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/admin/freelancers/pending`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    console.log("✅ Get pending freelancers successful:");
    console.log("Total pending:", response.data.pagination.total);
    console.log("Freelancers:", response.data.freelancers.length);

    if (response.data.freelancers.length > 0) {
      const firstFreelancer = response.data.freelancers[0];
      console.log("First freelancer:", {
        id: firstFreelancer.id,
        name: `${firstFreelancer.first_name} ${firstFreelancer.last_name}`,
        email: firstFreelancer.email,
        status: firstFreelancer.background_check_status,
      });

      return firstFreelancer.id;
    }

    return null;
  } catch (error) {
    console.error(
      "❌ Get pending freelancers failed:",
      error.response?.data || error.message
    );
    return null;
  }
};

// Test getting freelancer details
const testGetFreelancerDetails = async (freelancerId) => {
  try {
    const response = await axios.get(
      `${API_BASE}/admin/freelancers/${freelancerId}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    console.log("✅ Get freelancer details successful:");
    console.log("Freelancer details:", {
      id: response.data.freelancer.id,
      name: `${response.data.freelancer.first_name} ${response.data.freelancer.last_name}`,
      documents: {
        idFront: !!response.data.freelancer.id_front_url,
        idBack: !!response.data.freelancer.id_back_url,
        ssnFront: !!response.data.freelancer.ssn_front_url,
        ssnBack: !!response.data.freelancer.ssn_back_url,
      },
      agreements: {
        contractor: response.data.freelancer.agreement_accepted,
        terms1099: response.data.freelancer.terms_1099_accepted,
        supplies: response.data.freelancer.brings_supplies,
        experience: response.data.freelancer.has_experience,
      },
    });

    return true;
  } catch (error) {
    console.error(
      "❌ Get freelancer details failed:",
      error.response?.data || error.message
    );
    return false;
  }
};

// Test admin dashboard stats
const testDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    console.log("✅ Dashboard stats successful:");
    console.log(
      "Pending freelancers count:",
      response.data.stats.pendingFreelancers
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Dashboard stats failed:",
      error.response?.data || error.message
    );
    return false;
  }
};

// Main test runner
const runTests = async () => {
  console.log("🚀 Starting Admin Freelancer Management Tests...");

  try {
    // Test admin login
    const loginSuccess = await testAdminLogin();
    if (!loginSuccess) {
      console.log("❌ Cannot proceed without admin login");
      return;
    }

    // Test dashboard stats
    await testDashboardStats();

    // Test getting pending freelancers
    const freelancerId = await testGetPendingFreelancers();

    if (freelancerId) {
      // Test getting freelancer details
      await testGetFreelancerDetails(freelancerId);
    } else {
      console.log("ℹ️ No pending freelancers found to test details endpoint");
    }

    console.log("\n🎉 All tests completed!");
  } catch (error) {
    console.error("\n💥 Test suite failed:", error.message);
  }
};

// Run the tests
runTests();
