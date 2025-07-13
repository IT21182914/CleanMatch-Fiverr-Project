import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
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

const CleanerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    completedJobs: 0,
    monthlyEarnings: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await bookingsAPI.getCleanerBookings();
      const jobsData = response.data.data;
      setJobs(jobsData.slice(0, 5)); // Show only recent 5 jobs

      // Calculate stats
      const totalJobs = jobsData.length;
      const pendingJobs = jobsData.filter((job) =>
        ["pending", "confirmed"].includes(job.status)
      ).length;
      const completedJobs = jobsData.filter(
        (job) => job.status === "completed"
      ).length;

      // Calculate monthly earnings (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyEarnings = jobsData
        .filter((job) => {
          const jobDate = new Date(job.scheduledDate);
          return (
            job.status === "completed" &&
            jobDate.getMonth() === currentMonth &&
            jobDate.getFullYear() === currentYear
          );
        })
        .reduce((total, job) => total + job.totalAmount, 0);

      setStats({ totalJobs, pendingJobs, completedJobs, monthlyEarnings });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      await bookingsAPI.acceptBooking(jobId);
      fetchJobs(); // Refresh the list
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      await bookingsAPI.rejectBooking(jobId);
      fetchJobs(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting job:", error);
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
            Manage your cleaning jobs and track your earnings.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link to="/availability">
            <Button className="inline-flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Update Availability
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <BriefcaseIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Jobs
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalJobs}
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
                  {stats.pendingJobs}
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
                  {stats.completedJobs}
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
                  This Month
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(stats.monthlyEarnings)}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Recent Jobs</CardTitle>
          <Link
            to="/jobs"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <LoadingCard />
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs assigned yet
              </h3>
              <p className="text-gray-500 mb-4">
                Complete your profile to start receiving job assignments.
              </p>
              <Link to="/profile">
                <Button>Complete Profile</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <li key={job.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {job.service?.name || "Cleaning Service"}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                job.status
                              )}`}
                            >
                              {capitalizeFirst(job.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatDateTime(job.scheduledDate)}
                          <span className="mx-2">•</span>
                          <span className="font-medium">
                            {formatCurrency(job.totalAmount)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Customer: {job.customer?.firstName}{" "}
                          {job.customer?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Address: {job.address}
                        </p>

                        {job.status === "pending" && (
                          <div className="flex space-x-2 mt-3">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleAcceptJob(job.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectJob(job.id)}
                            >
                              Decline
                            </Button>
                          </div>
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

export default CleanerDashboard;
