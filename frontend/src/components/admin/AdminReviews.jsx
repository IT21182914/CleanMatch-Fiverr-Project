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
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";
import { adminAPI } from "../../lib/api";

const AdminReviews = () => {
  const { isAuthenticated } = useContext(AuthContext);

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
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsive pagination
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

      console.log("Fetching initial data for admin reviews...");

      if (!isAuthenticated) {
        console.error("User not authenticated");
        toast.error("Please login to access admin features");
        return;
      }

      const [cleanersResponse, statsResponse] = await Promise.all([
        adminAPI.getCleaners(),
        adminAPI.getAdminReviewStats(),
      ]);

      // Handle cleaners response
      if (cleanersResponse?.data?.success && cleanersResponse.data.cleaners) {
        setCleaners(cleanersResponse.data.cleaners);
      } else {
        setCleaners([]);
        toast.error("Failed to load cleaners");
      }

      // Handle stats response
      if (statsResponse?.data?.success) {
        setStats(statsResponse.data.stats || null);
      } else {
        setStats(null);
        toast.error("Failed to load statistics");
      }
    } catch (error) {
      console.error("Network error fetching initial data:", error);
      setCleaners([]);
      setStats(null);
      toast.error("Network error - please check your connection");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
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
        fetchInitialData();
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
        fetchInitialData();
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
        fetchInitialData();
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

  const renderStars = (rating, size = "sm") => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`${sizeClasses[size]} ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
    trend = null,
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
    };

    console.log(Icon);

    const iconColorClasses = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100",
    };

    return (
      <Card
        className={`border ${colorClasses[color]} transition-all duration-200 hover:shadow-lg`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium opacity-75 mb-1 truncate">
                {title}
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate">
                {value}
              </p>
              {subtitle && (
                <p className="text-xs opacity-75 truncate">{subtitle}</p>
              )}
            </div>
            <div
              className={`p-2 sm:p-3 rounded-xl ${iconColorClasses[color]} flex-shrink-0`}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
          {trend && (
            <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm">
              <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-green-600 font-medium">
                {trend}% from last month
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Authentication guard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <XCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Please login to access the admin review management system
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="w-full text-sm sm:text-base"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            Loading Review Management
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Please wait while we fetch your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Review Management System
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            Manage customer reviews and maintain service quality standards
          </p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-xl">
            <nav className="flex flex-col sm:flex-row sm:space-x-8 px-4 sm:px-6">
              {[
                {
                  id: "dashboard",
                  label: "Dashboard",
                  icon: ChartBarIcon,
                  count: null,
                },
                {
                  id: "reviews",
                  label: "All Reviews",
                  icon: StarIcon,
                  count: stats?.totalReviews,
                },
                {
                  id: "create",
                  label: "Create Review",
                  icon: PlusIcon,
                  count: null,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm sm:text-base transition-colors w-full sm:w-auto justify-start sm:justify-center ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon
                    className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
                      activeTab === tab.id
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {tab.label}
                  {tab.count !== null && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                title="Total Reviews"
                value={stats?.totalReviews || 0}
                subtitle="All time reviews"
                icon={DocumentTextIcon}
                color="blue"
                trend={12}
              />
              <StatCard
                title="Average Rating"
                value={stats?.averageRating ? `${stats.averageRating}★` : "0★"}
                subtitle="Overall satisfaction"
                icon={StarIcon}
                color="green"
                trend={5}
              />
              <StatCard
                title="Active Cleaners"
                value={cleaners.length}
                subtitle="Service providers"
                icon={UserGroupIcon}
                color="purple"
              />
              <StatCard
                title="This Month"
                value={stats?.monthlyReviews || 0}
                subtitle="Recent reviews"
                icon={CalendarIcon}
                color="orange"
                trend={8}
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {reviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {renderStars(review.rating, "sm")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {review.cleaner_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {reviews.length === 0 && (
                      <div className="text-center py-6 sm:py-8">
                        <p className="text-gray-500 text-sm">
                          No recent activity
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <AdjustmentsHorizontalIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("create")}
                      className="w-full flex items-center gap-3 p-2 sm:p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-blue-900 text-sm sm:text-base">
                          Create New Review
                        </p>
                        <p className="text-xs sm:text-sm text-blue-600">
                          Add a review for a cleaner
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className="w-full flex items-center gap-3 p-2 sm:p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-green-900 text-sm sm:text-base">
                          Manage Reviews
                        </p>
                        <p className="text-xs sm:text-sm text-green-600">
                          Edit or moderate existing reviews
                        </p>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Enhanced Filters */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Filter Reviews
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cleaner
                    </label>
                    <select
                      value={filters.cleanerId}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          cleanerId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        setFilters((prev) => ({
                          ...prev,
                          visible: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Reviews</option>
                      <option value="true">Visible Only</option>
                      <option value="false">Hidden Only</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }))
                        }
                        placeholder="Search reviews..."
                        className="w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading State for Reviews Tab */}
            {loading && (
              <div className="space-y-3 sm:space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm animate-pulse">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 space-y-2 sm:space-y-3">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Reviews List */}
            {!loading && reviews.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {review.cleaner_name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              {renderStars(review.rating, "sm")}
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full flex-shrink-0">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                            {review.review_text}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>
                                {new Date(
                                  review.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {review.is_visible ? (
                                <>
                                  <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                  <span className="text-green-600 font-medium">
                                    Visible
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                  <span className="text-red-600 font-medium">
                                    Hidden
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:ml-6 justify-end lg:justify-start">
                          <button
                            onClick={() =>
                              handleToggleVisibility(
                                review.id,
                                review.is_visible
                              )
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              review.is_visible
                                ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                                : "text-green-600 bg-green-50 hover:bg-green-100"
                            }`}
                            title={
                              review.is_visible ? "Hide review" : "Show review"
                            }
                          >
                            {review.is_visible ? (
                              <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingReview(review)}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit review"
                          >
                            <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete review"
                          >
                            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State for No Reviews */}
            {!loading && reviews.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No Reviews Found
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
                  {filters.cleanerId || filters.visible || filters.search
                    ? "No reviews match your current filters. Try adjusting your search criteria."
                    : "No reviews have been created yet. Start by creating your first review."}
                </p>
                {!filters.cleanerId && !filters.visible && !filters.search && (
                  <Button
                    onClick={() => setActiveTab("create")}
                    className="text-sm sm:text-base"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create First Review
                  </Button>
                )}
              </div>
            )}

            {/* Enhanced Pagination */}
            {!loading && pagination.pages > 1 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total} reviews
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                          }))
                        }
                        disabled={pagination.page <= 1}
                        className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                      {Array.from(
                        {
                          length: Math.min(isMobile ? 3 : 5, pagination.pages),
                        },
                        (_, i) => {
                          const page =
                            Math.max(
                              1,
                              pagination.page -
                                Math.floor((isMobile ? 3 : 5) / 2)
                            ) + i;
                          if (page > pagination.pages) return null;
                          return (
                            <button
                              key={page}
                              onClick={() =>
                                setPagination((prev) => ({ ...prev, page }))
                              }
                              className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg ${
                                pagination.page === page
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                          }))
                        }
                        disabled={pagination.page >= pagination.pages}
                        className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Create Review Tab */}
        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Create New Review
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form
                  onSubmit={handleCreateReview}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Cleaner *
                    </label>
                    <select
                      value={formData.cleanerId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cleanerId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <select
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            rating: parseInt(e.target.value),
                          }))
                        }
                        className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <div className="flex justify-center sm:justify-start">
                        {renderStars(formData.rating, "md")}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Text *
                    </label>
                    <textarea
                      value={formData.reviewText}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reviewText: e.target.value,
                        }))
                      }
                      rows="6"
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      placeholder="Write a detailed review about the cleaner's performance, punctuality, quality of work, and overall service..."
                      required
                    />
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                      Minimum 20 characters required
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                    <Button
                      type="submit"
                      className="flex-1 text-sm sm:text-base"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Review
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setFormData({
                          cleanerId: "",
                          rating: 5,
                          reviewText: "",
                        })
                      }
                      className="sm:px-6 text-sm sm:text-base"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Edit Review Modal */}
        {editingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Edit Review
                </h3>
              </div>

              <div className="p-4 sm:p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    handleUpdateReview(editingReview.id, {
                      rating: parseInt(formData.get("rating")),
                      reviewText: formData.get("reviewText"),
                    });
                  }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cleaner
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm sm:text-base">
                      {editingReview.cleaner_name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <select
                        name="rating"
                        defaultValue={editingReview.rating}
                        className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <div className="flex justify-center sm:justify-start">
                        {renderStars(editingReview.rating, "md")}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Text
                    </label>
                    <textarea
                      name="reviewText"
                      defaultValue={editingReview.review_text}
                      rows="6"
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 text-sm sm:text-base"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Update Review
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditingReview(null)}
                      className="sm:px-6 text-sm sm:text-base"
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal backdrop click handler */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setEditingReview(null)}
            />
          </div>
        )}

        {/* Success/Error Toast Container */}
        <div className="fixed bottom-4 right-4 z-50">
          {/* Toast notifications will appear here via react-hot-toast */}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
