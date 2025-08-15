const axios = require('axios');

// Test configuration for geocoding functionality
const API_BASE_URL = 'http://localhost:5000/api';
const CUSTOMER_TOKEN = 'your_customer_jwt_token_here';

/**
 * Test geocoding with zipcode
 */
async function testZipcodeSearch() {
    console.log('\n🔍 Testing Nearby Cleaners Search with Zipcode...');

    try {
        const response = await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners`,
            {
                params: {
                    zipCode: '07094', // New Jersey zipcode
                    radius: 20,
                    minRating: 4.0
                },
                headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` }
            }
        );

        console.log('✅ Zipcode search successful:', response.data);
        console.log(`📊 Found ${response.data.data.length} cleaners for zipcode 07094`);

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
 * Test with coordinates (should still work)
 */
async function testCoordinatesSearch() {
    console.log('\n📍 Testing Nearby Cleaners Search with Coordinates...');

    try {
        const response = await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners`,
            {
                params: {
                    latitude: 40.7128,
                    longitude: -74.0060,
                    radius: 20,
                    minRating: 4.0
                },
                headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` }
            }
        );

        console.log('✅ Coordinates search successful:', response.data);
        console.log(`📊 Found ${response.data.data.length} cleaners for coordinates`);
        console.log(`🔧 Search method: ${response.data.searchCriteria.searchMethod}`);

        return response.data;
    } catch (error) {
        console.error('❌ Coordinates search test failed:', error.response?.data || error.message);
    }
}

/**
 * Test various zipcode formats
 */
async function testZipcodeFormats() {
    console.log('\n📮 Testing Different Zipcode Formats...');

    const zipcodes = ['10001', '10001-1234', '90210', '07094', 'K1A 0A1']; // Last one is Canadian

    for (const zipCode of zipcodes) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/nearby-cleaners`,
                {
                    params: {
                        zipCode,
                        radius: 15
                    },
                    headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` }
                }
            );

            console.log(`✅ ${zipCode}: ${response.data.data.length} cleaners found`);
            if (response.data.searchCriteria.geocodedAddress) {
                console.log(`   📍 Geocoded to: ${response.data.searchCriteria.geocodedAddress}`);
            }
        } catch (error) {
            console.error(`❌ ${zipCode}: ${error.response?.data?.error || error.message}`);
        }
    }
}

/**
 * Test error scenarios
 */
async function testErrorScenarios() {
    console.log('\n🚨 Testing Error Scenarios...');

    // Test 1: No location data provided
    try {
        await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners`,
            { headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` } }
        );
    } catch (error) {
        console.log('✅ Correctly rejected request without location:', error.response.data.error);
    }

    // Test 2: Invalid zipcode format
    try {
        await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners?zipCode=invalid123`,
            { headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` } }
        );
    } catch (error) {
        console.log('✅ Correctly rejected invalid zipcode:', error.response.data.error);
    }

    // Test 3: Invalid coordinates
    try {
        await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners?latitude=invalid&longitude=invalid`,
            { headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` } }
        );
    } catch (error) {
        console.log('✅ Correctly rejected invalid coordinates:', error.response.data.error);
    }

    // Test 4: Invalid radius
    try {
        await axios.get(
            `${API_BASE_URL}/users/nearby-cleaners?zipCode=10001&radius=-5`,
            { headers: { Authorization: `Bearer ${CUSTOMER_TOKEN}` } }
        );
    } catch (error) {
        console.log('✅ Correctly rejected invalid radius:', error.response.data.error);
    }
}

/**
 * Test geocoding utility directly
 */
async function testGeocodingUtility() {
    console.log('\n🔧 Testing Geocoding Utility Directly...');

    try {
        const { geocodeAddress, isZipCode } = require('../utils/geocoding');

        // Test zipcode validation
        console.log('Testing zipcode validation:');
        console.log(`  10001: ${isZipCode('10001')}`);
        console.log(`  10001-1234: ${isZipCode('10001-1234')}`);
        console.log(`  K1A 0A1: ${isZipCode('K1A 0A1')}`);
        console.log(`  invalid: ${isZipCode('invalid')}`);

        // Test geocoding (requires API key)
        if (process.env.GOOGLE_GEO_API_KEY) {
            console.log('\nTesting geocoding:');
            const result = await geocodeAddress('10001');
            console.log(`  10001 geocoded to: ${result.latitude}, ${result.longitude}`);
            console.log(`  Formatted address: ${result.formattedAddress}`);
        } else {
            console.log('⚠️  GOOGLE_GEO_API_KEY not set, skipping geocoding test');
        }

    } catch (error) {
        console.error('❌ Geocoding utility test failed:', error.message);
    }
}

/**
 * Run all geocoding tests
 */
async function runGeocodingTests() {
    console.log('🚀 Starting Geocoding & Zipcode Search Tests...');
    console.log('================================================');

    // Test geocoding utility
    await testGeocodingUtility();

    console.log('\n📝 Note: API tests require valid JWT token and running server');
    console.log('Update CUSTOMER_TOKEN and ensure server is running to test API endpoints\n');

    // Uncomment to run API tests (requires valid token and running server)
    // await testZipcodeSearch();
    // await testCoordinatesSearch();
    // await testZipcodeFormats();
    // await testErrorScenarios();

    console.log('\n🎉 Geocoding tests completed!');
    console.log('================================================');
}

/**
 * Example usage patterns
 */
function showUsageExamples() {
    console.log('\n📖 API Usage Examples:');
    console.log('================================================');

    console.log('\n1. Search by zipcode:');
    console.log('GET /api/users/nearby-cleaners?zipCode=07094&radius=20');

    console.log('\n2. Search by coordinates:');
    console.log('GET /api/users/nearby-cleaners?latitude=40.7128&longitude=-74.0060&radius=20');

    console.log('\n3. Search with filters:');
    console.log('GET /api/users/nearby-cleaners?zipCode=10001&radius=15&minRating=4.5&serviceType=deep-cleaning');

    console.log('\n4. Expected response with geocoding:');
    console.log(`{
  "success": true,
  "data": [...cleaners...],
  "searchCriteria": {
    "latitude": 40.7505,
    "longitude": -73.9934,
    "radiusKm": 20,
    "searchMethod": "geocoded",
    "originalZipCode": "10001",
    "geocodedAddress": "New York, NY 10001, USA"
  },
  "stats": { ... }
}`);
}

// Export functions for testing
module.exports = {
    testZipcodeSearch,
    testCoordinatesSearch,
    testZipcodeFormats,
    testErrorScenarios,
    testGeocodingUtility,
    runGeocodingTests,
    showUsageExamples
};

// Run tests if called directly
if (require.main === module) {
    require('dotenv').config(); // Load environment variables

    showUsageExamples();
    runGeocodingTests().catch(console.error);
}
