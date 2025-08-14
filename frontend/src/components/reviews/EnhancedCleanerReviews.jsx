import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import { api } from "../../lib/api";

const CleanerReviews = ({ cleanerId, showAddReview = false, onAddReview, showTitle = true }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const { showToast } = useToast();

  const fetchReviews = async (page = 1, sort = "newest") => {
    try {
      setLoading(true);
      const response = await api.get(
        `/reviews/cleaner/${cleanerId}?page=${page}&limit=10&sort=${sort}`
      );

      if (response.data.success) {
        setReviews(response.data.reviews);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      showToast("Error loading reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cleanerId) {
      fetchReviews(1, sortBy);
    }
  }, [cleanerId, sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    fetchReviews(1, newSort);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const renderRatingDistribution = () => {
    if (!stats) return null;

    const { distribution, totalReviews } = stats;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-x-3 text-sm">
            <span className="w-12">{rating} star</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{
                  width: `${
                    totalReviews > 0
                      ? (distribution[rating] / totalReviews) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <span className="w-8 text-right text-gray-600">
              {distribution[rating] || 0}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const loadMoreReviews = () => {
    if (pagination && currentPage < pagination.pages) {
      fetchReviews(currentPage + 1, sortBy);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {stats && showTitle && (
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.averageRating?.toFixed(1) || "0.0"}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.averageRating || 0))}
              </div>
              <div className="text-sm text-gray-600">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Rating Distribution</h3>
              {renderRatingDistribution()}
            </div>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {showTitle ? `Customer Reviews (${stats?.totalReviews || 0})` : "Reviews"}
          </h3>
          <div className="flex items-center space-x-4">
            {showAddReview && (
              <Button
                onClick={onAddReview}
                variant="outline"
                size="sm"
              >
                Write Review
              </Button>
            )}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-5xl mb-4">💬</div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              No reviews yet
            </h4>
            <p className="text-gray-500">
              Be the first to review this cleaner!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.customer_first_name?.charAt(0) || 
                       review.customer_name?.charAt(0) || 
                       "A"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.customer_name || 
                           `${review.customer_first_name || 'Anonymous'} Customer`}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500">
                            • {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                      {review.service_name && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {review.service_name}
                        </span>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                    {review.is_verified && (
                      <div className="flex items-center mt-2 text-sm text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified Review
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {pagination && currentPage < pagination.pages && (
          <div className="text-center mt-6">
            <Button
              onClick={loadMoreReviews}
              variant="outline"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More Reviews"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CleanerReviews;
