import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getTicketById, addTicketMessage, updateTicket } from "../../lib/api";
import LoadingSpinner from "../shared/LoadingSpinner";

const TicketDetails = ({ userRole = "customer" }) => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  // Admin update states
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    priority: "",
    assignedAdminId: "",
    internalNotes: "",
    resolution: "",
  });

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

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTicketById(id);
      const ticketData = response.data.data;
      setTicket(ticketData);
      setUpdateData({
        status: ticketData.status,
        priority: ticketData.priority,
        assignedAdminId: ticketData.assignedAdmin?.id || "",
        internalNotes: ticketData.internalNotes || "",
        resolution: "",
      });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSendingMessage(true);

    try {
      await addTicketMessage(id, {
        message: newMessage,
        isInternal: isInternal,
      });

      setNewMessage("");
      setIsInternal(false);
      await fetchTicket(); // Refresh to get new message
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatePayload = {};

      if (updateData.status !== ticket.status) {
        updatePayload.status = updateData.status;
      }
      if (updateData.priority !== ticket.priority) {
        updatePayload.priority = updateData.priority;
      }
      if (updateData.assignedAdminId !== (ticket.assignedAdmin?.id || "")) {
        updatePayload.assignedAdminId = updateData.assignedAdminId || null;
      }
      if (updateData.internalNotes !== (ticket.internalNotes || "")) {
        updatePayload.internalNotes = updateData.internalNotes;
      }
      if (
        updateData.resolution &&
        (updateData.status === "resolved" || updateData.status === "closed")
      ) {
        updatePayload.resolution = updateData.resolution;
      }

      if (Object.keys(updatePayload).length === 0) {
        toast.error("No changes to save");
        return;
      }

      await updateTicket(id, updatePayload);
      await fetchTicket();
      setShowUpdateForm(false);
      toast.success("Ticket updated successfully");
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ticket Not Found
          </h2>
          <p className="text-gray-600">
            The requested ticket could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Ticket #{ticket.id}
                </h1>
                <p className="text-lg font-medium text-gray-800">
                  {ticket.summary}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[ticket.status]
                  }`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    priorityColors[ticket.priority]
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {ticket.booking && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Related Booking
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Booking ID: #{ticket.booking.id}</p>
                  <p>Service: {ticket.booking.serviceName}</p>
                  <p>
                    Date: {new Date(ticket.booking.date).toLocaleDateString()}
                  </p>
                  <p>
                    Address: {ticket.booking.address}, {ticket.booking.city},{" "}
                    {ticket.booking.state}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Messages
            </h2>

            <div className="space-y-4 mb-6">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.isInternal
                      ? "bg-yellow-50 border-l-4 border-yellow-400"
                      : message.user.role === "admin"
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : "bg-gray-50 border-l-4 border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {message.user.firstName} {message.user.lastName}
                      </span>
                      <span className="text-xs text-gray-500 uppercase">
                        {message.user.role}
                      </span>
                      {message.isInternal && (
                        <span className="text-xs text-yellow-700 bg-yellow-200 px-2 py-1 rounded">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Message Form */}
            <form onSubmit={handleSendMessage} className="border-t pt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Message
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  placeholder="Type your message here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                {userRole === "admin" && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Internal note (only visible to admins)
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={sendingMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingMessage ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket Information
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <span className="ml-2 text-gray-600">
                  {categoryLabels[ticket.category]}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>

              {ticket.firstResponseAt && (
                <div>
                  <span className="font-medium text-gray-700">
                    First Response:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {new Date(ticket.firstResponseAt).toLocaleString()}
                  </span>
                </div>
              )}

              {ticket.resolvedAt && (
                <div>
                  <span className="font-medium text-gray-700">Resolved:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(ticket.resolvedAt).toLocaleString()}
                  </span>
                </div>
              )}

              <div>
                <span className="font-medium text-gray-700">Customer:</span>
                <span className="ml-2 text-gray-600">
                  {ticket.customer.firstName} {ticket.customer.lastName}
                </span>
              </div>

              {ticket.assignedAdmin && (
                <div>
                  <span className="font-medium text-gray-700">
                    Assigned to:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {ticket.assignedAdmin.firstName}{" "}
                    {ticket.assignedAdmin.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Controls */}
          {userRole === "admin" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Admin Controls
                </h3>
                <button
                  onClick={() => setShowUpdateForm(!showUpdateForm)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showUpdateForm ? "Cancel" : "Update Ticket"}
                </button>
              </div>

              {showUpdateForm && (
                <form onSubmit={handleUpdateTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={updateData.status}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_customer">
                        Waiting for Customer
                      </option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={updateData.priority}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internal Notes
                    </label>
                    <textarea
                      value={updateData.internalNotes}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          internalNotes: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {(updateData.status === "resolved" ||
                    updateData.status === "closed") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resolution Message
                      </label>
                      <textarea
                        value={updateData.resolution}
                        onChange={(e) =>
                          setUpdateData((prev) => ({
                            ...prev,
                            resolution: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Describe how this issue was resolved..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? "Updating..." : "Update Ticket"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Timeline */}
          {ticket.timeline && ticket.timeline.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h3>

              <div className="space-y-3">
                {ticket.timeline.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {event.description}
                      </p>
                      {event.user && (
                        <p className="text-xs text-gray-500">
                          by {event.user.firstName} {event.user.lastName}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
