const { query } = require("../config/database");
const {
  createSubscription,
  createStripeCustomer,
  createOneTimePayment,
  stripe,
} = require("../utils/stripe");

// CleanMatch membership plans configuration
const MEMBERSHIP_PLANS = {
  // Comfort Life Moon Plans
  moon_1_month: {
    name: "Comfort Life Moon",
    subtitle: "1 Month",
    monthlyFee: 36.90,
    fee: 36.90,
    duration: 30, // days
    tier: "moon",
    discountPercentage: 15.0, // Service discount percentage
    discountRange: { min: 18, max: 22 },
    features: [
      "15% discounts on services between $18-$22",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "30-day access",
    ],
    tagline: "Affordable monthly protection",
    canBeRecurring: true,
    recurringInterval: 'month',
    stripePriceIds: {
      recurring: process.env.STRIPE_MOON_1_MONTH_RECURRING,
      oneTime: process.env.STRIPE_MOON_1_MONTH_ONETIME
    }
  },
  moon_3_months: {
    name: "Comfort Life Moon",
    subtitle: "3 Months",
    monthlyFee: 33.21, // 99.63 / 3
    fee: 99.63,
    originalFee: 110.70,
    duration: 90, // days
    tier: "moon",
    discount: 10,
    discountPercentage: 15.0, // Service discount percentage
    discountRange: { min: 18, max: 22 },
    features: [
      "15% discounts on services between $18-$22",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "90-day access",
      "10% discount applied",
    ],
    tagline: "Save 10% with quarterly plan",
    badge: "Save 10%",
    canBeRecurring: true,
    recurringInterval: 'quarter',
    stripePriceIds: {
      recurring: process.env.STRIPE_MOON_3_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_MOON_3_MONTHS_ONETIME
    }
  },
  moon_6_months: {
    name: "Comfort Life Moon",
    subtitle: "6 Months",
    monthlyFee: 31.37, // 188.19 / 6
    fee: 188.19,
    originalFee: 221.40,
    duration: 180, // days
    tier: "moon",
    discount: 15,
    discountPercentage: 15.0, // Service discount percentage
    discountRange: { min: 18, max: 22 },
    features: [
      "15% discounts on services between $18-$22",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "180-day access",
      "15% discount applied",
    ],
    tagline: "Save 15% with semi-annual plan",
    badge: "Save 15%",
    canBeRecurring: true,
    recurringInterval: 'semiannual',
    stripePriceIds: {
      recurring: process.env.STRIPE_MOON_6_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_MOON_6_MONTHS_ONETIME
    }
  },
  moon_12_months: {
    name: "Comfort Life Moon",
    subtitle: "12 Months",
    monthlyFee: 29.52, // 354.24 / 12
    fee: 354.24,
    originalFee: 442.80,
    duration: 365, // days
    tier: "moon",
    discount: 20,
    discountPercentage: 15.0, // Service discount percentage
    discountRange: { min: 18, max: 22 },
    features: [
      "15% discounts on services between $18-$22",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "365-day access",
      "20% discount applied",
      "Best value",
    ],
    tagline: "Maximum savings with annual plan",
    badge: "Best Value",
    popular: true,
    canBeRecurring: true,
    recurringInterval: 'year',
    stripePriceIds: {
      recurring: process.env.STRIPE_MOON_12_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_MOON_12_MONTHS_ONETIME
    }
  },

  // Comfort Life Star Plans
  star_1_month: {
    name: "Comfort Life Star",
    subtitle: "1 Month",
    monthlyFee: 63.90,
    fee: 63.90,
    duration: 30, // days
    tier: "star",
    discountPercentage: 20.0, // Service discount percentage
    discountRange: { min: 18, max: 32 },
    features: [
      "20% discounts on services between $18-$32",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "30-day access",
      "Extended service range",
    ],
    tagline: "Enhanced monthly protection",
    canBeRecurring: true,
    recurringInterval: 'month',
    stripePriceIds: {
      recurring: process.env.STRIPE_STAR_1_MONTH_RECURRING,
      oneTime: process.env.STRIPE_STAR_1_MONTH_ONETIME
    }
  },
  star_3_months: {
    name: "Comfort Life Star",
    subtitle: "3 Months",
    monthlyFee: 57.51, // 172.53 / 3
    fee: 172.53,
    originalFee: 191.70,
    duration: 90, // days
    tier: "star",
    discount: 10,
    discountPercentage: 20.0, // Service discount percentage
    discountRange: { min: 18, max: 32 },
    features: [
      "20% discounts on services between $18-$32",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "90-day access",
      "Extended service range",
      "10% discount applied",
    ],
    tagline: "Save 10% with quarterly plan",
    badge: "Save 10%",
    canBeRecurring: true,
    recurringInterval: 'quarter',
    stripePriceIds: {
      recurring: process.env.STRIPE_STAR_3_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_STAR_3_MONTHS_ONETIME
    }
  },
  star_6_months: {
    name: "Comfort Life Star",
    subtitle: "6 Months",
    monthlyFee: 54.30, // 325.77 / 6
    fee: 325.77,
    originalFee: 383.40,
    duration: 180, // days
    tier: "star",
    discount: 15,
    discountPercentage: 20.0, // Service discount percentage
    discountRange: { min: 18, max: 32 },
    features: [
      "20% discounts on services between $18-$32",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "180-day access",
      "Extended service range",
      "15% discount applied",
    ],
    tagline: "Save 15% with semi-annual plan",
    badge: "Save 15%",
    canBeRecurring: true,
    recurringInterval: 'semiannual',
    stripePriceIds: {
      recurring: process.env.STRIPE_STAR_6_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_STAR_6_MONTHS_ONETIME
    }
  },
  star_12_months: {
    name: "Comfort Life Star",
    subtitle: "12 Months",
    monthlyFee: 51.12, // 613.44 / 12
    fee: 613.44,
    originalFee: 766.80,
    duration: 365, // days
    tier: "star",
    discount: 20,
    discountPercentage: 20.0, // Service discount percentage
    discountRange: { min: 18, max: 32 },
    features: [
      "20% discounts on services between $18-$32",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "365-day access",
      "Extended service range",
      "20% discount applied",
      "Best value",
    ],
    tagline: "Maximum savings with annual plan",
    badge: "Most Popular",
    popular: true,
    canBeRecurring: true,
    recurringInterval: 'year',
    stripePriceIds: {
      recurring: process.env.STRIPE_STAR_12_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_STAR_12_MONTHS_ONETIME
    }
  },

  // Comfort Life Sun Plans
  sun_1_month: {
    name: "Comfort Life Sun",
    subtitle: "1 Month",
    monthlyFee: 96.30,
    fee: 96.30,
    duration: 30, // days
    tier: "sun",
    discountPercentage: 25.0, // Service discount percentage
    discountRange: { min: 18, max: 45 },
    features: [
      "25% discounts on services between $18-$45",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "30-day access",
      "Premium service range",
      "Concierge support",
    ],
    tagline: "Premium monthly protection",
    canBeRecurring: true,
    recurringInterval: 'month',
    stripePriceIds: {
      recurring: process.env.STRIPE_SUN_1_MONTH_RECURRING,
      oneTime: process.env.STRIPE_SUN_1_MONTH_ONETIME
    }
  },
  sun_3_months: {
    name: "Comfort Life Sun",
    subtitle: "3 Months",
    monthlyFee: 86.67, // 260.01 / 3
    fee: 260.01,
    originalFee: 288.90,
    duration: 90, // days
    tier: "sun",
    discount: 10,
    discountPercentage: 25.0, // Service discount percentage
    discountRange: { min: 18, max: 45 },
    features: [
      "25% discounts on services between $18-$45",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "90-day access",
      "Premium service range",
      "Concierge support",
      "10% discount applied",
    ],
    tagline: "Save 10% with quarterly plan",
    badge: "Save 10%",
    canBeRecurring: true,
    recurringInterval: 'quarter',
    stripePriceIds: {
      recurring: process.env.STRIPE_SUN_3_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_SUN_3_MONTHS_ONETIME
    }
  },
  sun_6_months: {
    name: "Comfort Life Sun",
    subtitle: "6 Months",
    monthlyFee: 81.89, // 491.31 / 6
    fee: 491.31,
    originalFee: 577.80,
    duration: 180, // days
    tier: "sun",
    discount: 15,
    discountPercentage: 25.0, // Service discount percentage
    discountRange: { min: 18, max: 45 },
    features: [
      "25% discounts on services between $18-$45",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "180-day access",
      "Premium service range",
      "Concierge support",
      "15% discount applied",
    ],
    tagline: "Save 15% with semi-annual plan",
    badge: "Save 15%",
    canBeRecurring: true,
    recurringInterval: 'semiannual',
    stripePriceIds: {
      recurring: process.env.STRIPE_SUN_6_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_SUN_6_MONTHS_ONETIME
    }
  },
  sun_12_months: {
    name: "Comfort Life Sun",
    subtitle: "12 Months",
    monthlyFee: 77.08, // 924.96 / 12
    fee: 924.96,
    originalFee: 1155.60,
    duration: 365, // days
    tier: "sun",
    discount: 20,
    discountPercentage: 25.0, // Service discount percentage
    discountRange: { min: 18, max: 45 },
    features: [
      "25% discounts on services between $18-$45",
      "Priority booking",
      "24/7 customer support",
      "Service guarantee",
      "Flexible scheduling",
      "365-day access",
      "Premium service range",
      "Concierge support",
      "20% discount applied",
      "Maximum coverage",
    ],
    tagline: "Ultimate protection with annual plan",
    badge: "Premium",
    canBeRecurring: true,
    recurringInterval: 'year',
    stripePriceIds: {
      recurring: process.env.STRIPE_SUN_12_MONTHS_RECURRING,
      oneTime: process.env.STRIPE_SUN_12_MONTHS_ONETIME
    }
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
    const { tier = "moon_1_month", paymentMethodId, isRecurring = false } = req.body;

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
      const currentTier = existingMembership.rows[0].tier;

      // Extract plan details for comparison
      const currentPlan = MEMBERSHIP_PLANS[currentTier];
      const newPlan = MEMBERSHIP_PLANS[tier];

      // Prevent downgrade from annual to monthly for any tier
      if (currentTier.includes("12_months") && tier.includes("1_month")) {
        return res.status(400).json({
          success: false,
          error: "Cannot downgrade from annual to monthly plan while annual plan is active",
        });
      }
      
      // Allow same user to have same plan (for plan renewals/extensions)
      if (currentTier === tier) {
        return res.status(400).json({
          success: false,
          error: "User already has this membership tier active",
        });
      }

      // Allow upgrades and plan changes
      console.log(`User changing from ${currentTier} to ${tier}`);
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
    let stripePayment, membershipResult;

    // Handle case where user is upgrading/changing plan
    if (existingMembership?.rows?.length > 0) {
      // Cancel the current subscription in Stripe if it exists
      const currentSubscriptionId = existingMembership.rows[0].stripe_subscription_id;
      try {
        await stripe.subscriptions.cancel(currentSubscriptionId, {
          prorate: true,
          invoice_now: false
        });

        // Mark the old subscription as cancelled in our database
        await query(
          `UPDATE memberships 
           SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP,
           cancellation_reason = 'Upgraded to annual plan'
           WHERE id = $1`,
          [existingMembership.rows[0].id]
        );
      } catch (cancelError) {
        console.error("Error cancelling previous subscription during upgrade:", cancelError);
        // Continue with the upgrade even if there was an issue cancelling the old subscription
      }
    }

    // Get appropriate price ID based on the recurring flag
    const priceId = isRecurring ? plan.stripePriceIds.recurring : plan.stripePriceIds.oneTime;

    // Handle different payment types based on isRecurring parameter
    if (isRecurring) {
      // Create Stripe subscription for recurring plans
      const subscription = await createSubscription({
        customerId: stripeCustomerId,
        priceId: priceId,
        userId: req.user.id,
        paymentMethodId,
      });

      stripePayment = subscription;

      // Set initial status - Stripe subscriptions usually start as 'incomplete'
      // until the first payment is confirmed
      let status = 'unpaid';
      if (subscription.status === 'active') {
        status = 'active';
      }

      // Create membership record in database for recurring plan
      membershipResult = await query(
        `INSERT INTO memberships (
          user_id, plan_name, tier, monthly_fee, discount_percentage,
          stripe_subscription_id, status, start_date, current_period_start, 
          current_period_end, auto_renewal
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          req.user.id,
          plan.name + (tier.includes('year') ? ' (Annual)' : ' (Monthly)'),
          tier,
          plan.monthlyFee,
          plan.discountPercentage,
          subscription.id,
          status,
          new Date(),
          new Date(subscription.current_period_start * 1000),
          new Date(subscription.current_period_end * 1000),
          true // Auto renewal is true for recurring plans
        ]
      );

      // Prepare client response
      const responseData = {
        success: true,
        membership: membershipResult.rows[0],
        subscription_id: subscription.id,
        status: subscription.status,
        paymentType: 'recurring',
        isRecurring: true
      };

      // Add client secret if available for payment confirmation
      if (subscription.latest_invoice?.payment_intent?.client_secret) {
        responseData.client_secret = subscription.latest_invoice.payment_intent.client_secret;
        responseData.payment_intent_id = subscription.latest_invoice.payment_intent.id;
      }

      res.status(201).json(responseData);

    } else {
      // Create one-time payment for non-recurring plans
      const paymentIntent = await createOneTimePayment({
        customerId: stripeCustomerId,
        amount: plan.fee,
        userId: req.user.id,
        description: `CleanMatch ${plan.name} ${tier.includes('year') ? 'Annual' : 'Monthly'} Membership (One-time)`,
        metadata: {
          tier: tier,
          user_id: req.user.id,
          isRecurring: false,
          membership_type: 'one-time'
        }
      });

      stripePayment = paymentIntent;

      // Calculate period end date (current date + duration days)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      // Set initial status based on Stripe payment intent status
      let status = 'unpaid';
      if (paymentIntent.status === 'succeeded') {
        status = 'active';
      }

      // Create membership record in database for one-time plan
      // We're using stripe_subscription_id to store the payment intent ID for one-time payments
      membershipResult = await query(
        `INSERT INTO memberships (
          user_id, plan_name, tier, monthly_fee, discount_percentage,
          stripe_subscription_id, status, start_date, current_period_start, 
          current_period_end, auto_renewal, cancel_at_period_end
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
          req.user.id,
          plan.name + (tier.includes('year') ? ' (Annual)' : ' (Monthly)') + ' (One-time)',
          tier,
          plan.fee,
          plan.discountPercentage,
          paymentIntent.id,
          status,
          startDate,
          startDate,
          endDate,
          false,
          true  // One-time memberships will cancel at period end automatically
        ]
      );

      res.status(201).json({
        success: true,
        membership: membershipResult.rows[0],
        payment_intent_id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        paymentType: 'one-time',
        isRecurring: false,
        // Include these fields to maintain compatibility with subscription responses
        subscription_id: paymentIntent.id
      });
    }

  } catch (error) {
    console.error("Subscribe to membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating membership subscription",
      details: error.message
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

    // Check if this is a recurring or one-time membership
    const isRecurring = membership.auto_renewal;

    if (isRecurring) {
      // For recurring subscriptions, update in Stripe
      try {
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
          SET cancel_at_period_end = $1, updated_at = CURRENT_TIMESTAMP, cancellation_reason = $3
          WHERE id = $2`,
          [cancelAtPeriodEnd, membership.id, reason || "User requested cancellation"]
        );
      } catch (stripeError) {
        console.error("Error updating Stripe subscription:", stripeError);

        // If the subscription doesn't exist in Stripe anymore, still update our database
        if (stripeError.code === 'resource_missing') {
          await query(
            `UPDATE memberships 
            SET cancel_at_period_end = true, updated_at = CURRENT_TIMESTAMP, cancellation_reason = $2
            WHERE id = $1`,
            [membership.id, reason || "User requested cancellation"]
          );
        } else {
          throw stripeError; // Re-throw if it's a different error
        }
      }
    } else {
      // For one-time memberships, just update our database - no refunds as per requirements
      await query(
        `UPDATE memberships 
        SET cancel_at_period_end = true, updated_at = CURRENT_TIMESTAMP, cancellation_reason = $2
        WHERE id = $1`,
        [membership.id, reason || "User requested cancellation"]
      );
    }

    res.json({
      success: true,
      message: "Membership will cancel at the end of the current period. No refunds will be issued.",
      membership: {
        ...membership,
        cancel_at_period_end: true,
        cancellation_reason: reason || "User requested cancellation"
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
    // First verify both membership and booking exist to avoid foreign key errors
    const membershipCheck = await query(
      "SELECT id FROM memberships WHERE id = $1",
      [membershipId]
    );

    if (membershipCheck.rows.length === 0) {
      console.error(`Membership ID ${membershipId} not found. Cannot record usage.`);
      return false;
    }

    const bookingCheck = await query(
      "SELECT id FROM bookings WHERE id = $1",
      [bookingId]
    );

    if (bookingCheck.rows.length === 0) {
      console.error(`Booking ID ${bookingId} not found. Cannot record membership usage.`);
      return false;
    }

    // Check if a record already exists for this booking and membership
    const existingRecord = await query(
      "SELECT id FROM membership_usage WHERE booking_id = $1",
      [bookingId]
    );

    if (existingRecord.rows.length > 0) {
      console.log(`Membership usage for booking ${bookingId} already recorded. Skipping.`);
      return true;
    }

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
    // Log detailed error but don't throw - we don't want to disrupt the booking process
    console.error(`Failed to record membership usage for membership ${membershipId} and booking ${bookingId}:`, error.message);
    return false;
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

/**
 * @desc    Activate membership after successful payment
 * @route   PUT /api/memberships/activate
 * @access  Private (Customers only)
 */
const activateMembership = async (req, res) => {
  try {
    const { tier = "supersaver_month" } = req.body;

    // Find the most recent membership with pending status for the user
    const membershipResult = await query(
      `SELECT * FROM memberships 
       WHERE user_id = $1 AND tier = $2 AND status = 'unpaid'
       ORDER BY created_at DESC LIMIT 1`,
      [req.user.id, tier]
    );

    if (membershipResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No pending membership found to activate",
      });
    }

    const membership = membershipResult.rows[0];

    // Update the membership status to active
    await query(
      `UPDATE memberships 
       SET status = 'active', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [membership.id]
    );

    // Check if auto_renewal is true, indicating it's a subscription
    if (membership.auto_renewal) {
      try {
        // Verify subscription status in Stripe
        const subscription = await stripe.subscriptions.retrieve(
          membership.stripe_subscription_id
        );

        if (subscription && subscription.status === 'incomplete') {
          // Update the subscription status in Stripe if needed
          await stripe.subscriptions.update(membership.stripe_subscription_id, {
            metadata: {
              payment_verified: 'true',
              activated_at: new Date().toISOString()
            }
          });
        }
      } catch (stripeError) {
        // Log the error but don't fail the activation
        console.warn("Warning: Could not update subscription in Stripe:", stripeError.message);
      }
    } else {
      // For one-time payments, we need to check the payment intent instead
      try {
        // Check payment intent status
        const paymentIntent = await stripe.paymentIntents.retrieve(
          membership.stripe_subscription_id // This contains payment intent ID for one-time payments
        );

        if (paymentIntent && paymentIntent.status !== 'succeeded') {
          console.warn(`Payment intent status is ${paymentIntent.status}, not 'succeeded'. Membership activated anyway.`);
        }
      } catch (stripeError) {
        // Log the error but don't fail the activation
        console.warn("Warning: Could not verify payment intent in Stripe:", stripeError.message);
      }
    }

    res.json({
      success: true,
      message: "Membership activated successfully",
      membership: {
        ...membership,
        status: 'active'
      }
    });
  } catch (error) {
    console.error("Activate membership error:", error);
    res.status(500).json({
      success: false,
      error: "Server error activating membership",
      details: error.message
    });
  }
};

/**
 * Calculate membership discount for a service
 * @param {string} membershipTier - The membership tier (e.g., 'moon_1_month')
 * @param {number} servicePrice - The base price of the service
 * @returns {object} - { isEligible: boolean, discountedPrice: number, originalPrice: number }
 */
const calculateMembershipDiscount = (membershipTier, servicePrice) => {
  const plan = MEMBERSHIP_PLANS[membershipTier];
  
  if (!plan || !plan.discountRange) {
    return {
      isEligible: false,
      discountedPrice: servicePrice,
      originalPrice: servicePrice,
      discountAmount: 0,
      message: "No membership discount available"
    };
  }

  const { min, max } = plan.discountRange;
  
  // Check if service price falls within the discount range
  if (servicePrice >= min && servicePrice <= max) {
    // Use the discount percentage from the plan
    const discountPercentage = plan.discountPercentage || 15; // Default 15% if not specified

    const discountAmount = servicePrice * (discountPercentage / 100);
    const discountedPrice = servicePrice - discountAmount;

    return {
      isEligible: true,
      discountedPrice: Math.round(discountedPrice * 100) / 100, // Round to 2 decimal places
      originalPrice: servicePrice,
      discountAmount: Math.round(discountAmount * 100) / 100,
      discountPercentage,
      message: `${discountPercentage}% membership discount applied`
    };
  }

  return {
    isEligible: false,
    discountedPrice: servicePrice,
    originalPrice: servicePrice,
    discountAmount: 0,
    message: `Service price $${servicePrice} is outside discount range ($${min}-$${max})`
  };
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
  activateMembership,
  calculateMembershipDiscount,
  MEMBERSHIP_PLANS,
};
