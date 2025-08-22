require("dotenv").config();
const { query, connectDB } = require("./config/database");
const bcrypt = require("bcryptjs");

async function createTestAdmin() {
  try {
    await connectDB();
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Delete existing test admin first
    await query("DELETE FROM users WHERE email = $1", [
      "testadmin@cleanmatch.com",
    ]);

    // Create new test admin
    const result = await query(
      "INSERT INTO users (email, password, first_name, last_name, role, is_verified, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id, email",
      [
        "testadmin@cleanmatch.com",
        hashedPassword,
        "Test",
        "Admin",
        "admin",
        true,
        true,
      ]
    );

    console.log("Test admin created:", result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

createTestAdmin();
