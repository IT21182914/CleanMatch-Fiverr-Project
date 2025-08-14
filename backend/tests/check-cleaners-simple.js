const { query, connectDB } = require("./config/database");

async function checkCleaners() {
  try {
    await connectDB();

    // Check if there are any cleaner users
    const result = await query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'cleaner'"
    );
    console.log(`📊 Total cleaners in database: ${result.rows[0].count}`);

    // If no cleaners, create some sample ones
    if (parseInt(result.rows[0].count) === 0) {
      console.log("📝 Creating sample cleaners...");

      const sampleCleaners = [
        {
          first_name: "Maria",
          last_name: "Santos",
          email: "maria.santos@example.com",
          role: "cleaner",
        },
        {
          first_name: "David",
          last_name: "Kim",
          email: "david.kim@example.com",
          role: "cleaner",
        },
        {
          first_name: "Lisa",
          last_name: "Thompson",
          email: "lisa.thompson@example.com",
          role: "cleaner",
        },
      ];

      for (const cleaner of sampleCleaners) {
        await query(
          `INSERT INTO users (first_name, last_name, email, role, is_active, created_at) 
           VALUES ($1, $2, $3, $4, true, NOW())
           ON CONFLICT (email) DO NOTHING`,
          [cleaner.first_name, cleaner.last_name, cleaner.email, cleaner.role]
        );
      }

      const newResult = await query(
        "SELECT COUNT(*) as count FROM users WHERE role = 'cleaner'"
      );
      console.log(
        `✅ Sample cleaners created! Total: ${newResult.rows[0].count}`
      );
    }

    // Show some cleaner details
    const cleaners = await query(
      "SELECT id, first_name, last_name, email FROM users WHERE role = 'cleaner' LIMIT 5"
    );

    console.log("👥 Available cleaners:");
    cleaners.rows.forEach((cleaner) => {
      console.log(
        `  - ${cleaner.first_name} ${cleaner.last_name} (ID: ${cleaner.id})`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
}

checkCleaners();
