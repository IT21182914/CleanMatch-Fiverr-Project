import React, { useState } from "react";

const TicketAssignModal = ({ show, ticket, adminUsers, onAssign, onClose }) => {
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleAssign = async () => {
    if (!selectedAdmin && selectedAdmin !== "unassign") return;

    setLoading(true);
    try {
      if (ticket?.bulk) {
        // Handle bulk assignment (you might need to implement bulk assign API)
        for (const ticketId of ticket.ids) {
          await onAssign(ticketId, selectedAdmin);
        }
      } else {
        await onAssign(ticket.id, selectedAdmin);
      }
      onClose();
    } catch (error) {
      console.error("Assignment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAssignment = () => {
    if (ticket?.bulk) {
      return `${ticket.ids.length} tickets`;
    }
    return ticket?.assignedAdmin
      ? `${ticket.assignedAdmin.firstName} ${ticket.assignedAdmin.lastName}`
      : "Unassigned";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2 sm:mx-0 max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {ticket?.bulk
              ? "Bulk Assign Tickets"
              : `Assign Ticket #${ticket?.id}`}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Currently assigned to: <strong>{getCurrentAssignment()}</strong>
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex-1 overflow-hidden">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
            Assign to Admin
          </label>

          <div className="space-y-2 sm:space-y-3 max-h-full overflow-y-auto">
            {/* Unassign Option */}
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 min-h-[60px] sm:min-h-0">
              <input
                type="radio"
                name="admin"
                value="unassign"
                checked={selectedAdmin === "unassign"}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
              />
              <div className="ml-3 min-w-0 flex-1">
                <div className="text-sm font-medium text-red-700">Unassign</div>
                <div className="text-xs text-red-600">
                  Remove assignment from ticket{ticket?.bulk ? "s" : ""}
                </div>
              </div>
            </label>

            {/* Admin Users */}
            {adminUsers.map((admin) => (
              <label
                key={admin.id}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 min-h-[60px] sm:min-h-0"
              >
                <input
                  type="radio"
                  name="admin"
                  value={admin.id}
                  checked={selectedAdmin === admin.id.toString()}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {admin.name}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {admin.email}
                  </div>
                </div>
                {/* Current assignment indicator */}
                {!ticket?.bulk && ticket?.assignedAdmin?.id === admin.id && (
                  <span className="text-xs text-green-600 font-medium flex-shrink-0 ml-2">
                    Current
                  </span>
                )}
              </label>
            ))}
          </div>

          {adminUsers.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <div className="text-gray-400 text-3xl sm:text-4xl mb-2">👥</div>
              <p className="text-sm sm:text-base text-gray-500">
                No admin users available
              </p>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 min-h-[44px] flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedAdmin || loading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            <span>
              {selectedAdmin === "unassign" ? "Unassign" : "Assign"}
              {ticket?.bulk && ` (${ticket.ids.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketAssignModal;
