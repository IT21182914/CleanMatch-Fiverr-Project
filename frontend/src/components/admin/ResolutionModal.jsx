import React, { useState } from "react";

const ResolutionModal = ({ show, ticket, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    resolution_type: "",
    resolution_details: "",
    actions_taken: "",
    customer_notified: true,
    refund_amount: "",
    compensation_offered: "",
    follow_up_required: false,
    follow_up_date: "",
    internal_notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const resolutionTypes = [
    { value: "issue_resolved", label: "✅ Issue Fully Resolved" },
    { value: "partial_refund", label: "💰 Partial Refund Issued" },
    { value: "full_refund", label: "💳 Full Refund Issued" },
    { value: "service_credit", label: "🎟️ Service Credit Applied" },
    { value: "freelancer_replaced", label: "👥 Freelancer Replaced" },
    { value: "booking_rescheduled", label: "📅 Booking Rescheduled" },
    { value: "compensation_offered", label: "🎁 Compensation Provided" },
    { value: "no_action_required", label: "📋 No Action Required" },
    { value: "escalated_to_legal", label: "⚖️ Escalated to Legal" },
    { value: "other", label: "📝 Other (specify in details)" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resolution_type) {
      alert("Please select a resolution type");
      return;
    }

    if (!formData.resolution_details.trim()) {
      alert("Please provide resolution details");
      return;
    }

    // Validate refund amount if applicable
    if (
      ["partial_refund", "full_refund"].includes(formData.resolution_type) &&
      !formData.refund_amount
    ) {
      alert("Please specify the refund amount");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        resolution_type: "",
        resolution_details: "",
        actions_taken: "",
        customer_notified: true,
        refund_amount: "",
        compensation_offered: "",
        follow_up_required: false,
        follow_up_date: "",
        internal_notes: "",
      });
    } catch (error) {
      console.error("Error submitting resolution:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Resolve Ticket #{ticket?.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={submitting}
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Resolution Process:</strong> Select the appropriate
              resolution type and provide detailed information about how the
              issue was addressed. This information will be permanently recorded
              and may be sent to the customer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resolution Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Resolution Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resolutionTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.resolution_type === type.value
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="resolution_type"
                      value={type.value}
                      checked={formData.resolution_type === type.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Financial Information */}
            {(["partial_refund", "full_refund"].includes(
              formData.resolution_type
            ) ||
              formData.resolution_type === "compensation_offered") && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-medium text-yellow-800">
                  Financial Details
                </h4>

                {["partial_refund", "full_refund"].includes(
                  formData.resolution_type
                ) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="refund_amount"
                        value={formData.refund_amount}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        max={ticket?.booking?.totalAmount || 1000}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {ticket?.booking?.totalAmount && (
                      <p className="text-xs text-gray-500 mt-1">
                        Original booking amount: $
                        {parseFloat(ticket.booking.totalAmount).toFixed(2)}
                      </p>
                    )}
                  </div>
                )}

                {formData.resolution_type === "compensation_offered" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compensation Details
                    </label>
                    <textarea
                      name="compensation_offered"
                      value={formData.compensation_offered}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Describe the compensation offered (e.g., free service credit, discount on next booking...)"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Resolution Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Details *
              </label>
              <textarea
                name="resolution_details"
                value={formData.resolution_details}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Provide a detailed explanation of how the issue was resolved. This may be shared with the customer..."
                required
              />
            </div>

            {/* Actions Taken */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actions Taken
              </label>
              <textarea
                name="actions_taken"
                value={formData.actions_taken}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="List the specific actions you took to resolve this issue (e.g., contacted freelancer, processed refund, rescheduled service...)"
              />
            </div>

            {/* Customer Notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="customer_notified"
                  name="customer_notified"
                  checked={formData.customer_notified}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label
                    htmlFor="customer_notified"
                    className="text-sm font-medium text-gray-700"
                  >
                    Notify Customer of Resolution
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Send an automated email to the customer with resolution
                    details
                  </p>
                </div>
              </div>
            </div>

            {/* Follow-up Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="follow_up_required"
                  name="follow_up_required"
                  checked={formData.follow_up_required}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label
                    htmlFor="follow_up_required"
                    className="text-sm font-medium text-gray-700"
                  >
                    Requires Follow-up
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Schedule a follow-up check to ensure the resolution was
                    successful
                  </p>
                </div>
              </div>

              {formData.follow_up_required && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="datetime-local"
                    name="follow_up_date"
                    value={formData.follow_up_date}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              )}
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes
              </label>
              <textarea
                name="internal_notes"
                value={formData.internal_notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Additional internal notes that won't be visible to the customer..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resolving...
                  </>
                ) : (
                  "✅ Resolve Ticket"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResolutionModal;
