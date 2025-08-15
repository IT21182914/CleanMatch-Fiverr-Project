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
    pgm.addColumns('cleaner_profiles', {
        current_latitude: { type: 'decimal(10,8)' },
        current_longitude: { type: 'decimal(11,8)' },
        last_location_update: { type: 'timestamptz' },
        location_accuracy: { type: 'decimal(10,2)' },
    });

    pgm.createIndex(
        'cleaner_profiles',
        ['current_latitude', 'current_longitude', 'is_available', 'last_location_update'],
        { name: 'idx_cleaner_profiles_location' }
    );

    pgm.createIndex(
        'cleaner_profiles',
        'last_location_update',
        { name: 'idx_cleaner_profiles_last_location_update', where: 'is_available = true' }
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropIndex(
        'cleaner_profiles',
        ['current_latitude', 'current_longitude', 'is_available', 'last_location_update'],
        { name: 'idx_cleaner_profiles_location' }
    );

    pgm.dropIndex(
        'cleaner_profiles',
        'last_location_update',
        { name: 'idx_cleaner_profiles_last_location_update' }
    );

    pgm.dropColumns('cleaner_profiles', [
        'current_latitude',
        'current_longitude',
        'last_location_update',
        'location_accuracy',
    ]);
};
