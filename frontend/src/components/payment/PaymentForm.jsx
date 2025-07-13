import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Button from "../ui/Button";

const PaymentForm = ({ bookingId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?booking_id=${bookingId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
        onError(error.message);
      } else {
        setMessage("An unexpected error occurred.");
        onError("An unexpected error occurred.");
      }
    } else {
      // Payment succeeded
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {message && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{message}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={!stripe || !elements || loading}
      >
        {loading ? "Processing..." : "Complete Payment"}
      </Button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By completing this payment, you agree to our terms of service and
          privacy policy.
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;
