require("dotenv").config();
const { query, connectDB } = require("../config/database");
const bcrypt = require("bcryptjs");

const createAdminUser = async () => {
  try {
    await connectDB();
    console.log("🔍 Checking for existing admin users...");

    // Check if admin exists
    const existingAdmin = await query(
      "SELECT id, email, role FROM users WHERE role = $1",
      ["admin"]
    );

    if (existingAdmin.rows.length > 0) {
      console.log("✅ Admin users found:");
      existingAdmin.rows.forEach((admin) => {
        console.log(
          `   - ID: ${admin.id}, Email: ${admin.email}, Role: ${admin.role}`
        );
      });

      // Check and activate admin accounts
      console.log("🔧 Activating all admin accounts...");
      await query(
        "UPDATE users SET is_active = true, is_verified = true WHERE role = $1",
        ["admin"]
      );
      console.log("✅ All admin accounts activated and verified!");
    } else {
      console.log("❌ No admin users found. Creating default admin...");

      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const adminResult = await query(
        `INSERT INTO users (
          email, password, first_name, last_name, role, 
          is_verified, is_active, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        RETURNING id, email, role`,
        [
          "admin@cleanmatch.com",
          hashedPassword,
          "Admin",
          "User",
          "admin",
          true,
          true,
        ]
      );

      console.log("✅ Admin user created successfully:");
      console.log(`   - ID: ${adminResult.rows[0].id}`);
      console.log(`   - Email: ${adminResult.rows[0].email}`);
      console.log(`   - Role: ${adminResult.rows[0].role}`);
      console.log(`   - Password: admin123`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdminUser();
