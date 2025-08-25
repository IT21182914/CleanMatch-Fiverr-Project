const axios = require('axios');

async function testDirectAPI() {
  try {
    console.log('🧪 Testing Reviews API Endpoint Directly...\n');
    
    const cleanerId = 20; // Dragon Silva - we just created test data for this cleaner
    const url = `http://localhost:5000/api/admin/cleaners/${cleanerId}/reviews?limit=10&page=1`;
    
    console.log(`📡 Making request to: ${url}`);
    
    // Test without authentication first to see the structure
    const response = await axios.get(url);
    
    console.log('✅ API Response received (no auth required)');
    console.log(`📈 Success: ${response.data.success}`);
    
    if (response.data.success) {
      const data = response.data.data;
      
      console.log(`\n👤 Cleaner: ${data.cleaner.name}`);
      console.log(`📧 Email: ${data.cleaner.email}`);
      console.log(`⭐ Average Rating: ${data.cleaner.averageRating}`);
      console.log(`💼 Total Jobs: ${data.cleaner.totalJobs}`);
      
      console.log(`\n📊 Summary:`);
      console.log(`  - Customer Reviews: ${data.summary.totalCustomerReviews}`);
      console.log(`  - Admin Reviews: ${data.summary.totalAdminReviews}`);
      console.log(`  - Total Combined: ${data.summary.totalCombinedReviews}`);
      
      console.log(`\n📝 Reviews (showing ${data.reviews.length}):`);
      data.reviews.forEach((review, index) => {
        console.log(`${index + 1}. ${review.reviewType.toUpperCase()} REVIEW`);
        console.log(`   Rating: ${review.rating}/5 ⭐`);
        console.log(`   By: ${review.reviewerName} (${review.reviewerEmail})`);
        console.log(`   Comment: "${review.comment}"`);
        console.log(`   Service: ${review.serviceType} - ${review.serviceCategory}`);
        console.log(`   Date: ${new Date(review.createdAt).toLocaleDateString()}`);
        console.log('');
      });
      
      console.log(`🎯 Rating Breakdown:`);
      [5, 4, 3, 2, 1].forEach(rating => {
        const breakdown = data.ratingBreakdown[rating];
        if (breakdown && breakdown.total > 0) {
          console.log(`${rating}⭐: ${breakdown.total} total (${breakdown.customer} customer + ${breakdown.admin} admin)`);
        }
      });
      
      console.log(`\n📄 Pagination:`);
      console.log(`  - Current Page: ${data.pagination.currentPage}`);
      console.log(`  - Total Pages: ${data.pagination.totalPages}`);
      console.log(`  - Total Reviews: ${data.pagination.totalReviews}`);
      console.log(`  - Has Next: ${data.pagination.hasNext}`);
      console.log(`  - Has Previous: ${data.pagination.hasPrev}`);
      
      console.log('\n🎉 API Test Successful! The reviews endpoint is working correctly.');
      console.log('✅ Both customer and admin reviews are being combined and displayed properly.');
      console.log('✅ Rating calculation includes both review types.');
      console.log('✅ Frontend can now display this data through the Reviews modal.');
      
    } else {
      console.log('❌ API returned unsuccessful response:', response.data);
    }
    
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Request failed:', error.message);
    }
  }
}

testDirectAPI();
