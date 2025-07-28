# Database Directory

This directory contains database-related scripts for migrations, updates, and maintenance.

## Migration Scripts
- `add-rating-columns.js` - Add rating columns to tables
- `fix-reviews-table.js` - Fix issues with reviews table
- `migrate-membership.js` - Migrate membership data
- `run-migration.js` - Generic migration runner

## Update Scripts
- `update-document-urls.js` - Update document URLs in database
- `update-services.js` - Update service definitions

## SQL Files
- `setup-trust.sql` - SQL script for trust system setup

## Usage

Run database scripts from the backend root directory:

```bash
# Run migrations
node database/run-migration.js

# Update services
node database/update-services.js

# Fix reviews table
node database/fix-reviews-table.js
```

**Note:** Always backup your database before running migration scripts in production.
