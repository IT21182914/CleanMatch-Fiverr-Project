const { query, connectDB } = require("./config/database");

async function createSampleReviews() {
  try {
    await connectDB();

    // Insert some sample admin reviews
    const sampleReviews = [
      {
        reviewer_name: "Jessica Martinez",
        cleaner_id: 1, // Assuming cleaner ID 1 exists
        rating: 5,
        comment:
          "Outstanding service! The team was punctual, professional, and left my home absolutely spotless. I highly recommend this cleaning service to anyone looking for quality work.",
        service_type: "Deep Cleaning",
        is_admin_review: true,
      },
      {
        reviewer_name: "Robert Thompson",
        cleaner_id: 1,
        rating: 5,
        comment:
          "Exceptional attention to detail. They cleaned areas I never even thought needed cleaning. Very professional and courteous staff. Will definitely book again!",
        service_type: "Standard Cleaning",
        is_admin_review: true,
      },
      {
        reviewer_name: "Amanda Wilson",
        cleaner_id: 1,
        rating: 4,
        comment:
          "Great service overall. The cleaners were efficient and thorough. My office space has never looked better. Highly satisfied with the results.",
        service_type: "Office Cleaning",
        is_admin_review: true,
      },
    ];

    console.log("📝 Creating sample admin reviews...");

    for (const review of sampleReviews) {
      await query(
        `INSERT INTO reviews (reviewer_name, cleaner_id, rating, comment, service_type, is_admin_review, is_visible, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW())`,
        [
          review.reviewer_name,
          review.cleaner_id,
          review.rating,
          review.comment,
          review.service_type,
          review.is_admin_review,
        ]
      );
    }

    console.log("✅ Sample admin reviews created successfully!");

    // Verify the reviews were created
    const result = await query(
      "SELECT COUNT(*) as count FROM reviews WHERE is_admin_review = true"
    );
    console.log(`📊 Total admin reviews in database: ${result.rows[0].count}`);
  } catch (error) {
    console.error("❌ Error creating sample reviews:", error);
  } finally {
    process.exit(0);
  }
}

createSampleReviews();
