import { useState, useEffect, useCallback } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "../ui/Card";

const CleanerReviewsDisplay = ({ cleanerId, limit = 10 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:3001/api/reviews${
          cleanerId ? `/cleaner/${cleanerId}` : ""
        }?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setStats(
          data.stats || {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          }
        );
      } else {
        throw new Error("Failed to fetch reviews");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [cleanerId, limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      if (index < rating) {
        return <StarIcon key={index} className="h-5 w-5 text-yellow-400" />;
      } else {
        return (
          <StarOutlineIcon key={index} className="h-5 w-5 text-gray-300" />
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading reviews: {error}</p>
        <button
          onClick={fetchReviews}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Based on {stats.totalReviews} review
              {stats.totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating] || 0;
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {rating}★
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(review.customer_name || review.reviewer_name || "A")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.customer_name ||
                        review.reviewer_name ||
                        "Anonymous Customer"}
                      {review.is_admin_review && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-normal">
                          Verified Purchase
                        </span>
                      )}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {review.service_type && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                    {review.service_type}
                  </span>
                )}
              </div>

              {/* Review Content */}
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>

              {/* Response from business (if any) */}
              {review.response && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Response from SIMORGH SERVICE:
                  </p>
                  <p className="text-gray-700 text-sm">{review.response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CleanerReviewsDisplay;
