import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getTickets } from "../../lib/api";
import LoadingSpinner from "../shared/LoadingSpinner";

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
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Tickets List */}
      <div className="p-6">
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-2 text-gray-500">
              {userRole === "customer"
                ? "You haven't created any support tickets yet."
                : "No tickets match the current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800"
                      >
                        #{ticket.id}
                      </Link>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[ticket.status]
                        }`}
                      >
                        {statusLabels[ticket.status]}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          priorityColors[ticket.priority]
                        }`}
                      >
                        {ticket.priority}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {categoryLabels[ticket.category]}
                      </span>
                    </div>

                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      {ticket.summary}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {ticket.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        {userRole === "admin" && ticket.customer && (
                          <span>
                            Customer: {ticket.customer.firstName}{" "}
                            {ticket.customer.lastName}
                          </span>
                        )}
                        {ticket.booking && (
                          <span>
                            Booking: #{ticket.booking.id} -{" "}
                            {ticket.booking.serviceName}
                          </span>
                        )}
                        <span>{ticket.messageCount || 0} messages</span>
                      </div>
                      <div className="text-right">
                        <div>
                          {new Date(ticket.openedAt).toLocaleDateString()}
                        </div>
                        {ticket.assignedAdmin && userRole === "admin" && (
                          <div className="text-xs">
                            Assigned to: {ticket.assignedAdmin.firstName}{" "}
                            {ticket.assignedAdmin.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              {Math.min(
                (pagination.page - 1) * pagination.limit + 1,
                pagination.total
              )}{" "}
              to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} tickets
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i;
                if (pageNum > pagination.pages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      pageNum === pagination.page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
