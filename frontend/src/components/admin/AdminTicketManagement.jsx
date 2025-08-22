import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getAdminTickets,
  getAdminTicketStats,
  updateTicketStatus,
  assignTicket,
  getAdminUsers,
} from "../../lib/api";
import LoadingSpinner from "../shared/LoadingSpinner";
import AdminTicketFilters from "./AdminTicketFilters";
import AdminTicketItem from "./AdminTicketItem";
import TicketAssignModal from "./TicketAssignModal";
import StatusUpdateModal from "./StatusUpdateModal";
import {
  RefreshCcw,
  BarChart3,
  AlertTriangle,
  Ticket,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  UserX,
  Users,
  Archive,
} from "lucide-react";

const AdminTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [adminUsers, setAdminUsers] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
    assigned: "all",
    page: 1,
    limit: 20,
    sortBy: "created_at",
    sortOrder: "DESC",
  });

  const [pagination, setPagination] = useState({});

  // Modal states
  const [assignModal, setAssignModal] = useState({ show: false, ticket: null });
  const [statusModal, setStatusModal] = useState({ show: false, ticket: null });
  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => {
    console.log("useEffect triggered with filters:", filters);

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching tickets with filters:", filters);

        // Send all filters to backend - backend will handle "all" values properly
        console.log("Sending filters to backend:", filters);

        // Fetch tickets and stats in parallel
        const [ticketsResponse, statsResponse, adminResponse] =
          await Promise.all([
            getAdminTickets(filters),
            getAdminTicketStats(),
            adminUsers.length === 0
              ? getAdminUsers()
              : Promise.resolve({ data: { data: adminUsers } }),
          ]);

        console.log("Tickets response:", ticketsResponse.data);
        setTickets(ticketsResponse.data.data);
        setPagination(ticketsResponse.data.pagination);
        setStats(statsResponse.data.data);

        if (adminUsers.length === 0) {
          setAdminUsers(adminResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load tickets");
      } finally {
        setLoading(false);
        setLoadingStats(false);
      }
    };

    fetchData();
  }, [filters, adminUsers]);

  const handleFilterChange = (newFilters) => {
    console.log("Filter change received:", newFilters);
    console.log("Current filters before change:", filters);
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    console.log("Updated filters to be set:", updatedFilters);
    setFilters(updatedFilters);
    console.log("setFilters called with:", updatedFilters);
  };

  const handleStatusUpdate = async (ticketId, status, reason) => {
    try {
      await updateTicketStatus(ticketId, { status, reason });
      toast.success(`Ticket status updated to ${status}`);

      // Refresh tickets data
      const ticketsResponse = await getAdminTickets(filters);
      setTickets(ticketsResponse.data.data);
      setPagination(ticketsResponse.data.pagination);

      // Refresh stats
      const statsResponse = await getAdminTicketStats();
      setStats(statsResponse.data.data);

      setStatusModal({ show: false, ticket: null });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  const handleAssignTicket = async (ticketId, adminId) => {
    try {
      await assignTicket(ticketId, { adminId });
      toast.success(
        adminId === "unassign"
          ? "Ticket unassigned"
          : "Ticket assigned successfully"
      );

      // Refresh tickets data
      const ticketsResponse = await getAdminTickets(filters);
      setTickets(ticketsResponse.data.data);
      setPagination(ticketsResponse.data.pagination);

      // Refresh stats
      const statsResponse = await getAdminTicketStats();
      setStats(statsResponse.data.data);

      setAssignModal({ show: false, ticket: null });
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Failed to assign ticket");
    }
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    color = "blue",
    trend,
    icon: IconComponent,
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      yellow:
        "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
      red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      gray: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
      orange:
        "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
    };
    console.log(IconComponent);

    const iconColorClasses = {
      blue: "text-blue-600",
      green: "text-green-600",
      yellow: "text-yellow-600",
      red: "text-red-600",
      gray: "text-gray-600",
      orange: "text-orange-600",
    };

    return (
      <div
        className={`p-4 sm:p-6 rounded-xl border ${colorClasses[color]} transition-all duration-200 hover:shadow-lg cursor-pointer group`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg bg-white/50 group-hover:bg-white transition-colors ${iconColorClasses[color]}`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-2xl sm:text-3xl font-bold mb-1 leading-none">
                {value || 0}
              </div>
              <div className="text-sm font-semibold leading-tight mb-1">
                {title}
              </div>
              {subtitle && (
                <div className="text-xs opacity-75 leading-tight">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          {trend && (
            <div className="flex items-center space-x-1">
              {trend.positive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <div
                className={`text-sm font-medium ${
                  trend.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.value}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading Ticket Management Dashboard
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we fetch your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link
            to="/admin"
            className="hover:text-blue-600 transition-colors font-medium"
          >
            Admin Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Ticket Management</span>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ticket Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage customer support tickets and track resolution performance
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0">
              <button
                onClick={async () => {
                  const ticketsResponse = await getAdminTickets(filters);
                  setTickets(ticketsResponse.data.data);
                  setPagination(ticketsResponse.data.pagination);
                  toast.success("Data refreshed successfully");
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh Data
              </button>
              <Link
                to="/admin/tickets/stats"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                <BarChart3 className="w-4 h-4 text-white" />
                <span className="text-white">View Analytics</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
              title="Open Tickets"
              value={stats.general.open_tickets}
              subtitle="Require immediate attention"
              color="red"
              icon={AlertCircle}
            />
            <StatCard
              title="In Progress"
              value={stats.general.in_progress_tickets}
              subtitle="Currently being handled"
              color="yellow"
              icon={Clock}
            />
            <StatCard
              title="Urgent Priority"
              value={stats.general.urgent_tickets}
              subtitle="Critical issues"
              color="red"
              icon={AlertTriangle}
            />
            <StatCard
              title="Unassigned"
              value={stats.general.unassigned_tickets}
              subtitle="Awaiting assignment"
              color="gray"
              icon={UserX}
            />
            <StatCard
              title="Resolved"
              value={stats.general.resolved_tickets}
              subtitle="Completed this month"
              color="green"
              icon={CheckCircle}
            />
            <StatCard
              title="Total Tickets"
              value={stats.general.total_tickets}
              subtitle="All time record"
              color="blue"
              icon={Archive}
            />
          </div>
        )}

        {/* SLA Performance Alert */}
        {stats?.sla &&
          (stats.sla.overdue_first_response > 0 ||
            stats.sla.overdue_resolution > 0) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-1">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Service Level Agreement Violations
                  </h3>
                  <div className="text-sm text-red-700 space-y-1">
                    {stats.sla.overdue_first_response > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {stats.sla.overdue_first_response} tickets overdue for
                          first response
                        </span>
                      </div>
                    )}
                    {stats.sla.overdue_resolution > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>
                          {stats.sla.overdue_resolution} tickets overdue for
                          resolution
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Filters Section */}
        <div className="mb-6">
          <AdminTicketFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            stats={stats}
            adminUsers={adminUsers}
          />
        </div>

        {/* Main Ticket List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-gray-600" />
                  Support Tickets
                  <span className="ml-2 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {pagination.total || 0}
                  </span>
                </h2>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>

              {/* Bulk Actions */}
              {selectedTickets.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">
                      {selectedTickets.length} ticket
                      {selectedTickets.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() =>
                        setStatusModal({
                          show: true,
                          ticket: { bulk: true, ids: selectedTickets },
                        })
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-white" />
                      <span className="text-white">Update Status</span>
                    </button>
                    <button
                      onClick={() =>
                        setAssignModal({
                          show: true,
                          ticket: { bulk: true, ids: selectedTickets },
                        })
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-white">Bulk Assign</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tickets found
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Try adjusting your filters or check back later for new support
                requests.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <AdminTicketItem
                  key={ticket.id}
                  ticket={ticket}
                  onStatusUpdate={(status, reason) =>
                    handleStatusUpdate(ticket.id, status, reason)
                  }
                  onAssign={(adminId) => handleAssignTicket(ticket.id, adminId)}
                  onSelect={(selected) => {
                    if (selected) {
                      setSelectedTickets((prev) => [...prev, ticket.id]);
                    } else {
                      setSelectedTickets((prev) =>
                        prev.filter((id) => id !== ticket.id)
                      );
                    }
                  }}
                  selected={selectedTickets.includes(ticket.id)}
                  adminUsers={adminUsers}
                />
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Results Info */}
                <div className="text-sm text-gray-700 font-medium">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total.toLocaleString()} results
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, pagination.pages) },
                      (_, i) => {
                        const halfVisible = 2;
                        let startPage = Math.max(
                          1,
                          pagination.page - halfVisible
                        );
                        let endPage = Math.min(pagination.pages, startPage + 4);

                        if (endPage - startPage + 1 < 5) {
                          startPage = Math.max(1, endPage - 4);
                        }

                        const pageNum = startPage + i;
                        if (pageNum > endPage) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              pageNum === pagination.page
                                ? "text-white bg-blue-600 border border-blue-600"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <TicketAssignModal
          show={assignModal.show}
          ticket={assignModal.ticket}
          adminUsers={adminUsers}
          onAssign={handleAssignTicket}
          onClose={() => setAssignModal({ show: false, ticket: null })}
        />

        <StatusUpdateModal
          show={statusModal.show}
          ticket={statusModal.ticket}
          onUpdate={handleStatusUpdate}
          onClose={() => setStatusModal({ show: false, ticket: null })}
        />
      </div>
    </div>
  );
};

export default AdminTicketManagement;
