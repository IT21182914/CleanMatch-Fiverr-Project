const { bookingSchema } = require('./middleware/validation');

// Test the booking validation with the problematic request
const testBookingData = {
  serviceId: 52,
  bookingDate: '2026-02-05',
  bookingTime: '13:00',
  address: '813/2,Senapura,Tissamaraharama',
  city: 'Tissamaraharama',
  state: 'Southern',
  zipCode: '82600',
  specialInstructions: 'afrf',
  durationHours: 2,
  homeSize: 'medium',  
  bedrooms: '2',
  bathrooms: '2',
  pets: true,
  frequency: 'one-time',
  addOns: [{ id: 1, price: 25 }]
};

console.log('Testing booking validation...');
console.log('Test data:', JSON.stringify(testBookingData, null, 2));

const { error, value } = bookingSchema.validate(testBookingData);

if (error) {
  console.log('❌ Validation failed:', error.details[0].message);
} else {
  console.log('✅ Validation passed!');
  console.log('Validated data:', value);
}
