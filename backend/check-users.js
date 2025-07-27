require("dotenv").config();
const { query, connectDB } = require("./config/database");

const checkUsers = async () => {
  try {
    await connectDB();
    console.log("🔍 Checking all cleaner users in the database...\n");

    const result = await query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, 
             cp.background_check_status, cp.id_front_url, cp.id_back_url
      FROM users u 
      LEFT JOIN cleaner_profiles cp ON u.id = cp.user_id 
      WHERE u.role = 'cleaner' 
      ORDER BY u.id
    `);

    if (result.rows.length === 0) {
      console.log("❌ No cleaner users found");
    } else {
      console.log(`✅ Found ${result.rows.length} cleaner users:\n`);

      result.rows.forEach((user) => {
        console.log(`📋 User ID: ${user.id}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);
        console.log(`   Email: ${user.email}`);
        console.log(
          `   Status: ${user.background_check_status || "No profile"}`
        );
        console.log(`   ID Front: ${user.id_front_url || "Not set"}`);
        console.log(`   ID Back: ${user.id_back_url || "Not set"}`);
        console.log("");
      });
    }

    // Check if user 35 specifically exists
    const user35 = await query("SELECT * FROM users WHERE id = $1", [35]);
    if (user35.rows.length > 0) {
      console.log(
        "✅ User 35 exists:",
        user35.rows[0].first_name,
        user35.rows[0].last_name
      );
    } else {
      console.log("❌ User 35 does not exist");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkUsers();
