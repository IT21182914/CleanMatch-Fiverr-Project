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
        className={`p-6 rounded-lg border ${colorClasses[color]} transition-all hover:shadow-md`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold mb-1">{value || 0}</div>
            <div className="text-sm font-medium">{title}</div>
            {subtitle && (
              <div className="text-xs opacity-75 mt-1">{subtitle}</div>
            )}
          </div>
          {trend && (
            <div
              className={`text-sm font-medium ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.positive ? "↗" : "↘"} {trend.value}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loadingStats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">
            Loading ticket management dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/admin" className="hover:text-blue-600">
            Admin Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Ticket Management</span>
        </nav>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Ticket Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage customer support tickets and complaints
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={async () => {
                const ticketsResponse = await getAdminTickets(filters);
                setTickets(ticketsResponse.data.data);
                setPagination(ticketsResponse.data.pagination);
                toast.success("Tickets refreshed");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              to="/admin/tickets/stats"
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">SLA Alerts</h3>
                <div className="mt-1 text-sm text-red-700">
                  {stats.sla.overdue_first_response > 0 && (
                    <span className="mr-4">
                      {stats.sla.overdue_first_response} tickets overdue for
                      first response
                    </span>
                  )}
                  {stats.sla.overdue_resolution > 0 && (
                    <span>
                      {stats.sla.overdue_resolution} tickets overdue for
                      resolution
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Filters */}
      <AdminTicketFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        stats={stats}
        adminUsers={adminUsers}
      />

      {/* Ticket List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Tickets ({pagination.total || 0})
            </h2>

            {/* Bulk Actions */}
            {selectedTickets.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedTickets.length} selected
                </span>
                <button
                  onClick={() =>
                    setStatusModal({
                      show: true,
                      ticket: { bulk: true, ids: selectedTickets },
                    })
                  }
                  className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  Bulk Update Status
                </button>
                <button
                  onClick={() =>
                    setAssignModal({
                      show: true,
                      ticket: { bulk: true, ids: selectedTickets },
                    })
                  }
                  className="px-3 py-1 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100"
                >
                  Bulk Assign
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <Ticket className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No tickets found</p>
            <p className="text-gray-400">
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
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i;
                    if (pageNum > pagination.pages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
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

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
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
  );
};

export default AdminTicketManagement;
