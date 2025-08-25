require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function createTestReviews() {
  try {
    console.log('🧪 Creating test review data...\n');
    
    // Get a cleaner to add reviews to
    const cleaners = await pool.query("SELECT id, first_name, last_name FROM users WHERE role = 'cleaner' LIMIT 1");
    
    if (cleaners.rows.length === 0) {
      console.log('❌ No cleaners found');
      return;
    }
    
    const cleaner = cleaners.rows[0];
    const cleanerId = cleaner.id;
    console.log(`👤 Using cleaner: ${cleaner.first_name} ${cleaner.last_name} (ID: ${cleanerId})`);
    
    // Get a customer to create reviews from
    const customers = await pool.query("SELECT id FROM users WHERE role = 'customer' LIMIT 1");
    const customerId = customers.rows.length > 0 ? customers.rows[0].id : null;
    
    // Create test customer review (if we have a customer)
    if (customerId) {
      console.log('\n📝 Creating test customer review...');
      await pool.query(`
        INSERT INTO reviews (booking_id, customer_id, cleaner_id, rating, comment, created_at, updated_at) 
        VALUES (NULL, $1, $2, 5, 'Excellent service! Very thorough and professional.', NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [customerId, cleanerId]);
      
      await pool.query(`
        INSERT INTO reviews (booking_id, customer_id, cleaner_id, rating, comment, created_at, updated_at) 
        VALUES (NULL, $1, $2, 4, 'Good work, arrived on time.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
        ON CONFLICT DO NOTHING
      `, [customerId, cleanerId]);
      
      console.log('✅ Customer reviews created');
    }
    
    // Create test admin reviews
    console.log('\n🏢 Creating test admin reviews...');
    const adminId = 5; // We know this admin exists from our earlier check
    
    await pool.query(`
      INSERT INTO admin_reviews (cleaner_id, admin_id, rating, review_text, is_visible, created_at, updated_at) 
      VALUES ($1, $2, 5, 'Outstanding cleaner! Consistent quality work and professionalism.', true, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [cleanerId, adminId]);
    
    await pool.query(`
      INSERT INTO admin_reviews (cleaner_id, admin_id, rating, review_text, is_visible, created_at, updated_at) 
      VALUES ($1, $2, 4, 'Reliable and efficient. Minor room for improvement in communication.', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')
      ON CONFLICT DO NOTHING
    `, [cleanerId, adminId]);
    
    console.log('✅ Admin reviews created');
    
    // Now update the cleaner profile rating manually to simulate our rating system
    console.log('\n⭐ Calculating combined rating...');
    
    // Get all reviews for this cleaner
    const customerReviews = await pool.query('SELECT rating FROM reviews WHERE cleaner_id = $1', [cleanerId]);
    const adminReviews = await pool.query('SELECT rating FROM admin_reviews WHERE cleaner_id = $1', [cleanerId]);
    
    let totalRating = 0;
    let totalCount = 0;
    
    customerReviews.rows.forEach(review => {
      totalRating += review.rating;
      totalCount++;
    });
    
    adminReviews.rows.forEach(review => {
      totalRating += review.rating;
      totalCount++;
    });
    
    const averageRating = totalCount > 0 ? (totalRating / totalCount) : 0;
    
    console.log(`📊 Customer reviews: ${customerReviews.rows.length}`);
    console.log(`📊 Admin reviews: ${adminReviews.rows.length}`);
    console.log(`📊 Total reviews: ${totalCount}`);
    console.log(`📊 Average rating: ${averageRating.toFixed(2)}`);
    
    // Update cleaner profile
    await pool.query(`
      UPDATE cleaner_profiles 
      SET rating = $1, updated_at = NOW() 
      WHERE user_id = $2
    `, [averageRating.toFixed(2), cleanerId]);
    
    console.log('✅ Cleaner profile updated with combined rating');
    
    // Test our API query structure
    console.log('\n🔍 Testing combined query...');
    const testQuery = `
      (
        SELECT 
          r.id,
          r.rating,
          r.comment,
          r.created_at,
          'customer' as review_type,
          u.first_name as reviewer_name,
          u.email as reviewer_email,
          COALESCE('N/A') as service_type,
          COALESCE('N/A') as service_category
        FROM reviews r
        JOIN users u ON r.customer_id = u.id
        WHERE r.cleaner_id = $1
      )
      UNION ALL
      (
        SELECT 
          ar.id,
          ar.rating,
          ar.review_text as comment,
          ar.created_at,
          'admin' as review_type,
          'Admin' as reviewer_name,
          'admin@cleanmatch.com' as reviewer_email,
          'N/A' as service_type,
          'Admin Review' as service_category
        FROM admin_reviews ar
        WHERE ar.cleaner_id = $1
      )
      ORDER BY created_at DESC
    `;
    
    const testResult = await pool.query(testQuery, [cleanerId]);
    console.log(`🎯 Combined query result: ${testResult.rows.length} reviews`);
    
    testResult.rows.forEach((review, index) => {
      console.log(`${index + 1}. ${review.review_type.toUpperCase()} - ${review.rating}⭐ by ${review.reviewer_name}`);
      console.log(`   Comment: ${review.comment}`);
      console.log(`   Date: ${review.created_at.toISOString().split('T')[0]}`);
    });
    
    console.log('\n🎉 Test data creation completed successfully!');
    console.log(`\n📋 Summary for Cleaner ID ${cleanerId}:`);
    console.log(`   - Customer Reviews: ${customerReviews.rows.length}`);
    console.log(`   - Admin Reviews: ${adminReviews.rows.length}`);
    console.log(`   - Combined Rating: ${averageRating.toFixed(2)}/5.0`);
    console.log(`   - Ready for frontend testing!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

createTestReviews();
