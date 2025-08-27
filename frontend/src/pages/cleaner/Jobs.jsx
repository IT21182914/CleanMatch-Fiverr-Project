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
  const [accepting, setAccepting] = useState({});
  const [declining, setDeclining] = useState({});
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

  const handleAcceptJob = async (jobId, event) => {
    // Enhanced mobile event handling
    if (event) {
      event.preventDefault();
      event.stopPropagation();

      // Mobile-specific touch event handling
      if (event.type === "touchend") {
        event.preventDefault();
      }
    }

    // Prevent multiple clicks/touches - enhanced check
    if (accepting[jobId] || declining[jobId] || updating[jobId]) {
      console.log("🚫 Accept button blocked - operation in progress");
      return;
    }

    console.log("🔄 Starting accept job process for job:", jobId);

    try {
      setAccepting((prev) => ({ ...prev, [jobId]: true }));
      const job = jobs.find((j) => j.id === jobId);

      if (!job) {
        throw new Error("Job not found");
      }

      console.log("📝 Job details:", { id: job.id, status: job.status });

      // Use appropriate API based on job status
      if (job.status === "pending_cleaner_response") {
        console.log("📡 Calling acceptBooking API...");
        const response = await bookingsAPI.acceptBooking(jobId);
        console.log("✅ Accept booking response:", response);
      } else {
        console.log("📡 Calling updateStatus API...");
        const response = await bookingsAPI.updateStatus(jobId, "confirmed");
        console.log("✅ Update status response:", response);
      }

      // Update job in local state
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "confirmed" } : job
        )
      );

      console.log("✅ Job accepted successfully");
    } catch (error) {
      console.error("❌ Error accepting job:", error);

      // Enhanced error logging for mobile debugging
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });

      // Show user-friendly error (you might want to add a toast notification here)
      alert(`Failed to accept job: ${error.message}`);
    } finally {
      setAccepting((prev) => ({ ...prev, [jobId]: false }));
      console.log("🔚 Accept job process completed for job:", jobId);
    }
  };

  const handleRejectJob = async (jobId, event) => {
    // Prevent any default behavior and event propagation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Prevent multiple clicks
    if (accepting[jobId] || declining[jobId]) return;

    try {
      setDeclining((prev) => ({ ...prev, [jobId]: true }));
      const job = jobs.find((j) => j.id === jobId);

      // Use appropriate API based on job status
      if (job.status === "pending_cleaner_response") {
        await bookingsAPI.rejectBooking(jobId, "Unable to take this booking");

        // Remove job from local state as it's no longer assigned to this cleaner
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
      } else {
        await bookingsAPI.updateStatus(jobId, "cancelled");

        // Update job in local state
        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobId ? { ...job, status: "cancelled" } : job
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting job:", error);
      // Optionally show toast notification for error
    } finally {
      setDeclining((prev) => ({ ...prev, [jobId]: false }));
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
    if (filter === "pending")
      return (
        job.status === "pending" || job.status === "pending_cleaner_response"
      );
    return job.status === filter;
  });

  const statusCounts = {
    all: jobs.length,
    pending: jobs.filter(
      (j) => j.status === "pending" || j.status === "pending_cleaner_response"
    ).length,
    confirmed: jobs.filter((j) => j.status === "confirmed").length,
    in_progress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    cancelled: jobs.filter((j) => j.status === "cancelled").length,
  };

  const getJobActions = (job) => {
    const actions = [];

    if (job.status === "pending" || job.status === "pending_cleaner_response") {
      actions.push(
        <Button
          key="accept"
          size="sm"
          variant="success"
          loading={accepting[job.id]}
          onClick={(e) => {
            console.log("🖱️ Accept button clicked (onClick)");
            handleAcceptJob(job.id, e);
          }}
          onTouchStart={(e) => {
            console.log("👆 Accept button touch start");
            e.preventDefault();
          }}
          onTouchEnd={(e) => {
            console.log("👆 Accept button touch end");
            e.preventDefault();
            e.stopPropagation();
            handleAcceptJob(job.id, e);
          }}
          disabled={declining[job.id] || updating[job.id]}
          className="flex items-center justify-center min-h-[44px] w-full sm:w-auto px-4 py-3 touch-manipulation select-none"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        >
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          <span className="text-xs sm:text-sm">Accept</span>
        </Button>
      );
      actions.push(
        <Button
          key="reject"
          size="sm"
          variant="outline"
          loading={declining[job.id]}
          onClick={(e) => {
            console.log("🖱️ Decline button clicked (onClick)");
            handleRejectJob(job.id, e);
          }}
          onTouchStart={(e) => {
            console.log("👆 Decline button touch start");
            e.preventDefault();
          }}
          onTouchEnd={(e) => {
            console.log("👆 Decline button touch end");
            e.preventDefault();
            e.stopPropagation();
            handleRejectJob(job.id, e);
          }}
          disabled={accepting[job.id] || updating[job.id]}
          className="flex items-center justify-center text-red-600 border-red-300 hover:bg-red-50 min-h-[44px] w-full sm:w-auto px-4 py-3 touch-manipulation select-none"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        >
          <XCircleIcon className="h-4 w-4 mr-1" />
          <span className="text-xs sm:text-sm">Decline</span>
        </Button>
      );
    }

    if (job.status === "confirmed") {
      actions.push(
        <Button
          key="start"
          size="sm"
          loading={updating[job.id]}
          onClick={(e) => {
            console.log("🖱️ Start Job button clicked");
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            handleStartJob(job.id);
          }}
          onTouchStart={(e) => {
            console.log("👆 Start Job button touch start");
            e.preventDefault();
          }}
          onTouchEnd={(e) => {
            console.log("👆 Start Job button touch end");
            e.preventDefault();
            e.stopPropagation();
            handleStartJob(job.id);
          }}
          disabled={accepting[job.id] || declining[job.id]}
          className="flex items-center justify-center min-h-[44px] w-full sm:w-auto px-4 py-3 touch-manipulation select-none"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        >
          <span className="text-xs sm:text-sm">Start Job</span>
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
          onClick={(e) => {
            console.log("🖱️ Mark Complete button clicked");
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            handleCompleteJob(job.id);
          }}
          onTouchStart={(e) => {
            console.log("👆 Mark Complete button touch start");
            e.preventDefault();
          }}
          onTouchEnd={(e) => {
            console.log("👆 Mark Complete button touch end");
            e.preventDefault();
            e.stopPropagation();
            handleCompleteJob(job.id);
          }}
          disabled={accepting[job.id] || declining[job.id]}
          className="flex items-center justify-center min-h-[44px] w-full sm:w-auto px-4 py-3 touch-manipulation select-none"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        >
          <span className="text-xs sm:text-sm">Mark Complete</span>
        </Button>
      );
    }

    actions.push(
      <Button
        key="view"
        size="sm"
        variant="ghost"
        className="flex items-center justify-center min-h-[44px] w-full sm:w-auto px-4 py-3 touch-manipulation select-none"
        style={{ touchAction: "manipulation" }}
      >
        <EyeIcon className="h-4 w-4 mr-1" />
        <span className="text-xs sm:text-sm">View</span>
      </Button>
    );

    return actions;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold leading-6 text-gray-900 sm:text-xl md:text-2xl lg:text-3xl lg:tracking-tight">
                My Jobs
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-2xl">
                Manage your cleaning assignments and track your work progress.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link to="/availability" className="block w-full sm:w-auto">
                <Button className="inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium">
                  <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden xs:inline">Update </span>Availability
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-3 sm:px-4 md:px-6">
            <nav className="-mb-px flex overflow-x-auto scrollbar-hide">
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
                  className={`whitespace-nowrap py-2 sm:py-3 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm flex-shrink-0 transition-colors duration-200 ${
                    filter === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.label.replace(/\s+/g, "")}
                  </span>
                  <span className="ml-1 bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full text-xs leading-tight">
                    {statusCounts[tab.key]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm">
                <LoadingCard />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <CardContent className="text-center py-8 sm:py-12 px-4">
              <BriefcaseIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {filter === "all" ? "No jobs yet" : `No ${filter} jobs`}
              </h3>
              <p className="text-sm text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto">
                {filter === "all"
                  ? "Complete your profile to start receiving job assignments."
                  : `You don't have any ${filter} jobs at the moment.`}
              </p>
              {filter === "all" && (
                <Link to="/profile">
                  <Button className="w-full sm:w-auto">Complete Profile</Button>
                </Link>
              )}
            </CardContent>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {/* Job Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <BriefcaseIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 truncate">
                          {job.service?.name || "Cleaning Service"}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Job #{job.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
                      <span
                        className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full text-center ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {capitalizeFirst(job.status)}
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900 text-right">
                        {formatCurrency(job.totalAmount || job.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-sm">
                        {formatDateTime(job.scheduledDate || job.booking_date)}
                        <span className="hidden sm:inline">
                          {" "}
                          at {job.scheduledTime || job.booking_time}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{job.address}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 sm:col-span-2 lg:col-span-1">
                      <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {job.customer?.firstName || job.customer_first_name}{" "}
                        {job.customer?.lastName || job.customer_last_name}
                      </span>
                    </div>
                  </div>

                  {/* Customer Contact Info */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="flex items-center text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {job.customer?.firstName || job.customer_first_name}{" "}
                          {job.customer?.lastName || job.customer_last_name}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {job.customer?.phone ||
                            job.customer_phone ||
                            "Not provided"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Full Address:</strong>{" "}
                        <span className="break-words">
                          {job.address}, {job.city}, {job.state}{" "}
                          {job.zipCode || job.zip_code}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {job.specialInstructions && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Special Instructions
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3 break-words">
                        {job.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Job Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                    <div className="bg-gray-50 rounded p-3">
                      <span className="text-gray-500 block mb-1">
                        Duration:
                      </span>
                      <span className="font-medium text-gray-900">
                        {job.durationHours || job.duration_hours} hours
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <span className="text-gray-500 block mb-1">
                        Payment Status:
                      </span>
                      <span
                        className={`font-medium ${
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
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-2 border-t border-gray-100 mt-3 sm:mt-4">
                    {getJobActions(job).map((action, index) => (
                      <div
                        key={index}
                        className="touch-manipulation w-full sm:w-auto"
                        style={{
                          WebkitTouchCallout: "none",
                          WebkitUserSelect: "none",
                          KhtmlUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                          userSelect: "none",
                        }}
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
