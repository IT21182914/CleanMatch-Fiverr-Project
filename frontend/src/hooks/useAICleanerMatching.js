import { useState, useCallback } from "react";
import { bookingsAPI } from "../lib/api";

export const useAICleanerMatching = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchingMode, setMatchingMode] = useState("ai");

  const fetchRecommendations = useCallback(
    async (bookingData) => {
      setLoading(true);
      setError(null);

      try {
        const searchData = {
          zipCode: bookingData.zipCode,
          latitude: bookingData.latitude,
          longitude: bookingData.longitude,
          bookingDate: bookingData.scheduledDate,
          bookingTime: bookingData.scheduledTime,
          durationHours: bookingData.durationHours || 2,
          serviceId: bookingData.serviceId,
          limit: 10,
          matchingMode, // Include the current matching mode
        };

        console.log("Fetching AI recommendations with data:", searchData);
        const response = await bookingsAPI.getZipBasedRecommendations(
          searchData
        );

        if (response.data.success) {
          let sortedRecommendations = response.data.data.recommendations;

          // Apply different sorting based on matching mode
          switch (matchingMode) {
            case "zip":
              sortedRecommendations.sort((a, b) => {
                // First by ZIP proximity, then by rating
                if (a.zipProximityScore !== b.zipProximityScore) {
                  return b.zipProximityScore - a.zipProximityScore;
                }
                return b.rating - a.rating;
              });
              break;
            case "distance":
              sortedRecommendations.sort((a, b) => {
                // First by distance, then by rating
                if (a.distance !== b.distance) {
                  return a.distance - b.distance;
                }
                return b.rating - a.rating;
              });
              break;
            case "ai":
            default:
              // Already sorted by AI match score from backend
              break;
          }

          setRecommendations(sortedRecommendations);
          return sortedRecommendations;
        } else {
          setError("No cleaners found for your area and time slot");
          return [];
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to find available cleaners. Please try again.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [matchingMode]
  );

  const retryFetch = useCallback(
    (bookingData) => {
      return fetchRecommendations(bookingData);
    },
    [fetchRecommendations]
  );

  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setError(null);
  }, []);

  const updateMatchingMode = useCallback((mode) => {
    setMatchingMode(mode);
  }, []);

  // AI Insights functions
  const getCleanerInsights = useCallback((cleaner) => {
    const insights = [];

    if (cleaner.isInSameZip) {
      insights.push({
        type: "location",
        icon: "📍",
        text: "Located in your exact ZIP code",
        priority: "high",
      });
    } else if (cleaner.isInSameArea) {
      insights.push({
        type: "location",
        icon: "🗺️",
        text: "Located in your local area",
        priority: "medium",
      });
    }

    if (cleaner.rating >= 4.5) {
      insights.push({
        type: "quality",
        icon: "⭐",
        text: "Highly rated by customers",
        priority: "high",
      });
    }

    if (cleaner.distance <= 5) {
      insights.push({
        type: "proximity",
        icon: "🚗",
        text: "Very close to your location",
        priority: "medium",
      });
    }

    if (cleaner.experienceYears >= 3) {
      insights.push({
        type: "experience",
        icon: "👨‍💼",
        text: "Experienced professional",
        priority: "medium",
      });
    }

    if (cleaner.totalJobs >= 50) {
      insights.push({
        type: "track_record",
        icon: "✅",
        text: "Proven track record",
        priority: "medium",
      });
    }

    if (cleaner.hourlyRate <= 25) {
      insights.push({
        type: "value",
        icon: "💰",
        text: "Competitive pricing",
        priority: "low",
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, []);

  const getMatchingModeDescription = useCallback((mode) => {
    switch (mode) {
      case "ai":
        return {
          title: "AI Smart Match",
          description:
            "Advanced algorithm analyzes multiple factors including location, ratings, experience, and availability patterns",
          icon: "🤖",
          features: [
            "ZIP code proximity analysis",
            "Distance optimization",
            "Quality score weighting",
            "Availability intelligence",
          ],
        };
      case "zip":
        return {
          title: "ZIP Code Priority",
          description:
            "Prioritizes cleaners in your exact ZIP code and surrounding areas for maximum locality",
          icon: "📮",
          features: [
            "Exact ZIP matches first",
            "Same area preference",
            "Regional fallback",
            "Local market focus",
          ],
        };
      case "distance":
        return {
          title: "Distance Based",
          description:
            "Shows cleaners sorted by physical distance from your location",
          icon: "📏",
          features: [
            "Closest first",
            "Reduced travel time",
            "Lower transportation costs",
            "Quick response times",
          ],
        };
      default:
        return {
          title: "Smart Match",
          description: "Intelligent matching algorithm",
          icon: "⚡",
          features: [],
        };
    }
  }, []);

  const getOptimizationSuggestions = useCallback((recommendations) => {
    const suggestions = [];

    if (recommendations.length === 0) {
      suggestions.push({
        type: "no_results",
        message:
          "No cleaners found. Try expanding your search area or selecting a different time slot.",
        action: "expand_search",
      });
      return suggestions;
    }

    const topMatch = recommendations[0];
    const avgRating =
      recommendations.reduce((sum, c) => sum + c.rating, 0) /
      recommendations.length;
    const avgDistance =
      recommendations.reduce((sum, c) => sum + c.distance, 0) /
      recommendations.length;

    if (topMatch.matchScore < 70) {
      suggestions.push({
        type: "low_match",
        message: "Consider adjusting your date/time for better matches.",
        action: "adjust_time",
      });
    }

    if (avgDistance > 15) {
      suggestions.push({
        type: "distance",
        message:
          "Most available cleaners are far from your location. Consider expanding your search area.",
        action: "expand_area",
      });
    }

    if (avgRating < 4.0) {
      suggestions.push({
        type: "quality",
        message:
          "Consider scheduling during peak hours for access to top-rated cleaners.",
        action: "peak_hours",
      });
    }

    const sameZipCount = recommendations.filter((c) => c.isInSameZip).length;
    if (sameZipCount > 0) {
      suggestions.push({
        type: "local_advantage",
        message: `${sameZipCount} cleaner${
          sameZipCount > 1 ? "s" : ""
        } available in your ZIP code for faster service.`,
        action: "local_focus",
      });
    }

    return suggestions;
  }, []);

  return {
    recommendations,
    loading,
    error,
    matchingMode,
    fetchRecommendations,
    retryFetch,
    clearRecommendations,
    updateMatchingMode,
    getCleanerInsights,
    getMatchingModeDescription,
    getOptimizationSuggestions,
  };
};

export default useAICleanerMatching;
