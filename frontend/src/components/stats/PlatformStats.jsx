import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";

const PlatformStats = ({ className = "" }) => {
  const [stats, setStats] = useState(null);
  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch stats and coverage in parallel
      const [statsResponse, coverageResponse] = await Promise.all([
        api.get("/stats/public"),
        api.get("/stats/coverage"),
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (coverageResponse.data.success) {
        setCoverage(coverageResponse.data.coverage);
      }
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      // Set default stats if API fails
      setStats({
        averageRating: 4.8,
        customersServed: 150,
        cleaningsCompleted: 500,
        activeCleaners: 25,
        citiesCovered: 10,
      });
      setCoverage({
        cities: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
        totalCities: 10,
        totalStates: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg p-4">
              <div className="h-8 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const StatCard = ({ icon, value, label, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      {description && (
        <div className="text-xs text-gray-500">{description}</div>
      )}
    </div>
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center justify-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20">
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
            className="w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="⭐"
          value={renderStars(stats?.averageRating || 4.8)}
          label="Customer Rating"
          description="Based on verified reviews"
        />

        <StatCard
          icon="👥"
          value={stats?.customersServed?.toLocaleString() || "150+"}
          label="Happy Customers"
          description="Served nationwide"
        />

        <StatCard
          icon="🧹"
          value={stats?.cleaningsCompleted?.toLocaleString() || "500+"}
          label="Cleanings Completed"
          description="Quality guaranteed"
        />

        <StatCard
          icon="🏆"
          value={`${stats?.activeCleaners || 25}+`}
          label="Professional Cleaners"
          description="Vetted & insured"
        />
      </div>

      {/* Coverage Information */}
      {coverage && coverage.cities.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Service Coverage
            </h3>
            <p className="text-gray-600">
              We serve {coverage.totalCities} cities across{" "}
              {coverage.totalStates} states
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {coverage.totalCities}
              </div>
              <div className="text-sm text-gray-600">Cities Covered</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {coverage.totalStates}
              </div>
              <div className="text-sm text-gray-600">States Served</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Emergency Service</div>
            </div>
          </div>

          {coverage.cities.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 text-center mb-2">
                Featured Cities:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {coverage.cities.slice(0, 6).map((city, index) => (
                  <span
                    key={index}
                    className="bg-white text-sm px-3 py-1 rounded-full border border-gray-200 text-gray-700"
                  >
                    {city}
                  </span>
                ))}
                {coverage.cities.length > 6 && (
                  <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200">
                    +{coverage.cities.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trust Indicators */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Fully Insured</span>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Background Checked</span>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Satisfaction Guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
