/**
 * Test script for ZIP code-based cleaner matching functionality
 * This script demonstrates the enhanced cleaner auto-assignment logic
 */

const {
  calculateZipProximityScore,
  calculateDistanceWithZipFallback,
  calculateEnhancedMatchScore,
} = require("../utils/matchCleaner");

console.log("=== ZIP Code Matching System Test ===\n");

// Test ZIP code proximity scoring
console.log("1. ZIP Code Proximity Scoring:");
console.log(
  "Same ZIP (12345 vs 12345):",
  calculateZipProximityScore("12345", "12345")
);
console.log(
  "Same area (12345 vs 12367):",
  calculateZipProximityScore("12345", "12367")
);
console.log(
  "Same region (12345 vs 12567):",
  calculateZipProximityScore("12345", "12567")
);
console.log(
  "Different region (12345 vs 67890):",
  calculateZipProximityScore("12345", "67890")
);
console.log("Missing ZIP codes:", calculateZipProximityScore("12345", null));
console.log("");

// Test distance calculation with ZIP fallback
console.log("2. Distance Calculation with ZIP Fallback:");
console.log("With coordinates (5 mile distance):");
console.log(
  "  Result:",
  calculateDistanceWithZipFallback(
    40.7128,
    -74.006,
    40.7589,
    -73.9851,
    "10001",
    "10002"
  )
);

console.log("Without coordinates, same ZIP:");
console.log(
  "  Result:",
  calculateDistanceWithZipFallback(null, null, null, null, "10001", "10001")
);

console.log("Without coordinates, same area:");
console.log(
  "  Result:",
  calculateDistanceWithZipFallback(null, null, null, null, "10001", "10023")
);

console.log("Without coordinates, different region:");
console.log(
  "  Result:",
  calculateDistanceWithZipFallback(null, null, null, null, "10001", "90210")
);
console.log("");

// Test enhanced match scoring
console.log("3. Enhanced Match Score Comparison:");

const sampleCleaner = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  rating: 4.5,
  experience_years: 5,
  total_jobs: 100,
  hourly_rate: 25,
};

const bookingDetails = {
  zipCode: "10001",
  serviceType: "deep-cleaning",
};

console.log("Sample Cleaner Profile:");
console.log("- Rating: 4.5/5");
console.log("- Experience: 5 years");
console.log("- Total Jobs: 100");
console.log("- Hourly Rate: $25");
console.log("");

console.log("Scenario A: Same ZIP code, 2 miles away");
const scenarioA = calculateEnhancedMatchScore(
  sampleCleaner,
  2, // distance
  100, // same ZIP proximity score
  bookingDetails
);
console.log("Enhanced Match Score:", scenarioA);

console.log("Scenario B: Same area ZIP, 8 miles away");
const scenarioB = calculateEnhancedMatchScore(
  sampleCleaner,
  8, // distance
  75, // same area proximity score
  bookingDetails
);
console.log("Enhanced Match Score:", scenarioB);

console.log("Scenario C: Different region, 15 miles away");
const scenarioC = calculateEnhancedMatchScore(
  sampleCleaner,
  15, // distance
  25, // different region proximity score
  bookingDetails
);
console.log("Enhanced Match Score:", scenarioC);
console.log("");

// Demonstrate scoring priority
console.log("4. Scoring Priority Analysis:");
console.log("The ZIP code proximity now contributes 25% of the total score,");
console.log("making local cleaners significantly more likely to be selected.");
console.log("");
console.log("Score Breakdown (100 points total):");
console.log("- ZIP Proximity: 25 points max");
console.log("- Distance: 20 points max");
console.log("- Rating: 20 points max");
console.log("- Experience: 15 points max");
console.log("- Job History: 10 points max");
console.log("- Rate Competitiveness: 10 points max");
console.log("");

console.log("5. Business Impact:");
console.log("✓ Customers get cleaners from their immediate area first");
console.log("✓ Reduced travel time and costs for cleaners");
console.log("✓ Better local market coverage");
console.log("✓ Improved customer satisfaction with faster service");
console.log("✓ More accurate matching even without GPS coordinates");
console.log("");

// Sample API usage
console.log("6. API Usage Example:");
console.log("POST /api/bookings/recommendations-by-zip");
console.log(
  JSON.stringify(
    {
      zipCode: "10001",
      latitude: 40.7128,
      longitude: -74.006,
      bookingDate: "2024-01-15",
      bookingTime: "10:00",
      durationHours: 3,
      serviceId: 1,
      limit: 5,
    },
    null,
    2
  )
);
console.log("");

console.log("Expected Response Format:");
console.log(`{
  "success": true,
  "data": {
    "totalFound": 5,
    "zipCode": "10001",
    "recommendations": [
      {
        "id": 1,
        "name": "John Doe",
        "rating": 4.5,
        "hourlyRate": 25,
        "distance": 2.1,
        "zipProximityScore": 100,
        "matchScore": 88.5,
        "zipCode": "10001",
        "isInSameZip": true,
        "isInSameArea": true
      }
    ]
  }
}`);

console.log("\n=== Test Complete ===");
