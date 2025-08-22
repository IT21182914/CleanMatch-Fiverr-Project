import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  User,
  Home,
  UserCheck,
  Clock,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Play,
  Pause,
  Check,
  UserX,
  ExternalLink,
  Users,
  Zap,
  Settings,
} from "lucide-react";

const AdminTicketItem = ({
  ticket,
  onStatusUpdate,
  onAssign,
  onSelect,
  selected,
  adminUsers,
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const statusConfig = {
    open: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: AlertCircle,
    },
    in_progress: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      icon: Clock,
    },
    waiting_customer: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: Pause,
    },
    resolved: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: CheckCircle,
    },
    closed: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: Check,
    },
  };

  const priorityConfig = {
    low: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      icon: null,
    },
    normal: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: null,
    },
    high: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      icon: AlertTriangle,
    },
    urgent: {
      bg: "bg-red-50",
      text: "text-red-700",
      icon: AlertTriangle,
    },
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
        urgent: true,
      };
    }

    // Resolution SLA (24 hours for normal, 4 hours for urgent)
    const resolutionSLA = ticket.priority === "urgent" ? 4 : 24;
    if (
      !ticket.resolvedAt &&
      hoursOpen > resolutionSLA &&
      ticket.status !== "waiting_customer"
    ) {
      return {
        type: "overdue_resolution",
        message: "Overdue for resolution",
        urgent: false,
      };
    }

    return null;
  };

  const slaStatus = getSLAStatus(ticket);
  const statusInfo = statusConfig[ticket.status];
  const priorityInfo = priorityConfig[ticket.priority];
  const StatusIcon = statusInfo.icon;
  const PriorityIcon = priorityInfo.icon;

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
      className={`p-4 sm:p-6 hover:bg-gray-50/50 transition-all duration-200 ${
        selected ? "bg-blue-50 border-l-4 border-blue-500" : ""
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Enhanced Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <Link
                  to={`/admin/tickets/${ticket.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                >
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  Ticket #{ticket.id}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {/* Status and Priority Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                  >
                    {StatusIcon && <StatusIcon className="w-3 h-3" />}
                    {statusLabels[ticket.status]}
                  </span>

                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${priorityInfo.bg} ${priorityInfo.text}`}
                  >
                    {PriorityIcon && <PriorityIcon className="w-3 h-3" />}
                    {priorityLabels[ticket.priority]}
                  </span>

                  {/* Category Badge */}
                  <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {categoryLabels[ticket.category]}
                  </span>
                </div>
              </div>

              {/* SLA Alert */}
              {slaStatus && (
                <div className="mb-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      slaStatus.urgent
                        ? "bg-red-100 text-red-800 border border-red-200 animate-pulse"
                        : "bg-orange-100 text-orange-800 border border-orange-200"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {slaStatus.message}
                  </div>
                </div>
              )}

              {/* Ticket Summary */}
              <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
                {ticket.summary}
              </h3>

              {/* Description Preview */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {ticket.description}
              </p>

              {/* Meta Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
                {/* Customer Info */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-medium truncate">
                    {ticket.customer.firstName} {ticket.customer.lastName}
                  </span>
                </div>

                {/* Service Info */}
                {ticket.booking && (
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {ticket.booking.serviceName}
                    </span>
                  </div>
                )}

                {/* Freelancer Info */}
                {ticket.freelancer && (
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {ticket.freelancer.firstName} {ticket.freelancer.lastName}
                    </span>
                  </div>
                )}

                {/* Created Time */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>Created {getTimeAgo(ticket.createdAt)}</span>
                </div>

                {/* Message Count */}
                {ticket.messageCount > 0 && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>
                      {ticket.messageCount} message
                      {ticket.messageCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {/* Last Activity */}
                {ticket.lastMessageAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>
                      Last activity {getTimeAgo(ticket.lastMessageAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Assignment and Actions Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Assignment Status */}
                <div className="flex items-center">
                  {ticket.assignedAdmin ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Assigned to {ticket.assignedAdmin.firstName}{" "}
                        {ticket.assignedAdmin.lastName}
                      </span>
                      <span className="sm:hidden">
                        {ticket.assignedAdmin.firstName}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                      <UserX className="w-4 h-4" />
                      Unassigned
                    </div>
                  )}
                </div>

                {/* Quick Actions Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm min-h-[40px]"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Quick Actions</span>
                    <span className="sm:hidden">Actions</span>
                    <MoreHorizontal className="w-4 h-4 ml-1" />
                  </button>

                  {/* Enhanced Quick Actions Dropdown */}
                  {showQuickActions && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                      <div className="p-4">
                        {/* Status Actions */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Update Status
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {ticket.status === "open" && (
                              <button
                                onClick={() =>
                                  handleQuickStatusChange("in_progress")
                                }
                                className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-white bg-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
                              >
                                <Play className="w-3 h-3 text-white" />
                                <span className="text-white">
                                  Start Progress
                                </span>
                              </button>
                            )}
                            {(ticket.status === "open" ||
                              ticket.status === "in_progress") && (
                              <button
                                onClick={() =>
                                  handleQuickStatusChange("waiting_customer")
                                }
                                className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Pause className="w-3 h-3 text-white" />
                                <span className="text-white">
                                  Wait Customer
                                </span>
                              </button>
                            )}
                            {ticket.status !== "resolved" &&
                              ticket.status !== "closed" && (
                                <button
                                  onClick={() =>
                                    handleQuickStatusChange("resolved")
                                  }
                                  className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 transition-colors col-span-2"
                                >
                                  <CheckCircle className="w-3 h-3 text-white" />
                                  <span className="text-white">
                                    Mark as Resolved
                                  </span>
                                </button>
                              )}
                          </div>
                        </div>

                        {/* Assignment Actions */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Assignment
                          </h4>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {!ticket.assignedAdmin && (
                              <button
                                onClick={() => handleQuickAssign("self")}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <User className="w-3 h-3 text-white" />
                                <span className="text-white">Assign to Me</span>
                              </button>
                            )}
                            {adminUsers.slice(0, 4).map((admin) => (
                              <button
                                key={admin.id}
                                onClick={() => handleQuickAssign(admin.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-lg transition-colors ${
                                  ticket.assignedAdmin?.id === admin.id
                                    ? "text-green-700 bg-green-50 border border-green-200 font-medium"
                                    : "text-gray-700 hover:bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  <span className="truncate">{admin.name}</span>
                                </div>
                                {ticket.assignedAdmin?.id === admin.id && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </button>
                            ))}
                            {ticket.assignedAdmin && (
                              <button
                                onClick={() => handleQuickAssign("unassign")}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <UserX className="w-3 h-3 text-white" />
                                <span className="text-white">
                                  Unassign Ticket
                                </span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* View Full Ticket */}
                        <div className="pt-3 border-t border-gray-100">
                          <Link
                            to={`/admin/tickets/${ticket.id}`}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => setShowQuickActions(false)}
                          >
                            <FileText className="w-4 h-4 text-white" />
                            <span className="text-white">View Full Ticket</span>
                            <ArrowRight className="w-4 h-4 text-white" />
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
