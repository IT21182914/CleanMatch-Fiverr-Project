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
  // Add enhanced review fields to reviews table
  pgm.addColumns("reviews", {
    service_quality: {
      type: "integer",
      check: "service_quality >= 1 AND service_quality <= 5",
    },
    punctuality: {
      type: "integer",
      check: "punctuality >= 1 AND punctuality <= 5",
    },
    communication: {
      type: "integer",
      check: "communication >= 1 AND communication <= 5",
    },
    would_recommend: {
      type: "boolean",
    },
    helpful_votes: {
      type: "integer",
      default: 0,
    },
    total_votes: {
      type: "integer",
      default: 0,
    },
  });

  // Create indexes for the new fields
  pgm.createIndex("reviews", "service_quality", {
    name: "idx_reviews_service_quality",
    ifNotExists: true,
  });
  pgm.createIndex("reviews", "would_recommend", {
    name: "idx_reviews_would_recommend",
    ifNotExists: true,
  });
  pgm.createIndex("reviews", ["helpful_votes", "total_votes"], {
    name: "idx_reviews_helpfulness",
    ifNotExists: true,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Remove indexes
  pgm.dropIndex("reviews", ["helpful_votes", "total_votes"], {
    name: "idx_reviews_helpfulness",
    ifExists: true,
  });
  pgm.dropIndex("reviews", "would_recommend", {
    name: "idx_reviews_would_recommend",
    ifExists: true,
  });
  pgm.dropIndex("reviews", "service_quality", {
    name: "idx_reviews_service_quality",
    ifExists: true,
  });

  // Remove columns
  pgm.dropColumns("reviews", [
    "service_quality",
    "punctuality",
    "communication",
    "would_recommend",
    "helpful_votes",
    "total_votes",
  ]);
};
