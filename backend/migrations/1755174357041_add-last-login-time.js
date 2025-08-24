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
    pgm.addColumns('cleaner_profiles', {
        last_active: { type: 'timestamptz' },
    });

    pgm.createIndex('cleaner_profiles', 'last_active', {
        name: 'idx_cleaner_profiles_last_active',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropIndex('cleaner_profiles', 'last_active', {
        name: 'idx_cleaner_profiles_last_active',
    });
    pgm.dropColumns('cleaner_profiles', ['last_active']);
};
