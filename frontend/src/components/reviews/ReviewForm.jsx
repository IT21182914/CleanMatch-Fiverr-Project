import React, { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import { api } from "../../lib/api";

const ReviewForm = ({ bookingId, onReviewSubmitted, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const checkCanReview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/can-review/${bookingId}`);

      if (response.data.success) {
        setCanReview(response.data);
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error);
      showToast("Error checking review eligibility", "error");
    } finally {
      setLoading(false);
    }
  }, [bookingId, showToast]);

  useEffect(() => {
    if (bookingId) {
      checkCanReview();
    }
  }, [bookingId, checkCanReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showToast("Please select a rating", "error");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/reviews", {
        bookingId,
        rating,
        comment: comment.trim() || null,
      });

      if (response.data.success) {
        showToast("Review submitted successfully!", "success");
        if (onReviewSubmitted) {
          onReviewSubmitted(response.data.review);
        }
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage =
        error.response?.data?.error || "Error submitting review";
      showToast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-colors"
        >
          <svg
            className={`w-8 h-8 ${
              star <= (hoveredRating || rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 && (
          <>
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </>
        )}
      </span>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <div className="p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!canReview?.canReview) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="text-gray-500 mb-4">
            {canReview?.reason || "Cannot review this booking"}
          </div>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Rate Your Experience
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>

        {canReview.booking?.cleanerName && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Cleaner:</strong> {canReview.booking.cleanerName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Booking ID:</strong> #{canReview.booking.id}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate this service? *
            </label>
            <StarRating />
          </div>

          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Share your experience (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell others about your experience with this cleaner..."
              maxLength={1000}
            />
            <div className="text-right mt-1">
              <span className="text-xs text-gray-500">
                {comment.length}/1000
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              disabled={rating === 0 || submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Submitting...
                </div>
              ) : (
                "Submit Review"
              )}
            </Button>

            {onClose && (
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>
              * Your review will be public and help other customers make
              informed decisions. Reviews are moderated and may be hidden if
              they violate our guidelines.
            </p>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ReviewForm;
