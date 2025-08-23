import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  StarIcon,
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

  const getGrowthIcon = (growth) => {
    if (growth > 0)
      return <ArrowUpIcon className="h-3.5 w-3.5 text-green-600" />;
    if (growth < 0)
      return <ArrowDownIcon className="h-3.5 w-3.5 text-red-600" />;
    return null;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-500";
  };

  // Mock growth calculations (in a real app, you'd compare with previous periods)
  const mockGrowth = {
    revenue: 12.5,
    bookings: 8.3,
    users: 15.2,
    completion: 2.1,
  };

  const MetricCard = ({ icon, title, value, growth, growthLabel }) => (
    <Card className="transition-all duration-200 hover:shadow-lg border-0 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gray-50">{icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`flex items-center justify-end space-x-1 text-sm font-medium ${getGrowthColor(
                growth
              )}`}
            >
              {getGrowthIcon(growth)}
              <span>{Math.abs(growth)}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{growthLabel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <LoadingCard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl">
                Comprehensive insights into platform performance and business
                metrics
              </p>
            </div>
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">
                  Period:
                </label>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="min-w-[120px] border-gray-300 rounded-lg text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Select>
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">
                  Year:
                </label>
                <Select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="min-w-[100px] border-gray-300 rounded-lg text-sm"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <MetricCard
            icon={<CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />}
            title="Total Revenue"
            value={formatCurrency(analytics.stats.totalRevenue || 0)}
            growth={mockGrowth.revenue}
            growthLabel="vs last period"
          />
          <MetricCard
            icon={<CalendarIcon className="h-6 w-6 text-blue-600" />}
            title="Total Bookings"
            value={(analytics.stats.totalBookings || 0).toLocaleString()}
            growth={mockGrowth.bookings}
            growthLabel="vs last period"
          />
          <MetricCard
            icon={<UsersIcon className="h-6 w-6 text-purple-600" />}
            title="Active Users"
            value={(analytics.stats.totalUsers || 0).toLocaleString()}
            growth={mockGrowth.users}
            growthLabel="vs last period"
          />
          <MetricCard
            icon={<ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />}
            title="Completion Rate"
            value={`${
              analytics.stats.totalBookings > 0
                ? (
                    (analytics.stats.completedBookings /
                      analytics.stats.totalBookings) *
                    100
                  ).toFixed(1)
                : 0
            }%`}
            growth={mockGrowth.completion}
            growthLabel="vs last period"
          />
        </div>

        {/* Revenue Analytics Chart */}
        <Card className="mb-10 border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Revenue Analytics
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Track revenue performance over time
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span>Trending data</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {analytics.revenue.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ChartBarIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Revenue Data Available
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Revenue analytics will be displayed here once you have
                  completed bookings and transactions.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {analytics.revenue.map((item, index) => {
                  const maxRevenue = Math.max(
                    ...analytics.revenue.map((r) => parseFloat(r.revenue || 0))
                  );
                  const width =
                    maxRevenue > 0
                      ? (parseFloat(item.revenue || 0) / maxRevenue) * 100
                      : 0;

                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-6 py-2"
                    >
                      <div className="w-20 text-sm font-medium text-gray-700">
                        {new Date(item.period).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-full h-8 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-blue-500 h-8 rounded-full flex items-center justify-end pr-4 transition-all duration-300"
                            style={{ width: `${Math.max(width, 8)}%` }}
                          >
                            <span className="text-sm text-white font-semibold">
                              {formatCurrency(item.revenue || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-20 text-sm text-gray-600 text-right font-medium">
                        {(item.transactions || 0).toLocaleString()} jobs
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-10">
          {/* Top Performing Services */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Top Performing Services
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Most popular services by booking volume
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {analytics.stats.topServices?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    No service performance data available
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {(analytics.stats.topServices || [])
                    .slice(0, 5)
                    .map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-gray-700 shadow-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {service.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {service.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {service.booking_count.toLocaleString()} bookings
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(service.revenue || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Rated Cleaners */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Top Rated Cleaners
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Highest performing service providers
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {analytics.stats.topCleaners?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <UsersIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    No cleaner performance data available
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {(analytics.stats.topCleaners || [])
                    .slice(0, 5)
                    .map((cleaner, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {cleaner.first_name?.charAt(0)}
                            {cleaner.last_name?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {cleaner.first_name} {cleaner.last_name}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">
                                {cleaner.rating}/5.0
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {cleaner.total_jobs.toLocaleString()} jobs
                          </p>
                          <p className="text-sm text-gray-600">
                            {cleaner.bookings_count.toLocaleString()} completed
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-6">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Platform Overview
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Key platform metrics and user activity summary
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analytics.stats.users
                    ?.filter((u) => u.role === "customer")
                    .reduce((sum, u) => sum + parseInt(u.count), 0)
                    ?.toLocaleString() || 0}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Active Customers
                </div>
                <div className="text-xs text-gray-500">
                  Platform users seeking services
                </div>
              </div>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <UsersIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analytics.stats.users
                    ?.filter((u) => u.role === "cleaner")
                    .reduce((sum, u) => sum + parseInt(u.count), 0)
                    ?.toLocaleString() || 0}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Active Cleaners
                </div>
                <div className="text-xs text-gray-500">
                  Service providers on platform
                </div>
              </div>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {(
                    analytics.stats.bookings?.pending_bookings || 0
                  ).toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Pending Bookings
                </div>
                <div className="text-xs text-gray-500">
                  Awaiting confirmation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
