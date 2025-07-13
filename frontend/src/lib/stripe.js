import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

export const redirectToCheckout = async (sessionId) => {
  const stripe = await stripePromise;
  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    console.error("Stripe checkout error:", error);
    throw error;
  }
};

export const createPaymentElement = async (clientSecret) => {
  const stripe = await stripePromise;

  if (!stripe || !clientSecret) {
    return null;
  }

  const elements = stripe.elements({
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#3b82f6",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  });

  return { stripe, elements };
};
