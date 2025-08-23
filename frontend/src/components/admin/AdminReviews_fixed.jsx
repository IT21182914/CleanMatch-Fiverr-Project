import React, { useState, useEffect, useCallback, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { LoadingCard } from "../ui/Loading";
import {
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";
import { adminAPI } from "../../lib/api";

const AdminReviews = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [editingReview, setEditingReview] = useState(null);
  const [filters, setFilters] = useState({
    cleanerId: "",
    visible: "",
    search: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    cleanerId: "",
    rating: 5,
    reviewText: "",
  });

  const fetchReviews = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("User not authenticated for fetching reviews");
      setReviews([]);
      return;
    }

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await adminAPI.getAdminReviews(params);

      if (response?.data?.success) {
        setReviews(response.data.reviews || []);
        setPagination((prev) => ({ ...prev, ...response.data.pagination }));
      } else {
        console.warn("Failed to fetch reviews:", response?.data);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      toast.error("Failed to load reviews");
    }
  }, [pagination.page, pagination.limit, filters, isAuthenticated]);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);

      console.log("📡 Fetching initial data for admin reviews...");

      // Check authentication state from context
      console.log("🔐 Authentication state:", {
        isAuthenticated,
        user: !!user,
      });

      if (!isAuthenticated) {
        console.error("❌ User not authenticated");
        toast.error("Please login to access admin features");
        return;
      }

      console.log("🌐 Using adminAPI for cleaners and stats...");

      // Use the configured adminAPI instead of raw fetch
      const [cleanersResponse, statsResponse] = await Promise.all([
        adminAPI.getCleaners(),
        adminAPI.getAdminReviewStats(),
      ]);

      console.log("📊 Responses received:");
      console.log("- Cleaners response:", cleanersResponse);
      console.log("- Stats response:", statsResponse);

      // Handle cleaners response
      if (cleanersResponse?.data?.success && cleanersResponse.data.cleaners) {
        setCleaners(cleanersResponse.data.cleaners);
        console.log(
          `📋 Loaded ${cleanersResponse.data.cleaners.length} cleaners`
        );
      } else {
        console.warn(
          "⚠️ Invalid cleaners data structure:",
          cleanersResponse?.data
        );
        setCleaners([]);
        toast.error("Failed to load cleaners");
      }

      // Handle stats response
      if (statsResponse?.data?.success) {
        setStats(statsResponse.data.stats || null);
        console.log("📊 Stats loaded successfully");
      } else {
        console.warn("Stats request not successful:", statsResponse?.data);
        setStats(null);
        toast.error("Failed to load statistics");
      }
    } catch (error) {
      console.error("❌ Network error fetching initial data:", error);
      setCleaners([]);
      setStats(null);
      toast.error("Network error - please check your connection");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Only fetch data when user is authenticated
    if (isAuthenticated) {
      // Add a small delay to ensure authentication state is properly initialized
      const timer = setTimeout(() => {
        fetchInitialData();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchInitialData]);

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab, fetchReviews]);

  const handleCreateReview = async (e) => {
    e.preventDefault();

    if (!formData.cleanerId || !formData.reviewText.trim()) {
      toast.error("Please select a cleaner and provide review text");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    try {
      const response = await adminAPI.createAdminReview(formData);

      if (response?.data?.success) {
        toast.success("Review created successfully!");
        setFormData({ cleanerId: "", rating: 5, reviewText: "" });
        if (activeTab === "reviews") {
          fetchReviews();
        }
        fetchInitialData(); // Refresh stats
      } else {
        toast.error(response?.data?.error || "Failed to create review");
      }
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error(error.response?.data?.error || "Failed to create review");
    }
  };

  const handleUpdateReview = async (id, updateData) => {
    if (!isAuthenticated) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    try {
      const response = await adminAPI.updateAdminReview(id, updateData);

      if (response?.data?.success) {
        toast.success("Review updated successfully!");
        setEditingReview(null);
        fetchReviews();
        fetchInitialData(); // Refresh stats
      } else {
        toast.error(response?.data?.error || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.response?.data?.error || "Failed to update review");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    if (!isAuthenticated) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    try {
      const response = await adminAPI.deleteAdminReview(id);

      if (response?.data?.success) {
        toast.success("Review deleted successfully!");
        fetchReviews();
        fetchInitialData(); // Refresh stats
      } else {
        toast.error(response?.data?.error || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.error || "Failed to delete review");
    }
  };

  const handleToggleVisibility = async (id, currentVisibility) => {
    await handleUpdateReview(id, { isVisible: !currentVisibility });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // Authentication guard
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please login to access admin features
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Review Management
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
            { id: "reviews", label: "All Reviews", icon: StarIcon },
            { id: "create", label: "Create Review", icon: PlusIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon
                className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? "text-blue-500" : "text-gray-400"
                }`}
              />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Reviews
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats?.totalReviews || 0}
                </p>
              </div>
              <StarIcon className="h-12 w-12 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Average Rating
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats?.averageRating || 0}
                </p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Cleaners
                </h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {cleaners.length}
                </p>
              </div>
              <UserIcon className="h-12 w-12 text-purple-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <select
              value={filters.cleanerId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, cleanerId: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cleaners</option>
              {cleaners.map((cleaner) => (
                <option key={cleaner.id} value={cleaner.id}>
                  {cleaner.name}
                </option>
              ))}
            </select>
            <select
              value={filters.visible}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, visible: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Reviews</option>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {review.cleaner_name}
                      </h3>
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">
                        Rating: {review.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{review.review_text}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Created:{" "}
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        Status: {review.is_visible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() =>
                        handleToggleVisibility(review.id, review.is_visible)
                      }
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {review.is_visible ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingReview(review)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: i + 1 }))
                  }
                  className={`px-3 py-2 rounded ${
                    pagination.page === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Review Tab */}
      {activeTab === "create" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create New Review
          </h2>
          <form onSubmit={handleCreateReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Cleaner
              </label>
              <select
                value={formData.cleanerId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cleanerId: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a cleaner...</option>
                {cleaners.map((cleaner) => (
                  <option key={cleaner.id} value={cleaner.id}>
                    {cleaner.name} ({cleaner.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Text
              </label>
              <textarea
                value={formData.reviewText}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reviewText: e.target.value,
                  }))
                }
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your review..."
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Create Review
            </Button>
          </form>
        </Card>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Review</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleUpdateReview(editingReview.id, {
                  rating: parseInt(formData.get("rating")),
                  reviewText: formData.get("reviewText"),
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  name="rating"
                  defaultValue={editingReview.rating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Text
                </label>
                <textarea
                  name="reviewText"
                  defaultValue={editingReview.review_text}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <Button type="submit" className="flex-1">
                  Update Review
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingReview(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
