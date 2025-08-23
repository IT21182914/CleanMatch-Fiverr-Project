
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
    const fetchBookingDetails = async () => {
      try {
        // Only fetch the booking without creating a payment intent
        const bookingResponse = await bookingsAPI.getById(bookingId);
        const bookingData =
          bookingResponse.data.data ||
          bookingResponse.data.booking ||
          bookingResponse.data;

        console.log("Fetched Booking Data:", bookingData);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError("Failed to load booking information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBookingDetails();
  }, [bookingId]);

  const createPaymentIntent = async () => {
    setLoading(true);
    try {
      // Create payment intent which may update booking with membership discounts
      const paymentResponse = await paymentsAPI.createPaymentIntent(bookingId);

      const clientSecret =
        paymentResponse.data.client_secret ||
        paymentResponse.data.data?.clientSecret ||
        paymentResponse.data.data?.client_secret;

      if (!clientSecret) throw new Error("Failed to get payment client secret");

      setClientSecret(clientSecret);

      // Fetch the updated booking after payment intent creation
      const bookingResponse = await bookingsAPI.getById(bookingId);
      const bookingData =
        bookingResponse.data.data ||
        bookingResponse.data.booking ||
        bookingResponse.data;

      console.log("Fetched Updated Booking Data (after payment intent creation):", bookingData);
      setBooking(bookingData);

      // Check for membership discount information from the payment intent response
      if (paymentResponse.data.membership_discount_applied) {
        console.log("Membership discount applied:", paymentResponse.data);
      }

    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError("Failed to create payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

            {/* Pricing Breakdown */}
            <div className="border-t pt-2 mt-3 space-y-2">
              {/* Service Rate */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Service Rate:</span>
                <span className="text-sm text-gray-700">
                  {formatCurrency(booking.pricing_breakdown?.hourly_rate || booking.service?.basePrice || 0)} per hour
                </span>
              </div>

              {/* Duration */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Duration:</span>
                <span className="text-sm text-gray-700">
                  {booking.durationHours || booking.duration_hours || booking.pricing_breakdown?.hours || 0} hours
                </span>
              </div>

              {/* Original Price (Rate * Hours) */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Original Price:</span>
                <span className="text-sm text-gray-700">
                  {formatCurrency(
                    (booking.pricing_breakdown?.hourly_rate * (booking.durationHours || booking.duration_hours || booking.pricing_breakdown?.hours || 0)) ||
                    (booking.pricing_breakdown?.base_amount * 2) ||
                    booking.totalAmount ||
                    booking.total_amount || 0
                  )}
                </span>
              </div>

              {/* Membership Discount - Show for both original membership and after-booking activation */}
              {(booking.pricing_breakdown?.membership_discount > 0 || booking.hasMembership) && (
                <>
                  {/* Membership activated after booking creation - special notice */}
                  {booking.hasMembership && !booking.pricing_breakdown?.membership_discount && (
                    <div className="bg-green-50 p-2 rounded border border-green-200 mb-2">
                      <p className="text-sm text-green-800 font-medium">
                        Your membership discount will be applied at checkout!
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        You activated a membership after this booking was created. Your 50% discount will be applied when you make payment.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700 flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Membership Discount (50%):
                    </span>
                    <span className="text-sm font-medium text-green-700">
                      -{formatCurrency(
                        booking.pricing_breakdown?.membership_discount
                          ? (booking.pricing_breakdown.membership_discount * (booking.durationHours || booking.duration_hours || booking.pricing_breakdown?.hours || 0))
                          : ((booking.totalAmount || booking.total_amount || 0) / 2)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Discounted Rate:</span>
                    <span className="text-sm font-medium text-green-700">
                      {formatCurrency(
                        booking.pricing_breakdown?.discounted_hourly_rate ||
                        (booking.pricing_breakdown?.hourly_rate / 2) ||
                        ((booking.service?.basePrice || 0) / 2)
                      )} per hour
                    </span>
                  </div>
                </>
              )}

              {/* Total Amount */}
              <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-900">Total:</span>
                <div className="text-right">
                  {/* Show original price with strikethrough if membership was activated after booking */}
                  {booking.hasMembership && !booking.pricing_breakdown?.membership_discount && (
                    <div className="text-sm text-gray-500 line-through mb-1">
                      {formatCurrency(booking.totalAmount || booking.total_amount || 0)}
                    </div>
                  )}

                  {/* Show current price */}
                  <span className="text-lg font-bold text-blue-600">
                    {booking.hasMembership && !booking.pricing_breakdown?.membership_discount ?
                      // Calculate 50% discount if membership was activated after booking
                      formatCurrency((booking.totalAmount || booking.total_amount || 0) / 2) :
                      // Otherwise show the standard total
                      formatCurrency(booking.totalAmount || booking.total_amount || 0)}
                  </span>
                </div>
              </div>

              {/* Membership Promotion - Only show if no membership */}
              {!(booking.pricing_breakdown?.membership_discount > 0 || booking.hasMembership) && (
                <div className="mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Save 50% on this booking</span> with a CleanMatch membership!
                  </p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      color="amber"
                      className="text-xs"
                      onClick={() => navigate("/customer/membership")}
                    >
                      View Membership Options
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500">Includes all fees and taxes</p>
            </div>
          </CardContent>
        </Card>


        {/* Payment Form */}
        <Card>
          <CardHeader className="pb-2 bg-blue-50 border-b border-blue-200 rounded-t-lg">
            <h4 className="text-sm font-medium text-blue-900">Payment Details</h4>
          </CardHeader>
          <CardContent className="pt-2">
            {!clientSecret ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-4">
                  Click the button below to proceed with payment. Your membership discount will be applied if eligible.
                </p>
                <Button
                  onClick={createPaymentIntent}
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Processing..." : "Make Payment"}
                </Button>
                {booking.hasMembership && !booking.pricing_breakdown?.membership_discount && (
                  <p className="mt-3 text-xs text-green-600">
                    Your 50% membership discount will be applied when you make payment!
                  </p>
                )}
              </div>
            ) : (
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


