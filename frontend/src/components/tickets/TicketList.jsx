import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getTickets } from "../../lib/api";
import LoadingSpinner from "../shared/LoadingSpinner";
import BulkUpdateModal from "./BulkUpdateModal";

const TicketList = ({ userRole = "customer" }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({});
  const [isMobileView, setIsMobileView] = useState(false);

  // Bulk selection states (admin only)
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Mobile filters state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const statusColors = {
    open: "bg-red-100 text-red-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    waiting_customer: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    normal: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  const categoryLabels = {
    service_quality: "Service Quality",
    lateness: "Lateness",
    damage: "Damage",
    payment: "Payment Issues",
    other: "Other",
  };

  const statusLabels = {
    open: "Open",
    in_progress: "In Progress",
    waiting_customer: "Waiting for Customer",
    resolved: "Resolved",
    closed: "Closed",
  };

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.category) params.append("category", filters.category);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await getTickets(params.toString());
      setTickets(response.data.data || []);
      setPagination(response.data.pagination || {});

      // Reset bulk selection when tickets change
      setSelectedTickets([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
    // Close mobile filters after selection
    if (isMobileView) {
      setShowMobileFilters(false);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Bulk selection handlers (admin only)
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedTickets(tickets.map((ticket) => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleTicketSelect = (ticketId, checked) => {
    if (checked) {
      setSelectedTickets((prev) => [...prev, ticketId]);
    } else {
      setSelectedTickets((prev) => prev.filter((id) => id !== ticketId));
      setSelectAll(false);
    }
  };

  const handleBulkUpdate = () => {
    if (selectedTickets.length === 0) {
      toast.error("Please select at least one ticket");
      return;
    }
    setShowBulkModal(true);
  };

  const handleBulkSuccess = () => {
    fetchTickets();
    setSelectedTickets([]);
    setSelectAll(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Mobile Filter Toggle */}
      <div className="block md:hidden px-4 pt-4 pb-2 border-b border-gray-200">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            Filters
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              showMobileFilters ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <div
        className={`border-b border-gray-200 ${
          showMobileFilters || !isMobileView ? "block" : "hidden"
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_customer">Waiting for Customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="service_quality">Service Quality</option>
                  <option value="lateness">Lateness</option>
                  <option value="damage">Damage</option>
                  <option value="payment">Payment Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions for Admin */}
            {userRole === "admin" && (
              <div className="w-full sm:w-auto">
                {selectedTickets.length > 0 && (
                  <button
                    onClick={handleBulkUpdate}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Bulk Update ({selectedTickets.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="p-4 sm:p-6">
        {tickets.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <svg
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tickets found
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              {userRole === "customer"
                ? "You haven't created any support tickets yet."
                : "No tickets match the current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Bulk Selection Header (Admin Only) */}
            {userRole === "admin" && tickets.length > 0 && (
              <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-200">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-700">
                    Select all {tickets.length} tickets
                  </span>
                </label>
                {selectedTickets.length > 0 && (
                  <span className="text-xs sm:text-sm text-gray-600">
                    {selectedTickets.length} tickets selected
                  </span>
                )}
              </div>
            )}

            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox for admin */}
                  {userRole === "admin" && (
                    <div className="flex items-start pt-1 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={(e) =>
                          handleTicketSelect(ticket.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Header - Mobile stacked, Desktop inline */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="text-base sm:text-lg font-medium text-blue-600 hover:text-blue-800 flex-shrink-0"
                        >
                          #{ticket.id}
                        </Link>
                        <div className="flex flex-wrap gap-1 sm:gap-2 min-w-0">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              statusColors[ticket.status]
                            }`}
                          >
                            {statusLabels[ticket.status]}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              priorityColors[ticket.priority]
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
                        <span className="bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                          {categoryLabels[ticket.category]}
                        </span>
                        <span className="whitespace-nowrap">
                          {new Date(ticket.openedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2 line-clamp-2">
                      {ticket.summary}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">
                      {ticket.description}
                    </p>

                    {/* Footer Info - Mobile stacked, Desktop inline */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-500">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        {userRole === "admin" && ticket.customer && (
                          <span className="truncate">
                            Customer: {ticket.customer.firstName}{" "}
                            {ticket.customer.lastName}
                          </span>
                        )}
                        {ticket.booking && (
                          <span className="truncate">
                            Booking: #{ticket.booking.id} -{" "}
                            {ticket.booking.serviceName}
                          </span>
                        )}
                        <span className="flex-shrink-0">
                          {ticket.messageCount || 0} messages
                        </span>
                      </div>

                      {ticket.assignedAdmin && userRole === "admin" && (
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs">
                            Assigned to: {ticket.assignedAdmin.firstName}{" "}
                            {ticket.assignedAdmin.lastName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Responsive Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing{" "}
              {Math.min(
                (pagination.page - 1) * pagination.limit + 1,
                pagination.total
              )}{" "}
              to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} tickets
            </div>

            <div className="flex justify-center gap-1 sm:gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] h-8 sm:h-auto flex items-center justify-center"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">←</span>
              </button>

              {/* Show fewer page numbers on mobile */}
              {[...Array(Math.min(isMobileView ? 3 : 5, pagination.pages))].map(
                (_, i) => {
                  const pageNum =
                    Math.max(1, pagination.page - (isMobileView ? 1 : 2)) + i;
                  if (pageNum > pagination.pages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-md min-w-[44px] h-8 sm:h-auto flex items-center justify-center ${
                        pageNum === pagination.page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] h-8 sm:h-auto flex items-center justify-center"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">→</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Update Modal */}
      {userRole === "admin" && (
        <BulkUpdateModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          selectedTickets={selectedTickets}
          onSuccess={handleBulkSuccess}
        />
      )}
    </div>
  );
};

export default TicketList;
