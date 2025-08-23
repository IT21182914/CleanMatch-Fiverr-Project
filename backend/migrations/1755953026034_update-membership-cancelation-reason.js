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
    pgm.addColumns('memberships', {
        cancellation_reason: {
            type: 'text',
            notNull: false,
            default: null,
            comment: 'Reason provided by the user for cancelling their membership'
        }
    }, {
        ifNotExists: true
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropColumn('memberships', 'cancellation_reason', {
        ifExists: true
    });
};
