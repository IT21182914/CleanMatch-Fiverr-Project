import React, { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Loading } from "../ui/Loading";
import { api } from "../../lib/api";

const CleanerReviews = ({ cleanerId, showTitle = true, maxReviews = null }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const limit = maxReviews || 10;
      const response = await api.get(
        `/reviews/cleaner/${cleanerId}?page=${currentPage}&limit=${limit}`
      );

      if (response.data.success) {
        setReviews(response.data.reviews);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [cleanerId, currentPage, maxReviews]);

  useEffect(() => {
    if (cleanerId) {
      fetchReviews();
    }
  }, [cleanerId, fetchReviews]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const RatingDistribution = () => {
    if (!stats || stats.totalReviews === 0) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-800">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-1">
                {renderStars(stats.averageRating)}
              </div>
              <div className="text-sm text-gray-600">
                Based on {stats.totalReviews} review
                {stats.totalReviews !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star] || 0;
              const percentage =
                stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center space-x-2 text-sm">
                  <span className="w-3 text-gray-600">{star}</span>
                  <svg
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (!reviews.length && stats?.totalReviews === 0) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="text-gray-500 mb-2">No reviews yet</div>
          <div className="text-sm text-gray-400">
            This cleaner hasn't received any reviews yet.
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {showTitle && (
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Customer Reviews
        </h3>
      )}

      <RatingDistribution />

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="font-medium text-gray-800">
                      {review.customer_first_name}
                    </div>
                    <div className="text-sm text-gray-500">•</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      for {review.service_name}
                    </span>
                  </div>
                </div>
              </div>

              {review.comment && (
                <div className="text-gray-700 leading-relaxed">
                  {review.comment}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {pagination && pagination.pages > 1 && !maxReviews && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {pagination.pages}
          </span>

          <Button
            onClick={() =>
              setCurrentPage(Math.min(pagination.pages, currentPage + 1))
            }
            disabled={currentPage === pagination.pages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CleanerReviews;
