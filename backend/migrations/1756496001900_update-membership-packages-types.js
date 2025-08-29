/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    // First, add the new values to the existing membership_tier enum
    // Each ADD VALUE must be in its own statement for PostgreSQL
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'moon_1_month'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'moon_3_months'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'moon_6_months'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'moon_12_months'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'star_1_month'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'star_3_months'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'star_6_months'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'star_12_months'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'sun_1_month'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'sun_3_months'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'sun_6_months'");
    pgm.sql("ALTER TYPE membership_tier ADD VALUE IF NOT EXISTS 'sun_12_months'");

    // Note: We cannot change the default value in the same transaction where we add enum values
    // This will be done in a separate migration or manually after this migration completes

    // Create a mapping comment for reference
    pgm.sql(`
        -- Migration completed: New membership tiers added to enum
        -- Default value change will need to be done in a separate transaction
        -- Old tiers (supersaver_month, supersaver_year) are still valid
        -- New tiers are now available for use
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

exports.down = (pgm) => {
    // Note: PostgreSQL doesn't support removing values from ENUMs easily
    // You would need to recreate the enum type to remove values
    // For safety, we'll leave the new values in the enum even when rolling back
    pgm.sql(`
        -- Cannot easily remove enum values in PostgreSQL
        -- If you need to remove them, you would need to:
        -- 1. Create a new enum without the values
        -- 2. Migrate all data to use the old enum values
        -- 3. Drop the old enum and rename the new one
        -- This is complex and potentially destructive, so we'll leave the values
    `);
};
