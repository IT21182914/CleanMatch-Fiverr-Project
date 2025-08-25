const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testReviewsData() {
  try {
    console.log('🔍 Testing Reviews System...\n');
    
    // Get cleaners
    const cleaners = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE role = $1 LIMIT 3', 
      ['cleaner']
    );
    
    console.log(`👤 Found ${cleaners.rows.length} cleaners:`);
    cleaners.rows.forEach(c => {
      console.log(`- ID: ${c.id}, Name: ${c.first_name} ${c.last_name}`);
    });
    
    if (cleaners.rows.length > 0) {
      const cleanerId = cleaners.rows[0].id;
      const cleanerName = `${cleaners.rows[0].first_name} ${cleaners.rows[0].last_name}`;
      
      console.log(`\n📊 Checking reviews for ${cleanerName} (ID: ${cleanerId}):`);
      
      // Customer reviews
      const customerReviews = await pool.query(
        'SELECT id, rating, comment, created_at FROM reviews WHERE cleaner_id = $1 ORDER BY created_at DESC', 
        [cleanerId]
      );
      console.log(`📝 Customer reviews: ${customerReviews.rows.length}`);
      
      // Admin reviews  
      const adminReviews = await pool.query(
        'SELECT id, rating, comment, created_at FROM admin_reviews WHERE cleaner_id = $1 ORDER BY created_at DESC', 
        [cleanerId]
      );
      console.log(`🏢 Admin reviews: ${adminReviews.rows.length}`);
      
      // Profile rating
      const profile = await pool.query(
        'SELECT rating, total_reviews FROM cleaner_profiles WHERE user_id = $1', 
        [cleanerId]
      );
      const profileData = profile.rows[0];
      console.log(`⭐ Current profile rating: ${profileData?.rating || 'N/A'}`);
      console.log(`📈 Total reviews in profile: ${profileData?.total_reviews || 0}`);
      
      // Test combined query (like our API endpoint)
      console.log('\n🔗 Testing combined reviews query...');
      const combinedQuery = `
        (
          SELECT 
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            'customer' as review_type,
            u.first_name as reviewer_name
          FROM reviews r
          JOIN users u ON r.user_id = u.id
          WHERE r.cleaner_id = $1
        )
        UNION ALL
        (
          SELECT 
            ar.id,
            ar.rating,
            ar.comment,
            ar.created_at,
            'admin' as review_type,
            'Admin' as reviewer_name
          FROM admin_reviews ar
          WHERE ar.cleaner_id = $1
        )
        ORDER BY created_at DESC
        LIMIT 5
      `;
      
      const combinedResult = await pool.query(combinedQuery, [cleanerId]);
      console.log(`🎯 Combined reviews found: ${combinedResult.rows.length}`);
      
      combinedResult.rows.forEach((review, index) => {
        console.log(`${index + 1}. ${review.review_type.toUpperCase()} - Rating: ${review.rating}/5, By: ${review.reviewer_name}`);
        if (review.comment) {
          console.log(`   Comment: ${review.comment.substring(0, 60)}...`);
        }
      });
      
      // If no reviews exist, let's create some test data
      if (combinedResult.rows.length === 0) {
        console.log('\n📝 No reviews found. Creating test data...');
        
        // Create a test admin review
        await pool.query(
          `INSERT INTO admin_reviews (cleaner_id, rating, comment, service_category, reviewer_email, created_at) 
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [cleanerId, 5, 'Excellent work! Admin approved quality.', 'House Cleaning', 'admin@cleanmatch.com']
        );
        
        // Update cleaner rating
        await pool.query(
          `UPDATE cleaner_profiles 
           SET rating = 5.0, total_reviews = 1, updated_at = NOW() 
           WHERE user_id = $1`,
          [cleanerId]
        );
        
        console.log('✅ Test admin review created and rating updated!');
      }
      
    } else {
      console.log('❌ No cleaners found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
    console.log('\n🏁 Test completed!');
  }
}

testReviewsData();
