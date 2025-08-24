const { Pool } = require("pg");

let pool;
let isConnected = false;

const connectDB = async (retries = 5) => {
  try {
    // Construct DATABASE_URL from individual variables if not provided
    let databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl && process.env.DATABASE_HOST) {
      const host = process.env.DATABASE_HOST;
      const port = process.env.DATABASE_PORT || 5432;
      const database = process.env.DATABASE_NAME;
      const user = process.env.DATABASE_USER;
      const password = process.env.DATABASE_PASSWORD;

      databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`;
    }

    // Determine SSL configuration based on environment and database URL
    let sslConfig = false;

    // Use SSL for cloud databases (Supabase, AWS, Heroku, etc.)
    if (
      databaseUrl &&
      (databaseUrl.includes("supabase.co") ||
        databaseUrl.includes("amazonaws.com") ||
        databaseUrl.includes("render.com") ||
        databaseUrl.includes("heroku.com") ||
        process.env.NODE_ENV === "production")
    ) {
      sslConfig = {
        rejectUnauthorized: false,
      };
    }

    const config = {
      connectionString: databaseUrl,
      ssl: sslConfig,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      statement_timeout: 30000,
      query_timeout: 30000,
      application_name: "CleanMatch-backend",
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };

    pool = new Pool(config);

    // Handle connection errors
    pool.on("error", (err) => {
      console.error("❌ Database pool error:", err);
      isConnected = false;

      // Attempt to reconnect after a delay
      setTimeout(() => {
        console.log("🔄 Attempting to reconnect to database...");
        connectDB();
      }, 5000);
    });

    pool.on("connect", () => {
      console.log("✅ Database client connected");
      isConnected = true;
    });

    pool.on("acquire", () => {
      console.log("📡 Database client acquired from pool");
    });

    pool.on("release", () => {
      console.log("🔄 Database client released back to pool");
    });

    // Test the connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");
    isConnected = true;

    // Create tables if they don't exist
    await createTables();

    // Set up connection health check
    setInterval(async () => {
      try {
        await pool.query("SELECT 1");
        if (!isConnected) {
          console.log("✅ Database connection restored");
          isConnected = true;
        }
      } catch (error) {
        console.error("❌ Database health check failed:", error.message);
        isConnected = false;
      }
    }, 30000); // Check every 30 seconds
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    if (retries > 0) {
      console.log(
        `🔄 Retrying connection in 5 seconds... (${retries} attempts remaining)`
      );
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error("❌ Max retries exceeded. Exiting...");
      process.exit(1);
    }
  }
};

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        user_name VARCHAR(100) UNIQUE,
        phone VARCHAR(20),
        role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'cleaner', 'admin')),
        profile_image TEXT,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(10),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        stripe_customer_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cleaner profiles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cleaner_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT,
        experience_years INTEGER DEFAULT 0,
        hourly_rate DECIMAL(10, 2),
        availability_schedule JSONB,
        service_radius INTEGER DEFAULT 10,
        rating DECIMAL(3, 2) DEFAULT 0.00,
        total_jobs INTEGER DEFAULT 0,
        is_available BOOLEAN DEFAULT TRUE,
        background_check_status VARCHAR(20) DEFAULT 'pending',
        certifications TEXT[],
        stripe_account_id VARCHAR(255),
        cleaning_services TEXT[],
        cleaning_frequency VARCHAR(50) DEFAULT 'part-time',
        preferred_hours TEXT,
        message TEXT,
        id_front_url TEXT,
        id_back_url TEXT,
        ssn_front_url TEXT,
        ssn_back_url TEXT,
        agreement_accepted BOOLEAN DEFAULT FALSE,
        terms_1099_accepted BOOLEAN DEFAULT FALSE,
        brings_supplies BOOLEAN DEFAULT FALSE,
        has_experience BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        base_price DECIMAL(10, 2) NOT NULL,
        duration_hours INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cleaner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        duration_hours INTEGER NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
        special_instructions TEXT,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(10) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
        stripe_payment_intent_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Memberships table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS memberships (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_name VARCHAR(100) NOT NULL DEFAULT 'SuperSaver Monthly',
        tier VARCHAR(50) NOT NULL DEFAULT 'supersaver' CHECK (tier IN ('supersaver')),
        monthly_fee DECIMAL(10, 2) NOT NULL DEFAULT 59.00,
        discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 50.00,
        stripe_subscription_id VARCHAR(255) UNIQUE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'trialing', 'expired')),
        start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        auto_renewal BOOLEAN DEFAULT TRUE,
        billing_cycle_anchor INTEGER,
        trial_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Membership usage tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS membership_usage (
        id SERIAL PRIMARY KEY,
        membership_id INTEGER REFERENCES memberships(id) ON DELETE CASCADE,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        discount_applied DECIMAL(10, 2) NOT NULL,
        original_amount DECIMAL(10, 2) NOT NULL,
        discounted_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Legacy subscriptions table for backward compatibility
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_name VARCHAR(100) NOT NULL,
        stripe_subscription_id VARCHAR(255) UNIQUE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tickets system tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
        freelancer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        assigned_admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        
        category VARCHAR(50) NOT NULL CHECK (category IN ('service_quality', 'lateness', 'damage', 'payment', 'other')),
        priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
        status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
        
        summary VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        internal_notes TEXT,
        
        -- SLA timestamps
        opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        first_response_at TIMESTAMP,
        resolved_at TIMESTAMP,
        closed_at TIMESTAMP,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_messages (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_internal BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_attachments (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
        message_id INTEGER REFERENCES ticket_messages(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        file_url TEXT NOT NULL,
        uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_timeline (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action_type VARCHAR(50) NOT NULL,
        old_value VARCHAR(255),
        new_value VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Special offers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS special_offers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        offer_type VARCHAR(50) NOT NULL CHECK (offer_type IN ('first_clean', 'membership_bonus', 'seasonal', 'referral')),
        discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('fixed_amount', 'percentage', 'fixed_price')),
        discount_value DECIMAL(10, 2) NOT NULL,
        conditions JSONB NOT NULL DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valid_until TIMESTAMP,
        max_uses_per_user INTEGER DEFAULT 1,
        max_total_uses INTEGER,
        current_total_uses INTEGER DEFAULT 0,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User offer usage tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_offer_usage (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        offer_id INTEGER REFERENCES special_offers(id) ON DELETE CASCADE,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        discount_applied DECIMAL(10, 2) NOT NULL,
        original_amount DECIMAL(10, 2) NOT NULL,
        final_amount DECIMAL(10, 2) NOT NULL,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, offer_id)
      )
    `);

    // Reviews system
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cleaner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
        punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
        communication INTEGER CHECK (communication >= 1 AND communication <= 5),
        would_recommend BOOLEAN,
        helpful_votes INTEGER DEFAULT 0,
        total_votes INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT TRUE,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(booking_id, customer_id)
      )
    `);

    // Platform statistics
    await pool.query(`
      CREATE TABLE IF NOT EXISTS platform_stats (
        id SERIAL PRIMARY KEY,
        stat_name VARCHAR(100) NOT NULL UNIQUE,
        stat_value DECIMAL(10, 2),
        stat_text VARCHAR(255),
        stat_json JSONB,
        last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        manual_override BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Coverage areas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coverage_areas (
        id SERIAL PRIMARY KEY,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip_codes TEXT[], -- Array of zip codes served in this city
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(city, state)
      )
    `);

    // Trust badges for credibility
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trust_badges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        external_url TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        badge_type VARCHAR(50) DEFAULT 'media' CHECK (badge_type IN ('media', 'certification', 'award', 'partner')),
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Customer testimonials
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_title VARCHAR(255),
        customer_location VARCHAR(255),
        content TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        service_type VARCHAR(255),
        image_url TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INTEGER DEFAULT 0,
        source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'review', 'import')),
        source_review_id INTEGER REFERENCES reviews(id) ON DELETE SET NULL,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_users_user_name ON users(user_name)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_users_zip_code ON users(zip_code)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_bookings_cleaner_id ON bookings(cleaner_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date)"
    );

    // Membership table indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_memberships_stripe_subscription_id ON memberships(stripe_subscription_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_membership_usage_membership_id ON membership_usage(membership_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_membership_usage_booking_id ON membership_usage(booking_id)"
    );

    // Special offers table indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_special_offers_type ON special_offers(offer_type)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_special_offers_active ON special_offers(is_active)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_user_offer_usage_user_id ON user_offer_usage(user_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_user_offer_usage_offer_id ON user_offer_usage(offer_id)"
    );

    // Reviews indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_cleaner_id ON reviews(cleaner_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews(is_visible)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)"
    );

    // Ticket system indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON tickets(customer_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tickets_booking_id ON tickets(booking_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tickets_freelancer_id ON tickets(freelancer_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tickets_assigned_admin_id ON tickets(assigned_admin_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_tickets_opened_at ON tickets(opened_at)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_ticket_messages_user_id ON ticket_messages(user_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_ticket_messages_created_at ON ticket_messages(created_at)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_ticket_attachments_message_id ON ticket_attachments(message_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_ticket_timeline_ticket_id ON ticket_timeline(ticket_id)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_ticket_timeline_created_at ON ticket_timeline(created_at)"
    );

    // Platform stats indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_platform_stats_name ON platform_stats(stat_name)"
    );

    // Coverage areas indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_coverage_areas_active ON coverage_areas(is_active)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_coverage_areas_city_state ON coverage_areas(city, state)"
    );

    // Trust badges indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_trust_badges_active ON trust_badges(is_active)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_trust_badges_order ON trust_badges(display_order)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_trust_badges_type ON trust_badges(badge_type)"
    );

    // Testimonials indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(display_order)"
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_testimonials_source ON testimonials(source)"
    );

    // Additional tables for payment processing
    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_transfers (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        stripe_transfer_id VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        platform_fee DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_refunds (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        stripe_refund_id VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create membership status view for quick membership checks
    // First check if the view exists to avoid conflicts with migrations
    const viewCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'user_membership_status'
      ) as exists;
    `);
    
    const viewExists = viewCheckResult.rows[0].exists;
    
    if (!viewExists) {
      await pool.query(`
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
        WHERE u.role IN ('customer', 'admin', 'cleaner')
      `);
    }

    // Create trigger function to update tickets updated_at timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_ticket_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger for tickets table
    await pool.query(`
      DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
      CREATE TRIGGER update_tickets_updated_at
          BEFORE UPDATE ON tickets
          FOR EACH ROW
          EXECUTE FUNCTION update_ticket_updated_at();
    `);

    // Create function to check if user is currently a member
    await pool.query(`
      CREATE OR REPLACE FUNCTION is_user_member(user_id_param INTEGER)
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM memberships 
          WHERE user_id = user_id_param 
            AND status IN ('active', 'trialing') 
            AND (current_period_end > NOW() OR (status = 'trialing' AND (trial_end IS NULL OR trial_end > NOW())))
        );
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Admin Reviews Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_reviews (
        id SERIAL PRIMARY KEY,
        cleaner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        is_visible BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for admin_reviews table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_reviews_cleaner_id ON admin_reviews(cleaner_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_reviews_admin_id ON admin_reviews(admin_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_reviews_created_at ON admin_reviews(created_at);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_reviews_is_visible ON admin_reviews(is_visible);
    `);

    console.log("✅ Database tables created/verified successfully");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    throw error;
  }
};

const query = async (text, params, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.error(
        `❌ Database query failed (attempt ${i + 1}):`,
        error.message
      );

      if (i === retries - 1) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

const getClient = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      return client;
    } catch (error) {
      console.error(
        `❌ Failed to get database client (attempt ${i + 1}):`,
        error.message
      );

      if (i === retries - 1) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Health check function
const healthCheck = async () => {
  try {
    await query("SELECT 1");
    return { status: "healthy", connected: true };
  } catch (error) {
    return { status: "unhealthy", connected: false, error: error.message };
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    console.log("🔄 Closing database pool...");
    await pool.end();
    console.log("✅ Database pool closed gracefully");
    isConnected = false;
  } catch (error) {
    console.error("❌ Error during database shutdown:", error.message);
  }
};

module.exports = {
  connectDB,
  query,
  getClient,
  healthCheck,
  gracefulShutdown,
  pool,
};
