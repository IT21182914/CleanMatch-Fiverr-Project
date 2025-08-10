import React, { useState } from "react";

const TicketReplyForm = ({ show, ticket, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    message: "",
    isInternal: false,
    attachments: [],
    templateId: "",
    priority: "normal",
  });

  const [submitting, setSubmitting] = useState(false);

  // Common reply templates
  const templates = [
    {
      id: "acknowledge",
      name: "Acknowledge Receipt",
      content: `Dear ${ticket?.customer?.firstName || "[Customer Name]"},

Thank you for contacting CleanMatch support. We have received your ticket #${
        ticket?.id || "[Ticket ID]"
      } and are reviewing your concern.

We understand how important this matter is to you, and we are committed to resolving it promptly. Our team is currently investigating the issue, and we will keep you updated on our progress.

If you have any additional information that might help us resolve this matter more quickly, please don't hesitate to share it.

Best regards,
CleanMatch Support Team`,
    },
    {
      id: "request_info",
      name: "Request Additional Information",
      content: `Dear ${ticket?.customer?.firstName || "[Customer Name]"},

Thank you for reaching out to us regarding ticket #${
        ticket?.id || "[Ticket ID]"
      }.

To help us resolve your concern as quickly as possible, we need some additional information:

• [Specific information needed]
• [Any relevant details]
• [Documentation if required]

Please reply to this email with the requested information at your earliest convenience. This will help us expedite the resolution of your case.

Thank you for your patience and cooperation.

Best regards,
CleanMatch Support Team`,
    },
    {
      id: "booking_review",
      name: "Booking Under Review",
      content: `Dear ${ticket?.customer?.firstName || "[Customer Name]"},

We have thoroughly reviewed your booking #${
        ticket?.booking?.id || "[Booking ID]"
      } and understand your concerns.

We are currently coordinating with the relevant parties to address this matter. We will provide you with an update within 24-48 hours with our findings and proposed resolution.

We appreciate your patience as we work to resolve this situation to your satisfaction.

Best regards,
CleanMatch Support Team`,
    },
    {
      id: "escalation",
      name: "Issue Escalated",
      content: `Dear ${ticket?.customer?.firstName || "[Customer Name]"},

Your concern regarding ticket #${
        ticket?.id || "[Ticket ID]"
      } has been escalated to our senior support team for immediate attention.

A specialized team member will be contacting you within the next 24 hours to discuss your case in detail and work toward a resolution.

We sincerely apologize for any inconvenience this matter has caused and appreciate your continued patience.

Best regards,
CleanMatch Support Team`,
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTemplateSelect = (e) => {
    const templateId = e.target.value;
    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          templateId,
          message: template.content,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        templateId: "",
        message: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      alert("Please enter a message");
      return;
    }

    setSubmitting(true);
    try {
      // Create FormData if there are attachments
      const submitData = new FormData();
      submitData.append("message", formData.message);
      submitData.append("isInternal", formData.isInternal);
      submitData.append("priority", formData.priority);

      // Add attachments
      formData.attachments.forEach((file, index) => {
        submitData.append(`attachments[${index}]`, file);
      });

      await onSubmit(submitData);

      // Reset form
      setFormData({
        message: "",
        isInternal: false,
        attachments: [],
        templateId: "",
        priority: "normal",
      });
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {formData.isInternal ? "Add Internal Note" : "Reply to Customer"}{" "}
              - Ticket #{ticket?.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={submitting}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reply Type Toggle */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="replyType"
                    checked={!formData.isInternal}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, isInternal: false }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    💬 Customer Reply
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="replyType"
                    checked={formData.isInternal}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, isInternal: true }))
                    }
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    📝 Internal Note
                  </span>
                </label>
              </div>

              {formData.isInternal && (
                <p className="text-xs text-yellow-700 mt-2">
                  ⚠️ Internal notes are only visible to admin team members and
                  won't be sent to the customer.
                </p>
              )}
            </div>

            {/* Template Selection (only for customer replies) */}
            {!formData.isInternal && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Template (Optional)
                </label>
                <select
                  value={formData.templateId}
                  onChange={handleTemplateSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">
                    Select a template or write custom message
                  </option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.isInternal ? "Internal Note *" : "Message *"}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  formData.isInternal
                    ? "Add internal notes about this ticket. These notes will only be visible to admin team members..."
                    : "Type your reply to the customer here. Be professional and helpful..."
                }
                required
              />
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Characters: {formData.message.length}</span>
                {formData.templateId && (
                  <span className="text-blue-600">
                    Using template:{" "}
                    {templates.find((t) => t.id === formData.templateId)?.name}
                  </span>
                )}
              </div>
            </div>

            {/* Priority (for internal notes) */}
            {formData.isInternal && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low - General information</option>
                  <option value="normal">Normal - Standard note</option>
                  <option value="high">High - Important information</option>
                  <option value="urgent">
                    Urgent - Requires immediate attention
                  </option>
                </select>
              </div>
            )}

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF, PDF, DOC, DOCX, TXT (Max 5MB
                per file)
              </p>

              {/* Display selected attachments */}
              {formData.attachments.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files:
                  </p>
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm text-gray-700">
                          📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information Preview (for customer replies) */}
            {!formData.isInternal && ticket?.customer && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Sending to:
                </h4>
                <div className="text-sm text-gray-600">
                  <p>
                    {ticket.customer.firstName} {ticket.customer.lastName}
                  </p>
                  <p>{ticket.customer.email}</p>
                  {ticket.customer.phone && <p>{ticket.customer.phone}</p>}
                </div>
              </div>
            )}

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
                className={`px-6 py-2 text-sm font-medium text-white border border-transparent rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  formData.isInternal
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
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
                    Sending...
                  </>
                ) : (
                  <>{formData.isInternal ? "📝 Add Note" : "💬 Send Reply"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketReplyForm;
