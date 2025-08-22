require("dotenv").config();
const { query, connectDB } = require("./config/database");

async function testCleanersAPI() {
  try {
    await connectDB();

    // Test the exact query from the controller
    console.log("Testing cleaners API query...");
    const result = await query(
      `SELECT 
        id, 
        first_name, 
        last_name, 
        email,
        rating,
        review_count
      FROM users 
      WHERE role = 'cleaner' AND is_active = true
      ORDER BY first_name, last_name`
    );

    console.log(`Found ${result.rows.length} cleaners:`);

    result.rows.forEach((cleaner) => {
      const name = `${cleaner.first_name} ${cleaner.last_name}`;
      const rating = cleaner.rating || 0;
      const reviewCount = cleaner.review_count || 0;

      console.log(
        `- ${cleaner.id}: ${name} (${cleaner.email}) - ⭐ ${rating.toFixed(
          1
        )} (${reviewCount} reviews)`
      );
    });

    // Test the controller transformation
    const cleaners = result.rows.map((cleaner) => ({
      id: cleaner.id,
      name: `${cleaner.first_name} ${cleaner.last_name}`,
      email: cleaner.email,
      rating: cleaner.rating || 0,
      reviewCount: cleaner.review_count || 0,
    }));

    console.log("\nTransformed data for frontend:");
    console.log(JSON.stringify({ success: true, cleaners }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testCleanersAPI();
