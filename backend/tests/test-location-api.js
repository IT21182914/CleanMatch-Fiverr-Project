const axios = require('axios');

// Test configuration
const API_BASE_URL = 'http://localhost:5000/api';
const CLEANER_TOKEN = 'your_cleaner_jwt_token_here';
const CUSTOMER_TOKEN = 'your_customer_jwt_token_here';

// Test locations (New York City area)
const TEST_LOCATIONS = {
    cleaner1: { lat: 40.7128, lng: -74.0060 }, // Manhattan
    cleaner2: { lat: 40.7589, lng: -73.9851 }, // Times Square
    customer: { lat: 40.7282, lng: -73.7949 },  // Queens
};

/**
 * Test cleaner availability update with location
 */
async function testCleanerAvailability() {
    console.log('\n🧹 Testing Cleaner Availability Update...');

    try {
        const response = await axios.put(
            `${API_BASE_URL}/users/availability`,
            {
                isAvailable: true,
                latitude: TEST_LOCATIONS.cleaner1.lat,
                longitude: TEST_LOCATIONS.cleaner1.lng,
                locationAccuracy: 5.0
            },
            {
                headers: { Authorization: `Bearer ${CLEANER_TOKEN}` }
            }
        );

        console.log('✅ Cleaner availability updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Cleaner availability test failed:', error.response?.data || error.message);
    }
}

/**
 * Test finding nearby cleaners with zipcode
 */
async function testNearbyCleanersWithZipcode() {
    console.log('\n🔍 Testing Nearby Cleaners Search with Zipcode...');

    try {
        const response = await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners`,
            {
                params: {
                    zipCode: '07094',
                    radius: 20,
                    minRating: 4.0
                },
                headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` }
            }
        );

        console.log('✅ Zipcode search successful:', response.data);
        console.log(`📊 Found ${response.data.data.length} cleaners within 20km of zipcode 07094`);

        if (response.data.searchCriteria) {
            console.log(`🗺️  Geocoded to: ${response.data.searchCriteria.geocodedAddress}`);
            console.log(`📍 Coordinates: ${response.data.searchCriteria.latitude}, ${response.data.searchCriteria.longitude}`);
            console.log(`🔧 Search method: ${response.data.searchCriteria.searchMethod}`);
        }

        return response.data;
    } catch (error) {
        console.error('❌ Zipcode search test failed:', error.response?.data || error.message);
    }
}

/**
 * Test finding nearby cleaners (original coordinates test)
 */
async function testNearbyCleaners() {
    console.log('\n🔍 Testing Nearby Cleaners Search...');

    try {
        const response = await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners`,
            {
                params: {
                    latitude: TEST_LOCATIONS.customer.lat,
                    longitude: TEST_LOCATIONS.customer.lng,
                    radius: 20,
                    minRating: 4.0
                },
                headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` }
            }
        );

        console.log('✅ Nearby cleaners found:', response.data);
        console.log(`📊 Found ${response.data.data.length} cleaners within 20km`);

        if (response.data.data.length > 0) {
            const nearestCleaner = response.data.data[0];
            console.log(`🏆 Nearest cleaner: ${nearestCleaner.firstName} ${nearestCleaner.lastName} (${nearestCleaner.distanceKm}km away)`);
        }

        return response.data;
    } catch (error) {
        console.error('❌ Nearby cleaners test failed:', error.response?.data || error.message);
    }
}

/**
 * Test online cleaners statistics
 */
async function testOnlineStats() {
    console.log('\n📈 Testing Online Cleaners Statistics...');

    try {
        const response = await axios.get(
            `${API_BASE_URL}/users/online-stats`,
            {
                headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` }
            }
        );

        console.log('✅ Online statistics:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Online stats test failed:', error.response?.data || error.message);
    }
}

/**
 * Test booking-specific nearby cleaners
 */
async function testBookingNearbyCleaners(bookingId) {
    console.log('\n🎯 Testing Booking-Specific Nearby Cleaners...');

    try {
        const response = await axios.get(
            `${API_BASE_URL}/bookings/${bookingId}/nearby-cleaners`,
            {
                params: {
                    latitude: TEST_LOCATIONS.customer.lat,
                    longitude: TEST_LOCATIONS.customer.lng,
                    radius: 15
                },
                headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` }
            }
        );

        console.log('✅ Booking nearby cleaners:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Booking nearby cleaners test failed:', error.response?.data || error.message);
    }
}

