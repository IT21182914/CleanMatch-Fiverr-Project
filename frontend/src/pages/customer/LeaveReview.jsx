import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  StarIcon,
  UserCircleIcon,
  CalendarIcon,
  HomeIcon,
  CheckCircleIcon,
  HeartIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ModernPageLoader } from "../../components/ui/Loading";
import enhancedApi, { bookingsAPI } from "../../lib/api";
import { formatDateTime, formatCurrency } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

const LeaveReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [serviceQuality, setServiceQuality] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check authentication first
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to leave a review");
      navigate("/login");
      return;
    }

    // Skip if still loading auth
    if (authLoading) {
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await bookingsAPI.getById(bookingId);
        if (response.data.success) {
          setBooking(response.data.data);
        } else {
          toast.error("Booking not found");
          navigate("/customer/bookings");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Error loading booking details");
        navigate("/customer/bookings");
      }
    };

    const checkCanReview = async () => {
      try {
        const response = await enhancedApi.get(
          `/reviews/can-review/${bookingId}`
        );
        if (response.data.success) {
          if (!response.data.canReview) {
            toast.error(
              response.data.reason || "You cannot review this booking"
            );
            navigate("/customer/bookings");
          }
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error);
        toast.error("Error checking review eligibility");
        navigate("/customer/bookings");
      } finally {
        setLoading(false);
      }
    };

    const initializePage = async () => {
      await fetchBookingDetails();
      await checkCanReview();
    };

    initializePage();
  }, [bookingId, navigate, authLoading, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select an overall rating");
      return;
    }

    if (serviceQuality === 0 || punctuality === 0 || communication === 0) {
      toast.error("Please rate all aspects of the service");
      return;
    }

    if (wouldRecommend === null) {
      toast.error("Please indicate if you would recommend this cleaner");
      return;
    }

    try {
      setSubmitting(true);

      const reviewData = {
        bookingId: parseInt(bookingId),
        rating,
        comment: comment.trim() || null,
        serviceQuality,
        punctuality,
        communication,
        wouldRecommend,
      };

      const response = await enhancedApi.post("/reviews", reviewData);

      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/customer/bookings", {
            state: {
              message:
                "Review submitted successfully! Thank you for your feedback.",
            },
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage =
        error.response?.data?.error || "Error submitting review";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, size = "large" }) => {
    const [hovered, setHovered] = useState(0);
    const starSize = size === "large" ? "w-10 h-10" : "w-6 h-6";

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-all duration-200 transform hover:scale-110"
          >
            {star <= (hovered || value) ? (
              <StarIconSolid className={`${starSize} text-yellow-400`} />
            ) : (
              <StarIcon
                className={`${starSize} text-gray-300 hover:text-yellow-300`}
              />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (loading || authLoading) {
    return <ModernPageLoader />;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center shadow-xl border border-green-100">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircleIcon className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Review Submitted!
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for taking the time to share your feedback. Your review
              helps others find great cleaning services.
            </p>
            <div className="flex justify-center">
              <div className="bg-yellow-50 p-3 rounded-full">
                <StarIconSolid className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/customer/bookings")}
            className="p-2 hover:bg-white/50 rounded-full transition-colors mr-4"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Leave a Review
            </h1>
            <p className="text-gray-600 mt-1">
              Share your experience with others
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <HomeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="w-10 h-10 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking?.cleaner
                        ? `${booking.cleaner.first_name} ${booking.cleaner.last_name}`
                        : "Cleaner information unavailable"}
                    </p>
                    <p className="text-sm text-gray-600">Your cleaner</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span>{formatDateTime(booking?.date, booking?.time)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <HomeIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span>{booking?.service?.name}</span>
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    <span className="text-gray-600 mr-3">Total:</span>
                    <span className="text-green-600">
                      {formatCurrency(booking?.total_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-xl font-bold text-gray-900">
                  How was your cleaning experience?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Your honest feedback helps us maintain high service standards
                  and helps other customers make informed decisions.
                </p>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Overall Rating */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Overall Rating
                    </h3>
                    <StarRating value={rating} onChange={setRating} />
                    <p className="text-sm text-gray-600 mt-2">
                      {rating === 0 && "Click to rate"}
                      {rating === 1 && "Poor - Not satisfied"}
                      {rating === 2 && "Fair - Below expectations"}
                      {rating === 3 && "Good - Met expectations"}
                      {rating === 4 && "Very Good - Exceeded expectations"}
                      {rating === 5 && "Excellent - Outstanding service"}
                    </p>
                  </div>

                  {/* Detailed Ratings */}
                  <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Rate specific aspects:
                    </h4>

                    <div className="grid sm:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="font-medium text-gray-700 mb-2">
                          Service Quality
                        </p>
                        <StarRating
                          value={serviceQuality}
                          onChange={setServiceQuality}
                          size="small"
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-700 mb-2">
                          Punctuality
                        </p>
                        <StarRating
                          value={punctuality}
                          onChange={setPunctuality}
                          size="small"
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-700 mb-2">
                          Communication
                        </p>
                        <StarRating
                          value={communication}
                          onChange={setCommunication}
                          size="small"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <HeartIcon className="w-5 h-5 mr-2 text-red-500" />
                      Would you recommend this cleaner?
                    </h4>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setWouldRecommend(true)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          wouldRecommend === true
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-green-300 text-gray-600"
                        }`}
                      >
                        👍 Yes, absolutely!
                      </button>
                      <button
                        type="button"
                        onClick={() => setWouldRecommend(false)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          wouldRecommend === false
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-red-300 text-gray-600"
                        }`}
                      >
                        👎 Not really
                      </button>
                    </div>
                  </div>

                  {/* Written Review */}
                  <div>
                    <label className="block font-semibold text-gray-900 mb-4">
                      Share your experience (optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell others about your experience... Was the cleaner professional? Did they pay attention to detail? Any specific highlights or areas for improvement?"
                      rows={6}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {comment.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={
                        submitting ||
                        rating === 0 ||
                        serviceQuality === 0 ||
                        punctuality === 0 ||
                        communication === 0 ||
                        wouldRecommend === null
                      }
                      className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting Review...
                        </div>
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Your review will be visible to other customers
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReview;
