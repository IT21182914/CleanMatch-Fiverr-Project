import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
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
import { bookingsAPI } from "../../lib/api";
import {
  formatDateTime,
  formatCurrency,
  getStatusColor,
  capitalizeFirst,
} from "../../lib/utils";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await bookingsAPI.getCleanerBookings();
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      setUpdating((prev) => ({ ...prev, [jobId]: true }));
      await bookingsAPI.updateStatus(jobId, "confirmed");

      // Update job in local state
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "confirmed" } : job
        )
      );
    } catch (error) {
      console.error("Error accepting job:", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      setUpdating((prev) => ({ ...prev, [jobId]: true }));
      await bookingsAPI.updateStatus(jobId, "cancelled");

      // Update job in local state
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "cancelled" } : job
        )
      );
    } catch (error) {
      console.error("Error rejecting job:", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleStartJob = async (jobId) => {
    try {
      setUpdating((prev) => ({ ...prev, [jobId]: true }));
      await bookingsAPI.updateStatus(jobId, "in_progress");

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "in_progress" } : job
        )
      );
    } catch (error) {
      console.error("Error starting job:", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleCompleteJob = async (jobId) => {
    try {
      setUpdating((prev) => ({ ...prev, [jobId]: true }));
      await bookingsAPI.updateStatus(jobId, "completed");

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "completed" } : job
        )
      );
    } catch (error) {
      console.error("Error completing job:", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true;
    return job.status === filter;
  });

  const statusCounts = {
    all: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    confirmed: jobs.filter((j) => j.status === "confirmed").length,
    in_progress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    cancelled: jobs.filter((j) => j.status === "cancelled").length,
  };

  const getJobActions = (job) => {
    const actions = [];

    if (job.status === "pending") {
      actions.push(
        <Button
          key="accept"
          size="sm"
          variant="success"
          loading={updating[job.id]}
          onClick={() => handleAcceptJob(job.id)}
          className="flex items-center"
        >
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          Accept
        </Button>
      );
      actions.push(
        <Button
          key="reject"
          size="sm"
          variant="outline"
          loading={updating[job.id]}
          onClick={() => handleRejectJob(job.id)}
          className="flex items-center text-red-600 border-red-300 hover:bg-red-50"
        >
          <XCircleIcon className="h-4 w-4 mr-1" />
          Decline
        </Button>
      );
    }

    if (job.status === "confirmed") {
      actions.push(
        <Button
          key="start"
          size="sm"
          loading={updating[job.id]}
          onClick={() => handleStartJob(job.id)}
        >
          Start Job
        </Button>
      );
    }

    if (job.status === "in_progress") {
      actions.push(
        <Button
          key="complete"
          size="sm"
          variant="success"
          loading={updating[job.id]}
          onClick={() => handleCompleteJob(job.id)}
        >
          Mark Complete
        </Button>
      );
    }

    actions.push(
      <Button
        key="view"
        size="sm"
        variant="ghost"
        className="flex items-center"
      >
        <EyeIcon className="h-4 w-4 mr-1" />
        View
      </Button>
    );

    return actions;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            My Jobs
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your cleaning assignments and track your work.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link to="/availability">
            <Button className="inline-flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Update Availability
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: "all", label: "All Jobs" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "in_progress", label: "In Progress" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} ({statusCounts[tab.key]})
            </button>
          ))}
        </nav>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "all" ? "No jobs yet" : `No ${filter} jobs`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "all"
                ? "Complete your profile to start receiving job assignments."
                : `You don't have any ${filter} jobs at the moment.`}
            </p>
            {filter === "all" && (
              <Link to="/profile">
                <Button>Complete Profile</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {job.service?.name || "Cleaning Service"}
                      </h3>
                      <p className="text-sm text-gray-500">Job #{job.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {capitalizeFirst(job.status)}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(job.totalAmount || job.total_amount)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {formatDateTime(
                      job.scheduledDate || job.booking_date
                    )} at {job.scheduledTime || job.booking_time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {job.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {job.customer?.firstName || job.customer_first_name}{" "}
                    {job.customer?.lastName || job.customer_last_name}
                  </div>
                </div>

                {/* Customer Contact Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {job.customer?.firstName || job.customer_first_name}{" "}
                      {job.customer?.lastName || job.customer_last_name}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {job.customer?.phone ||
                        job.customer_phone ||
                        "Not provided"}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Full Address:</strong> {job.address}, {job.city},{" "}
                      {job.state} {job.zipCode || job.zip_code}
                    </p>
                  </div>
                </div>

                {/* Special Instructions */}
                {job.specialInstructions && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Special Instructions
                    </h4>
                    <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
                      {job.specialInstructions}
                    </p>
                  </div>
                )}

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2 font-medium">
                      {job.durationHours || job.duration_hours} hours
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Status:</span>
                    <span
                      className={`ml-2 font-medium ${
                        job.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {capitalizeFirst(
                        job.paymentStatus || job.payment_status || "pending"
                      )}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  {getJobActions(job)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
