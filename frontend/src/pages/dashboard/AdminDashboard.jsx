import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import { adminAPI } from "../../lib/api";
import {
  formatCurrency,
  getStatusColor,
  capitalizeFirst,
} from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, bookingsResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getBookings({ limit: 5 }),
      ]);

      // Transform the dashboard stats to match expected format
      const dashboardStats = dashboardResponse.data.stats;
      const transformedStats = {
        totalUsers:
          dashboardStats.users?.reduce(
            (sum, user) => sum + parseInt(user.count),
            0
          ) || 0,
        totalBookings: dashboardStats.bookings?.total_bookings || 0,
        totalRevenue: dashboardStats.bookings?.total_revenue || 0,
        pendingBookings:
          dashboardStats.bookings?.total_bookings -
            dashboardStats.bookings?.completed_bookings || 0,
      };

      setStats(transformedStats);
      setRecentBookings(bookingsResponse.data.bookings || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values to prevent component crash
      setStats({
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        pendingFreelancers: 0,
      });
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName}. Here's your platform overview.
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
          <Link to="/admin/users">
            <Button variant="outline" className="inline-flex items-center">
              <UsersIcon className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/memberships">
            <Button variant="outline" className="inline-flex items-center">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Memberships
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button className="inline-flex items-center">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Users
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalUsers}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-green-600" />
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
              <CurrencyDollarIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-cyan-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending Bookings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.pendingBookings}
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
                  Pending Freelancers
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.pendingFreelancers || 0}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/admin/users">
              <div className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600">
                    <UsersIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Manage Users
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    View and manage customers and cleaners
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/admin/freelancers/pending">
              <div className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-600">
                    <ClockIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Pending Freelancers
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Review and approve freelancer applications
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/admin/bookings">
              <div className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600">
                    <CalendarIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    View Bookings
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Monitor all cleaning bookings
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/admin/services">
              <div className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600">
                    <ChartBarIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Manage Services
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add and edit cleaning services
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/admin/analytics">
              <div className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-cyan-50 text-cyan-600">
                    <CurrencyDollarIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Analytics
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    View detailed platform analytics
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/admin/trust">
              <div className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-600">
                    <ShieldCheckIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Trust Management
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Manage trust badges and testimonials
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Recent Bookings</CardTitle>
          <Link
            to="/admin/bookings"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <LoadingCard />
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recent bookings
              </h3>
              <p className="text-gray-500">
                Bookings will appear here once customers start booking services.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <li key={booking.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {booking.service?.name || "Cleaning Service"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Customer: {booking.customer?.firstName}{" "}
                            {booking.customer?.lastName}
                          </p>
                          {booking.cleaner && (
                            <p className="text-sm text-gray-500">
                              Cleaner: {booking.cleaner.firstName}{" "}
                              {booking.cleaner.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {capitalizeFirst(booking.status)}
                          </span>
                        </div>
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

export default AdminDashboard;
