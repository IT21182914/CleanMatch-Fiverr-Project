# Backend Organization Guide

This document explains the reorganized backend structure of CleanMatch.

## 📁 Directory Structure

The backend has been organized into logical folders to improve maintainability and clarity:

### Core Application Files (Backend Root)
- `server.js` - Main Express application entry point
- `package.json` - Dependencies and npm scripts
- `.env` / `.env.example` - Environment configuration
- `Dockerfile` - Docker containerization
- `README.md` - Project documentation

### 🔧 Core Application Directories
- `config/` - Database and application configuration
- `controllers/` - Business logic controllers
- `middleware/` - Express middleware (auth, validation, error handling)
- `routes/` - API route definitions
- `utils/` - Utility functions and helpers
- `uploads/` - File upload storage
- `migrations/` - Database migration files (existing)

### 📜 Scripts Directory (`scripts/`)
Setup, seeding, and utility scripts for project initialization:
- `setup.js` - Main project setup
- `seed.js` - Database seeding with sample data
- `create-admin.js` - Create admin users
- `create-test-freelancers.js` - Create test cleaner accounts
- `setup-offers.js` - Setup service offers
- `setup-supabase-storage.js` - Configure Supabase storage
- `setup-trust.js` - Setup trust and safety features

### 🗄️ Database Directory (`database/`)
Database-related scripts, migrations, and maintenance:
- `add-rating-columns.js` - Add rating functionality
- `fix-reviews-table.js` - Fix reviews table issues
- `migrate-membership.js` - Membership system migrations
- `run-migration.js` - Generic migration runner
- `update-document-urls.js` - Update document URLs
- `update-services.js` - Update service definitions
- `setup-trust.sql` - SQL scripts for trust system

### 🛠️ Tools Directory (`tools/`)
Development and monitoring tools:
- `db-monitor.js` - Database health monitoring
- `debug-db.js` - Database debugging utilities
- `process-manager.js` - Production process management
- `check-cleaners.js` - Validate cleaner data
- `check-users.js` - Validate user data

### 🧪 Tests Directory (`tests/`)
All test files for the application:
- `test-server.js` - Basic server testing
- `test-api.js` - API endpoint tests
- `test-comprehensive.js` - Full system tests
- `test-validation.js` - Input validation tests
- `test-registration.js` - User registration tests
- And more...

### 📖 Docs Directory (`docs/`)
Documentation and guides:
- `api.md` - API documentation
- `DATABASE_GUIDE.md` - Database setup guide
- `PROJECT_OVERVIEW.md` - Comprehensive project overview

## 🚀 NPM Scripts

Updated scripts for the new structure:

```bash
# Application
npm start              # Start the server
npm run dev            # Development mode
npm run start:pm       # Start with process manager

# Setup & Seeding
npm run setup          # Project setup
npm run seed           # Seed database
npm run setup:storage  # Setup Supabase storage

# Testing
npm test               # Run Jest tests
npm run test:server    # Test server functionality
npm run test:documents # Test document upload

# Monitoring
npm run db:monitor     # Monitor database health
npm run db:health      # Check database connection
```

## 📝 Usage Examples

### Running Setup Scripts
```bash
# From backend root directory
node scripts/setup.js
node scripts/create-admin.js
node scripts/seed.js
```

### Database Operations
```bash
node database/run-migration.js
node database/update-services.js
```

### Development Tools
```bash
node tools/db-monitor.js
node tools/check-users.js
```

### Testing
```bash
node tests/test-server.js
node tests/test-api.js
```

## 🎯 Benefits of This Organization

1. **Clear Separation of Concerns**: Each directory has a specific purpose
2. **Easier Maintenance**: Related files are grouped together
3. **Better Onboarding**: New developers can easily understand the structure
4. **Improved Scripts**: Clear npm scripts for common operations
5. **Enhanced Documentation**: Each directory has its own README
6. **Cleaner Root**: Only essential files remain in the backend root

## 🔄 Migration Notes

All import paths have been updated automatically:
- Scripts now use `../config/database` instead of `./config/database`
- NPM scripts point to new file locations
- All relative imports have been corrected

The application functionality remains unchanged - only the file organization has been improved.
