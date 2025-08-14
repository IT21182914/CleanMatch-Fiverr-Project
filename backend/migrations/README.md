# Migrations Directory

This directory contains all database migration files and scripts for the CleanMatch backend application.

## File Structure

### Migration Scripts (JavaScript)
- `add-freelancer-fields.js` - Adds freelancer-specific fields to database
- `add-rating-columns.js` - Adds rating columns to relevant tables
- `enhance-reviews-system.js` - Enhances the review system database structure
- `fix-reviews-table.js` - Fixes issues in the reviews table
- `migrate-membership.js` - Migrates membership system data
- `update-document-urls.js` - Updates document URL references
- `update-services.js` - Updates service-related data

### SQL Migration Files
- `add-metadata-column.sql` - Adds metadata columns
- `add_missing_columns.sql` - Adds any missing database columns
- `enhanced-assignment-system.sql` - Creates enhanced assignment system tables
- `setup-test-cleaners.sql` - Sets up test cleaner data
- `setup-tickets.sql` - Creates ticketing system tables
- `setup-trust.sql` - Sets up trust and verification system tables

### Migration Runners
- `run-enhanced-assignment-migration.js` - Runs enhanced assignment migrations
- `run-migration.js` - General migration runner
- `run-tickets-migration.js` - Runs ticket system migrations

## Migration Categories

### System Enhancements
- Assignment system improvements
- Review system enhancements
- Trust and verification system setup

### Data Updates
- Service data migrations
- Document URL updates
- User field additions

### Testing Setup
- Test data creation
- Development environment setup

## Running Migrations

```bash
# Run all pending migrations
node migrations/run-migration.js

# Run specific migration
node migrations/run-enhanced-assignment-migration.js

# Run ticket system migration
node migrations/run-tickets-migration.js

# Execute SQL migrations (using your database client)
# Example for PostgreSQL:
psql -U username -d database_name -f migrations/setup-trust.sql
```

## Migration Best Practices

1. **Backup First**: Always backup your database before running migrations
2. **Test Environment**: Run migrations in a test environment first
3. **Sequential Order**: Run migrations in chronological order
4. **Rollback Plan**: Have a rollback strategy for each migration
5. **Documentation**: Document any manual steps required

## Notes

- All database schema changes are now consolidated in this directory
- Migration files include both SQL and JavaScript implementations
- Runner scripts help automate the migration process
- Test-specific migrations are separated from production migrations
