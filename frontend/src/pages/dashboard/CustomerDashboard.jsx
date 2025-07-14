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
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your cleaning services today.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link to="/book">
            <Button className="inline-flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Book New Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Bookings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalBookings}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Upcoming
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.upcomingBookings}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Completed
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.completedBookings}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Recent Bookings</CardTitle>
          <Link
            to="/bookings"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <LoadingCard />
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-500 mb-4">
                Book your first cleaning service to get started.
              </p>
              <Link to="/book">
                <Button>Book Now</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {booking.service?.name || "Cleaning Service"}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {capitalizeFirst(booking.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatDateTime(booking.scheduledDate)}
                          <span className="mx-2">•</span>
                          <span className="font-medium">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                        {booking.cleaner && (
                          <p className="text-sm text-gray-500 mt-1">
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
