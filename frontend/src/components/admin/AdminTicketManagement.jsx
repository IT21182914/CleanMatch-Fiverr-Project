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
import { RefreshCcw, BarChart3, AlertTriangle, Ticket } from "lucide-react";

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
    console.log("🔄 useEffect triggered with filters:", filters);

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching tickets with filters:", filters);

        // Send all filters to backend - backend will handle "all" values properly
        console.log("🧹 Sending filters to backend:", filters);

        // Fetch tickets and stats in parallel
        const [ticketsResponse, statsResponse, adminResponse] =
          await Promise.all([
            getAdminTickets(filters),
            getAdminTicketStats(),
            adminUsers.length === 0
              ? getAdminUsers()
              : Promise.resolve({ data: { data: adminUsers } }),
          ]);

        console.log("✅ Tickets response:", ticketsResponse.data);
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
    console.log("🎛️ Filter change received:", newFilters);
    console.log("🔍 Current filters before change:", filters);
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    console.log("📝 Updated filters to be set:", updatedFilters);
    setFilters(updatedFilters);
    console.log("✅ setFilters called with:", updatedFilters);
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

  const StatCard = ({ title, value, subtitle, color = "blue", trend }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      red: "bg-red-50 text-red-700 border-red-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
    };

    return (
      <div
        className={`p-3 xs:p-4 sm:p-6 rounded-lg border ${colorClasses[color]} transition-all hover:shadow-md`}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 leading-none">
              {value || 0}
            </div>
            <div className="text-xs xs:text-sm font-medium leading-tight">
              {title}
            </div>
            {subtitle && (
              <div className="text-xs opacity-75 mt-1 leading-tight">
                {subtitle}
              </div>
            )}
          </div>
          {trend && (
            <div
              className={`text-xs xs:text-sm font-medium ${
                trend.positive ? "text-green-600" : "text-red-600"
              } ml-2 flex-shrink-0`}
            >
              <div className="whitespace-nowrap">
                {trend.positive ? "↗" : "↘"} {trend.value}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loadingStats) {
    return (
      <div className="container mx-auto px-2 xs:px-4 py-4 xs:py-8">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 text-sm xs:text-base">
            Loading ticket management dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 xs:px-4 py-4 xs:py-6 sm:py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-4 xs:mb-6">
        <nav className="text-xs xs:text-sm text-gray-600 mb-2 xs:mb-3 sm:mb-4 overflow-x-auto">
          <div className="flex items-center whitespace-nowrap">
            <Link to="/admin" className="hover:text-blue-600 transition-colors">
              Admin Dashboard
            </Link>
            <span className="mx-1 xs:mx-2">/</span>
            <span className="text-gray-900 font-medium">Ticket Management</span>
          </div>
        </nav>

        <div className="flex flex-col gap-3 xs:gap-4">
          <div>
            <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight break-words">
              Ticket Management
            </h1>
            <p className="text-gray-600 mt-1 xs:mt-2 text-xs xs:text-sm sm:text-base leading-tight">
              Manage customer support tickets and complaints
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            <button
              onClick={async () => {
                const ticketsResponse = await getAdminTickets(filters);
                setTickets(ticketsResponse.data.data);
                setPagination(ticketsResponse.data.pagination);
                toast.success("Tickets refreshed");
              }}
              className="flex-1 xs:flex-none px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0" />
              <span>Refresh</span>
            </button>
            <Link
              to="/admin/tickets/stats"
              className="flex-1 xs:flex-none px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0" />
              <span className="xs:hidden">Stats</span>
              <span className="hidden xs:inline">Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-6 sm:mb-8">
          <StatCard
            title="Open Tickets"
            value={stats.general.open_tickets}
            subtitle="Needs attention"
            color="red"
          />
          <StatCard
            title="In Progress"
            value={stats.general.in_progress_tickets}
            subtitle="Being handled"
            color="yellow"
          />
          <StatCard
            title="Urgent Priority"
            value={stats.general.urgent_tickets}
            subtitle="High priority"
            color="red"
          />
          <StatCard
            title="Unassigned"
            value={stats.general.unassigned_tickets}
            subtitle="Need assignment"
            color="gray"
          />
          <StatCard
            title="Resolved"
            value={stats.general.resolved_tickets}
            subtitle="This month"
            color="green"
          />
          <StatCard
            title="Total Tickets"
            value={stats.general.total_tickets}
            subtitle="All time"
            color="blue"
          />
        </div>
      )}

      {/* SLA Performance Alert */}
      {stats?.sla &&
        (stats.sla.overdue_first_response > 0 ||
          stats.sla.overdue_resolution > 0) && (
          <div className="mb-4 xs:mb-6 p-3 xs:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2 xs:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 xs:w-5 xs:h-5 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs xs:text-sm font-medium text-red-800 mb-1">
                  SLA Alerts
                </h3>
                <div className="text-xs xs:text-sm text-red-700 space-y-1">
                  {stats.sla.overdue_first_response > 0 && (
                    <div>
                      {stats.sla.overdue_first_response} tickets overdue for
                      first response
                    </div>
                  )}
                  {stats.sla.overdue_resolution > 0 && (
                    <div>
                      {stats.sla.overdue_resolution} tickets overdue for
                      resolution
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Filters */}
      <div className="mb-4 xs:mb-6">
        <AdminTicketFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          stats={stats}
          adminUsers={adminUsers}
        />
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-b border-gray-200">
          <div className="flex flex-col gap-3 xs:gap-4">
            <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900">
              Tickets ({pagination.total || 0})
            </h2>

            {/* Bulk Actions */}
            {selectedTickets.length > 0 && (
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 p-2 xs:p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-xs xs:text-sm text-blue-700 font-medium">
                  {selectedTickets.length} ticket
                  {selectedTickets.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                  <button
                    onClick={() =>
                      setStatusModal({
                        show: true,
                        ticket: { bulk: true, ids: selectedTickets },
                      })
                    }
                    className="px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() =>
                      setAssignModal({
                        show: true,
                        ticket: { bulk: true, ids: selectedTickets },
                      })
                    }
                    className="px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-green-700 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    Bulk Assign
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-8 xs:py-12 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 text-xs xs:text-sm sm:text-base">
              Loading tickets...
            </p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-8 xs:py-12 text-center px-4">
            <div className="flex justify-center mb-4">
              <Ticket className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm xs:text-base sm:text-lg mb-2">
              No tickets found
            </p>
            <p className="text-gray-400 text-xs xs:text-sm sm:text-base">
              Try adjusting your filters or check back later.
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

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3 xs:gap-4">
              {/* Results info */}
              <div className="text-xs xs:text-sm text-gray-700 text-center xs:text-left">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </div>

              {/* Pagination controls */}
              <div className="flex justify-center xs:justify-end">
                <div className="flex items-center gap-1 xs:gap-2 overflow-x-auto">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="flex-shrink-0 px-2 xs:px-3 py-1 xs:py-2 text-xs xs:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="xs:hidden">←</span>
                    <span className="hidden xs:inline">Previous</span>
                  </button>

                  {/* Page numbers - responsive count */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      {
                        length: Math.min(
                          window.innerWidth < 480
                            ? 3
                            : window.innerWidth < 640
                            ? 4
                            : 5,
                          pagination.pages
                        ),
                      },
                      (_, i) => {
                        const maxVisible =
                          window.innerWidth < 480
                            ? 3
                            : window.innerWidth < 640
                            ? 4
                            : 5;
                        const halfVisible = Math.floor(maxVisible / 2);
                        let startPage = Math.max(
                          1,
                          pagination.page - halfVisible
                        );
                        let endPage = Math.min(
                          pagination.pages,
                          startPage + maxVisible - 1
                        );

                        if (endPage - startPage + 1 < maxVisible) {
                          startPage = Math.max(1, endPage - maxVisible + 1);
                        }

                        const pageNum = startPage + i;
                        if (pageNum > endPage) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`flex-shrink-0 px-2 xs:px-3 py-1 xs:py-2 text-xs xs:text-sm font-medium rounded-lg transition-colors ${
                              pageNum === pagination.page
                                ? "text-blue-700 bg-blue-50 border border-blue-200"
                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="flex-shrink-0 px-2 xs:px-3 py-1 xs:py-2 text-xs xs:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="xs:hidden">→</span>
                    <span className="hidden xs:inline">Next</span>
                  </button>
                </div>
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
  );
};

export default AdminTicketManagement;
