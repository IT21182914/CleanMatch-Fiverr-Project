const { query } = require("../config/database");
const {
  createSubscription,
  createStripeCustomer,
  stripe,
} = require("../utils/stripe");

// CleanMatch membership plans configuration
const MEMBERSHIP_PLANS = {
  supersaver: {
    name: "SuperSaver Monthly",
    monthlyFee: 59.0,
    discountPercentage: 50.0,
    stripePriceId: process.env.STRIPE_SUPERSAVER_PRICE_ID,
    features: [
      "50% discount on all cleaning services",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "Money-back guarantee",
    ],
    popular: true,
    tagline: "Save 50% on every service",
    badge: "Most Popular",
  },
  basic: {
    name: "Basic Plan",
    monthlyFee: 49.0,
    discountPercentage: 15.0,
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: [
      "15% discount on all cleaning services",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
    ],
  },
  premium: {
    name: "Premium Plan",
    monthlyFee: 79.0,
    discountPercentage: 25.0,
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      "25% discount on all cleaning services",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Free monthly deep clean upgrade",
      "Flexible rescheduling",
    ],
  },
  gold: {
    name: "Gold Plan",
    monthlyFee: 129.0,
    discountPercentage: 35.0,
    stripePriceId: process.env.STRIPE_GOLD_PRICE_ID,
    features: [
      "35% discount on all cleaning services",
      "VIP priority booking",
      "24/7 customer support",
      "Service guarantee",
      "2 free monthly deep clean upgrades",
      "Flexible rescheduling",
      "Dedicated account manager",
      "Eco-friendly products included",
    ],
  },
};

/**
 * @desc    Get all membership plans
 * @route   GET /api/memberships/plans
 * @access  Public
 */
const getMembershipPlans = async (req, res) => {
  try {
    res.json({
      success: true,
      plans: MEMBERSHIP_PLANS,
    });
  } catch (error) {
    console.error("Get membership plans error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving membership plans",
    });
  }
};

/**
 * @desc    Subscribe to membership
 * @route   POST /api/memberships/subscribe
 * @access  Private (Customers only)
 */
const subscribeToMembership = async (req, res) => {
  try {
    const { tier = "basic", paymentMethodId } = req.body;

    if (!MEMBERSHIP_PLANS[tier]) {
      return res.status(400).json({
        success: false,
        error: "Invalid membership tier",
      });
    }

    // Check if user already has an active membership
    const existingMembership = await query(
      "SELECT * FROM memberships WHERE user_id = $1 AND status = 'active'",
      [req.user.id]
    );

    if (existingMembership.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User already has an active membership",
      });
    }

    // Get user details
    const userResult = await query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    const user = userResult.rows[0];

    // Create Stripe customer if needed
    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      stripeCustomerId = await createStripeCustomer(user);
      await query("UPDATE users SET stripe_customer_id = $1 WHERE id = $2", [
        stripeCustomerId,
        req.user.id,
      ]);
    }

    const plan = MEMBERSHIP_PLANS[tier];

    // Create Stripe subscription
    const subscription = await createSubscription({
      customerId: stripeCustomerId,
      priceId: plan.stripePriceId,
      userId: req.user.id,
      paymentMethodId,
    });

    // Create membership record in database
    const membershipResult = await query(
      `INSERT INTO memberships (
        user_id, plan_name, tier, monthly_fee, discount_percentage,
        stripe_subscription_id, status, start_date, current_period_start, 
        current_period_end
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        req.user.id,
        plan.name,
        tier,
        plan.monthlyFee,
        plan.discountPercentage,
        subscription.id,
        subscription.status,
        new Date(),
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
      ]
    );

    res.status(201).json({
      success: true,
      membership: membershipResult.rows[0],
      subscription_id: subscription.id,
      client_secret: subscription.latest_invoice?.payment_intent?.client_secret,
      status: subscription.status,
    });
  } catch (error) {
    console.error("Subscribe to membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating membership subscription",
    });
  }
};

/**
 * @desc    Get user's current membership
 * @route   GET /api/memberships/current
 * @access  Private (Customers only)
 */
const getCurrentMembership = async (req, res) => {
  try {
    const membershipResult = await query(
      `SELECT m.*, 
       CASE WHEN m.status = 'active' AND m.current_period_end > NOW() THEN true ELSE false END as is_active
       FROM memberships m 
       WHERE m.user_id = $1 
       ORDER BY m.created_at DESC 
       LIMIT 1`,
      [req.user.id]
    );

    const membership = membershipResult.rows[0] || null;

    // If membership exists, get usage statistics
    let usageStats = null;
    if (membership) {
      const usageResult = await query(
        `SELECT 
         COUNT(*) as total_bookings,
         SUM(discount_applied) as total_savings,
         SUM(original_amount - discounted_amount) as total_discounts
         FROM membership_usage 
         WHERE membership_id = $1`,
        [membership.id]
      );
      usageStats = usageResult.rows[0];
    }

    res.json({
      success: true,
      membership,
      usageStats,
      planDetails: membership ? MEMBERSHIP_PLANS[membership.tier] : null,
    });
  } catch (error) {
    console.error("Get current membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving membership",
    });
  }
};

/**
 * @desc    Cancel membership
 * @route   PUT /api/memberships/cancel
 * @access  Private (Customers only)
 */
const cancelMembership = async (req, res) => {
  try {
    const { cancelAtPeriodEnd = true, reason } = req.body;

    // Get user's active membership
    const membershipResult = await query(
      "SELECT * FROM memberships WHERE user_id = $1 AND status = 'active'",
      [req.user.id]
    );

    if (membershipResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No active membership found",
      });
    }

    const membership = membershipResult.rows[0];

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      membership.stripe_subscription_id,
      {
        cancel_at_period_end: cancelAtPeriodEnd,
        metadata: {
          cancellation_reason: reason || "User requested cancellation",
        },
      }
    );

    // Update database
    await query(
      `UPDATE memberships 
       SET cancel_at_period_end = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [cancelAtPeriodEnd, membership.id]
    );

    res.json({
      success: true,
      message: cancelAtPeriodEnd
        ? "Membership will cancel at the end of the current period"
        : "Membership cancellation removed",
      membership: {
        ...membership,
        cancel_at_period_end: cancelAtPeriodEnd,
      },
    });
  } catch (error) {
    console.error("Cancel membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error canceling membership",
    });
  }
};

