import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Select } from "../../components/ui/Form";
import { LoadingCard } from "../../components/ui/Loading";
import { adminAPI } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    revenue: [],
    stats: {
      totalRevenue: 0,
      totalBookings: 0,
      totalUsers: 0,
      completedBookings: 0,
      monthlyRevenue: [],
      topServices: [],
      topCleaners: [],
    },
  });
  const [timeRange, setTimeRange] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, year]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, revenueResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAnalytics({ period: timeRange, year }),
      ]);

      setAnalytics({
        revenue: revenueResponse.data.analytics || [],
        stats: dashboardResponse.data.stats || {},
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const calculateGrowth = (current, previous) => {
  //     if (!previous || previous === 0) return 0;
  //     return (((current - previous) / previous) * 100).toFixed(1);
  //   };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    if (growth < 0) return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Mock growth calculations (in a real app, you'd compare with previous periods)
  const mockGrowth = {
    revenue: 12.5,
    bookings: 8.3,
    users: 15.2,
    completion: 2.1,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <LoadingCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor platform performance and business metrics.
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
          <Select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
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
                <dd className="flex items-baseline">
                  <div className="text-lg font-medium text-gray-900">
                    {formatCurrency(analytics.stats.totalRevenue || 0)}
                  </div>
                  <div
                    className={`ml-2 flex items-center text-sm ${getGrowthColor(
                      mockGrowth.revenue
                    )}`}
                  >
                    {getGrowthIcon(mockGrowth.revenue)}
                    <span className="ml-1">{mockGrowth.revenue}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

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
                <dd className="flex items-baseline">
                  <div className="text-lg font-medium text-gray-900">
                    {analytics.stats.totalBookings || 0}
                  </div>
                  <div
                    className={`ml-2 flex items-center text-sm ${getGrowthColor(
                      mockGrowth.bookings
                    )}`}
                  >
                    {getGrowthIcon(mockGrowth.bookings)}
                    <span className="ml-1">{mockGrowth.bookings}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Users
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-medium text-gray-900">
                    {analytics.stats.totalUsers || 0}
                  </div>
                  <div
                    className={`ml-2 flex items-center text-sm ${getGrowthColor(
                      mockGrowth.users
                    )}`}
                  >
                    {getGrowthIcon(mockGrowth.users)}
                    <span className="ml-1">{mockGrowth.users}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Completion Rate
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-medium text-gray-900">
                    {analytics.stats.totalBookings > 0
                      ? (
                          (analytics.stats.completedBookings /
                            analytics.stats.totalBookings) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                  <div
                    className={`ml-2 flex items-center text-sm ${getGrowthColor(
                      mockGrowth.completion
                    )}`}
                  >
                    {getGrowthIcon(mockGrowth.completion)}
                    <span className="ml-1">{mockGrowth.completion}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.revenue.length === 0 ? (
            <div className="text-center py-12">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No data available
              </h3>
              <p className="text-gray-500">
                Revenue data will appear here once you have completed bookings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simple bar chart representation */}
              {analytics.revenue.map((item, index) => {
                const maxRevenue = Math.max(
                  ...analytics.revenue.map((r) => parseFloat(r.revenue || 0))
                );
                const width =
                  maxRevenue > 0
                    ? (parseFloat(item.revenue || 0) / maxRevenue) * 100
                    : 0;

                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-24 text-sm text-gray-600">
                      {new Date(item.period).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-6 relative">
                        <div
                          className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(width, 5)}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(item.revenue || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600 text-right">
                      {item.transactions || 0} jobs
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.stats.topServices?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No service data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(analytics.stats.topServices || [])
                  .slice(0, 5)
                  .map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {service.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {service.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {service.booking_count} bookings
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(service.revenue || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Cleaners */}
        <Card>
          <CardHeader>
            <CardTitle>Top Cleaners</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.stats.topCleaners?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No cleaner data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(analytics.stats.topCleaners || [])
                  .slice(0, 5)
                  .map((cleaner, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {cleaner.first_name?.charAt(0)}
                              {cleaner.last_name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {cleaner.first_name} {cleaner.last_name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            ⭐ {cleaner.rating}/5.0
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {cleaner.total_jobs} jobs
                        </p>
                        <p className="text-sm text-gray-500">
                          {cleaner.bookings_count} completed
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.stats.users
                  ?.filter((u) => u.role === "customer")
                  .reduce((sum, u) => sum + parseInt(u.count), 0) || 0}
              </div>
              <div className="text-sm text-gray-500">Active Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics.stats.users
                  ?.filter((u) => u.role === "cleaner")
                  .reduce((sum, u) => sum + parseInt(u.count), 0) || 0}
              </div>
              <div className="text-sm text-gray-500">Active Cleaners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.stats.bookings?.pending_bookings || 0}
              </div>
              <div className="text-sm text-gray-500">Pending Bookings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
