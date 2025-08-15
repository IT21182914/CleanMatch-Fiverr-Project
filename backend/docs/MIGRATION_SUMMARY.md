# Create a new migration file
npm run migrate:create <migration_name>

# Run pending migrations (latest only)
npm run migrate:up

# Run all pending migrations
npm run migrate:up:all

# Rollback the last migration
npm run migrate:down

# Rollback and re-run the last migration
npm run migrate:redo
