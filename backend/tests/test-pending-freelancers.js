const { query, connectDB } = require("../config/database");

/**
 * Test script to check pending freelancers in database
 */
async function testPendingFreelancers() {
  try {
    console.log("🔍 Testing Pending Freelancers Database Query...");

    // Initialize database connection
    await connectDB();
    console.log("✅ Database connected");

    // First, let's see what users exist
    const allUsersResult = await query(`
      SELECT id, email, first_name, last_name, role, created_at
      FROM users 
      WHERE role = 'cleaner'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    console.log(`\n👥 Found ${allUsersResult.rows.length} cleaner users:`);
    allUsersResult.rows.forEach((user, i) => {
      console.log(
        `  ${i + 1}. ${user.first_name} ${user.last_name} (${
          user.email
        }) - ID: ${user.id}`
      );
    });

    // Check cleaner profiles
    const cleanerProfilesResult = await query(`
      SELECT 
        cp.user_id,
        cp.background_check_status,
        cp.id_front_url,
        cp.id_back_url, 
        cp.ssn_front_url,
        cp.ssn_back_url,
        u.first_name,
        u.last_name,
        u.email
      FROM cleaner_profiles cp
      JOIN users u ON cp.user_id = u.id
      WHERE u.role = 'cleaner'
      ORDER BY cp.created_at DESC
      LIMIT 10
    `);

    console.log(
      `\n📋 Found ${cleanerProfilesResult.rows.length} cleaner profiles:`
    );
    cleanerProfilesResult.rows.forEach((profile, i) => {
      const docCount = [
        profile.id_front_url,
        profile.id_back_url,
        profile.ssn_front_url,
        profile.ssn_back_url,
      ].filter(Boolean).length;

      console.log(`  ${i + 1}. ${profile.first_name} ${profile.last_name}`);
      console.log(`     Status: ${profile.background_check_status}`);
      console.log(`     Documents: ${docCount}/4`);
      console.log(`     ID Front: ${profile.id_front_url ? "✓" : "✗"}`);
      console.log(`     ID Back: ${profile.id_back_url ? "✓" : "✗"}`);
      console.log(`     SSN Front: ${profile.ssn_front_url ? "✓" : "✗"}`);
      console.log(`     SSN Back: ${profile.ssn_back_url ? "✓" : "✗"}`);
      console.log("");
    });

    // Now check the actual pending freelancers query
    const pendingQuery = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.address, u.city, u.state, u.zip_code,
        u.created_at, u.is_active,
        cp.cleaning_services, cp.cleaning_frequency, cp.preferred_hours, cp.message,
        cp.id_front_url, cp.id_back_url, cp.ssn_front_url, cp.ssn_back_url,
        cp.agreement_accepted, cp.terms_1099_accepted, cp.brings_supplies, cp.has_experience,
        cp.background_check_status, cp.created_at as profile_created_at
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND cp.background_check_status = 'pending'
        AND cp.id_front_url IS NOT NULL 
        AND cp.id_back_url IS NOT NULL
        AND cp.ssn_front_url IS NOT NULL
        AND cp.ssn_back_url IS NOT NULL
      ORDER BY u.created_at DESC
      LIMIT 20
    `;

    const pendingResult = await query(pendingQuery);

    console.log(
      `\n🕒 Found ${pendingResult.rows.length} pending freelancers with all required documents:`
    );

    if (pendingResult.rows.length === 0) {
      console.log(
        "❌ No pending freelancers found with complete document uploads"
      );
      console.log(
        "\n💡 To see pending freelancers, you need freelancers that have:"
      );
      console.log("   1. role = 'cleaner'");
      console.log("   2. background_check_status = 'pending'");
      console.log(
        "   3. All 4 document URLs: id_front_url, id_back_url, ssn_front_url, ssn_back_url"
      );
    } else {
      pendingResult.rows.forEach((freelancer, i) => {
        console.log(
          `  ${i + 1}. ${freelancer.first_name} ${freelancer.last_name} (${
            freelancer.email
          })`
        );
        console.log(`     Status: ${freelancer.background_check_status}`);
        console.log(`     Documents:`);
        console.log(`       ID Front: ${freelancer.id_front_url}`);
        console.log(`       ID Back: ${freelancer.id_back_url}`);
        console.log(`       SSN Front: ${freelancer.ssn_front_url}`);
        console.log(`       SSN Back: ${freelancer.ssn_back_url}`);
        console.log("");
      });
    }

    // Let's also check if there are any freelancers with missing documents
    const incompleteQuery = `
      SELECT 
        u.id, u.first_name, u.last_name, u.email,
        cp.background_check_status,
        cp.id_front_url,
        cp.id_back_url,
        cp.ssn_front_url,
        cp.ssn_back_url
      FROM users u
      JOIN cleaner_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'cleaner' 
        AND cp.background_check_status = 'pending'
        AND (
          cp.id_front_url IS NULL OR 
          cp.id_back_url IS NULL OR 
          cp.ssn_front_url IS NULL OR 
          cp.ssn_back_url IS NULL
        )
      ORDER BY u.created_at DESC
    `;

    const incompleteResult = await query(incompleteQuery);

    if (incompleteResult.rows.length > 0) {
      console.log(
        `\n⚠️  Found ${incompleteResult.rows.length} pending freelancers with incomplete documents:`
      );
      incompleteResult.rows.forEach((freelancer, i) => {
        const docCount = [
          freelancer.id_front_url,
          freelancer.id_back_url,
          freelancer.ssn_front_url,
          freelancer.ssn_back_url,
        ].filter(Boolean).length;

        console.log(
          `  ${i + 1}. ${freelancer.first_name} ${
            freelancer.last_name
          } - ${docCount}/4 documents`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error testing pending freelancers:", error);
  }
}

// Run the test
if (require.main === module) {
  testPendingFreelancers()
    .then(() => {
      console.log("\n✅ Test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Test failed:", error);
      process.exit(1);
    });
}

module.exports = {
  testPendingFreelancers,
};
