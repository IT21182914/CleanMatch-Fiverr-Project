import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  Zap,
  Brain,
  Target,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Button from "../ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Spinner } from "../ui/Loading";
import useAICleanerMatching from "../../hooks/useAICleanerMatching";

const AICleanerMatcher = ({ bookingData, onCleanerSelect, onBack }) => {
  const [selectedCleaner, setSelectedCleaner] = useState(null);

  const {
    recommendations,
    loading,
    error,
    matchingMode,
    fetchRecommendations,
    retryFetch,
    updateMatchingMode,
    getCleanerInsights,
    getMatchingModeDescription,
    getOptimizationSuggestions,
  } = useAICleanerMatching();

  useEffect(() => {
    if (bookingData) {
      fetchRecommendations(bookingData);
    }
  }, [bookingData, fetchRecommendations]);

  const handleModeChange = (newMode) => {
    updateMatchingMode(newMode);
    if (bookingData) {
      fetchRecommendations(bookingData);
    }
  };

  const getMatchingModeIcon = (mode) => {
    switch (mode) {
      case "ai":
        return <Brain className="w-4 h-4" />;
      case "zip":
        return <Target className="w-4 h-4" />;
      case "distance":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-orange-600 bg-orange-50";
  };

  const getZipProximityBadge = (cleaner) => {
    if (cleaner.isInSameZip) {
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          Same ZIP
        </span>
      );
    }
    if (cleaner.isInSameArea) {
      return (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          Same Area
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
        Different Area
      </span>
    );
  };

  const handleCleanerSelect = (cleaner) => {
    setSelectedCleaner(cleaner);
    onCleanerSelect(cleaner);
  };

  const currentModeInfo = getMatchingModeDescription(matchingMode);
  const suggestions = getOptimizationSuggestions(recommendations);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">
            Finding the best cleaners for you...
          </p>
          <p className="text-sm text-gray-500">
            AI is analyzing location, ratings, and availability
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          AI Cleaner Matching
        </h2>
        <p className="text-gray-600">
          Found {recommendations.length} cleaners available for{" "}
          {bookingData.zipCode}
        </p>
      </div>

      {/* Matching Mode Selector */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          {currentModeInfo.icon} {currentModeInfo.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {currentModeInfo.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {["ai", "zip", "distance"].map((mode) => {
            const modeInfo = getMatchingModeDescription(mode);
            return (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  matchingMode === mode
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getMatchingModeIcon(mode)}
                  <span className="font-medium">{modeInfo.title}</span>
                </div>
                <p className="text-xs text-gray-600">{modeInfo.description}</p>
              </button>
            );
          })}
        </div>

        {/* Current Mode Features */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-800 mb-2">
            Current Mode Features:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {currentModeInfo.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs text-gray-600"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            AI Optimization Suggestions
          </h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="text-sm text-yellow-800">
                <AlertCircle className="w-3 h-3 inline mr-2" />
                {suggestion.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button
            onClick={() => retryFetch(bookingData)}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Cleaner Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Recommended Cleaners (
            {matchingMode === "ai"
              ? "AI Ranked"
              : matchingMode === "zip"
              ? "ZIP Priority"
              : "Distance Sorted"}
            )
          </h3>

          <div className="grid gap-4">
            {recommendations.map((cleaner, index) => {
              const insights = getCleanerInsights(cleaner);

              return (
                <Card
                  key={cleaner.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCleaner?.id === cleaner.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleCleanerSelect(cleaner)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Cleaner Basic Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {cleaner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">
                              {cleaner.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              {getZipProximityBadge(cleaner)}
                              {index === 0 && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  🏆 Top Match
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">
                              {cleaner.rating.toFixed(1)} ({cleaner.totalJobs}{" "}
                              jobs)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">
                              {cleaner.distance} mi away
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm">
                              ${cleaner.hourlyRate}/hr
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span className="text-sm">
                              {cleaner.experienceYears}+ years
                            </span>
                          </div>
                        </div>

                        {/* AI Match Score */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {matchingMode === "ai"
                                ? "AI Match Score"
                                : matchingMode === "zip"
                                ? "ZIP Priority Score"
                                : "Distance Score"}
                              :
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(
                                cleaner.matchScore
                              )}`}
                            >
                              {cleaner.matchScore.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              ZIP: {cleaner.zipCode}
                            </span>
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            AI Insights:
                          </p>
                          <div className="space-y-1">
                            {insights.slice(0, 3).map((insight, idx) => (
                              <p
                                key={idx}
                                className={`text-xs ${
                                  insight.priority === "high"
                                    ? "text-green-700"
                                    : insight.priority === "medium"
                                    ? "text-blue-700"
                                    : "text-gray-600"
                                }`}
                              >
                                {insight.icon} {insight.text}
                              </p>
                            ))}
                            {insights.length > 3 && (
                              <p className="text-xs text-gray-500">
                                +{insights.length - 3} more insights
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedCleaner?.id === cleaner.id && (
                        <div className="ml-4">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back to Booking Details
        </Button>
        {selectedCleaner && (
          <Button
            onClick={() => onCleanerSelect(selectedCleaner)}
            className="flex-1"
          >
            Continue with {selectedCleaner.name}
          </Button>
        )}
      </div>

      {/* AI Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          How AI Matching Works
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            • <strong>ZIP Code Priority:</strong> Cleaners in your exact ZIP get
            25% bonus points
          </p>
          <p>
            • <strong>Distance Analysis:</strong> Closer cleaners receive higher
            scores
          </p>
          <p>
            • <strong>Quality Metrics:</strong> Reviews, experience, and job
            completion rates
          </p>
          <p>
            • <strong>Availability:</strong> Real-time schedule checking
          </p>
          <p>
            • <strong>Smart Ranking:</strong> Combines all factors for optimal
            matching
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICleanerMatcher;