/**
 * @desc    Reactivate membership
 * @route   PUT /api/memberships/reactivate
 * @access  Private (Customers only)
 */
const reactivateMembership = async (req, res) => {
  try {
    // Get user's membership
    const membershipResult = await query(
      "SELECT * FROM memberships WHERE user_id = $1 AND cancel_at_period_end = true",
      [req.user.id]
    );

    if (membershipResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No membership scheduled for cancellation found",
      });
    }

    const membership = membershipResult.rows[0];

    // Update subscription in Stripe
    await stripe.subscriptions.update(membership.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    // Update database
    await query(
      `UPDATE memberships 
       SET cancel_at_period_end = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [membership.id]
    );

    res.json({
      success: true,
      message: "Membership reactivated successfully",
    });
  } catch (error) {
    console.error("Reactivate membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error reactivating membership",
    });
  }
};

/**
 * @desc    Update membership payment method
 * @route   PUT /api/memberships/payment-method
 * @access  Private (Customers only)
 */
const updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        error: "Payment method ID is required",
      });
    }

    // Get user's active membership
    const membershipResult = await query(
      "SELECT * FROM memberships WHERE user_id = $1 AND status = 'active'",
      [req.user.id]
    );

    if (membershipResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No active membership found",
      });
    }

    const membership = membershipResult.rows[0];

    // Get user's Stripe customer ID
    const userResult = await query(
      "SELECT stripe_customer_id FROM users WHERE id = $1",
      [req.user.id]
    );
    const stripeCustomerId = userResult.rows[0].stripe_customer_id;

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Update default payment method for the subscription
    await stripe.subscriptions.update(membership.stripe_subscription_id, {
      default_payment_method: paymentMethodId,
    });

    res.json({
      success: true,
      message: "Payment method updated successfully",
    });
  } catch (error) {
    console.error("Update payment method error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating payment method",
    });
  }
};

/**
 * @desc    Calculate membership pricing for a service
 * @route   POST /api/memberships/calculate-pricing
 * @access  Private (Customers only)
 */
const calculateMembershipPricing = async (req, res) => {
  try {
    const { serviceId, hours = 1 } = req.body;

    // Get service details
    const serviceResult = await query(
      "SELECT id, name, base_price FROM services WHERE id = $1 AND is_active = true",
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    const service = serviceResult.rows[0];
    const originalAmount = parseFloat(service.base_price) * parseInt(hours);

    // Check user's membership status
    const membershipResult = await query(
      `SELECT * FROM memberships 
       WHERE user_id = $1 AND status = 'active' 
       AND current_period_end > NOW()`,
      [req.user.id]
    );

    let discountAmount = 0;
    let discountPercentage = 0;
    let membershipTier = null;

    if (membershipResult.rows.length > 0) {
      const membership = membershipResult.rows[0];
      membershipTier = membership.tier;
      discountPercentage = parseFloat(membership.discount_percentage);
      discountAmount = originalAmount * (discountPercentage / 100);
    }

    const finalAmount = originalAmount - discountAmount;

    res.json({
      success: true,
      pricing: {
        service: {
          id: service.id,
          name: service.name,
          basePricePerHour: service.base_price,
        },
        calculation: {
          hours: parseInt(hours),
          originalAmount: Math.round(originalAmount * 100) / 100,
          discountPercentage,
          discountAmount: Math.round(discountAmount * 100) / 100,
          finalAmount: Math.round(finalAmount * 100) / 100,
          membershipTier,
          savings: Math.round(discountAmount * 100) / 100,
        },
      },
    });
  } catch (error) {
    console.error("Calculate membership pricing error:", error);
    res.status(500).json({
      success: false,
      error: "Server error calculating membership pricing",
    });
  }
};

/**
 * @desc    Record membership usage (called when booking is paid)
 * @route   POST /api/memberships/record-usage
 * @access  Private (Internal use)
 */
const recordMembershipUsage = async (
  membershipId,
  bookingId,
  originalAmount,
  discountedAmount
) => {
  try {
    const discountApplied = originalAmount - discountedAmount;

    await query(
      `INSERT INTO membership_usage 
       (membership_id, booking_id, discount_applied, original_amount, discounted_amount)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        membershipId,
        bookingId,
        discountApplied,
        originalAmount,
        discountedAmount,
      ]
    );

    return true;
  } catch (error) {
    console.error("Record membership usage error:", error);
    throw error;
  }
};

