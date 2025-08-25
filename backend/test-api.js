require('dotenv').config();
const axios = require('axios');

async function testReviewsAPI() {
  try {
    console.log('🧪 Testing Reviews API...\n');
    
    // Test login first to get admin token
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'dilanshanuka999@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test the cleaner reviews endpoint
    const cleanerId = 20; // Dragon Silva from our earlier check
    console.log(`📊 Testing reviews for cleaner ID: ${cleanerId}`);
    
    const reviewsResponse = await axios.get(
      `http://localhost:5000/api/admin/cleaners/${cleanerId}/reviews?limit=10&page=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const reviewsData = reviewsResponse.data;
    console.log('✅ API Response received');
    console.log(`📈 Status: ${reviewsData.success ? 'Success' : 'Failed'}`);
    
    if (reviewsData.success) {
      const data = reviewsData.data;
      console.log(`\n👤 Cleaner: ${data.cleaner.name}`);
      console.log(`⭐ Average Rating: ${data.cleaner.averageRating || 'N/A'}`);
      console.log(`📊 Summary:`);
      console.log(`  - Customer Reviews: ${data.summary.totalCustomerReviews}`);
      console.log(`  - Admin Reviews: ${data.summary.totalAdminReviews}`);
      console.log(`  - Total Combined: ${data.summary.totalCombinedReviews}`);
      
      console.log(`\n📝 Reviews (${data.reviews.length}):`);
      data.reviews.forEach((review, index) => {
        console.log(`${index + 1}. ${review.reviewType.toUpperCase()} - ${review.rating}⭐`);
        console.log(`   By: ${review.reviewerName}`);
        console.log(`   Comment: ${review.comment ? review.comment.substring(0, 60) + '...' : 'No comment'}`);
        console.log(`   Date: ${new Date(review.createdAt).toLocaleDateString()}`);
        console.log('');
      });
      
      console.log('🎯 Rating Breakdown:');
      Object.keys(data.ratingBreakdown).sort((a, b) => b - a).forEach(rating => {
        const breakdown = data.ratingBreakdown[rating];
        console.log(`${rating}⭐: ${breakdown.total} total (${breakdown.customer} customer + ${breakdown.admin} admin)`);
      });
      
    } else {
      console.log('❌ API request failed:', reviewsData.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testReviewsAPI();
