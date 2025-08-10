import React, { useState } from "react";

const InvestigationModal = ({ show, ticket, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    findings: "",
    actions_taken: "",
    notes: "",
    requires_followup: false,
    followup_date: "",
    evidence_links: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.findings.trim()) {
      alert("Please provide investigation findings");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        findings: "",
        actions_taken: "",
        notes: "",
        requires_followup: false,
        followup_date: "",
        evidence_links: "",
      });
    } catch (error) {
      console.error("Error submitting investigation:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Record Investigation - Ticket #{ticket?.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={submitting}
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Investigation Guidelines:</strong> Document your research
              findings, actions taken, and any evidence gathered. This will help
              track the resolution process and provide context for future
              reference.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Investigation Findings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investigation Findings *
              </label>
              <textarea
                name="findings"
                value={formData.findings}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What did you discover during your investigation? Include key details about the issue..."
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What specific actions did you take during the investigation? (e.g., contacted freelancer, reviewed booking details, checked payment records...)"
              />
            </div>

            {/* Evidence Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence & References
              </label>
              <textarea
                name="evidence_links"
                value={formData.evidence_links}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Links to relevant documents, screenshots, communication threads, or other evidence..."
              />
            </div>

            {/* Follow-up Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="requires_followup"
                  name="requires_followup"
                  checked={formData.requires_followup}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label
                    htmlFor="requires_followup"
                    className="text-sm font-medium text-gray-700"
                  >
                    Requires Follow-up Action
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Check this if additional investigation or actions are needed
                  </p>
                </div>
              </div>

              {formData.requires_followup && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="datetime-local"
                    name="followup_date"
                    value={formData.followup_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Recording...
                  </>
                ) : (
                  "🔍 Record Investigation"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvestigationModal;
