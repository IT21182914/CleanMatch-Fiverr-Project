import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Select, Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import { adminAPI } from "../../lib/api";
import { formatCurrency, formatDateTime } from "../../lib/utils";

const CleanerEarnings = () => {
  const [earnings, setEarnings] = useState({
    cleaners: [],
    pagination: {},
    summary: {},
    filters: {},
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: "",
    year: new Date().getFullYear(),
    search: "",
    sortBy: "monthly_earnings",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });
  const [searchInput, setSearchInput] = useState(""); // Separate state for search input

  // Keep searchInput in sync when search filter is changed programmatically
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cleanerDetails, setCleanerDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const queryParams = {};

        // Always include basic pagination and default filters
        queryParams.page = filters.page;
        queryParams.limit = filters.limit;
        queryParams.year = filters.year;
        queryParams.sortBy = filters.sortBy;
        queryParams.sortOrder = filters.sortOrder;

        // Include month even if empty (backend will handle empty as "all year")
        queryParams.month = filters.month;

        // Include search even if empty (backend will handle empty properly)
        queryParams.search = filters.search;

        // Add timestamp to bypass cache
        queryParams._t = Date.now();

        console.log("Frontend - Current filters state:", filters);
        console.log("Frontend - Sending to API:", queryParams);

        // Test direct axios call to verify parameters are being sent
        console.log("Frontend - Making direct test call with fetch...");
        try {
          await fetch(
            `http://localhost:5000/api/admin/cleaners/earnings?${new URLSearchParams(
              queryParams
            )}`
          );
          console.log("Frontend - Direct fetch test successful");
        } catch (testError) {
          console.log("Frontend - Direct fetch test failed:", testError);
        }

        const response = await adminAPI.getCleanerEarnings(queryParams);
        setEarnings(response.data.data);
      } catch (error) {
        console.error("Error fetching cleaner earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [filters]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
        page: 1, // Reset to page 1 when searching
      }));
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const fetchCleanerDetails = async (cleanerId) => {
    try {
      setDetailsLoading(true);
      const response = await adminAPI.getCleanerEarningsDetails(cleanerId, {
        year: filters.year,
      });
      setCleanerDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching cleaner details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const fetchTransactionDetails = async (
    cleanerId,
    month = null,
    year = null
  ) => {
    try {
      setTransactionLoading(true);
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (year) params.append("year", year || filters.year);

      const response = await adminAPI.getCleanerTransactionDetails(
        cleanerId,
        Object.fromEntries(params)
      );
      setTransactionDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    console.log(`Filter changed: ${key} = ${value}`); // Debug logging
    console.log(`Current filters before change:`, filters); // Debug logging

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: value,
        page: key !== "page" ? 1 : value, // Reset to page 1 when changing other filters
      };
      console.log(`New filters after change:`, newFilters); // Debug logging
      return newFilters;
    });
  };

  const handleViewDetails = (cleaner) => {
    setSelectedCleaner(cleaner);
    setShowDetails(true);
    fetchCleanerDetails(cleaner.id);
  };

  const handleViewTransactions = (cleaner, month = null) => {
    setSelectedCleaner(cleaner);
    setShowTransactions(true);
    fetchTransactionDetails(cleaner.id, month, filters.year);
  };

  const handleSort = (field) => {
    const newOrder =
      filters.sortBy === field && filters.sortOrder === "desc" ? "asc" : "desc";
    handleFilterChange("sortBy", field);
    handleFilterChange("sortOrder", newOrder);
  };

  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === "asc" ? (
      <ArrowUpIcon className="w-4 h-4 inline ml-1" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 inline ml-1" />
    );
  };

  const months = [
    { value: "", label: "All Year" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <LoadingCard />
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
            Cleaner Earnings Tracking
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and track earnings for all cleaners across different time
            periods.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Cleaners
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {earnings.summary.totalActiveCleaners || 0}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Earnings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(earnings.summary.totalEarnings || 0)}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Job Value
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(earnings.summary.avgJobValue || 0)}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Completed Jobs
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {earnings.summary.totalCompletedJobs || 0}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.year.toString()}
                onChange={(e) =>
                  handleFilterChange("year", parseInt(e.target.value))
                }
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="monthly_earnings">Earnings</option>
                <option value="name">Name</option>
                <option value="total_jobs">Jobs Count</option>
                <option value="avg_rating">Rating</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cleaners..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Showing results for: <strong>{earnings.summary.period}</strong>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cleaner Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.cleaners.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("name")}
                      >
                        Cleaner {getSortIcon("name")}
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("monthly_earnings")}
                      >
                        Earnings {getSortIcon("monthly_earnings")}
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("total_jobs")}
                      >
                        Jobs {getSortIcon("total_jobs")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours Worked
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Hourly
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("avg_rating")}
                      >
                        Rating {getSortIcon("avg_rating")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending Payout
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earnings.cleaners.map((cleaner) => (
                      <tr key={cleaner.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {cleaner.first_name} {cleaner.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {cleaner.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(cleaner.monthly_earnings)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cleaner.period_completed_jobs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cleaner.hours_worked} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(cleaner.avg_hourly_earned)}/hr
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">
                              {cleaner.avg_rating
                                ? parseFloat(cleaner.avg_rating).toFixed(1)
                                : "N/A"}
                            </span>
                            {cleaner.avg_rating && (
                              <span className="ml-1 text-yellow-400">★</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-orange-600">
                            {formatCurrency(cleaner.pending_payout)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(cleaner)}
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewTransactions(cleaner, filters.month)
                              }
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                              Transactions
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {earnings.pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {earnings.pagination.currentPage} of{" "}
                    {earnings.pagination.totalPages}(
                    {earnings.pagination.totalCleaners} total cleaners)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={earnings.pagination.currentPage === 1}
                      onClick={() =>
                        handleFilterChange(
                          "page",
                          earnings.pagination.currentPage - 1
                        )
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!earnings.pagination.hasMore}
                      onClick={() =>
                        handleFilterChange(
                          "page",
                          earnings.pagination.currentPage + 1
                        )
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No cleaners found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No cleaners match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cleaner Details Modal */}
      {showDetails && selectedCleaner && (
        <CleanerDetailsModal
          cleaner={selectedCleaner}
          details={cleanerDetails}
          loading={detailsLoading}
          year={filters.year}
          onClose={() => {
            setShowDetails(false);
            setSelectedCleaner(null);
            setCleanerDetails(null);
          }}
        />
      )}

      {/* Transaction Details Modal */}
      {showTransactions && selectedCleaner && (
        <TransactionDetailsModal
          cleaner={selectedCleaner}
          transactionDetails={transactionDetails}
          loading={transactionLoading}
          onClose={() => {
            setShowTransactions(false);
            setSelectedCleaner(null);
            setTransactionDetails(null);
          }}
        />
      )}
    </div>
  );
};

const CleanerDetailsModal = ({ details, loading, year, onClose }) => {
  if (loading || !details) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <LoadingCard />
            <div className="text-center mt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const monthlyData = details.earnings?.monthlyBreakdown || [];
  const yearTotals = details.earnings?.yearTotals || {};

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {details.cleaner.name} - Earnings Details
              </h3>
              <p className="text-gray-600">{details.cleaner.email}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  Rating:{" "}
                  {details.cleaner.rating
                    ? parseFloat(details.cleaner.rating).toFixed(1)
                    : "N/A"}{" "}
                  ★
                </span>
                <span>
                  Hourly Rate: {formatCurrency(details.cleaner.hourly_rate)}
                </span>
                <span>
                  Experience: {details.cleaner.experience_years} years
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              ✕ Close
            </Button>
          </div>

          {/* Year Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(yearTotals.totalEarnings)}
                </div>
                <div className="text-sm text-gray-600">
                  Total Earnings {year}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {yearTotals.completedJobs}
                </div>
                <div className="text-sm text-gray-600">Completed Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {yearTotals.totalHoursWorked}
                </div>
                <div className="text-sm text-gray-600">Hours Worked</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(yearTotals.avgHourlyEarned)}
                </div>
                <div className="text-sm text-gray-600">Avg Hourly Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings Breakdown - {year}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jobs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyData.map((month) => (
                      <tr key={month.month} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month.monthName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(month.earnings)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {month.completedJobs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {month.hoursWorked}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(month.avgHourlyRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          {details.recentBookings && details.recentBookings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings - {year}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {details.recentBookings.slice(0, 10).map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(
                              `${booking.booking_date} ${booking.booking_time}`
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.service_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.customer_first_name}{" "}
                            {booking.customer_last_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {formatCurrency(booking.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const TransactionDetailsModal = ({ transactionDetails, loading, onClose }) => {
  if (loading || !transactionDetails) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <LoadingCard />
            <div className="text-center mt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    cleaner: cleanerInfo,
    period,
    summary,
    transactions,
    serviceBreakdown,
  } = transactionDetails;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Transaction Details - {cleanerInfo.name}
              </h3>
              <p className="text-gray-600">
                {period.monthName} {period.year}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    cleanerInfo.canReceivePayment
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {cleanerInfo.canReceivePayment
                    ? "Payment Ready"
                    : "Stripe Setup Required"}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              ✕ Close
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalAmount)}
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.totalJobs}
                </div>
                <div className="text-sm text-gray-600">Completed Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {summary.totalHours.toFixed(1)}h
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(summary.averageHourlyRate)}
                </div>
                <div className="text-sm text-gray-600">Avg Hourly Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Service Breakdown */}
          {serviceBreakdown && serviceBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Service Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Service Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Jobs
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Avg Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Hours
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {serviceBreakdown.map((service, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.serviceName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {formatCurrency(service.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(service.averageAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.totalHours.toFixed(1)}h
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transaction List */}
          <Card>
            <CardHeader>
              <CardTitle>
                All Transactions ({transactions.length})
                <span className="text-sm font-normal text-gray-500 ml-2">
                  Actual payment transactions with Stripe IDs
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Service
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Transaction ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>
                              {
                                formatDateTime(
                                  transaction.bookingDate +
                                    " " +
                                    transaction.bookingTime
                                ).split(" ")[0]
                              }
                            </div>
                            <div className="text-xs text-gray-500">
                              Paid:{" "}
                              {
                                formatDateTime(transaction.paymentDate).split(
                                  " "
                                )[0]
                              }
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {transaction.serviceType}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.serviceCategory}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {transaction.customer.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.customer.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">
                          <div className="text-green-600">
                            {formatCurrency(transaction.amount)}
                          </div>
                          {transaction.membershipDiscountApplied && (
                            <div className="text-xs text-orange-600">
                              Discount:{" "}
                              {formatCurrency(
                                transaction.membershipDiscountAmount
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.duration}h
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          <div
                            className="max-w-20 truncate"
                            title={transaction.transactionId}
                          >
                            {transaction.transactionId?.substring(0, 12)}...
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="text-xs">
                            <div>
                              {transaction.location.city},{" "}
                              {transaction.location.state}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No transactions found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No completed, paid transactions for this period.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CleanerEarnings;
