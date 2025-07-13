const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
  createBookingPaymentIntent,
  createMembershipSubscription,
  cancelSubscription,
  createCleanerConnectAccount,
  getConnectAccountStatus,
  transferPaymentToCleaner,
  processBookingRefund,
  handleStripeWebhook,
  getUserSubscription,
} = require("../controllers/paymentsController");
const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for booking
// @access  Private (Customers only)
router.post(
  "/create-payment-intent",
  auth,
  authorize("customer"),
  createBookingPaymentIntent
);

// @route   POST /api/payments/subscription
// @desc    Create membership subscription
// @access  Private (Customers only)
router.post(
  "/subscription",
  auth,
  authorize("customer"),
  createMembershipSubscription
);

// @route   PUT /api/payments/subscription/cancel
// @desc    Cancel membership subscription
// @access  Private (Customers only)
router.put(
  "/subscription/cancel",
  auth,
  authorize("customer"),
  cancelSubscription
);

// @route   GET /api/payments/subscription
// @desc    Get user's subscription details
// @access  Private (Customers only)
router.get("/subscription", auth, authorize("customer"), getUserSubscription);

// @route   POST /api/payments/connect-account
// @desc    Create Stripe Connect account for cleaner
// @access  Private (Cleaners only)
router.post(
  "/connect-account",
  auth,
  authorize("cleaner"),
  createCleanerConnectAccount
);

// @route   GET /api/payments/connect-account/status
// @desc    Get Stripe Connect account status
// @access  Private (Cleaners only)
router.get(
  "/connect-account/status",
  auth,
  authorize("cleaner"),
  getConnectAccountStatus
);

// @route   POST /api/payments/transfer/:bookingId
// @desc    Transfer payment to cleaner after booking completion
// @access  Private (Admin only)
router.post(
  "/transfer/:bookingId",
  auth,
  authorize("admin"),
  transferPaymentToCleaner
);

// @route   POST /api/payments/refund/:bookingId
// @desc    Process refund for a booking
// @access  Private (Admin only)
router.post(
  "/refund/:bookingId",
  auth,
  authorize("admin"),
  processBookingRefund
);

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public (Stripe webhooks)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
