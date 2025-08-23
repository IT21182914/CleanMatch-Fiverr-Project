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
  // Create admin_reviews table
  pgm.createTable("admin_reviews", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    cleaner_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    admin_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    rating: {
      type: "integer",
      notNull: true,
      check: "rating >= 1 AND rating <= 5",
    },
    review_text: {
      type: "text",
      notNull: true,
    },
    is_visible: {
      type: "boolean",
      notNull: true,
      default: true,
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Create indexes
  pgm.createIndex("admin_reviews", "cleaner_id");
  pgm.createIndex("admin_reviews", "admin_id");
  pgm.createIndex("admin_reviews", "created_at");
  pgm.createIndex("admin_reviews", "is_visible");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the admin_reviews table
  pgm.dropTable("admin_reviews");
};
