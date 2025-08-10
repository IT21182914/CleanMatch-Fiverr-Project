import React, { useState } from "react";

const StatusUpdateModal = ({ show, ticket, onUpdate, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const statusOptions = [
    {
      value: "open",
      label: "Open",
      description: "Ticket is newly created and waiting for admin action",
      color: "red",
    },
    {
      value: "in_progress",
      label: "In Progress",
      description: "Admin is actively working on this ticket",
      color: "yellow",
    },
    {
      value: "waiting_customer",
      label: "Waiting for Customer",
      description: "Waiting for customer response or additional information",
      color: "blue",
    },
    {
      value: "resolved",
      label: "Resolved",
      description: "Issue has been resolved and awaiting customer confirmation",
      color: "green",
    },
    {
      value: "closed",
      label: "Closed",
      description: "Ticket is completely resolved and closed",
      color: "gray",
    },
  ];

  const getColorClasses = (color, isSelected = false) => {
    const colorMap = {
      red: isSelected
        ? "border-red-500 bg-red-50"
        : "border-red-200 hover:border-red-300",
      yellow: isSelected
        ? "border-yellow-500 bg-yellow-50"
        : "border-yellow-200 hover:border-yellow-300",
      blue: isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-blue-200 hover:border-blue-300",
      green: isSelected
        ? "border-green-500 bg-green-50"
        : "border-green-200 hover:border-green-300",
      gray: isSelected
        ? "border-gray-500 bg-gray-50"
        : "border-gray-200 hover:border-gray-300",
    };
    return colorMap[color] || colorMap.gray;
  };

  const getStatusEmoji = (status) => {
    const emojiMap = {
      open: "🔴",
      in_progress: "🟡",
      waiting_customer: "🔵",
      resolved: "🟢",
      closed: "⚫",
    };
    return emojiMap[status] || "⚪";
  };

  const handleUpdate = async () => {
    if (!selectedStatus) return;

    setLoading(true);
    try {
      if (ticket?.bulk) {
        // Handle bulk update (you might need to implement bulk update API)
        for (const ticketId of ticket.ids) {
          await onUpdate(ticketId, selectedStatus, reason);
        }
      } else {
        await onUpdate(ticket.id, selectedStatus, reason);
      }
      onClose();
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStatus = () => {
    if (ticket?.bulk) {
      return `${ticket.ids.length} tickets`;
    }
    return ticket?.status
      ? statusOptions.find((opt) => opt.value === ticket.status)?.label
      : "Unknown";
  };

  const getAvailableTransitions = () => {
    if (ticket?.bulk) {
      // For bulk operations, show all options
      return statusOptions;
    }

    // Define valid status transitions
    const transitions = {
      open: ["in_progress", "waiting_customer", "resolved"],
      in_progress: ["waiting_customer", "resolved", "closed"],
      waiting_customer: ["in_progress", "resolved"],
      resolved: ["closed", "in_progress"], // Can reopen if needed
      closed: ["in_progress"], // Can reopen if needed
    };

    const currentStatus = ticket?.status || "open";
    const validNextStatuses = transitions[currentStatus] || [];

    return statusOptions.filter(
      (option) =>
        validNextStatuses.includes(option.value) ||
        option.value === currentStatus
    );
  };

  const availableStatuses = getAvailableTransitions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {ticket?.bulk
              ? "Bulk Update Status"
              : `Update Status - Ticket #${ticket?.id}`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Current status: <strong>{getCurrentStatus()}</strong>
          </p>
        </div>

        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select New Status
            </label>

            <div className="grid gap-3">
              {availableStatuses.map((status) => (
                <label
                  key={status.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${getColorClasses(
                    status.color,
                    selectedStatus === status.value
                  )}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getStatusEmoji(status.value)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {status.label}
                      </span>
                      {!ticket?.bulk && ticket?.status === status.value && (
                        <span className="text-xs text-gray-500">(Current)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {status.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Reason/Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Change{" "}
              {selectedStatus && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Explain why you're changing the status${
                ticket?.bulk ? " for these tickets" : ""
              }...`}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Status Change Guidelines */}
          {selectedStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                📋 Guidelines for "
                {statusOptions.find((s) => s.value === selectedStatus)?.label}"
              </h4>
              <div className="text-xs text-blue-800 space-y-1">
                {selectedStatus === "in_progress" && (
                  <>
                    <p>• Assign the ticket to yourself or another admin</p>
                    <p>• Begin investigating the customer's complaint</p>
                    <p>• Send acknowledgment message to customer</p>
                  </>
                )}
                {selectedStatus === "waiting_customer" && (
                  <>
                    <p>
                      • Use when you need additional information from customer
                    </p>
                    <p>• Send a message requesting specific details</p>
                    <p>• Set appropriate follow-up reminders</p>
                  </>
                )}
                {selectedStatus === "resolved" && (
                  <>
                    <p>• Issue has been addressed and resolved</p>
                    <p>• Customer should be notified of the resolution</p>
                    <p>• Document the solution for future reference</p>
                  </>
                )}
                {selectedStatus === "closed" && (
                  <>
                    <p>• Customer has confirmed satisfaction with resolution</p>
                    <p>• All actions have been completed</p>
                    <p>• Ticket is archived and no longer active</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={!selectedStatus || !reason.trim() || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            Update Status
            {ticket?.bulk && ` (${ticket.ids.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
