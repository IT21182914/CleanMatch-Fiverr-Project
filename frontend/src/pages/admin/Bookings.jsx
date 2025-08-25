import { useState, useEffect, useCallback } from "react";
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard, LoadingTableRow } from "../../components/ui/Loading";
import { adminAPI } from "../../lib/api";
import {
  formatDateTime,
  formatCurrency,
  getStatusColor,
  capitalizeFirst,
} from "../../lib/utils";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
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

  // Cleaner assignment modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [availableCleaners, setAvailableCleaners] = useState([]);
  const [loadingCleaners, setLoadingCleaners] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchTerm,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching bookings with filters:", filters);
      const response = await adminAPI.getBookings(filters);
      console.log("Bookings API response:", response.data);
      setBookings(response.data.bookings);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

  // Handle cleaner assignment
  const openAssignModal = async (booking) => {
    setSelectedBooking(booking);
    setSelectedCleaner("");
    setAssignModalOpen(true);
    await fetchAvailableCleaners();
  };

  const fetchAvailableCleaners = async () => {
    try {
      setLoadingCleaners(true);
      // Get all active cleaners
      const response = await adminAPI.getUsers({
        role: "cleaner",
        status: "active",
        limit: 100,
      });
      setAvailableCleaners(response.data.users);
    } catch (error) {
      console.error("Error fetching cleaners:", error);
    } finally {
      setLoadingCleaners(false);
    }
  };

  const handleAssignCleaner = async () => {
    if (!selectedCleaner || !selectedBooking) return;

    try {
      setAssigning(true);
      await adminAPI.assignCleaner(selectedBooking.id, selectedCleaner);

      // Refresh bookings
      await fetchBookings();

      // Close modal
      setAssignModalOpen(false);

      // Show success message (you can add a toast notification here)
      const action = selectedBooking.cleaner_first_name
        ? "reassigned"
        : "assigned";
      console.log(`Cleaner ${action} successfully!`);

      // Reset state
      setSelectedBooking(null);
      setSelectedCleaner("");
    } catch (error) {
      console.error("Error assigning cleaner:", error);
      // Show error message (you can add a toast notification here)
    } finally {
      setAssigning(false);
    }
  };

  const getPaymentStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Booking Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage all cleaning service bookings.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
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
                <dd className="text-lg font-medium text-gray-900">
                  {pagination.total}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {bookings.filter((b) => b.status === "pending").length}
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
                  Completed
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {bookings.filter((b) => b.status === "completed").length}
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
                  Revenue (Paid)
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(
                    bookings
                      .filter((b) => b.payment_status === "paid")
                      .reduce((sum, b) => sum + parseFloat(b.total_amount), 0)
                  )}
                </dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="pending_cleaner_response">
                Pending Cleaner Response
              </option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>

            <Select
              value={filters.paymentStatus}
              onChange={(e) =>
                handleFilterChange("paymentStatus", e.target.value)
              }
            >
              <option value="">All Payment Status</option>
              <option value="pending">Payment Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  status: "",
                  paymentStatus: "",
                  search: "",
                  page: 1,
                  limit: 20,
                });
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Bookings ({pagination.total})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cleaner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <LoadingTableRow key={index} columns={6} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500">
                {filters.search || filters.status || filters.paymentStatus
                  ? "Try adjusting your filters."
                  : "No bookings have been made yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cleaner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{booking.id} - {booking.service_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDateTime(booking.booking_date)} -{" "}
                            {booking.booking_time}
                          </div>
                          <div className="text-sm text-gray-500">
                            Duration: {booking.duration_hours}h
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.address}, {booking.city}, {booking.state}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customer_first_name}{" "}
                            {booking.customer_last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer_email}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.cleaner_first_name ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.cleaner_first_name}{" "}
                              {booking.cleaner_last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.cleaner_email}
                            </div>
                            {/* Allow admin to reassign cleaner for non-completed bookings */}
                            {booking.status !== "completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 text-blue-600 hover:text-blue-800"
                                onClick={() => openAssignModal(booking)}
                                title="Reassign cleaner"
                              >
                                <UserPlusIcon className="h-3 w-3 mr-1" />
                                Reassign
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500">
                              Unassigned
                            </span>
                            {booking.status !== "completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => openAssignModal(booking)}
                              >
                                <UserPlusIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {capitalizeFirst(booking.status)}
                          </span>
                          <br />
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(
                              booking.payment_status
                            )}`}
                          >
                            {capitalizeFirst(booking.payment_status)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.total_amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {formatDateTime(booking.created_at)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>

                          {/* Show assign button for non-completed bookings without cleaner */}
                          {!booking.cleaner_first_name &&
                            booking.status !== "completed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openAssignModal(booking)}
                              >
                                <UserPlusIcon className="h-4 w-4" />
                              </Button>
                            )}

                          {/* Show reassign button for non-completed bookings with cleaner */}
                          {booking.cleaner_first_name &&
                            booking.status !== "completed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openAssignModal(booking)}
                                title="Reassign cleaner"
                              >
                                <UserPlusIcon className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
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
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-r-none"
                >
                  Previous
                </Button>

                {[...Array(Math.min(pagination.pages, 5))].map((_, index) => {
                  const page = index + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "primary" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className="rounded-none"
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
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

      {/* Cleaner Assignment Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedBooking?.cleaner_first_name ? "Reassign" : "Assign"}{" "}
                Cleaner to Booking #{selectedBooking?.id}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedBooking(null);
                  setSelectedCleaner("");
                }}
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <p>
                  <strong>Service:</strong> {selectedBooking?.service_name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedBooking &&
                    formatDateTime(selectedBooking.booking_date)}{" "}
                  - {selectedBooking?.booking_time}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedBooking?.duration_hours}h
                </p>
                <p>
                  <strong>Location:</strong> {selectedBooking?.address},{" "}
                  {selectedBooking?.city}, {selectedBooking?.state}
                </p>
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedBooking?.customer_first_name}{" "}
                  {selectedBooking?.customer_last_name}
                </p>
                {selectedBooking?.cleaner_first_name && (
                  <p>
                    <strong>Currently Assigned:</strong>{" "}
                    {selectedBooking.cleaner_first_name}{" "}
                    {selectedBooking.cleaner_last_name} (
                    {selectedBooking.cleaner_email})
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Cleaner
              </label>

              {selectedBooking?.cleaner_first_name && (
                <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This will reassign the booking from the current cleaner
                    to the selected cleaner.
                  </p>
                </div>
              )}

              {loadingCleaners ? (
                <div className="text-sm text-gray-500">
                  Loading available cleaners...
                </div>
              ) : (
                <Select
                  value={selectedCleaner}
                  onChange={(e) => setSelectedCleaner(e.target.value)}
                  className="w-full"
                >
                  <option value="">Choose a cleaner...</option>
                  {availableCleaners.map((cleaner) => {
                    const isCurrentlyAssigned =
                      selectedBooking?.cleaner_first_name &&
                      cleaner.id.toString() ===
                        selectedBooking?.cleaner_id?.toString();

                    return (
                      <option
                        key={cleaner.id}
                        value={cleaner.id}
                        className={isCurrentlyAssigned ? "bg-yellow-50" : ""}
                      >
                        {cleaner.first_name} {cleaner.last_name} -{" "}
                        {cleaner.email}
                        {cleaner.rating && ` (${cleaner.rating}⭐)`}
                        {isCurrentlyAssigned && " (Currently Assigned)"}
                      </option>
                    );
                  })}
                </Select>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedBooking(null);
                  setSelectedCleaner("");
                }}
                disabled={assigning}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAssignCleaner}
                disabled={!selectedCleaner || assigning}
              >
                {assigning
                  ? selectedBooking?.cleaner_first_name
                    ? "Reassigning..."
                    : "Assigning..."
                  : selectedBooking?.cleaner_first_name
                  ? "Reassign Cleaner"
                  : "Assign Cleaner"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
