require('dotenv').config();
const axios = require('axios');

async function testPublicReviewsAPI() {
  try {
    console.log('🧪 Testing Public Reviews API...\n');
    
    // Test the new public reviews endpoint
    const response = await axios.get('http://localhost:5000/api/reviews/public?limit=10');
    
    console.log('✅ API Response Status:', response.status);
    const data = response.data;
    
    if (data.success) {
      console.log(`📊 Total reviews available: ${data.total}`);
      console.log(`📝 Reviews returned: ${data.reviews.length}`);
      console.log(data.message);
      
      console.log('\n📋 Reviews Preview:');
      data.reviews.forEach((review, index) => {
        console.log(`${index + 1}. ${review.review_type.toUpperCase()} REVIEW`);
        console.log(`   👤 Reviewer: ${review.reviewer_name}`);
        console.log(`   🧹 For Cleaner: ${review.cleaner_name} (⭐ ${review.cleaner_rating}/5)`);
        console.log(`   ⭐ Review Rating: ${review.rating}/5`);
        console.log(`   🏷️ Service: ${review.service_type}`);
        console.log(`   💬 Comment: ${review.comment ? review.comment.substring(0, 80) + '...' : 'No comment'}`);
        console.log(`   📅 Date: ${new Date(review.created_at).toLocaleDateString()}`);
        console.log('');
      });
      
      // Count breakdown
      const customerCount = data.reviews.filter(r => r.review_type === 'customer').length;
      const adminCount = data.reviews.filter(r => r.review_type === 'admin').length;
      
      console.log(`📈 Breakdown: ${customerCount} customer + ${adminCount} admin reviews`);
      
    } else {
      console.log('❌ API request failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testPublicReviewsAPI();
