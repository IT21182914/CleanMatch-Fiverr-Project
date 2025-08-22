import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatDistanceToNow, format } from "date-fns";
import {
  getAdminTicketDetails,
  addTicketReply,
  investigateTicket,
  resolveTicket,
  closeTicket,
  updateTicketStatus,
  assignTicket,
  getAdminUsers,
} from "../../lib/api";
import LoadingSpinner from "../shared/LoadingSpinner";
import InvestigationModal from "./InvestigationModal";
import ResolutionModal from "./ResolutionModal";
import TicketReplyForm from "./TicketReplyForm";
import {
  AlertCircle,
  MessageSquare,
  Clock,
  Search,
  CheckCircle,
  Lock,
  Ticket,
  Paperclip,
  Plus,
  Settings,
  User,
  RotateCcw,
  Eye,
  Star,
} from "lucide-react";

const AdminTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState([]);

  // Modal states
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketResponse, adminResponse] = await Promise.all([
          getAdminTicketDetails(id),
          getAdminUsers(),
        ]);
        setTicket(ticketResponse.data.data);
        setAdminUsers(adminResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load ticket details");
        navigate("/admin/tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const fetchTicketDetails = async () => {
    try {
      const response = await getAdminTicketDetails(id);
      setTicket(response.data.data);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast.error("Failed to load ticket details");
    }
  };

  const handleStatusUpdate = async (status, reason) => {
    try {
      await updateTicketStatus(id, { status, reason });
      toast.success(`Ticket status updated to ${status}`);
      fetchTicketDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  const handleAssign = async (adminId) => {
    try {
      await assignTicket(id, { adminId });
      toast.success(
        adminId === "unassign"
          ? "Ticket unassigned"
          : "Ticket assigned successfully"
      );
      fetchTicketDetails();
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Failed to assign ticket");
    }
  };

  const handleReply = async (data) => {
    try {
      await addTicketReply(id, data);
      toast.success(
        data.isInternal ? "Internal note added" : "Reply sent to customer"
      );
      fetchTicketDetails();
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleInvestigation = async (data) => {
    try {
      await investigateTicket(id, data);
      toast.success("Investigation recorded successfully");
      fetchTicketDetails();
      setShowInvestigationModal(false);
    } catch (error) {
      console.error("Error recording investigation:", error);
      toast.error("Failed to record investigation");
    }
  };

  const handleResolution = async (data) => {
    try {
      await resolveTicket(id, data);
      toast.success("Ticket resolved successfully");
      fetchTicketDetails();
      setShowResolutionModal(false);
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error("Failed to resolve ticket");
    }
  };

  const handleClose = async (reason) => {
    try {
      await closeTicket(id, { reason });
      toast.success("Ticket closed successfully");
      fetchTicketDetails();
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast.error("Failed to close ticket");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-red-100 text-red-800 border-red-200",
      in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
      waiting_customer: "bg-blue-100 text-blue-800 border-blue-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      normal: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority] || colors.normal;
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const formatDateTime = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy 'at' HH:mm");
    } catch {
      return "Unknown";
    }
  };

  const getTimelineIcon = (actionType) => {
    switch (actionType) {
      case "created":
        return <Plus className="w-4 h-4 text-white" />;
      case "status_changed":
        return <RotateCcw className="w-4 h-4 text-white" />;
      case "assigned":
        return <User className="w-4 h-4 text-white" />;
      case "message_added":
        return <MessageSquare className="w-4 h-4 text-white" />;
      case "investigated":
        return <Search className="w-4 h-4 text-white" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-white" />;
      case "closed":
        return <Lock className="w-4 h-4 text-white" />;
      default:
        return <Settings className="w-4 h-4 text-white" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Ticket className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ticket Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The ticket you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            to="/admin/tickets"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
          >
            ← Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/admin" className="hover:text-blue-600">
            Admin Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link to="/admin/tickets" className="hover:text-blue-600">
            Ticket Management
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Ticket #{ticket.id}</span>
        </nav>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Ticket #{ticket.id}
              </h1>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status.replace("_", " ")}
              </span>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium gap-1 ${getPriorityColor(
                  ticket.priority
                )}`}
              >
                {ticket.priority === "urgent" && (
                  <AlertCircle className="w-4 h-4" />
                )}
                {ticket.priority} priority
              </span>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {ticket.summary}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>Created {getTimeAgo(ticket.createdAt)}</span>
              {ticket.firstResponseAt && (
                <span>First response {getTimeAgo(ticket.firstResponseAt)}</span>
              )}
              {ticket.resolvedAt && (
                <span>Resolved {getTimeAgo(ticket.resolvedAt)}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowReplyForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="text-white">Reply</span>
            </button>

            {ticket.status === "open" && (
              <button
                onClick={() =>
                  handleStatusUpdate("in_progress", "Started investigation")
                }
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white">Start Progress</span>
              </button>
            )}

            {ticket.status !== "resolved" && ticket.status !== "closed" && (
              <>
                <button
                  onClick={() => setShowInvestigationModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-white" />
                  <span className="text-white">Record Investigation</span>
                </button>

                <button
                  onClick={() => setShowResolutionModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-white">Resolve Ticket</span>
                </button>
              </>
            )}

            {ticket.status === "resolved" && (
              <button
                onClick={() => handleClose("Customer confirmed resolution")}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-white" />
                <span className="text-white">Close Ticket</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Messages and Communication */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Communication History
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-6 ${message.isInternal ? "bg-yellow-50" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          message.isInternal
                            ? "bg-yellow-200 text-yellow-800"
                            : message.user.role === "admin"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {message.user.firstName.charAt(0)}
                        {message.user.lastName.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {message.user.firstName} {message.user.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({message.user.role})
                        </span>
                        {message.isInternal && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Internal Note
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDateTime(message.createdAt)}
                        </span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      {/* Attachments */}
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium text-gray-700 mb-2">
                              Attachments:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {message.attachments.map((attachment) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs gap-1"
                                >
                                  <Paperclip className="w-3 h-3" />
                                  {attachment.filename}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Activity Timeline
              </h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {ticket.timeline.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== ticket.timeline.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                              {getTimelineIcon(event.actionType)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {event.description}
                                {event.oldValue && event.newValue && (
                                  <span className="text-xs text-gray-400">
                                    {" "}
                                    ({event.oldValue} → {event.newValue})
                                  </span>
                                )}
                                {event.user && (
                                  <span className="font-medium text-gray-700">
                                    {" "}
                                    by {event.user.firstName}{" "}
                                    {event.user.lastName}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-gray-500">
                              {getTimeAgo(event.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assignment
            </h3>
            {ticket.assignedAdmin ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.assignedAdmin.firstName}{" "}
                    {ticket.assignedAdmin.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Assigned Admin</p>
                </div>
                <button
                  onClick={() => handleAssign("unassign")}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Unassign
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3">No admin assigned</p>
                <select
                  onChange={(e) =>
                    e.target.value && handleAssign(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Assign to admin...</option>
                  {adminUsers.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {ticket.customer.firstName} {ticket.customer.lastName}
                </p>
                <p className="text-xs text-gray-500">{ticket.customer.email}</p>
                {ticket.customer.phone && (
                  <p className="text-xs text-gray-500">
                    {ticket.customer.phone}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">Member since</p>
                <p className="text-sm text-gray-700">
                  {formatDateTime(ticket.customer.memberSince)}
                </p>
              </div>

              {/* Customer History */}
              {ticket.customer.bookingHistory && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    Booking History
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-1 font-medium">
                        {ticket.customer.bookingHistory.total_bookings}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Completed:</span>
                      <span className="ml-1 font-medium">
                        {ticket.customer.bookingHistory.completed_bookings}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Cancelled:</span>
                      <span className="ml-1 font-medium">
                        {ticket.customer.bookingHistory.cancelled_bookings}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Value:</span>
                      <span className="ml-1 font-medium">
                        $
                        {parseFloat(
                          ticket.customer.bookingHistory.avg_booking_value || 0
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Previous Tickets */}
              {ticket.customer.previousTickets &&
                ticket.customer.previousTickets.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Previous Tickets
                    </p>
                    <div className="space-y-1">
                      {ticket.customer.previousTickets
                        .slice(0, 3)
                        .map((prevTicket) => (
                          <Link
                            key={prevTicket.id}
                            to={`/admin/tickets/${prevTicket.id}`}
                            className="block text-xs text-blue-600 hover:text-blue-800"
                          >
                            #{prevTicket.id} -{" "}
                            {prevTicket.summary.substring(0, 30)}...
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Booking Information */}
          {ticket.booking && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Related Booking
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    <Link
                      to={`/admin/bookings/${ticket.booking.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Booking #{ticket.booking.id}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500">
                    {ticket.booking.serviceName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="text-sm text-gray-700">
                    {formatDateTime(ticket.booking.date)} at{" "}
                    {ticket.booking.time}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm text-gray-700">
                    {ticket.booking.address}, {ticket.booking.city},{" "}
                    {ticket.booking.state} {ticket.booking.zipCode}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${parseFloat(ticket.booking.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm text-gray-700">
                      {ticket.booking.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Freelancer Information */}
          {ticket.freelancer && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Freelancer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.freelancer.firstName} {ticket.freelancer.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ticket.freelancer.email}
                  </p>
                  {ticket.freelancer.phone && (
                    <p className="text-xs text-gray-500">
                      {ticket.freelancer.phone}
                    </p>
                  )}
                </div>

                {ticket.freelancer.rating && (
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      {parseFloat(ticket.freelancer.rating).toFixed(1)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500">Background Check</p>
                  <p className="text-sm text-gray-700">
                    {ticket.freelancer.backgroundCheckStatus}
                  </p>
                </div>

                {/* Freelancer Performance */}
                {ticket.freelancer.history?.performance && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Performance
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Total Jobs:</span>
                        <span className="ml-1 font-medium">
                          {ticket.freelancer.history.performance.total_jobs}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <span className="ml-1 font-medium">
                          {ticket.freelancer.history.performance.completed_jobs}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Avg Rating:</span>
                        <span className="ml-1 font-medium flex items-center gap-1">
                          {parseFloat(
                            ticket.freelancer.history.performance.avg_rating ||
                              0
                          ).toFixed(1)}
                          <Star className="w-3 h-3 fill-current text-yellow-400" />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Internal Notes */}
          {ticket.internalNotes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                Internal Notes
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-yellow-800 whitespace-pre-wrap">
                  {ticket.internalNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <InvestigationModal
        show={showInvestigationModal}
        ticket={ticket}
        onSubmit={handleInvestigation}
        onClose={() => setShowInvestigationModal(false)}
      />

      <ResolutionModal
        show={showResolutionModal}
        ticket={ticket}
        onSubmit={handleResolution}
        onClose={() => setShowResolutionModal(false)}
      />

      <TicketReplyForm
        show={showReplyForm}
        ticket={ticket}
        onSubmit={handleReply}
        onClose={() => setShowReplyForm(false)}
      />
    </div>
  );
};

export default AdminTicketDetails;
