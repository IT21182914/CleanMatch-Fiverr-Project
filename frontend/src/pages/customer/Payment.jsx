
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import { paymentsAPI, bookingsAPI } from "../../lib/api";
import {
  Card,
  CardHeader,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ModernPageLoader } from "../../components/ui/Loading";
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
        const bookingResponse = await bookingsAPI.getById(bookingId);
        const bookingData =
          bookingResponse.data.data ||
          bookingResponse.data.booking ||
          bookingResponse.data;
        setBooking(bookingData);

        console.log("Fetched Booking Data:", bookingData);

        const paymentResponse = await paymentsAPI.createPaymentIntent(bookingId);

        const clientSecret =
          paymentResponse.data.client_secret ||
          paymentResponse.data.data?.clientSecret ||
          paymentResponse.data.data?.client_secret;

        if (!clientSecret) throw new Error("Failed to get payment client secret");

        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error fetching booking or creating payment intent:", error);
        setError("Failed to load payment information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBookingAndCreatePaymentIntent();
  }, [bookingId]);

  const handlePaymentSuccess = () => {
    bookingsAPI.updatePaymentStatus(bookingId, "paid")
      .then(() => {
        navigate(`/customer/bookings/${bookingId}`, {
          state: {
            message: "Payment completed successfully! You can now select a cleaner for your booking.",
            paymentSuccess: true
          }
        });
      })
      .catch(() => {
        setError("Failed to update payment status. Please try again.");
      });
  };

  const handlePaymentError = (error) => {
    setError(error);
  };

  if (loading) return <ModernPageLoader message="Loading payment details..." />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Error</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => navigate("/bookings")}>Return to Bookings</Button>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Not Found</h3>
            <p className="text-gray-500 mb-6">
              The booking you're trying to pay for could not be found.
            </p>
            <Button onClick={() => navigate("/bookings")}>Return to Bookings</Button>
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

  const options = { clientSecret, appearance };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900 pb-2">
              Complete Payment
            </h2>
            <p className="text-xs text-gray-500">Booking #{bookingId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card>
          <CardHeader className="pb-2 bg-cyan-50 border-b border-cyan-200 rounded-t-lg">
            <h4 className="text-sm font-medium text-cyan-900">Booking Summary</h4>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {/* Service Information */}
            <div>
              <span className="text-lg font-medium text-gray-900">
                {booking.service_name || booking.service?.name || "Cleaning Service"}
              </span>
              <p className="text-sm text-gray-600 mt-0.5">
                {booking.service?.description || "Professional cleaning service"}
              </p>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a3 3 0 002 2z" />
                </svg>
                <span>
                  {(() => {
                    const bookingDate = booking.bookingDate || booking.booking_date || booking.scheduledDate;
                    const bookingTime = booking.bookingTime || booking.booking_time;
                    console.log("Booking Date:", bookingDate);
                    console.log("Booking Time:", bookingTime);

                    if (!bookingDate) return "Date not available";

                    try {
                      if (bookingTime) {
                        const dateStr = bookingDate.includes("T") ? bookingDate : `${bookingDate}T${bookingTime}`;
                        console.log("Formatted Date String:", dateStr);
                        return formatDateTime(dateStr);
                      } else {
                        return formatDateTime(bookingDate);
                      }
                    } catch (error) {
                      console.error("Date formatting error:", error);
                      return "Invalid date format";
                    }
                  })()}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Duration: {booking.durationHours || booking.duration_hours || booking.service?.estimatedDuration || 2} hours
                </span>
              </div>
            </div>

            <div className="flex items-start text-sm text-gray-600">
              <svg className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{booking.address || "Address not specified"}</span>
            </div>

            {/* Special Instructions */}
            {(booking.specialInstructions || booking.special_instructions) && (
              <div>
                <span className="text-sm font-medium text-gray-900 mb-1">Special Instructions</span>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {booking.specialInstructions || booking.special_instructions}
                </p>
              </div>
            )}

            {/* Total Amount */}
            <div className="border-t pt-2 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Total:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(booking.totalAmount || booking.total_amount || 0)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Includes all fees and taxes</p>
            </div>
          </CardContent>
        </Card>


        {/* Payment Form */}
        <Card>
          <CardHeader className="pb-2 bg-blue-50 border-b border-blue-200 rounded-t-lg">
            <h4 className="text-sm font-medium text-blue-900">Payment Details</h4>
          </CardHeader>
          <CardContent className="pt-2">
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
    </div>
  );
};

export default Payment;


