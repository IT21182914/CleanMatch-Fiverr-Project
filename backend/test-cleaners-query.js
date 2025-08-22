require("dotenv").config();
const { query, connectDB } = require("./config/database");

async function testCleanersDirectly() {
  try {
    await connectDB();
    console.log("Testing direct database query for cleaners...");

    // First, let's see what columns exist in the users table
    const columnsResult = await query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'users' 
       ORDER BY ordinal_position`
    );

    console.log("Available columns in users table:");
    columnsResult.rows.forEach((col) => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });

    // Now let's get cleaners with available columns
    const result = await query(
      `SELECT id, first_name, last_name, email, is_active 
       FROM users 
       WHERE role = $1 
       ORDER BY first_name, last_name`,
      ["cleaner"]
    );

    console.log("\nFound", result.rows.length, "cleaners:");
    result.rows.forEach((cleaner) => {
      console.log(
        `- ${cleaner.id}: ${cleaner.first_name} ${cleaner.last_name} (${cleaner.email}) - Active: ${cleaner.is_active}`
      );
    });

    const activeCleaners = result.rows.filter((c) => c.is_active);
    console.log("Active cleaners:", activeCleaners.length);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

testCleanersDirectly();
