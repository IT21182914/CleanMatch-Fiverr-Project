exports.up = (pgm) => {
    // Drop the dependent view
    pgm.sql(`DROP VIEW IF EXISTS user_membership_status;`);

    // Drop old CHECK
    pgm.dropConstraint('memberships', 'memberships_tier_check', { ifExists: true });

    // Create enum type
    pgm.createType('membership_tier', ['supersaver_month', 'supersaver_year'], { ifNotExists: true });

    // Normalize data
    pgm.sql(`
    UPDATE memberships
    SET tier = 'supersaver_month'
    WHERE tier IS NULL
       OR tier NOT IN ('supersaver_month', 'supersaver_year');
  `);

    // Remove existing default
    pgm.alterColumn('memberships', 'tier', { default: null });

    // Change type
    pgm.alterColumn('memberships', 'tier', {
        type: 'membership_tier',
        using: `
      CASE
        WHEN tier IN ('supersaver_month','supersaver_year')
          THEN tier::membership_tier
        ELSE 'supersaver_month'::membership_tier
      END
    `,
        notNull: true,
    });

    // Add default
    pgm.alterColumn('memberships', 'tier', {
        default: pgm.func("'supersaver_month'::membership_tier"),
    });

    // Recreate the view with all the fields from the original view
    pgm.sql(`
    CREATE VIEW user_membership_status AS
    SELECT 
      u.id as user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.role,
      u.is_active as user_active,
      m.id as membership_id,
      m.tier,
      m.plan_name,
      m.monthly_fee,
      m.discount_percentage,
      m.status as membership_status,
      m.start_date as membership_start,
      m.current_period_end,
      m.cancel_at_period_end,
      CASE 
        WHEN m.id IS NULL THEN false
        WHEN m.status = 'active' AND m.current_period_end > NOW() THEN true
        WHEN m.status = 'trialing' AND (m.trial_end IS NULL OR m.trial_end > NOW()) THEN true
        ELSE false
      END as is_member_active,
      CASE 
        WHEN m.id IS NULL THEN 'none'
        WHEN m.status = 'active' AND m.current_period_end > NOW() THEN 'active'
        WHEN m.status = 'trialing' AND (m.trial_end IS NULL OR m.trial_end > NOW()) THEN 'trialing'
        WHEN m.status = 'active' AND m.current_period_end <= NOW() THEN 'expired'
        ELSE m.status
      END as effective_status,
      (SELECT COUNT(*) FROM membership_usage mu WHERE mu.membership_id = m.id) as usage_count,
      (SELECT COALESCE(SUM(discount_applied), 0) FROM membership_usage mu WHERE mu.membership_id = m.id) as total_savings
    FROM users u
    LEFT JOIN memberships m ON u.id = m.user_id AND u.role = 'customer'
    WHERE u.role IN ('customer', 'admin', 'cleaner');
  `);
};

exports.down = (pgm) => {
    // Drop recreated view
    pgm.sql(`DROP VIEW IF EXISTS user_membership_status;`);

    // Remove default
    pgm.alterColumn('memberships', 'tier', { default: null });

    // Convert back to varchar
    pgm.alterColumn('memberships', 'tier', {
        type: 'varchar(50)',
        using: 'tier::text',
    });

    pgm.sql(`
    UPDATE memberships
    SET tier = 'supersaver'
    WHERE tier IN ('supersaver_month','supersaver_year') OR tier IS NULL;
  `);

    pgm.addConstraint('memberships', 'memberships_tier_check', { check: "tier IN ('supersaver')" });

    pgm.alterColumn('memberships', 'tier', {
        default: pgm.func("'supersaver'"),
        notNull: true,
    });

    // Drop the enum
    pgm.dropType('membership_tier', { ifExists: true });

    // Recreate old version of the view with all required fields
    pgm.sql(`
    CREATE VIEW user_membership_status AS
    SELECT 
      u.id as user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.role,
      u.is_active as user_active,
      m.id as membership_id,
      m.tier,
      m.plan_name,
      m.monthly_fee,
      m.discount_percentage,
      m.status as membership_status,
      m.start_date as membership_start,
      m.current_period_end,
      m.cancel_at_period_end,
      CASE 
        WHEN m.id IS NULL THEN false
        WHEN m.status = 'active' AND m.current_period_end > NOW() THEN true
        WHEN m.status = 'trialing' AND (m.trial_end IS NULL OR m.trial_end > NOW()) THEN true
        ELSE false
      END as is_member_active,
      CASE 
        WHEN m.id IS NULL THEN 'none'
        WHEN m.status = 'active' AND m.current_period_end > NOW() THEN 'active'
        WHEN m.status = 'trialing' AND (m.trial_end IS NULL OR m.trial_end > NOW()) THEN 'trialing'
        WHEN m.status = 'active' AND m.current_period_end <= NOW() THEN 'expired'
        ELSE m.status
      END as effective_status,
      (SELECT COUNT(*) FROM membership_usage mu WHERE mu.membership_id = m.id) as usage_count,
      (SELECT COALESCE(SUM(discount_applied), 0) FROM membership_usage mu WHERE mu.membership_id = m.id) as total_savings
    FROM users u
    LEFT JOIN memberships m ON u.id = m.user_id AND u.role = 'customer'
    WHERE u.role IN ('customer', 'admin', 'cleaner');
      u.is_active as user_active,
      m.id as membership_id,
      m.tier,
      m.plan_name,
      m.monthly_fee,
      m.discount_percentage,
      m.status as membership_status,
      m.start_date as membership_start,
      m.current_period_end
    FROM memberships m
    JOIN users u ON u.id = m.user_id;
  `);
};
