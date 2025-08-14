# Tests Directory

This directory contains all test-related files for the CleanMatch backend application.

## File Structure

### Test Files
- `test-*.js` - Main test suites for different components
- `check-*.js` - Schema and functionality validation tests
- `create-sample-*.js` - Test data creation utilities

### Test Categories

#### API Tests
- `test-api.js` - General API endpoint tests
- `test-server.js` - Server functionality tests
- `test-comprehensive.js` - Full integration tests

#### Feature-Specific Tests
- `test-admin-freelancers.js` - Admin freelancer management tests
- `test-admin-ticket-management.js` - Ticket system admin tests
- `test-document-upload.js` - File upload functionality tests
- `test-enhanced-registration.js` - User registration tests
- `test-registration.js` - Basic registration tests
- `test-review-api.js` - Review system API tests
- `test-supabase.js` - Supabase integration tests
- `test-ticketing-system.js` - Ticketing system tests
- `test-validation.js` - Input validation tests
- `test-zip-matching.js` - Geographic matching tests

#### Schema Validation
- `check-cleaners.js` - Cleaner data validation
- `check-cleaners-simple.js` - Simple cleaner validation
- `check-notifications-schema.js` - Notification schema validation

#### Test Data Creation
- `create-sample-reviews.js` - Creates sample review data for testing

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
node tests/test-api.js

# Run schema checks
node tests/check-cleaners.js
```

## Notes

- All test files are now consolidated in this directory
- Test data creation utilities help set up consistent test environments
- Schema validation files ensure data integrity during development
