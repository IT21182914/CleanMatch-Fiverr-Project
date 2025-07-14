import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import { paymentsAPI, bookingsAPI } from "../../lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LoadingPage } from "../../components/ui/Loading";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import PaymentForm from "../../components/payment/PaymentForm";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookingAndCreatePaymentIntent = async () => {
      try {
        // Fetch booking details
        const bookingResponse = await bookingsAPI.getById(bookingId);
        const bookingData = bookingResponse.data.data || bookingResponse.data;
        setBooking(bookingData);

        // Create payment intent
        const paymentResponse = await paymentsAPI.createPaymentIntent(
          bookingId
        );

        // Handle different response structures
        const clientSecret =
          paymentResponse.data.client_secret ||
          paymentResponse.data.data?.clientSecret ||
          paymentResponse.data.data?.client_secret;

        if (!clientSecret) {
          throw new Error("Failed to get payment client secret");
        }

        setClientSecret(clientSecret);
      } catch (error) {
        console.error(
          "Error fetching booking or creating payment intent:",
          error
        );
        setError("Failed to load payment information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingAndCreatePaymentIntent();
    }
  }, [bookingId]);

  const handlePaymentSuccess = () => {
    navigate("/bookings?success=true");
  };

  const handlePaymentError = (error) => {
    setError(error);
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Payment Error
            </h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => navigate("/bookings")}>
              Return to Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Booking Not Found
            </h3>
            <p className="text-gray-500 mb-6">
              The booking you're trying to pay for could not be found.
            </p>
            <Button onClick={() => navigate("/bookings")}>
              Return to Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const appearance = {
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
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Complete Your Payment
        </h1>
        <p className="mt-2 text-gray-600">
          Secure payment processing powered by Stripe
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">
                {booking.service_name || booking.service?.name || "Service"}
              </h4>
              <p className="text-sm text-gray-500">
                {booking.service?.description ||
                  "Professional cleaning service"}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">
                  {formatDateTime(
                    booking.booking_date || booking.scheduledDate
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium text-right">
                  {booking.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Duration:</span>
                <span className="font-medium">
                  {booking.duration_hours ||
                    booking.service?.estimatedDuration ||
                    2}{" "}
                  hours
                </span>
              </div>
            </div>

            {booking.special_instructions && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">
                  Special Instructions:
                </h5>
                <p className="text-sm text-gray-600">
                  {booking.special_instructions}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">
                  Total:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    booking.total_amount || booking.totalAmount || 0
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Includes all fees and taxes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <PaymentForm
                  bookingId={bookingId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-blue-800">
              <strong>Secure Payment:</strong> Your payment information is
              encrypted and processed securely by Stripe. We never store your
              payment details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
