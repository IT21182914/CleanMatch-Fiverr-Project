const { query } = require("../config/database");
const {
  createPaymentIntent,
  createSubscription,
  createStripeCustomer,
  createConnectAccount,
  createAccountLink,
  transferToConnectAccount,
  handleWebhookEvent,
  processRefund,
  stripe,
} = require("../utils/stripe");

/**
 * @desc    Create payment intent for booking
 * @route   POST /api/payments/create-payment-intent
 * @access  Private (Customers only)
 */
const createBookingPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking details
    const bookingResult = await query(
      `SELECT b.*, s.name as service_name, u.stripe_customer_id
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users u ON b.customer_id = u.id
       WHERE b.id = $1 AND b.customer_id = $2`,
      [bookingId, req.user.id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check if booking already has a payment intent
    if (booking.stripe_payment_intent_id) {
      const existingPaymentIntent = await stripe.paymentIntents.retrieve(
        booking.stripe_payment_intent_id
      );

      if (existingPaymentIntent.status !== "canceled") {
        return res.json({
          success: true,
          client_secret: existingPaymentIntent.client_secret,
          payment_intent_id: existingPaymentIntent.id,
        });
      }
    }

    // Create Stripe customer if needed
    let stripeCustomerId = booking.stripe_customer_id;
    if (!stripeCustomerId) {
      const userResult = await query("SELECT * FROM users WHERE id = $1", [
        req.user.id,
      ]);
      stripeCustomerId = await createStripeCustomer(userResult.rows[0]);
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount: booking.total_amount,
      customerId: stripeCustomerId,
      bookingId: booking.id,
      description: `CleanMatch - ${booking.service_name} booking`,
    });

    // Update booking with payment intent ID
    await query(
      "UPDATE bookings SET stripe_payment_intent_id = $1 WHERE id = $2",
      [paymentIntent.id, booking.id]
    );

    res.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating payment intent",
    });
  }
};

/**
 * @desc    Create subscription for membership
 * @route   POST /api/payments/create-subscription
 * @access  Private (Customers only)
 */
