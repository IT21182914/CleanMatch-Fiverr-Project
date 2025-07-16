import { useState, useEffect, useCallback } from "react";
import {
  CreditCardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatsCard,
} from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard, LoadingTableRow } from "../../components/ui/Loading";
import { membershipAPI } from "../../lib/api";
import {
  formatCurrency,
  formatDateTime,
  capitalizeFirst,
} from "../../lib/utils";

const AdminMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    tier: "",
    search: "",
    page: 1,
    limit: 20,
    sortBy: "start_date",
    sortOrder: "desc",
  });

  console.log(selectedMembership);
  console.log(showMembershipModal);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  const fetchMemberships = useCallback(async () => {
    try {
      setLoading(true);
      const response = await membershipAPI.getAllMemberships(filters);
      setMemberships(response.data.memberships);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching memberships:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const response = await membershipAPI.getAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }));
  };

  const getStatusBadgeColor = (status, cancelAtPeriodEnd) => {
    if (cancelAtPeriodEnd)
      return "bg-orange-100 text-orange-800 border border-orange-200";
    const colors = {
      active: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-gray-100 text-gray-800 border border-gray-200",
      past_due: "bg-red-100 text-red-800 border border-red-200",
      unpaid: "bg-red-100 text-red-800 border border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getTierBadgeColor = (tier) => {
    const colors = {
      basic: "bg-blue-100 text-blue-800 border border-blue-200",
      premium: "bg-purple-100 text-purple-800 border border-purple-200",
      gold: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      foreverclean: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    };
    return (
      colors[tier?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border border-gray-200"
    );
  };

  const calculateChurnRate = () => {
    if (!analytics) return 0;
    const total = analytics.totalStats.total_memberships || 1;
    const cancelled = analytics.totalStats.cancelled_memberships || 0;
    return ((cancelled / total) * 100).toFixed(1);
  };

  const calculateGrowthRate = () => {
    if (!analytics) return 0;
    // Mock calculation - in real app this would come from API
    return "+12.3";
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <SparklesIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    ForeverClean Memberships
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">
                    Manage and monitor ForeverClean membership subscriptions
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <Button variant="primary" size="lg">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Analytics Cards */}
        {analyticsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : (
          analytics && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Members"
                value={analytics.totalStats.total_memberships || 0}
                change={calculateGrowthRate() + "%"}
                trend="up"
                icon={UserGroupIcon}
              />

              <StatsCard
                title="Active Members"
                value={analytics.totalStats.active_memberships || 0}
                change="94.2% retention"
                trend="up"
                icon={TrophyIcon}
              />

              <StatsCard
                title="Monthly Revenue"
                value={formatCurrency(
                  analytics.totalStats.monthly_revenue || 0
                )}
                change="+8.1%"
                trend="up"
                icon={CreditCardIcon}
              />

              <StatsCard
                title="Churn Rate"
                value={calculateChurnRate() + "%"}
                change="-2.1%"
                trend="down"
                icon={ChartBarIcon}
              />
            </div>
          )
        )}

        {/* Tier Distribution Overview */}
        {analytics && analytics.tierDistribution && (
          <Card variant="elevated">
            <CardHeader variant="primary">
              <CardTitle className="flex items-center">
                <TrophyIcon className="h-6 w-6 mr-2 text-yellow-600" />
                Membership Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {analytics.tierDistribution.map((tier) => (
                  <div
                    key={tier.tier}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {tier.tier === "foreverclean"
                            ? "ForeverClean"
                            : capitalizeFirst(tier.tier)}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {tier.active_count} active members
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-yellow-600">
                          {tier.count}
                        </div>
                        <div className="text-sm text-gray-500">total</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(tier.active_count / tier.count) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {((tier.active_count / tier.count) * 100).toFixed(1)}%
                      active rate
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card variant="elevated">
          <CardHeader variant="accent">
            <CardTitle className="flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search members..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 form-input"
                />
              </div>

              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="form-input"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="past_due">Past Due</option>
                <option value="unpaid">Unpaid</option>
              </Select>

              <Select
                value={filters.tier}
                onChange={(e) => handleFilterChange("tier", e.target.value)}
                className="form-input"
              >
                <option value="">All Plans</option>
                <option value="foreverclean">ForeverClean</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="gold">Gold</option>
              </Select>

              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="form-input"
              >
                <option value="start_date">Sort by Start Date</option>
                <option value="monthly_fee">Sort by Price</option>
                <option value="usage_count">Sort by Usage</option>
                <option value="total_savings">Sort by Savings</option>
              </Select>

              <Select
                value={filters.limit}
                onChange={(e) =>
                  handleFilterChange("limit", parseInt(e.target.value))
                }
                className="form-input"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Memberships Table */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Membership Details</span>
              <span className="text-sm font-normal text-gray-500">
                {pagination.total} total members
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent variant="flush">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("first_name")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Member</span>
                        {filters.sortBy === "first_name" &&
                          (filters.sortOrder === "desc" ? (
                            <ArrowTrendingDownIcon className="h-4 w-4" />
                          ) : (
                            <ArrowTrendingUpIcon className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("monthly_fee")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Monthly Fee</span>
                        {filters.sortBy === "monthly_fee" &&
                          (filters.sortOrder === "desc" ? (
                            <ArrowTrendingDownIcon className="h-4 w-4" />
                          ) : (
                            <ArrowTrendingUpIcon className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("usage_count")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Usage</span>
                        {filters.sortBy === "usage_count" &&
                          (filters.sortOrder === "desc" ? (
                            <ArrowTrendingDownIcon className="h-4 w-4" />
                          ) : (
                            <ArrowTrendingUpIcon className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Savings
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("start_date")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Started</span>
                        {filters.sortBy === "start_date" &&
                          (filters.sortOrder === "desc" ? (
                            <ArrowTrendingDownIcon className="h-4 w-4" />
                          ) : (
                            <ArrowTrendingUpIcon className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <LoadingTableRow key={index} columns={8} />
                    ))
                  ) : memberships.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="text-gray-500">
                          <SparklesIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No memberships found
                          </h3>
                          <p className="text-gray-500">
                            No memberships match your current filters. Try
                            adjusting your search criteria.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    memberships.map((membership) => (
                      <tr
                        key={membership.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-sm">
                                <span className="text-sm font-semibold text-white">
                                  {membership.first_name?.[0] || "U"}
                                  {membership.last_name?.[0] || ""}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {membership.first_name} {membership.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {membership.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTierBadgeColor(
                              membership.tier
                            )}`}
                          >
                            {membership.tier === "foreverclean"
                              ? "ForeverClean"
                              : capitalizeFirst(membership.tier)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                              membership.status,
                              membership.cancel_at_period_end
                            )}`}
                          >
                            {membership.cancel_at_period_end
                              ? "Ending Soon"
                              : capitalizeFirst(membership.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(membership.monthly_fee)}
                          </div>
                          <div className="text-xs text-gray-500">per month</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {membership.usage_count || 0}
                          </div>
                          <div className="text-xs text-gray-500">bookings</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(membership.total_savings || 0)}
                          </div>
                          <div className="text-xs text-gray-500">saved</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(membership.start_date, {
                            dateOnly: true,
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedMembership(membership);
                                setShowMembershipModal(true);
                              }}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-semibold">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-semibold">{pagination.total}</span>{" "}
                  results
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === pagination.page;

                      return (
                        <Button
                          key={pageNum}
                          variant={isActive ? "primary" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="min-w-[2.5rem]"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMemberships;