/**
 * @desc    Get membership analytics (for admin)
 * @route   GET /api/memberships/analytics
 * @access  Private (Admin only)
 */
const getMembershipAnalytics = async (req, res) => {
  try {
    // Total membership statistics
    const totalStatsResult = await query(`
      SELECT 
        COUNT(*) as total_memberships,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_memberships,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_memberships,
        SUM(CASE WHEN status = 'active' THEN monthly_fee ELSE 0 END) as monthly_revenue
      FROM memberships
    `);

    // Membership distribution by tier
    const tierDistributionResult = await query(`
      SELECT 
        tier,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count
      FROM memberships
      GROUP BY tier
      ORDER BY tier
    `);

    // Monthly membership growth
    const growthResult = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_memberships,
        tier
      FROM memberships
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at), tier
      ORDER BY month, tier
    `);

    // Usage statistics
    const usageStatsResult = await query(`
      SELECT 
        COUNT(*) as total_bookings_with_membership,
        SUM(discount_applied) as total_discounts_given,
        AVG(discount_applied) as avg_discount_per_booking
      FROM membership_usage
    `);

    res.json({
      success: true,
      analytics: {
        totalStats: totalStatsResult.rows[0],
        tierDistribution: tierDistributionResult.rows,
        monthlyGrowth: growthResult.rows,
        usageStats: usageStatsResult.rows[0],
      },
    });
  } catch (error) {
    console.error("Get membership analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving membership analytics",
    });
  }
};

/**
 * @desc    Get all memberships (for admin)
 * @route   GET /api/memberships/all
 * @access  Private (Admin only)
 */
const getAllMemberships = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, tier, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (status) {
      whereConditions.push(`m.status = $${paramCount++}`);
      queryParams.push(status);
    }

    if (tier) {
      whereConditions.push(`m.tier = $${paramCount++}`);
      queryParams.push(tier);
    }

    if (search) {
      whereConditions.push(
        `(u.first_name ILIKE $${paramCount} OR u.last_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get memberships with user details
    const membershipsQuery = `
      SELECT 
        m.*,
        u.first_name, u.last_name, u.email,
        (SELECT COUNT(*) FROM membership_usage mu WHERE mu.membership_id = m.id) as usage_count,
        (SELECT SUM(discount_applied) FROM membership_usage mu WHERE mu.membership_id = m.id) as total_savings
      FROM memberships m
      JOIN users u ON m.user_id = u.id
      ${whereClause}
      ORDER BY m.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const membershipsResult = await query(membershipsQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM memberships m
      JOIN users u ON m.user_id = u.id
      ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      memberships: membershipsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all memberships error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving memberships",
    });
  }
};

module.exports = {
  getMembershipPlans,
  subscribeToMembership,
  getCurrentMembership,
  cancelMembership,
  reactivateMembership,
  updatePaymentMethod,
  calculateMembershipPricing,
  recordMembershipUsage,
  getMembershipAnalytics,
  getAllMemberships,
  MEMBERSHIP_PLANS,
};
