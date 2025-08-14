# Seeds Directory

This directory contains all database seeding and initial data setup files for the CleanMatch backend application.

## File Structure

### Core Seeding
- `seed.js` - Main database seeding script with comprehensive data setup

### User Creation
- `create-admin.js` - Creates admin users for the system
- `create-test-freelancers.js` - Creates test freelancer accounts for development

### Sample Data
- `create-sample-documents.js` - Creates sample document data for testing

## Seed Categories

### Administrative Setup
- **Admin Creation**: Sets up administrative users with proper permissions
- **System Configuration**: Initializes system-level configurations

### Development Data
- **Test Users**: Creates freelancers and customers for development testing
- **Sample Documents**: Generates realistic document samples
- **Reference Data**: Sets up lookup tables and reference data

### Production Initialization
- **Default Data**: Creates essential data required for production deployment
- **System Defaults**: Initializes default settings and configurations

## Running Seeds

```bash
# Run main seed file (comprehensive setup)
node seeds/seed.js

# Create admin user
node seeds/create-admin.js

# Create test freelancers for development
node seeds/create-test-freelancers.js

# Generate sample documents
node seeds/create-sample-documents.js
```

## Seed Script Usage

### Development Environment
```bash
# Full development setup
node seeds/seed.js
node seeds/create-test-freelancers.js
node seeds/create-sample-documents.js
```

### Production Environment
```bash
# Production initialization (be careful!)
node seeds/seed.js
node seeds/create-admin.js
```

### Testing Environment
```bash
# Test data setup
node seeds/create-test-freelancers.js
node seeds/create-sample-documents.js
```

## Configuration

Most seed scripts use environment variables for configuration:
- `NODE_ENV` - Environment (development/production/test)
- `DATABASE_URL` - Database connection string
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password

## Best Practices

1. **Environment Awareness**: Seeds should check the environment before running
2. **Idempotent**: Seeds should be safe to run multiple times
3. **Cleanup**: Provide cleanup scripts for development data
4. **Documentation**: Document what each seed creates
5. **Security**: Never commit sensitive data in seed files

## Notes

- Seed files are separated from migration files for better organization
- Development and production seeds are clearly distinguished
- Sample data helps with realistic testing scenarios
- Admin creation is separated for security purposes
