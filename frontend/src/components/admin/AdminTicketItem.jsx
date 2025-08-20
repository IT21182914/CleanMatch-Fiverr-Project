import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";

const AdminTicketItem = ({
  ticket,
  onStatusUpdate,
  onAssign,
  onSelect,
  selected,
  adminUsers,
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const statusColors = {
    open: "bg-red-100 text-red-800 border-red-200",
    in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
    waiting_customer: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200",
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

  const priorityLabels = {
    low: "Low",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const getSLAStatus = (ticket) => {
    const now = new Date();
    const opened = new Date(ticket.openedAt);
    const hoursOpen = (now - opened) / (1000 * 60 * 60);

    // First response SLA (4 hours)
    if (!ticket.firstResponseAt && hoursOpen > 4) {
      return {
        type: "overdue_response",
        message: "Overdue for first response",
      };
    }

    // Resolution SLA (24 hours for normal, 4 hours for urgent)
    const resolutionSLA = ticket.priority === "urgent" ? 4 : 24;
    if (
      !ticket.resolvedAt &&
      hoursOpen > resolutionSLA &&
      ticket.status !== "waiting_customer"
    ) {
      return { type: "overdue_resolution", message: "Overdue for resolution" };
    }

    return null;
  };

  const slaStatus = getSLAStatus(ticket);

  const handleQuickStatusChange = (newStatus) => {
    onStatusUpdate(newStatus, `Quick update to ${newStatus}`);
    setShowQuickActions(false);
  };

  const handleQuickAssign = (adminId) => {
    onAssign(adminId);
    setShowQuickActions(false);
  };

  return (
    <div
      className={`p-3 sm:p-6 hover:bg-gray-50 transition-colors ${
        selected ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
        />

        {/* Ticket Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Header - Mobile: Stack, Desktop: Inline */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <Link
                  to={`/admin/tickets/${ticket.id}`}
                  className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors flex-shrink-0"
                >
                  Ticket #{ticket.id}
                </Link>

                {/* Badges - Mobile: Wrap, Desktop: Inline */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      statusColors[ticket.status]
                    }`}
                  >
                    {statusLabels[ticket.status]}
                  </span>

                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      priorityColors[ticket.priority]
                    }`}
                  >
                    {priorityLabels[ticket.priority]}
                    {ticket.priority === "urgent" && " 🚨"}
                  </span>

                  {/* Category Badge - Hidden on very small screens */}
                  <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {categoryLabels[ticket.category]}
                  </span>
                </div>
              </div>

              {/* SLA Alert - Full width on mobile */}
              {slaStatus && (
                <div className="mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      slaStatus.type === "overdue_response"
                        ? "bg-red-100 text-red-800 animate-pulse"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    ⚠️ {slaStatus.message}
                  </span>
                </div>
              )}

              {/* Summary */}
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2 line-clamp-2">
                {ticket.summary}
              </h3>

              {/* Description Preview - Shorter on mobile */}
              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-1 sm:line-clamp-2">
                {ticket.description}
              </p>

              {/* Meta Information - Mobile: Stack, Desktop: Inline */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1 truncate">
                  👤{" "}
                  <strong className="truncate">
                    {ticket.customer.firstName} {ticket.customer.lastName}
                  </strong>
                </span>

                {ticket.booking && (
                  <span className="flex items-center gap-1 truncate">
                    🏠{" "}
                    <span className="truncate">
                      {ticket.booking.serviceName}
                    </span>
                  </span>
                )}

                {ticket.freelancer && (
                  <span className="flex items-center gap-1 truncate">
                    🧹{" "}
                    <span className="truncate">
                      {ticket.freelancer.firstName} {ticket.freelancer.lastName}
                    </span>
                  </span>
                )}

                <span className="flex items-center gap-1 flex-shrink-0">
                  🕒 Created {getTimeAgo(ticket.createdAt)}
                </span>

                {ticket.messageCount > 0 && (
                  <span className="flex items-center gap-1 flex-shrink-0">
                    💬 {ticket.messageCount} message
                    {ticket.messageCount !== 1 ? "s" : ""}
                  </span>
                )}

                {ticket.lastMessageAt && (
                  <span className="flex items-center gap-1 flex-shrink-0">
                    📝 Last activity {getTimeAgo(ticket.lastMessageAt)}
                  </span>
                )}
              </div>

              {/* Assignment Info - Mobile: Stack, Desktop: Space between */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center">
                  {ticket.assignedAdmin ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅
                      <span className="hidden sm:inline ml-1">
                        Assigned to {ticket.assignedAdmin.firstName}{" "}
                        {ticket.assignedAdmin.lastName}
                      </span>
                      <span className="sm:hidden ml-1">
                        {ticket.assignedAdmin.firstName}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠️ Unassigned
                    </span>
                  )}
                </div>

                {/* Quick Actions - Mobile: Touch-friendly */}
                <div className="relative">
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="flex items-center gap-1 p-2 min-h-[44px] sm:min-h-0 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Quick Actions"
                  >
                    <MoreHorizontal className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">⚡ Actions</span>
                    <span className="sm:hidden text-xs">Actions</span>
                  </button>

                  {/* Quick Actions Dropdown - Responsive positioning */}
                  {showQuickActions && (
                    <div className="absolute right-0 sm:right-0 mt-2 w-72 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="p-2">
                        {/* Status Actions */}
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-700 mb-2">
                            Update Status
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {ticket.status === "open" && (
                              <button
                                onClick={() =>
                                  handleQuickStatusChange("in_progress")
                                }
                                className="px-3 py-2 text-xs font-medium text-yellow-700 bg-yellow-50 rounded hover:bg-yellow-100 min-h-[36px] flex items-center"
                              >
                                Start Progress
                              </button>
                            )}
                            {(ticket.status === "open" ||
                              ticket.status === "in_progress") && (
                              <button
                                onClick={() =>
                                  handleQuickStatusChange("waiting_customer")
                                }
                                className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 min-h-[36px] flex items-center"
                              >
                                Wait Customer
                              </button>
                            )}
                            {ticket.status !== "resolved" &&
                              ticket.status !== "closed" && (
                                <button
                                  onClick={() =>
                                    handleQuickStatusChange("resolved")
                                  }
                                  className="px-3 py-2 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 min-h-[36px] flex items-center"
                                >
                                  Resolve
                                </button>
                              )}
                          </div>
                        </div>

                        {/* Assignment Actions */}
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-700 mb-2">
                            Assign To
                          </h4>
                          <div className="max-h-32 sm:max-h-24 overflow-y-auto">
                            {!ticket.assignedAdmin && (
                              <button
                                onClick={() => handleQuickAssign("self")}
                                className="w-full text-left px-3 py-2 text-xs text-blue-700 hover:bg-blue-50 rounded min-h-[36px] flex items-center"
                              >
                                Assign to Me
                              </button>
                            )}
                            {adminUsers.slice(0, 4).map((admin) => (
                              <button
                                key={admin.id}
                                onClick={() => handleQuickAssign(admin.id)}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded min-h-[36px] flex items-center justify-between ${
                                  ticket.assignedAdmin?.id === admin.id
                                    ? "text-green-700 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                <span className="truncate">{admin.name}</span>
                                {ticket.assignedAdmin?.id === admin.id && (
                                  <span className="ml-2 flex-shrink-0">✅</span>
                                )}
                              </button>
                            ))}
                            {ticket.assignedAdmin && (
                              <button
                                onClick={() => handleQuickAssign("unassign")}
                                className="w-full text-left px-3 py-2 text-xs text-red-700 hover:bg-red-50 rounded min-h-[36px] flex items-center"
                              >
                                Unassign
                              </button>
                            )}
                          </div>
                        </div>

                        {/* View Actions */}
                        <div className="pt-2 border-t border-gray-200">
                          <Link
                            to={`/admin/tickets/${ticket.id}`}
                            className="block w-full text-center px-3 py-3 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors min-h-[44px] flex items-center justify-center"
                            onClick={() => setShowQuickActions(false)}
                          >
                            View Full Ticket →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showQuickActions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowQuickActions(false)}
        />
      )}
    </div>
  );
};

export default AdminTicketItem;
