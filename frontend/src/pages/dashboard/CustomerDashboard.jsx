import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import { bookingsAPI } from "../../lib/api";
import {
  formatDateTime,
  formatCurrency,
  getStatusColor,
  capitalizeFirst,
} from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getCustomerBookings();

      // Handle different response structures and ensure we have an array
      let bookingsData = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        bookingsData = response.data.data;
      } else if (
        response.data?.bookings &&
        Array.isArray(response.data.bookings)
      ) {
        bookingsData = response.data.bookings;
      } else if (response.data && Array.isArray(response.data)) {
        bookingsData = response.data;
      } else if (Array.isArray(response)) {
        bookingsData = response;
      }

      setBookings(bookingsData.slice(0, 5)); // Show only recent 5 bookings

      // Calculate stats
      const totalBookings = bookingsData.length;
      const upcomingBookings = bookingsData.filter((booking) =>
        ["pending", "confirmed", "in_progress"].includes(booking.status)
      ).length;
      const completedBookings = bookingsData.filter(
        (booking) => booking.status === "completed"
      ).length;

      setStats({ totalBookings, upcomingBookings, completedBookings });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Here's what's happening with your cleaning services today.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link to="/book" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto inline-flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Book New Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  Total Bookings
                </dt>
                <dd className="text-base sm:text-lg font-medium text-gray-900">
                  {stats.totalBookings}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  Upcoming
                </dt>
                <dd className="text-base sm:text-lg font-medium text-gray-900">
                  {stats.upcomingBookings}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  Completed
                </dt>
                <dd className="text-base sm:text-lg font-medium text-gray-900">
                  {stats.completedBookings}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-2 p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Recent Bookings</CardTitle>
          <Link
            to="/bookings"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
          {loading ? (
            <LoadingCard />
          ) : bookings.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">
                Book your first cleaning service to get started.
              </p>
              <Link to="/book" className="inline-block">
                <Button className="w-full sm:w-auto">Book Now</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id} className="py-3 sm:py-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {booking.service?.name || "Cleaning Service"}
                          </p>
                          <div className="mt-1 sm:mt-0 sm:ml-2 flex-shrink-0 flex">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {capitalizeFirst(booking.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                          <div className="flex items-center">
                            <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {formatDateTime(booking.scheduledDate)}
                          </div>
                          <span className="hidden sm:inline mx-2">•</span>
                          <span className="font-medium">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                        {booking.cleaner && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Cleaner: {booking.cleaner.firstName}{" "}
                            {booking.cleaner.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