const createMembershipSubscription = async (req, res) => {
  try {
    const { planName, priceId } = req.body;

    if (!planName || !priceId) {
      return res.status(400).json({
        success: false,
        error: "Plan name and price ID are required",
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
    }

    // Check if user already has an active subscription
    const existingSubscription = await query(
      "SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2",
      [req.user.id, "active"]
    );

    if (existingSubscription.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User already has an active subscription",
      });
    }

    // Create Stripe subscription
    const subscription = await createSubscription({
      customerId: stripeCustomerId,
      priceId,
      userId: req.user.id,
    });

    // Create subscription record in database
    await query(
      `INSERT INTO subscriptions (
        user_id, plan_name, stripe_subscription_id, status, 
        current_period_start, current_period_end
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user.id,
        planName,
        subscription.id,
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
      ]
    );

    res.status(201).json({
      success: true,
      subscription_id: subscription.id,
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating subscription",
    });
  }
};

/**
 * @desc    Cancel subscription
 * @route   PUT /api/payments/cancel-subscription
 * @access  Private (Customers only)
 */
const cancelSubscription = async (req, res) => {
  try {
    const { cancelAtPeriodEnd = true } = req.body;

    // Get user's subscription
    const subscriptionResult = await query(
      "SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2",
      [req.user.id, "active"]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No active subscription found",
      });
    }

    const subscription = subscriptionResult.rows[0];

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: cancelAtPeriodEnd }
    );

    // Update database
    await query(
      "UPDATE subscriptions SET cancel_at_period_end = $1 WHERE id = $2",
      [cancelAtPeriodEnd, subscription.id]
    );

    res.json({
      success: true,
      message: cancelAtPeriodEnd
        ? "Subscription will cancel at the end of the current period"
        : "Subscription cancellation removed",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({
      success: false,
      error: "Server error canceling subscription",
    });
  }
};

/**
 * @desc    Create Stripe Connect account for cleaner
 * @route   POST /api/payments/connect-account
 * @access  Private (Cleaners only)
 */
const createCleanerConnectAccount = async (req, res) => {
  try {
    // Check if cleaner already has a Connect account
    const cleanerResult = await query(
      "SELECT stripe_account_id FROM cleaner_profiles WHERE user_id = $1",
      [req.user.id]
    );

    if (cleanerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner profile not found",
      });
    }

    const cleanerProfile = cleanerResult.rows[0];

    // If account already exists, create new account link
    if (cleanerProfile.stripe_account_id) {
      const accountLink = await createAccountLink(
        cleanerProfile.stripe_account_id
      );

      return res.json({
        success: true,
        account_link: accountLink,
        account_id: cleanerProfile.stripe_account_id,
      });
    }

    // Get user details
    const userResult = await query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    const user = userResult.rows[0];

    // Create new Connect account
    const account = await createConnectAccount({
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      userId: user.id,
    });

    // Create account link for onboarding
    const accountLink = await createAccountLink(account.id);

    res.status(201).json({
      success: true,
      account_link: accountLink,
      account_id: account.id,
    });
  } catch (error) {
    console.error("Create Connect account error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating Connect account",
    });
  }
};

/**
 * @desc    Get Stripe Connect account status
 * @route   GET /api/payments/connect-status
 * @access  Private (Cleaners only)
 */
const getConnectAccountStatus = async (req, res) => {
  try {
    const cleanerResult = await query(
      "SELECT stripe_account_id FROM cleaner_profiles WHERE user_id = $1",
      [req.user.id]
    );

    if (cleanerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner profile not found",
      });
    }

    const cleanerProfile = cleanerResult.rows[0];

    if (!cleanerProfile.stripe_account_id) {
      return res.json({
        success: true,
        status: "not_created",
        can_receive_payments: false,
      });
    }

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(
      cleanerProfile.stripe_account_id
    );

    res.json({
      success: true,
      status: account.details_submitted ? "complete" : "incomplete",
      can_receive_payments: account.charges_enabled,
      account_id: account.id,
    });
  } catch (error) {
    console.error("Get Connect status error:", error);
    res.status(500).json({
      success: false,
      error: "Server error getting Connect status",
    });
  }
};

/**
 * @desc    Transfer payment to cleaner (called after job completion)
 * @route   POST /api/payments/transfer
 * @access  Private (Admin only or automated)
 */
const transferPaymentToCleaner = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking details with cleaner info
    const bookingResult = await query(
      `SELECT b.*, cp.stripe_account_id
       FROM bookings b
       JOIN cleaner_profiles cp ON b.cleaner_id = cp.user_id
       WHERE b.id = $1 AND b.status = 'completed' AND b.payment_status = 'paid'`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found or not eligible for transfer",
      });
    }

    const booking = bookingResult.rows[0];

    if (!booking.stripe_account_id) {
      return res.status(400).json({
        success: false,
        error: "Cleaner does not have a Connect account set up",
      });
    }

    // Check if transfer already exists
    const existingTransfer = await query(
      "SELECT id FROM booking_transfers WHERE booking_id = $1",
      [bookingId]
    );

    if (existingTransfer.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Payment has already been transferred for this booking",
      });
    }

    // Create transfer
    const transfer = await transferToConnectAccount({
      amount: booking.total_amount,
      connectAccountId: booking.stripe_account_id,
      bookingId: booking.id,
    });

    // Record transfer in database
    await query(
      `INSERT INTO booking_transfers (booking_id, stripe_transfer_id, amount, platform_fee)
       VALUES ($1, $2, $3, $4)`,
      [
        booking.id,
        transfer.id,
        transfer.amount / 100, // Convert from cents
        transfer.metadata.platform_fee / 100, // Convert from cents
      ]
    );

    res.json({
      success: true,
      message: "Payment transferred successfully",
      transfer_id: transfer.id,
    });
  } catch (error) {
    console.error("Transfer payment error:", error);
    res.status(500).json({
      success: false,
      error: "Server error transferring payment",
    });
  }
};

/**
 * @desc    Process refund for booking
 * @route   POST /api/payments/refund
 * @access  Private (Admin only)
 */
const processBookingRefund = async (req, res) => {
  try {
    const { bookingId, amount, reason } = req.body;

    // Get booking details
    const bookingResult = await query("SELECT * FROM bookings WHERE id = $1", [
      bookingId,
    ]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    if (!booking.stripe_payment_intent_id) {
      return res.status(400).json({
        success: false,
        error: "No payment found for this booking",
      });
    }

    // Process refund
    const refund = await processRefund(
      booking.stripe_payment_intent_id,
      amount
    );

    // Record refund in database
    await query(
      `INSERT INTO booking_refunds (booking_id, stripe_refund_id, amount, reason)
       VALUES ($1, $2, $3, $4)`,
      [booking.id, refund.id, refund.amount / 100, reason]
    );

    res.json({
      success: true,
      message: "Refund processed successfully",
      refund_id: refund.id,
      amount: refund.amount / 100,
    });
  } catch (error) {
    console.error("Process refund error:", error);
    res.status(500).json({
      success: false,
      error: "Server error processing refund",
    });
  }
};

/**
 * @desc    Handle Stripe webhooks
 * @route   POST /api/payments/webhook
 * @access  Public (but verified)
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    await handleWebhookEvent(event);

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

/**
 * @desc    Get user's subscription details
 * @route   GET /api/payments/subscription
 * @access  Private (Customers only)
 */
const getUserSubscription = async (req, res) => {
  try {
    const subscriptionResult = await query(
      "SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [req.user.id]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.json({
        success: true,
        subscription: null,
      });
    }

    const subscription = subscriptionResult.rows[0];

    res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving subscription",
    });
  }
};

module.exports = {
  createBookingPaymentIntent,
  createMembershipSubscription,
  cancelSubscription,
  createCleanerConnectAccount,
  getConnectAccountStatus,
  transferPaymentToCleaner,
  processBookingRefund,
  handleStripeWebhook,
  getUserSubscription,
};
