import React, { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import api from "../../lib/api";

const AdminReviewManagement = () => {
  const [dashboard, setDashboard] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const { showToast } = useToast();

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await api.get("/reviews/admin/dashboard");
      if (response.data.success) {
        setDashboard(response.data.dashboard);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      showToast("Error loading dashboard", "error");
    }
  }, [showToast]);

  const fetchAllReviews = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = await api.get(
          `/reviews/admin/all?page=${page}&limit=20`
        );
        if (response.data.success) {
          setAllReviews(response.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        showToast("Error loading reviews", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const fetchAdminReviews = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = await api.get(
          `/reviews/admin/admin-reviews?page=${page}&limit=20`
        );
        if (response.data.success) {
          setAdminReviews(response.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching admin reviews:", error);
        showToast("Error loading admin reviews", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchDashboard();
    if (activeTab === "dashboard") {
      setLoading(false);
    } else if (activeTab === "allReviews") {
      fetchAllReviews();
    } else if (activeTab === "adminReviews") {
      fetchAdminReviews();
    }
  }, [activeTab, fetchDashboard, fetchAllReviews, fetchAdminReviews]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowCreateForm(false);
    setShowBulkForm(false);
  };

  const toggleReviewVisibility = async (reviewId, currentVisibility) => {
    try {
      const response = await api.put(
        `/reviews/admin/${reviewId}/toggle-visibility`
      );
      if (response.data.success) {
        showToast(
          `Review ${currentVisibility ? "hidden" : "shown"}`,
          "success"
        );
        if (activeTab === "allReviews") {
          fetchAllReviews();
        } else if (activeTab === "adminReviews") {
          fetchAdminReviews();
        }
        fetchDashboard();
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      showToast("Error updating review visibility", "error");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await api.delete(`/reviews/admin/${reviewId}`);
      if (response.data.success) {
        showToast("Review deleted successfully", "success");
        if (activeTab === "allReviews") {
          fetchAllReviews();
        } else if (activeTab === "adminReviews") {
          fetchAdminReviews();
        }
        fetchDashboard();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast("Error deleting review", "error");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
        <div className="space-x-2">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Admin Review
          </Button>
          <Button onClick={() => setShowBulkForm(true)} variant="outline">
            Bulk Create Reviews
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "dashboard", name: "Dashboard", count: null },
            {
              id: "allReviews",
              name: "All Reviews",
              count: dashboard?.statistics?.total_reviews,
            },
            {
              id: "adminReviews",
              name: "Admin Reviews",
              count: dashboard?.statistics?.admin_reviews,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && dashboard && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">📝</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboard.statistics.total_reviews}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Customer Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboard.statistics.customer_reviews}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">⭐</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Admin Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboard.statistics.admin_reviews}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-semibold">⭐</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboard.statistics.average_rating || "0.0"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Admin Actions</h3>
            <div className="space-y-3">
              {dashboard.recentActions?.slice(0, 10).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">
                      {action.admin_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {action.action} review
                    </span>
                    {action.cleaner_name && (
                      <span className="text-sm text-gray-500">
                        for {action.cleaner_name}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(action.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Admin-Reviewed Cleaners */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Top Admin-Reviewed Cleaners
            </h3>
            <div className="space-y-3">
              {dashboard.topAdminReviewedCleaners?.map((cleaner) => (
                <div
                  key={cleaner.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">
                      {cleaner.cleaner_name}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(cleaner.admin_avg_rating || 0))}
                      <span className="text-sm text-gray-600">
                        ({cleaner.admin_avg_rating || 0})
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {cleaner.admin_review_count} admin reviews
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* All Reviews Tab */}
      {activeTab === "allReviews" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Reviews</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ReviewsList
              reviews={allReviews}
              onToggleVisibility={toggleReviewVisibility}
              onDelete={deleteReview}
              showAdminInfo={true}
            />
          )}
        </Card>
      )}

      {/* Admin Reviews Tab */}
      {activeTab === "adminReviews" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Admin-Created Reviews</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ReviewsList
              reviews={adminReviews}
              onToggleVisibility={toggleReviewVisibility}
              onDelete={deleteReview}
              showAdminInfo={true}
            />
          )}
        </Card>
      )}

      {/* Create Admin Review Modal */}
      {showCreateForm && (
        <AdminReviewCreateForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchDashboard();
            if (activeTab === "adminReviews") {
              fetchAdminReviews();
            }
          }}
        />
      )}

      {/* Bulk Create Reviews Modal */}
      {showBulkForm && (
        <AdminBulkReviewForm
          onClose={() => setShowBulkForm(false)}
          onSuccess={() => {
            setShowBulkForm(false);
            fetchDashboard();
            if (activeTab === "adminReviews") {
              fetchAdminReviews();
            }
          }}
        />
      )}
    </div>
  );
};

// Reviews List Component
const ReviewsList = ({
  reviews,
  onToggleVisibility,
  onDelete,
  showAdminInfo,
}) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-4">📝</div>
        <p className="text-gray-600">No reviews found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className={`border rounded-lg p-4 ${
            review.is_admin_created
              ? "bg-blue-50 border-blue-200"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">
                  {review.customer_name || "Anonymous"}
                </span>
                <span className="text-gray-500">→</span>
                <span className="font-medium text-gray-900">
                  {review.cleaner_name}
                </span>
                {review.is_admin_created && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Admin Created
                  </span>
                )}
                {!review.is_visible && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-600">
                  {formatDate(review.created_at)}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-700 mb-2">{review.comment}</p>
              )}
              {showAdminInfo && review.admin_notes && (
                <p className="text-sm text-gray-500 italic">
                  Admin notes: {review.admin_notes}
                </p>
              )}
              {showAdminInfo && review.admin_created_by_name && (
                <p className="text-xs text-gray-400">
                  Created by: {review.admin_created_by_name}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onToggleVisibility(review.id, review.is_visible)}
                variant="outline"
                size="sm"
                className={
                  review.is_visible ? "text-orange-600" : "text-green-600"
                }
              >
                {review.is_visible ? "Hide" : "Show"}
              </Button>
              <Button
                onClick={() => onDelete(review.id)}
                variant="outline"
                size="sm"
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Create Admin Review Form Component
const AdminReviewCreateForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cleanerId: "",
    rating: 5,
    comment: "",
    customerName: "",
    serviceName: "",
    adminNotes: "",
  });
  const [cleaners, setCleaners] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ESC key support
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    // Fetch cleaners list
    const fetchCleaners = async () => {
      try {
        const response = await api.get("/admin/users?role=cleaner&limit=100");
        if (response.data.success) {
          setCleaners(response.data.users || []);
        } else {
          // Fallback to demo cleaners if API fails
          setFallbackCleaners();
        }
      } catch (error) {
        console.error("Error fetching cleaners:", error);
        showToast("Using demo cleaners for testing", "warning");
        setFallbackCleaners();
      }
    };

    const setFallbackCleaners = () => {
      const demoCleaners = [
        {
          id: 1,
          first_name: "Maria",
          last_name: "Santos",
          email: "maria@demo.com",
        },
        {
          id: 2,
          first_name: "David",
          last_name: "Kim",
          email: "david@demo.com",
        },
        {
          id: 3,
          first_name: "Lisa",
          last_name: "Thompson",
          email: "lisa@demo.com",
        },
        {
          id: 4,
          first_name: "John",
          last_name: "Wilson",
          email: "john@demo.com",
        },
        {
          id: 5,
          first_name: "Sarah",
          last_name: "Brown",
          email: "sarah@demo.com",
        },
      ];
      setCleaners(demoCleaners);
    };

    fetchCleaners();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post("/reviews/admin/create", formData);
      if (response.data.success) {
        showToast("Admin review created successfully", "success");
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating admin review:", error);
      showToast(
        error.response?.data?.error || "Error creating review",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Create Admin Review</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cleaner
            </label>
            <select
              value={formData.cleanerId}
              onChange={(e) =>
                setFormData({ ...formData, cleanerId: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a cleaner</option>
              {cleaners.map((cleaner) => (
                <option key={cleaner.id} value={cleaner.id}>
                  {cleaner.first_name && cleaner.last_name
                    ? `${cleaner.first_name} ${cleaner.last_name}`
                    : cleaner.name || `Cleaner ${cleaner.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name (Optional)
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              placeholder="Write a review comment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name (Optional)
            </label>
            <input
              type="text"
              value={formData.serviceName}
              onChange={(e) =>
                setFormData({ ...formData, serviceName: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., House Cleaning"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Internal)
            </label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) =>
                setFormData({ ...formData, adminNotes: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Internal notes about this review..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3"
            >
              {submitting ? "Creating..." : "Create Review"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 py-3"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Bulk Create Admin Reviews Form Component
const AdminBulkReviewForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cleanerId: "",
    adminNotes: "",
    reviews: [{ rating: 5, comment: "", customerName: "" }],
  });
  const [cleaners, setCleaners] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ESC key support
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    // Fetch cleaners list
    const fetchCleaners = async () => {
      try {
        const response = await api.get("/admin/users?role=cleaner&limit=100");
        if (response.data.success) {
          setCleaners(response.data.users || []);
        } else {
          // Fallback to demo cleaners if API fails
          setFallbackCleaners();
        }
      } catch (error) {
        console.error("Error fetching cleaners:", error);
        setFallbackCleaners();
      }
    };

    const setFallbackCleaners = () => {
      const demoCleaners = [
        {
          id: 1,
          first_name: "Maria",
          last_name: "Santos",
          email: "maria@demo.com",
        },
        {
          id: 2,
          first_name: "David",
          last_name: "Kim",
          email: "david@demo.com",
        },
        {
          id: 3,
          first_name: "Lisa",
          last_name: "Thompson",
          email: "lisa@demo.com",
        },
        {
          id: 4,
          first_name: "John",
          last_name: "Wilson",
          email: "john@demo.com",
        },
        {
          id: 5,
          first_name: "Sarah",
          last_name: "Brown",
          email: "sarah@demo.com",
        },
      ];
      setCleaners(demoCleaners);
    };

    fetchCleaners();
  }, []);

  const addReview = () => {
    if (formData.reviews.length < 20) {
      setFormData({
        ...formData,
        reviews: [
          ...formData.reviews,
          { rating: 5, comment: "", customerName: "" },
        ],
      });
    }
  };

  const removeReview = (index) => {
    if (formData.reviews.length > 1) {
      const newReviews = formData.reviews.filter((_, i) => i !== index);
      setFormData({ ...formData, reviews: newReviews });
    }
  };

  const updateReview = (index, field, value) => {
    const newReviews = [...formData.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setFormData({ ...formData, reviews: newReviews });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post("/reviews/admin/bulk-create", formData);
      if (response.data.success) {
        showToast(
          `${response.data.reviews.length} admin reviews created successfully`,
          "success"
        );
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating bulk admin reviews:", error);
      showToast(
        error.response?.data?.error || "Error creating reviews",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Bulk Create Admin Reviews</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cleaner
            </label>
            <select
              value={formData.cleanerId}
              onChange={(e) =>
                setFormData({ ...formData, cleanerId: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a cleaner</option>
              {cleaners.map((cleaner) => (
                <option key={cleaner.id} value={cleaner.id}>
                  {cleaner.first_name && cleaner.last_name
                    ? `${cleaner.first_name} ${cleaner.last_name}`
                    : cleaner.name || `Cleaner ${cleaner.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Internal)
            </label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) =>
                setFormData({ ...formData, adminNotes: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Internal notes for all these reviews..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Reviews ({formData.reviews.length}/20)
              </label>
              <Button
                type="button"
                onClick={addReview}
                variant="outline"
                size="sm"
                disabled={formData.reviews.length >= 20}
              >
                Add Review
              </Button>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto">
              {formData.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Review #{index + 1}
                    </span>
                    {formData.reviews.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeReview(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Rating
                      </label>
                      <select
                        value={review.rating}
                        onChange={(e) =>
                          updateReview(
                            index,
                            "rating",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={review.customerName}
                        onChange={(e) =>
                          updateReview(index, "customerName", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        placeholder="e.g., Jane Doe"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Comment
                    </label>
                    <textarea
                      value={review.comment}
                      onChange={(e) =>
                        updateReview(index, "comment", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      rows="2"
                      placeholder="Review comment..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3"
            >
              {submitting
                ? "Creating..."
                : `Create ${formData.reviews.length} Reviews`}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 py-3"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminReviewManagement;
