/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    // Drop the existing check constraint
    pgm.sql("ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_status_check");
    
    // Add the updated check constraint with all required status values
    pgm.sql(`
        ALTER TABLE memberships 
        ADD CONSTRAINT memberships_status_check 
        CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'trialing', 'expired'))
    `);
    
    console.log("✅ Updated membership status constraint to include 'expired' status");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    // Drop the constraint
    pgm.sql("ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_status_check");
    
    // Add back the original constraint (assuming it didn't include 'expired')
    pgm.sql(`
        ALTER TABLE memberships 
        ADD CONSTRAINT memberships_status_check 
        CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'trialing'))
    `);
};
