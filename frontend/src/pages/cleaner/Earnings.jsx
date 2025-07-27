import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Select } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import { bookingsAPI, paymentsAPI } from "../../lib/api";
import {
  formatCurrency,
  formatDateTime,
  capitalizeFirst,
} from "../../lib/utils";

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    pending: 0,
  });
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [stripeStatus, setStripeStatus] = useState({
    status: "not_created",
    canReceivePayments: false,
  });

  useEffect(() => {
    fetchEarningsData();
    fetchStripeStatus();
  }, []);

  const fetchEarningsData = async () => {
    try {
      // Fetch all completed jobs for this cleaner
      const response = await bookingsAPI.getCleanerBookings();
      const jobs = response.data.data || [];

      const completedJobsList = jobs.filter(
        (job) => job.status === "completed"
      );
      setCompletedJobs(completedJobsList);

      // Calculate earnings
      const total = completedJobsList.reduce(
        (sum, job) => sum + parseFloat(job.total_amount || 0),
        0
      );

      // This month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonth = completedJobsList
        .filter((job) => {
          const jobDate = new Date(job.booking_date || job.scheduledDate);
          return (
            jobDate.getMonth() === currentMonth &&
            jobDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, job) => sum + parseFloat(job.total_amount || 0), 0);

      // This week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeek = completedJobsList
        .filter((job) => {
          const jobDate = new Date(job.booking_date || job.scheduledDate);
          return jobDate >= oneWeekAgo;
        })
        .reduce((sum, job) => sum + parseFloat(job.total_amount || 0), 0);

      // Pending earnings (completed but not transferred)
      const pending = completedJobsList
        .filter((job) => job.payment_status === "paid" && !job.transferred)
        .reduce((sum, job) => sum + parseFloat(job.total_amount || 0), 0);

      setEarnings({
        total,
        thisMonth,
        thisWeek,
        pending,
      });
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStripeStatus = async () => {
    try {
      const response = await paymentsAPI.getConnectAccountStatus();
      setStripeStatus(response.data);
    } catch (error) {
      console.error("Error fetching Stripe status:", error);
    }
  };

  const handleStripeSetup = async () => {
    try {
      const response = await paymentsAPI.createCleanerConnectAccount();
      window.location.href = response.data.account_link;
    } catch (error) {
      console.error("Error setting up Stripe:", error);
    }
  };

  const getFilteredJobs = () => {
    const now = new Date();

    switch (timeFilter) {
      case "week": {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return completedJobs.filter((job) => {
          const jobDate = new Date(job.booking_date || job.scheduledDate);
          return jobDate >= oneWeekAgo;
        });
      }

      case "month": {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return completedJobs.filter((job) => {
          const jobDate = new Date(job.booking_date || job.scheduledDate);
          return (
            jobDate.getMonth() === currentMonth &&
            jobDate.getFullYear() === currentYear
          );
        });
      }

      case "quarter": {
        const quarterStart = new Date();
        quarterStart.setMonth(quarterStart.getMonth() - 3);
        return completedJobs.filter((job) => {
          const jobDate = new Date(job.booking_date || job.scheduledDate);
          return jobDate >= quarterStart;
        });
      }

      default:
        return completedJobs;
    }
  };

  const filteredJobs = getFilteredJobs();
  const filteredEarnings = filteredJobs.reduce(
    (sum, job) => sum + parseFloat(job.total_amount || 0),
    0
  );

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
            Earnings Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your earnings and payment history from completed jobs.
          </p>
        </div>
      </div>

      {/* Payment Setup Warning */}
      {!stripeStatus.canReceivePayments && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent>
            <div className="flex items-start space-x-3">
              <CreditCardIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Payment Setup Required
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Complete your payment setup to receive earnings from completed
                  jobs.
                </p>
                <div className="mt-3">
                  <Button
                    onClick={handleStripeSetup}
                    size="sm"
                    variant="warning"
                  >
                    Complete Payment Setup
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Earnings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(earnings.total)}
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
                  This Month
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(earnings.thisMonth)}
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
                  This Week
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(earnings.thisWeek)}
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
                  Pending
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(earnings.pending)}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Earnings History
          </CardTitle>
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-auto"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
          </Select>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No earnings yet
              </h3>
              <p className="text-gray-500 mb-6">
                Complete jobs to start earning money through SIMORGH SERVICE.
              </p>
            </div>
          ) : (
            <>
              {/* Summary for filtered period */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {timeFilter === "all"
                        ? "Total"
                        : `${capitalizeFirst(timeFilter)}`}{" "}
                      Summary
                    </h4>
                    <p className="text-sm text-gray-500">
                      {filteredJobs.length} completed jobs
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(filteredEarnings)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Avg:{" "}
                      {formatCurrency(filteredEarnings / filteredJobs.length)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {job.service?.name || "Cleaning Service"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Job #{job.id} •{" "}
                            {formatDateTime(
                              job.booking_date || job.scheduledDate
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            Customer:{" "}
                            {job.customer_first_name || job.customer?.firstName}{" "}
                            {job.customer_last_name || job.customer?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(job.total_amount)}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            job.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {job.payment_status === "paid"
                            ? "Paid"
                            : "Pending Payment"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {job.duration_hours} hours
                      </div>
                      <div>
                        <span className="font-medium">Rate:</span>{" "}
                        {formatCurrency(
                          parseFloat(job.total_amount) / job.duration_hours
                        )}
                        /hour
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent>
          <div className="flex items-start space-x-3">
            <CreditCardIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Payment Information
              </h3>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>
                  • Payments are processed automatically after job completion
                </li>
                <li>• Platform fee is 10% of the total booking amount</li>
                <li>• Payments typically arrive within 2-3 business days</li>
                <li>• You'll receive email notifications for all transfers</li>
                <li>
                  • Access detailed payment history in your Stripe dashboard
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
