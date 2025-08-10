import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAdminUsers, bulkUpdateTickets } from "../../lib/api";

const BulkUpdateModal = ({ isOpen, onClose, selectedTickets, onSuccess }) => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    priority: "",
    assignedAdminId: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchAdminUsers();
    }
  }, [isOpen]);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const response = await getAdminUsers();
      setAdminUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one field is selected
    const hasUpdates =
      updateData.status || updateData.priority || updateData.assignedAdminId;
    if (!hasUpdates) {
      toast.error("Please select at least one field to update");
      return;
    }

    setUpdating(true);
    try {
      const updates = {};
      if (updateData.status) updates.status = updateData.status;
      if (updateData.priority) updates.priority = updateData.priority;
      if (updateData.assignedAdminId !== "") {
        if (updateData.assignedAdminId === "unassign") {
          updates.assignedAdminId = null;
        } else {
          updates.assignedAdminId = updateData.assignedAdminId || null;
        }
      }

      await bulkUpdateTickets({
        ticketIds: selectedTickets,
        updates,
      });

      toast.success(`Successfully updated ${selectedTickets.length} tickets`);
      setUpdateData({ status: "", priority: "", assignedAdminId: "" });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error bulk updating tickets:", error);
      toast.error("Failed to update tickets");
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUpdateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Bulk Update Tickets
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Update {selectedTickets.length} selected tickets. Leave fields empty
            to skip updating them.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={updateData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Don't change</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_customer">Waiting for Customer</option>
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
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Don't change</option>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Admin
              </label>
              <select
                value={updateData.assignedAdminId}
                onChange={(e) =>
                  handleInputChange("assignedAdminId", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Don't change</option>
                <option value="unassign">Unassign</option>
                {adminUsers.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
              {loading && (
                <p className="text-sm text-gray-500 mt-1">Loading admins...</p>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Tickets"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateModal;
