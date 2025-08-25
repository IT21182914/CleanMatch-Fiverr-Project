# CleanMatch Backend Folder Structure

This document describes the organized folder structure of the CleanMatch backend application.

## 📁 Root Directory Files
- `server.js` - Main application entry point
- `package.json` - Node.js dependencies and scripts
- `package-lock.json` - Dependency lock file
- `.env` - Environment variables (not in git)
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `.dockerignore` - Docker ignore rules
- `Dockerfile` - Docker container configuration
- `README.md` - Main project documentation

## 📂 Organized Folders

### `/config/`
Database configuration and connection setup
- `database.js` - Database connection and configuration

### `/constants/`
Application constants and enums

### `/controllers/`
Request handlers and business logic controllers
- `adminController.js` - Admin panel operations
- `authController.js` - Authentication and authorization
- `bookingsController.js` - Booking management
- `membershipController.js` - Membership operations
- `notificationsController.js` - Notification system
- `offersController.js` - Special offers management
- `paymentsController.js` - Payment processing
- `reviewsController.js` - Review system
- `servicesController.js` - Service management
- `statsController.js` - Statistics and analytics
- `ticketsController.js` - Support ticket system
- `trustController.js` - Trust and safety features
- `usersController.js` - User management

### `/docs/`
Documentation files
- `api.md` - API documentation
- `DATABASE_GUIDE.md` - Database setup guide
- `PROJECT_OVERVIEW.md` - Project overview
- `LOCATION_TRACKING_README.md` - Location tracking documentation
- Various implementation guides and summaries

### `/middleware/`
Express middleware functions
- `auth.js` - Authentication middleware
- `errorHandler.js` - Error handling middleware
- `fileUpload.js` - File upload middleware
- `validation.js` - Input validation middleware

### `/migrations/`
Database migration files
- Various timestamped migration files

### `/models/`
Data models and schemas (currently empty - organized structure)

### `/public/`
Static files served publicly
- `test-image-load.html` - Image loading test page

### `/routes/`
API route definitions
- `admin.js` - Admin routes
- `auth.js` - Authentication routes
- `bookings.js` - Booking routes
- `freelancerAuth.js` - Freelancer authentication
- `memberships.js` - Membership routes
- `notifications.js` - Notification routes
- `offers.js` - Offers routes
- `payments.js` - Payment routes
- `reviews.js` - Review routes
- `services.js` - Service routes
- `stats.js` - Statistics routes
- `tickets.js` - Ticket routes
- `trust.js` - Trust routes
- `users.js` - User routes

### `/scripts/`
Database setup and utility scripts
- `setup.js` - Main setup script
- `migrate.js` - Migration runner
- `setup-admin-reviews.js` - Admin review system setup
- `setup-offers.js` - Offers system setup
- `setup-supabase-storage.js` - Storage setup
- `setup-trust.js` - Trust system setup
- `create-trust-setup.js` - Trust feature creation
- `diagnose-storage.js` - Storage diagnostics
- `fix-bucket-permissions.js` - Storage permission fixes
- `test-image-cors.js` - CORS testing
- `fix-migration-issue.js` - Migration issue fixes

### `/seeds/`
Database seed files for initial data
- `create-admin.js` - Admin user creation
- Various other seed files

### `/services/`
Business logic service layer (currently empty - organized structure)

### `/tests/`
Test files and test utilities
- `test-api.js` - API testing
- `test-direct-api.js` - Direct API testing
- `test-public-reviews.js` - Public review testing
- `test-reviews.js` - Review system testing
- `create-test-reviews.js` - Test review creation
- Various other test files

### `/tools/`
Development and debugging tools
- `check-admin.js` - Admin system checker
- `check-bookings.js` - Booking system checker
- `check-cleaners.js` - Cleaner data checker
- `check-db-migrations.js` - Migration status checker
- `check-migrations.js` - Migration validator
- `check-schema.js` - Database schema checker
- `check-services.js` - Service system checker
- `check-users.js` - User data checker
- `db-monitor.js` - Database monitoring
- `debug-db.js` - Database debugging
- `process-manager.js` - Process management

### `/uploads/`
File upload storage directory

### `/utils/`
Utility functions and helpers
- `email.js` - Email utilities
- `errorUtils.js` - Error handling utilities
- `fileUpload.js` - File upload utilities
- `geocoding.js` - Location services
- `matchCleaner.js` - Cleaner matching algorithm
- `membershipScheduler.js` - Membership scheduling
- `scheduler.js` - General scheduling utilities
- `stripe.js` - Stripe payment utilities
- `supabaseStorage.js` - Supabase storage utilities

## 🎯 Benefits of This Structure

1. **Clear Separation of Concerns**: Each folder has a specific purpose
2. **Easy Navigation**: Developers can quickly find relevant files
3. **Scalability**: New features can be added following the established patterns
4. **Maintainability**: Code organization makes maintenance easier
5. **Testing**: All test files are centralized in `/tests/`
6. **Documentation**: All docs are centralized in `/docs/`
7. **Debugging**: All debugging tools are in `/tools/`

## 🔄 Migration Notes

Files have been moved from the root directory to their appropriate folders:
- Check/debug files → `/tools/`
- Test files → `/tests/`
- Script files → `/scripts/`
- Static files → `/public/`
- Documentation → `/docs/`

The `server.js` file remains in the root as the main entry point.
