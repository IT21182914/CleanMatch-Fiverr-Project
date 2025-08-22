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

const AdminReviews = () => {
  const { user, isAuthenticated, getToken } = useContext(AuthContext);
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
    const token = getToken();
    if (!token) {
      console.error("No valid token for fetching reviews");
      setReviews([]);
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      }).toString();

      const response = await fetch(`/api/admin/reviews?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        try {
          const data = await response.json();
          setReviews(data.reviews || []);
          setPagination((prev) => ({ ...prev, ...data.pagination }));
        } catch (jsonError) {
          console.warn("Failed to parse reviews JSON:", jsonError);
          setReviews([]);
        }
      } else {
        console.warn("Failed to fetch reviews:", response.status);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      toast.error("Failed to load reviews");
    }
  }, [pagination.page, pagination.limit, filters, getToken]);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);

      console.log("📡 Fetching initial data for admin reviews...");

      // Check authentication state from context
      console.log("🔐 Authentication state:", {
        isAuthenticated,
        user: !!user,
      });

      // Use the getToken method from AuthContext
      const token = getToken();

      console.log("🔑 Token exists:", !!token);
      console.log("🔑 Token length:", token ? token.length : 0);

      if (!token) {
        console.error("❌ No valid authentication token found");
        toast.error("Please login to access admin features");
        return;
      }

      // Log the exact URLs being called
      console.log("🌐 Calling cleaners API: /api/admin/reviews/cleaners");
      console.log("🌐 Calling stats API: /api/admin/reviews/stats");
      console.log("🌐 Current location:", window.location.origin);
      const [cleanersResponse, statsResponse] = await Promise.all([
        fetch("/api/admin/reviews/cleaners", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/admin/reviews/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      console.log("📊 Responses received:");
      console.log("- Cleaners response:", cleanersResponse);
      console.log("- Stats response:", statsResponse);

      // Handle cleaners response
      console.log("🧹 Cleaners response status:", cleanersResponse.status);
      console.log(
        "🧹 Cleaners response headers:",
        Object.fromEntries(cleanersResponse.headers.entries())
      );
      console.log("🧹 Cleaners response URL:", cleanersResponse.url);
      if (cleanersResponse.ok) {
        try {
          const cleanersData = await cleanersResponse.json();
          console.log("✅ Cleaners data:", cleanersData);

          if (cleanersData.success && cleanersData.cleaners) {
            setCleaners(cleanersData.cleaners);
            console.log(`📋 Loaded ${cleanersData.cleaners.length} cleaners`);
          } else {
            console.warn("⚠️ Invalid cleaners data structure:", cleanersData);
            setCleaners([]);
          }
        } catch (jsonError) {
          console.warn("❌ Failed to parse cleaners JSON:", jsonError);
          // Don't try to read response.text() again after json() failed
          console.warn("JSON parsing failed, likely HTML error page received");
          setCleaners([]);
          toast.error("Failed to load cleaners - invalid response format");
        }
      } else {
        console.warn("❌ Failed to fetch cleaners:", cleanersResponse.status);

        // Check for authentication errors
        if (cleanersResponse.status === 401) {
          console.error(
            "🔐 Authentication failed - token may be expired or invalid"
          );
          toast.error("Authentication failed. Please login again.");
          // Optionally redirect to login or clear invalid token
          // localStorage.removeItem("token");
          // window.location.href = "/login";
        }

        try {
          const errorText = await cleanersResponse.text();
          console.warn("Cleaners error response:", errorText);
        } catch (e) {
          console.warn("Could not read error response:", e);
        }
        setCleaners([]);
        toast.error(
          `Failed to load cleaners (Status: ${cleanersResponse.status})`
        );
      }

      // Handle stats response
      if (statsResponse.ok) {
        try {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setStats(statsData.stats || null);
          } else {
            console.warn("Stats request not successful:", statsData);
            setStats(null);
          }
        } catch (jsonError) {
          console.warn("Failed to parse stats JSON:", jsonError);
          setStats(null);
        }
      } else {
        console.warn("Failed to fetch stats:", statsResponse.status);
        setStats(null);
      }
    } catch (error) {
      console.error("❌ Network error fetching initial data:", error);
      setCleaners([]);
      setStats(null);
      toast.error("Network error - please check your connection");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, getToken]); // Dependencies for useCallback

  useEffect(() => {
    // Only fetch data when user is authenticated
    if (isAuthenticated) {
      // Add a small delay to ensure authentication state is properly initialized
      const timer = setTimeout(() => {
        fetchInitialData();
      }, 100); // 100ms delay

      return () => clearTimeout(timer);
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

    const token = getToken();
    if (!token) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    try {
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Review created successfully!");
        setFormData({ cleanerId: "", rating: 5, reviewText: "" });
        if (activeTab === "reviews") {
          fetchReviews();
        }
        fetchInitialData(); // Refresh stats
      } else {
        try {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to create review");
        } catch (jsonError) {
          console.warn("JSON parsing failed in handleCreateReview:", jsonError);
          toast.error("Failed to create review - server error");
        }
      }
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Failed to create review");
    }
  };

  const handleUpdateReview = async (id, updateData) => {
    const token = getToken();
    if (!token) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success("Review updated successfully!");
        setEditingReview(null);
        fetchReviews();
        fetchInitialData(); // Refresh stats
      } else {
        try {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to update review");
        } catch (jsonError) {
          console.warn("JSON parsing failed in handleUpdate:", jsonError);
          toast.error("Failed to update review - server error");
        }
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Review deleted successfully!");
        fetchReviews();
        fetchInitialData(); // Refresh stats
      } else {
        try {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to delete review");
        } catch (jsonError) {
          console.warn("JSON parsing failed in handleDelete:", jsonError);
          toast.error("Failed to delete review - server error");
        }
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
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

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: ChartBarIcon },
    { key: "reviews", label: "Manage Reviews", icon: StarIcon },
    { key: "create", label: "Create Review", icon: PlusIcon },
  ];

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Admin Review Management
        </h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <StarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.overview.total_reviews || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Visible</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.overview.visible_reviews || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeSlashIcon className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hidden</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.overview.hidden_reviews || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {parseFloat(stats.overview.average_rating || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentReviews && stats.recentReviews.length > 0 ? (
                  stats.recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            for {review.cleaner_name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          by {review.admin_name} •{" "}
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent reviews
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Reviewed Cleaners */}
          <Card>
            <CardHeader>
              <CardTitle>Top Reviewed Cleaners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topCleaners && stats.topCleaners.length > 0 ? (
                  stats.topCleaners.map((cleaner, index) => (
                    <div
                      key={cleaner.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">
                          {cleaner.cleaner_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{cleaner.admin_review_count} reviews</span>
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>
                            {parseFloat(cleaner.avg_admin_rating || 0).toFixed(
                              1
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No reviews yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manage Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Cleaner
                </label>
                <select
                  value={filters.cleanerId}
                  onChange={(e) =>
                    setFilters({ ...filters, cleanerId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Cleaners</option>
                  {cleaners.map((cleaner) => (
                    <option key={cleaner.id} value={cleaner.id}>
                      {cleaner.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <select
                  value={filters.visible}
                  onChange={(e) =>
                    setFilters({ ...filters, visible: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions
                </label>
                <Button
                  onClick={() =>
                    setFilters({ cleanerId: "", visible: "", search: "" })
                  }
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Reviews ({pagination.total})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm font-medium">
                              {review.cleaner_name}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                review.is_visible
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {review.is_visible ? "Visible" : "Hidden"}
                            </span>
                          </div>

                          {editingReview?.id === review.id ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Rating
                                </label>
                                <select
                                  value={editingReview.rating}
                                  onChange={(e) =>
                                    setEditingReview({
                                      ...editingReview,
                                      rating: parseInt(e.target.value),
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                      {num} Star{num !== 1 ? "s" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Review Text
                                </label>
                                <textarea
                                  value={editingReview.reviewText}
                                  onChange={(e) =>
                                    setEditingReview({
                                      ...editingReview,
                                      reviewText: e.target.value,
                                    })
                                  }
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() =>
                                    handleUpdateReview(review.id, {
                                      rating: editingReview.rating,
                                      reviewText: editingReview.reviewText,
                                    })
                                  }
                                  className="text-sm"
                                >
                                  Save
                                </Button>
                                <Button
                                  onClick={() => setEditingReview(null)}
                                  variant="outline"
                                  className="text-sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-gray-700 mb-2">
                                {review.review_text}
                              </p>
                              <p className="text-sm text-gray-500">
                                Created by {review.admin_name} on{" "}
                                {new Date(
                                  review.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {editingReview?.id !== review.id && (
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() =>
                                handleToggleVisibility(
                                  review.id,
                                  review.is_visible
                                )
                              }
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title={
                                review.is_visible
                                  ? "Hide review"
                                  : "Show review"
                              }
                            >
                              {review.is_visible ? (
                                <EyeSlashIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                setEditingReview({
                                  id: review.id,
                                  rating: review.rating,
                                  reviewText: review.review_text,
                                })
                              }
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="Edit review"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete review"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews found</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} results
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page - 1,
                        })
                      }
                      disabled={pagination.page === 1}
                      variant="outline"
                      className="text-sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page + 1,
                        })
                      }
                      disabled={pagination.page === pagination.pages}
                      variant="outline"
                      className="text-sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Review Tab */}
      {activeTab === "create" && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Admin Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Cleaner *
                </label>
                <select
                  value={formData.cleanerId}
                  onChange={(e) =>
                    setFormData({ ...formData, cleanerId: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a cleaner...</option>
                  {cleaners.map((cleaner) => (
                    <option key={cleaner.id} value={cleaner.id}>
                      {cleaner.name} - ⭐ {cleaner.rating.toFixed(1)} (
                      {cleaner.reviewCount} reviews)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseInt(e.target.value),
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num !== 1 ? "s" : ""} -{" "}
                      {num === 5
                        ? "Excellent"
                        : num === 4
                        ? "Good"
                        : num === 3
                        ? "Average"
                        : num === 2
                        ? "Poor"
                        : "Very Poor"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Text *
                </label>
                <textarea
                  value={formData.reviewText}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewText: e.target.value })
                  }
                  placeholder="Write your review about this cleaner's service..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This review will be visible on the homepage "What Our
                  Customers Say" section.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button type="submit" className="flex-1">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Review
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({ cleanerId: "", rating: 5, reviewText: "" })
                  }
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminReviews;
