import { useState, useEffect, useCallback } from "react";
import {
  CreditCardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
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
import { adminAPI } from "../../lib/api";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import { useToast } from "../../hooks/useToast";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
    page: 1,
    limit: 20,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  const { addToast } = useToast();

  // Fetch payments data
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching payments data...", filters);

      const response = await adminAPI.getPayments({
        ...filters,
      });

      console.log("Payments response:", response);

      if (response.data.payments) {
        setPayments(response.data.payments);
        setSummary(response.data.summary);
        setPagination(response.data.pagination);
      } else {
        console.error("No payments data in response:", response);
        setPayments([]);
        setSummary({
          total_transactions: 0,
          total_revenue: 0,
          average_transaction: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      addToast("Failed to load payments data", "error");

      // Set fallback data for demo
      setPayments([]);
      setSummary({
        total_transactions: 0,
        total_revenue: 0,
        average_transaction: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
    addToast("Payments data refreshed", "success");
  };

  const handleExportPayments = () => {
    // Create CSV export functionality
    const csvContent = [
      // CSV Header
      [
        "Transaction ID",
        "Date",
        "Customer",
        "Cleaner",
        "Service",
        "Amount",
        "Status",
      ],
      // CSV Data
      ...payments.map((payment) => [
        payment.id,
        formatDateTime(payment.created_at),
        `${payment.customer_first_name} ${payment.customer_last_name}`,
        payment.cleaner_first_name
          ? `${payment.cleaner_first_name} ${payment.cleaner_last_name}`
          : "Unassigned",
        payment.service_name,
        payment.total_amount,
        "Paid",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    addToast("Payments exported successfully", "success");
  };

  const getPaymentStatusBadge = () => {
    // Since we're only showing paid payments, always show success
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Paid
      </span>
    );
  };

  const getPaymentMethodInfo = (payment) => {
    if (payment.stripe_payment_intent_id) {
      return (
        <div className="flex items-center text-sm text-gray-600">
          <CreditCardIcon className="w-4 h-4 mr-1" />
          Card Payment
        </div>
      );
    }
    return (
      <div className="flex items-center text-sm text-gray-500">
        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
        Unknown
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Management
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Management
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor transactions, revenue, and payment analytics
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={refreshing}
            className="flex items-center gap-2"
          >
            <ChartBarIcon className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={handleExportPayments}
            className="flex items-center gap-2"
            disabled={payments.length === 0}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Transactions"
          value={summary?.total_transactions || 0}
          icon={CreditCardIcon}
          trend="neutral"
          trendValue=""
          trendLabel="all time"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(summary?.total_revenue || 0)}
          icon={CurrencyDollarIcon}
          trend="up"
          trendValue="100%"
          trendLabel="revenue growth"
        />
        <StatsCard
          title="Average Transaction"
          value={formatCurrency(summary?.average_transaction || 0)}
          icon={ChartBarIcon}
          trend="neutral"
          trendValue=""
          trendLabel="per transaction"
        />
        <StatsCard
          title="Success Rate"
          value="100%"
          icon={CheckCircleIcon}
          trend="up"
          trendValue="0%"
          trendLabel="payment failures"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Transactions
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by customer, service..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results per page
              </label>
              <Select
                value={filters.limit}
                onChange={(e) =>
                  handleFilterChange("limit", parseInt(e.target.value))
                }
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5" />
              Payment Transactions ({pagination.total})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  // Loading rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <LoadingTableRow key={index} columns={8} />
                  ))
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <CreditCardIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No payments found
                        </h3>
                        <p className="text-gray-500">
                          {filters.startDate ||
                          filters.endDate ||
                          filters.search
                            ? "No payments match your search criteria"
                            : "No payment transactions have been processed yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{payment.id}
                        </div>
                        {payment.stripe_payment_intent_id && (
                          <div className="text-xs text-gray-500 mt-1">
                            Stripe:{" "}
                            {payment.stripe_payment_intent_id.substring(0, 20)}
                            ...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDateTime(payment.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-800">
                                {payment.customer_first_name?.charAt(0)}
                                {payment.customer_last_name?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.customer_first_name}{" "}
                              {payment.customer_last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.cleaner_first_name ? (
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-green-800">
                                  {payment.cleaner_first_name?.charAt(0)}
                                  {payment.cleaner_last_name?.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.cleaner_first_name}{" "}
                                {payment.cleaner_last_name}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">
                            Unassigned
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {payment.service_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(payment.total_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentMethodInfo(payment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(payment)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.page - 1))
                  }
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePageChange(
                      Math.min(pagination.pages, pagination.page + 1)
                    )
                  }
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handlePageChange(Math.max(1, pagination.page - 1))
                      }
                      disabled={pagination.page === 1}
                      className="rounded-r-none"
                    >
                      Previous
                    </Button>
                    {Array.from(
                      { length: Math.min(5, pagination.pages) },
                      (_, i) => {
                        const pageNum = pagination.page - 2 + i;
                        if (pageNum < 1 || pageNum > pagination.pages)
                          return null;
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === pagination.page
                                ? "primary"
                                : "outline"
                            }
                            onClick={() => handlePageChange(pageNum)}
                            className="rounded-none"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                    <Button
                      variant="outline"
                      onClick={() =>
                        handlePageChange(
                          Math.min(pagination.pages, pagination.page + 1)
                        )
                      }
                      disabled={pagination.page === pagination.pages}
                      className="rounded-l-none"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
