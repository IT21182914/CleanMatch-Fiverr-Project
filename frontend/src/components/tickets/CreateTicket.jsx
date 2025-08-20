import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { createTicket, getUserBookings } from "../../lib/api";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const CreateTicket = ({ onTicketCreated, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: "",
    category: "service_quality",
    priority: "normal",
    summary: "",
    description: "",
    attachments: [],
  });

  const categories = [
    { value: "service_quality", label: "Service Quality" },
    { value: "lateness", label: "Lateness" },
    { value: "damage", label: "Damage" },
    { value: "payment", label: "Payment Issues" },
    { value: "other", label: "Other" },
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getUserBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.summary.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.summary.trim().length < 5) {
      toast.error("Summary must be at least 5 characters long");
      return;
    }

    if (formData.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }

    setLoading(true);

    try {
      const ticketData = {
        ...formData,
        bookingId: formData.bookingId || null,
        freelancerId: formData.bookingId
          ? bookings.find((b) => b.id == formData.bookingId)?.cleaner?.id ||
            null
          : null,
      };

      await createTicket(ticketData);
      toast.success("Support ticket created successfully");

      if (onTicketCreated) {
        onTicketCreated();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(error.response?.data?.error || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  if (loadingBookings) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header - Fixed on mobile for better UX */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-lg z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Create Support Ticket
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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
          )}
        </div>
      </div>

      {/* Form Container with better mobile scrolling */}
      <div className="p-4 sm:p-6 max-h-[calc(100vh-200px)] sm:max-h-none overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Two-column layout on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Booking Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Booking (Optional)
                </label>
                <select
                  name="bookingId"
                  value={formData.bookingId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select a booking (optional)</option>
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      #{booking.id} - {booking.service?.name} -{" "}
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {bookings.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No bookings available
                  </p>
                )}
              </div>

              {/* Category & Priority Row on Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  maxLength={255}
                  placeholder="Brief description of the issue"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Minimum 5 characters required
                  </p>
                  <p
                    className={`text-xs ${
                      formData.summary.length < 5
                        ? "text-red-500"
                        : formData.summary.length > 240
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.summary.length}/255
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Description takes full width on mobile */}
            <div className="lg:col-span-1">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={isMobileView ? 4 : 8}
                  maxLength={2000}
                  placeholder="Please provide detailed information about your issue..."
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Minimum 10 characters required
                  </p>
                  <p
                    className={`text-xs ${
                      formData.description.length < 10
                        ? "text-red-500"
                        : formData.description.length > 1800
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.description.length}/2000
                  </p>
                </div>
              </div>

              {/* Tips for mobile users */}
              {isMobileView && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-blue-800 mb-1">
                        Tip
                      </p>
                      <p className="text-xs text-blue-700">
                        Provide as much detail as possible to help us resolve
                        your issue quickly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Sticky on mobile */}
          <div
            className={`${
              isMobileView
                ? "sticky bottom-0 bg-white border-t border-gray-200 -mx-4 -mb-4 px-4 py-4"
                : ""
            } pt-4 sm:pt-6`}
          >
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={
                  loading ||
                  formData.summary.length < 5 ||
                  formData.description.length < 10
                }
                className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px] transition-colors"
              >
                {loading ? (
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
                    <span className="hidden sm:inline">Creating...</span>
                    <span className="sm:hidden">Creating</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Create Ticket</span>
                    <span className="sm:hidden">Create</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
