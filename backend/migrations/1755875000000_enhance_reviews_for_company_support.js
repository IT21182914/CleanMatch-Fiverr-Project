/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // This migration was already applied manually or through other means
  // No changes needed as this is just to satisfy the migration order
  console.log(
    "Migration 1755875000000_enhance_reviews_for_company_support - already applied"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // No rollback needed for this placeholder migration
  console.log(
    "Rollback for 1755875000000_enhance_reviews_for_company_support - no action needed"
  );
};
