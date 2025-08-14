const { query } = require("./config/database");

async function checkCleaners() {
  try {
    console.log("🔍 Checking available cleaners...");

    const result = await query(`
      SELECT u.id, u.first_name, u.last_name, u.zip_code, cp.is_available, cp.rating, cp.total_jobs
      FROM users u 
      JOIN cleaner_profiles cp ON u.id = cp.user_id 
      WHERE u.role = 'cleaner' AND u.is_active = true 
      LIMIT 5
    `);

    console.log("Available cleaners:", result.rows);

    if (result.rows.length === 0) {
      console.log(
        "❌ No cleaners found. Running test cleaner creation script..."
      );

      // Create a test cleaner
      const testCleanerResult = await query(`
        INSERT INTO users (first_name, last_name, email, password, role, phone, zip_code, is_active)
        VALUES ('Test', 'Cleaner', 'test.cleaner@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cleaner', '555-0123', '82600', true)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `);

      if (testCleanerResult.rows.length > 0) {
        const cleanerId = testCleanerResult.rows[0].id;

        // Create cleaner profile
        await query(
          `
          INSERT INTO cleaner_profiles (user_id, hourly_rate, service_radius, rating, total_jobs, is_available, background_check_status, experience_years)
          VALUES ($1, 25.00, 15, 4.5, 10, true, 'approved', 2)
          ON CONFLICT (user_id) DO UPDATE SET
            hourly_rate = 25.00,
            service_radius = 15,
            rating = 4.5,
            total_jobs = 10,
            is_available = true,
            background_check_status = 'approved',
            experience_years = 2
        `,
          [cleanerId]
        );

        console.log("✅ Test cleaner created successfully");
      } else {
        // Update existing test cleaner profile
        await query(`
          UPDATE cleaner_profiles 
          SET is_available = true, background_check_status = 'approved'
          WHERE user_id = (SELECT id FROM users WHERE email = 'test.cleaner@example.com')
        `);
        console.log("✅ Existing test cleaner updated");
      }
    }

    // Check again after potential creation
    const finalResult = await query(`
      SELECT u.id, u.first_name, u.last_name, u.zip_code, cp.is_available, cp.rating, cp.total_jobs
      FROM users u 
      JOIN cleaner_profiles cp ON u.id = cp.user_id 
      WHERE u.role = 'cleaner' AND u.is_active = true 
      LIMIT 5
    `);

    console.log("Final cleaner list:", finalResult.rows);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
}

checkCleaners();
