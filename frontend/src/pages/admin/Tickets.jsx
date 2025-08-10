import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import TicketList from "../../components/tickets/TicketList";
import { getTicketStats } from "../../lib/api";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const AdminTickets = () => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getTicketStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load ticket statistics");
    } finally {
      setLoadingStats(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      red: "bg-red-50 text-red-700 border-red-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return (
      <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm font-medium">{title}</div>
        {subtitle && <div className="text-xs opacity-75 mt-1">{subtitle}</div>}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/admin" className="hover:text-blue-600">
            Admin Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span>Support Tickets</span>
        </nav>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Support Ticket Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer support requests and track resolution times
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      {loadingStats ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      ) : stats ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Tickets"
              value={stats.overall?.total_tickets || 0}
              subtitle={`${stats.overall?.tickets_this_week || 0} this week`}
              color="blue"
            />
            <StatCard
              title="Open Tickets"
              value={stats.overall?.open_tickets || 0}
              subtitle={`${stats.overall?.urgent_tickets || 0} urgent`}
              color="red"
            />
            <StatCard
              title="In Progress"
              value={stats.overall?.in_progress_tickets || 0}
              subtitle={`${
                stats.overall?.waiting_customer_tickets || 0
              } waiting for customer`}
              color="yellow"
            />
            <StatCard
              title="Resolved"
              value={stats.overall?.resolved_tickets || 0}
              subtitle={`${stats.overall?.closed_tickets || 0} closed`}
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                By Category
              </h3>
              <div className="space-y-3">
                {stats.categories?.map((category) => (
                  <div
                    key={category.category}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {category.category.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({category.resolved_count}/{category.count} resolved)
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Average Response Times
              </h3>
              <div className="space-y-3">
                {stats.timings?.avg_first_response_hours && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">First Response</span>
                    <span className="font-medium text-gray-900">
                      {Math.round(stats.timings.avg_first_response_hours * 10) /
                        10}{" "}
                      hours
                    </span>
                  </div>
                )}
                {stats.timings?.avg_resolution_hours && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Resolution</span>
                    <span className="font-medium text-gray-900">
                      {Math.round(stats.timings.avg_resolution_hours * 10) / 10}{" "}
                      hours
                    </span>
                  </div>
                )}
                {stats.timings?.avg_closure_hours && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Closure</span>
                    <span className="font-medium text-gray-900">
                      {Math.round(stats.timings.avg_closure_hours * 10) / 10}{" "}
                      hours
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Workload */}
          {stats.adminWorkload && stats.adminWorkload.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Workload
              </h3>
              <div className="space-y-3">
                {stats.adminWorkload.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-900">
                      {admin.first_name} {admin.last_name}
                    </span>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-red-600">
                        {admin.open_assigned_tickets}
                      </span>
                      <span className="text-gray-400 mx-2">/</span>
                      <span>{admin.assigned_tickets} total</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Tickets List */}
      <TicketList userRole="admin" />
    </div>
  );
};

export default AdminTickets;
