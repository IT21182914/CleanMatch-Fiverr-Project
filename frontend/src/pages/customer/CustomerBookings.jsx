import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LazyList } from "../../components/ui/LazyComponents";
import { bookingsAPI } from "../../lib/api";
import {
  formatDateTime,
  formatCurrency,
  getStatusColor,
  capitalizeFirst,
} from "../../lib/utils";

const CustomerBookings = () => {
  const [filter, setFilter] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    // Multiple scroll-to-top approaches for maximum compatibility
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Target main element
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.scrollTop = 0;
      }

      // Target scrollable containers
      const scrollableElements = document.querySelectorAll(
        "[data-scroll-container], .overflow-y-auto, .overflow-auto, .min-h-screen"
      );
      scrollableElements.forEach((element) => {
        if (element.scrollTop !== undefined) {
          element.scrollTop = 0;
        }
      });
    };

    // Execute immediately
    scrollToTop();

    // Execute with requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      scrollToTop();
    });

    // Execute with slight delay to ensure DOM is ready
    setTimeout(scrollToTop, 50);
  }, []);

  // Handle success messages from redirects
  useEffect(() => {
    if (location.state?.message) {
      // Use a unique ID to prevent duplicate toasts for payment success
      const toastId = location.state?.paymentSuccess
        ? `payment-success-${Date.now()}`
        : `booking-message-${Date.now()}`;

      // Check if we've already shown this toast
      if (!sessionStorage.getItem(toastId)) {
        toast.success(location.state.message);
        // Mark this toast as shown
        sessionStorage.setItem(toastId, "shown");

        // Clean up after 5 seconds
        setTimeout(() => {
          sessionStorage.removeItem(toastId);
        }, 5000);
      }

      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Function to handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await bookingsAPI.updateStatus(bookingId, "cancelled");
      if (response.data.success) {
        toast.success("Booking cancelled successfully");
        // Trigger a refresh of the bookings list
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error(response.data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  // Lazy loading fetch function
  const fetchBookings = useCallback(
    async ({ page, limit }) => {
      try {
        const response = await bookingsAPI.getCustomerBookings({
          page,
          limit,
          status: filter !== "all" ? filter : undefined,
        });

        return {
          data: response.data.data || response.data.bookings || [],
          total: response.data.total || response.data.count || 0,
        };
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
    },
    [filter, refreshTrigger]
  );

  // Render individual booking item
  const renderBookingItem = useCallback(
    (booking) => (
      <Card key={booking.id}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {booking.service?.name || "Cleaning Service"}
                </h3>
                <p className="text-sm text-gray-500">Booking #{booking.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    booking.status
                  )}`}
                >
                  Work: {capitalizeFirst(booking.status)}
                </span>
                {/* Payment Status Badge */}
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      booking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    Payment:{" "}
                    {capitalizeFirst(
                      booking.paymentStatus === "paid" ? "PAID" : "PENDING"
                    )}
                  </span>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(booking.totalAmount || booking.total_amount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="h-4 w-4 mr-2" />
              {formatDateTime(booking.scheduledDate)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {booking.address}
            </div>
            {booking.cleaner && (
              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-2" />
                {booking.cleaner.firstName} {booking.cleaner.lastName}
              </div>
            )}
          </div>

          {booking.specialInstructions && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                <strong>Special Instructions:</strong>{" "}
                {booking.specialInstructions}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center"
              onClick={() => navigate(`/customer/bookings/${booking.id}`)}
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View Details
            </Button>

            {/* Payment button for unpaid bookings */}
            {(booking.payment_status === "pending" ||
              booking.paymentStatus === "pending") &&
              (booking.status === "pending" ||
                booking.status === "confirmed") && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => navigate(`/payment/${booking.id}`)}
                >
                  Complete Payment
                </Button>
              )}

            {/* Select Cleaner button for paid bookings without assigned cleaner */}
            {(booking.payment_status === "paid" ||
              booking.paymentStatus === "paid") &&
              !booking.cleaner &&
              booking.status === "confirmed" && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() =>
                    navigate("/customer/select-cleaner", {
                      state: { booking },
                    })
                  }
                >
                  Select Cleaner
                </Button>
              )}

            {booking.status === "completed" && !booking.review && (
              <Button
                size="sm"
                onClick={() => navigate(`/customer/review/${booking.id}`)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Leave Review
              </Button>
            )}

            {/* Cancel button for pending bookings or confirmed bookings without cleaner */}
            {(booking.status === "pending" ||
              (booking.status === "confirmed" && !booking.cleaner)) && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => handleCancelBooking(booking.id)}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    ),
    [navigate]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            My Bookings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your cleaning service bookings.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link to="/book">
            <Button>Book New Service</Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "in_progress", label: "In Progress" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Lazy Loaded Bookings List */}
      <LazyList
        fetchFunction={fetchBookings}
        renderItem={renderBookingItem}
        pageSize={5}
        className="space-y-4"
        dependencies={[filter, refreshTrigger]}
        renderEmpty={() => (
          <Card>
            <CardContent className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === "all"
                  ? "Book your first cleaning service to get started."
                  : `You don't have any ${filter} bookings at the moment.`}
              </p>
              {filter === "all" && (
                <Link to="/book">
                  <Button>Book Your First Service</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
        renderError={(error) => (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg
                  className="h-12 w-12 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to load bookings
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
            </CardContent>
          </Card>
        )}
      />
    </div>
  );
};

export default CustomerBookings;
