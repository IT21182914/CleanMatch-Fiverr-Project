const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { query } = require("../config/database");

/**
 * Create or retrieve Stripe customer
 * @param {Object} user - User object
 * @returns {string} Stripe customer ID
 */
const createStripeCustomer = async (user) => {
  try {
    // Check if user already has a Stripe customer ID
    if (user.stripe_customer_id) {
      return user.stripe_customer_id;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      phone: user.phone,
      metadata: {
        user_id: user.id.toString(),
      },
    });

    // Update user record with Stripe customer ID
    await query("UPDATE users SET stripe_customer_id = $1 WHERE id = $2", [
      customer.id,
      user.id,
    ]);

    return customer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
};

/**
 * Create payment intent for one-time payment
 * @param {Object} bookingData - Booking data including amount and customer info
 * @returns {Object} Payment intent object
 */
const createPaymentIntent = async (bookingData) => {
  try {
    const { amount, customerId, bookingId, description } = bookingData;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      customer: customerId,
      metadata: {
        booking_id: bookingId.toString(),
        type: "booking_payment",
      },
      description: description || "CleanMatch Service Booking",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

/**
 * Create subscription for membership plans
 * @param {Object} subscriptionData - Subscription data
 * @returns {Object} Subscription object
 */
const createSubscription = async (subscriptionData) => {
  try {
    const { customerId, priceId, userId } = subscriptionData;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        user_id: userId.toString(),
        type: "membership_subscription",
      },
    });

    return subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

/**
 * Handle successful payment
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {boolean} Success status
 */
const handleSuccessfulPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const bookingId = paymentIntent.metadata.booking_id;

      // Update booking payment status
      await query(
        "UPDATE bookings SET payment_status = $1, stripe_payment_intent_id = $2 WHERE id = $3",
        ["paid", paymentIntentId, bookingId]
      );

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error handling successful payment:", error);
    throw error;
  }
};

/**
 * Process refund
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @param {number} amount - Refund amount (optional, full refund if not specified)
 * @returns {Object} Refund object
 */
const processRefund = async (paymentIntentId, amount = null) => {
  try {
    const refundData = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to cents
    }

    const refund = await stripe.refunds.create(refundData);

    // Update booking status
    if (refund.status === "succeeded") {
      await query(
        "UPDATE bookings SET payment_status = $1 WHERE stripe_payment_intent_id = $2",
        ["refunded", paymentIntentId]
      );
    }

    return refund;
  } catch (error) {
    console.error("Error processing refund:", error);
    throw error;
  }
};

/**
 * Create Stripe Connect account for cleaners
 * @param {Object} cleanerData - Cleaner data
 * @returns {Object} Connect account object
 */
const createConnectAccount = async (cleanerData) => {
  try {
    const { email, firstName, lastName, phone, userId } = cleanerData;

    const account = await stripe.accounts.create({
      type: "express",
      email: email,
      metadata: {
        user_id: userId.toString(),
      },
    });

    // Update cleaner profile with Stripe account ID
    await query(
      "UPDATE cleaner_profiles SET stripe_account_id = $1 WHERE user_id = $2",
      [account.id, userId]
    );

    return account;
  } catch (error) {
    console.error("Error creating Connect account:", error);
    throw error;
  }
};

/**
 * Create account link for Connect account setup
 * @param {string} accountId - Stripe Connect account ID
 * @returns {string} Account link URL
 */
const createAccountLink = async (accountId) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.FRONTEND_URL}/cleaner/onboard-refresh`,
      return_url: `${process.env.FRONTEND_URL}/cleaner/onboard-success`,
      type: "account_onboarding",
    });

    return accountLink.url;
  } catch (error) {
    console.error("Error creating account link:", error);
    throw error;
  }
};

/**
 * Transfer payment to cleaner
 * @param {Object} transferData - Transfer data
 * @returns {Object} Transfer object
 */
const transferToConnectAccount = async (transferData) => {
  try {
    const { amount, connectAccountId, bookingId } = transferData;

    // Calculate platform fee (e.g., 10%)
    const platformFeePercentage = 0.1;
    const platformFee = Math.round(amount * platformFeePercentage * 100);
    const transferAmount = Math.round(amount * 100) - platformFee;

    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: "usd",
      destination: connectAccountId,
      metadata: {
        booking_id: bookingId.toString(),
        platform_fee: platformFee.toString(),
      },
    });

    return transfer;
  } catch (error) {
    console.error("Error transferring to Connect account:", error);
    throw error;
  }
};

/**
 * Handle Stripe webhook events
 * @param {Object} event - Stripe webhook event
 * @returns {boolean} Success status
 */
const handleWebhookEvent = async (event) => {
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handleSuccessfulPayment(event.data.object.id);
        break;

      case "invoice.payment_succeeded":
        if (event.data.object.subscription) {
          await handleSubscriptionPayment(event.data.object);
        }
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancellation(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return true;
  } catch (error) {
    console.error("Error handling webhook event:", error);
    throw error;
  }
};

/**
 * Handle subscription payment success
 * @param {Object} invoice - Stripe invoice object
 */
const handleSubscriptionPayment = async (invoice) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription
    );
    const userId = subscription.metadata.user_id;

    // Update both legacy subscriptions and new memberships tables
    await query(
      `UPDATE subscriptions 
       SET status = $1, current_period_start = $2, current_period_end = $3 
       WHERE stripe_subscription_id = $4`,
      [
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        subscription.id,
      ]
    );

    // Update memberships table
    await query(
      `UPDATE memberships 
       SET status = $1, current_period_start = $2, current_period_end = $3, updated_at = CURRENT_TIMESTAMP
       WHERE stripe_subscription_id = $4`,
      [
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        subscription.id,
      ]
    );
  } catch (error) {
    console.error("Error handling subscription payment:", error);
    throw error;
  }
};

/**
 * Handle subscription updates
 * @param {Object} subscription - Stripe subscription object
 */
const handleSubscriptionUpdate = async (subscription) => {
  try {
    // Update legacy subscriptions table
    await query(
      `UPDATE subscriptions 
       SET status = $1, current_period_start = $2, current_period_end = $3, 
           cancel_at_period_end = $4
       WHERE stripe_subscription_id = $5`,
      [
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        subscription.cancel_at_period_end,
        subscription.id,
      ]
    );

    // Update memberships table
    await query(
      `UPDATE memberships 
       SET status = $1, current_period_start = $2, current_period_end = $3, 
           cancel_at_period_end = $4, updated_at = CURRENT_TIMESTAMP
       WHERE stripe_subscription_id = $5`,
      [
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        subscription.cancel_at_period_end,
        subscription.id,
      ]
    );
  } catch (error) {
    console.error("Error handling subscription update:", error);
    throw error;
  }
};

/**
 * Handle subscription cancellation
 * @param {Object} subscription - Stripe subscription object
 */
const handleSubscriptionCancellation = async (subscription) => {
  try {
    // Update legacy subscriptions table
    await query(
      "UPDATE subscriptions SET status = $1 WHERE stripe_subscription_id = $2",
      ["cancelled", subscription.id]
    );

    // Update memberships table
    await query(
      "UPDATE memberships SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = $2",
      ["cancelled", subscription.id]
    );
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
    throw error;
  }
};

module.exports = {
  createStripeCustomer,
  createPaymentIntent,
  createSubscription,
  handleSuccessfulPayment,
  processRefund,
  createConnectAccount,
  createAccountLink,
  transferToConnectAccount,
  handleWebhookEvent,
  stripe,
};