/**
 * Test cleaner going offline (location privacy)
 */
async function testCleanerOffline() {
    console.log('\n🔐 Testing Cleaner Going Offline (Location Privacy)...');

    try {
        const response = await axios.put(
            `${API_BASE_URL}/users/availability`,
            {
                isAvailable: false
            },
            {
                headers: { Authorization: `Bearer ${CLEANER_TOKEN}` }
            }
        );

        console.log('✅ Cleaner went offline (location cleared):', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Cleaner offline test failed:', error.response?.data || error.message);
    }
}

/**
 * Test different radius searches
 */
async function testRadiusVariations() {
    console.log('\n📏 Testing Different Radius Searches...');

    const radii = [5, 10, 20, 30];

    for (const radius of radii) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/nearby-cleaners`,
                {
                    params: {
                        latitude: TEST_LOCATIONS.customer.lat,
                        longitude: TEST_LOCATIONS.customer.lng,
                        radius
                    },
                    headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` }
                }
            );

            console.log(`✅ ${radius}km radius: ${response.data.data.length} cleaners found`);
        } catch (error) {
            console.error(`❌ ${radius}km radius test failed:`, error.response?.data || error.message);
        }
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('🚀 Starting Location-Based Cleaner Availability Tests...');
    console.log('================================================');

    // Test 1: Cleaner goes online with location
    await testCleanerAvailability();

    // Wait a moment for database to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Customer searches for nearby cleaners with coordinates
    await testNearbyCleaners();

    // Test 2b: Customer searches for nearby cleaners with zipcode
    await testNearbyCleanersWithZipcode();

    // Test 3: Get online statistics
    await testOnlineStats();

    // Test 4: Test different radius searches
    await testRadiusVariations();

    // Test 5: Booking-specific search (replace with actual booking ID)
    // await testBookingNearbyCleaners(123);

    // Test 6: Cleaner goes offline
    await testCleanerOffline();

    console.log('\n🎉 All tests completed!');
    console.log('================================================');
}

/**
 * Test error scenarios
 */
async function testErrorScenarios() {
    console.log('\n🚨 Testing Error Scenarios...');

    // Test 1: Cleaner availability without location
    try {
        await axios.put(
            `${API_BASE_URL}/users/availability`,
            { isAvailable: true }, // Missing location
            { headers: { Authorization: `Bearer ${CLEANER_TOKEN}` } }
        );
    } catch (error) {
        console.log('✅ Correctly rejected availability without location:', error.response.data.error);
    }

    // Test 2: Customer search without coordinates or zipcode
    try {
        await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners`,
            { headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` } }
        );
    } catch (error) {
        console.log('✅ Correctly rejected search without location:', error.response.data.error);
    }

    // Test 3: Invalid zipcode format
    try {
        await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners?zipCode=invalid123`,
            { headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` } }
        );
    } catch (error) {
        console.log('✅ Correctly rejected invalid zipcode:', error.response.data.error);
    }

    // Test 4: Invalid radius
    try {
        await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners?latitude=invalid&longitude=invalid&radius=invalid`,
            { headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` } }
        );
    } catch (error) {
        console.log('✅ Correctly rejected invalid coordinates:', error.response.data.error);
    }
}

// Export functions for individual testing
module.exports = {
    testCleanerAvailability,
    testNearbyCleaners,
    testNearbyCleanersWithZipcode,
    testOnlineStats,
    testBookingNearbyCleaners,
    testCleanerOffline,
    testRadiusVariations,
    testErrorScenarios,
    runAllTests
};

// Run tests if called directly
if (require.main === module) {
    console.log('⚙️  Update the tokens above with valid JWT tokens before running tests');
    console.log('⚙️  Ensure your server is running on http://localhost:5000');
    console.log('⚙️  Run the location migration before testing');
    console.log('\n📝 To run individual tests:');
    console.log('   node test-location-api.js');
    console.log('\n📝 Or import and run specific tests in your test suite\n');

    // Uncomment to run all tests
    // runAllTests().catch(console.error);
}
