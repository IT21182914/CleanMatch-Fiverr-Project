import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";

const TrustIndicators = ({
  className = "",
  showBadges = true,
  showTestimonials = true,
  maxTestimonials = 3,
  layout = "default", // "default", "horizontal", "compact"
}) => {
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrustIndicators = useCallback(async () => {
    try {
      setLoading(true);

      const responses = await Promise.allSettled([
        showBadges ? api.get("/trust/public") : Promise.resolve(null),
        showTestimonials
          ? api.get(`/trust/testimonials/featured?limit=${maxTestimonials}`)
          : Promise.resolve(null),
      ]);

      const trustIndicators =
        responses[0].status === "fulfilled" ? responses[0].value?.data : null;
      const testimonials =
        responses[1].status === "fulfilled" ? responses[1].value?.data : null;

      setTrustData({
        badges: trustIndicators?.trustIndicators?.badges || [],
        testimonials: testimonials?.testimonials || [],
      });
    } catch (error) {
      console.error("Error fetching trust indicators:", error);
      // Set fallback data
      setTrustData({
        badges: [],
        testimonials: [],
      });
    } finally {
      setLoading(false);
    }
  }, [showBadges, showTestimonials, maxTestimonials]);

  useEffect(() => {
    fetchTrustIndicators();
  }, [fetchTrustIndicators]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          {showBadges && (
            <div className="flex justify-center space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          )}
          {showTestimonials && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg p-4 h-32"></div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    if (!rating) return null;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const TrustBadges = () => {
    if (!showBadges || !trustData?.badges?.length) return null;

    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Featured In
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {trustData.badges.map((badge) => (
            <div
              key={badge.id}
              className="group transition-all duration-200 hover:scale-105"
            >
              {badge.external_url ? (
                <a
                  href={badge.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={badge.image_url}
                    alt={badge.name}
                    className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                    title={badge.description || badge.name}
                  />
                </a>
              ) : (
                <img
                  src={badge.image_url}
                  alt={badge.name}
                  className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                  title={badge.description || badge.name}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        {testimonial.rating && (
          <div className="mb-2">{renderStars(testimonial.rating)}</div>
        )}
        <blockquote className="text-gray-700 italic leading-relaxed">
          "{testimonial.content}"
        </blockquote>
      </div>

      <div className="flex items-center space-x-3">
        {testimonial.image_url && (
          <img
            src={testimonial.image_url}
            alt={testimonial.customer_name}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-medium text-gray-800">
            {testimonial.customer_name}
          </div>
          {testimonial.customer_title && (
            <div className="text-sm text-gray-600">
              {testimonial.customer_title}
            </div>
          )}
          {testimonial.customer_location && (
            <div className="text-sm text-gray-500">
              {testimonial.customer_location}
            </div>
          )}
          {testimonial.service_type && (
            <div className="text-xs text-blue-600 mt-1">
              {testimonial.service_type}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const Testimonials = () => {
    if (!showTestimonials || !trustData?.testimonials?.length) return null;

    if (layout === "compact") {
      return (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            What Our Customers Say
          </h3>
          <div className="space-y-4">
            {trustData.testimonials.slice(0, 2).map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {testimonial.rating && renderStars(testimonial.rating)}
                  <span className="text-sm font-medium text-gray-800">
                    {testimonial.customer_name}
                  </span>
                </div>
                <p className="text-sm text-gray-700 italic">
                  "
                  {testimonial.content.length > 120
                    ? testimonial.content.substring(0, 120) + "..."
                    : testimonial.content}
                  "
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          What Our Customers Say
        </h3>
        <div
          className={`grid gap-6 ${
            layout === "horizontal"
              ? "grid-cols-1 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {trustData.testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    );
  };

  if (!trustData?.badges?.length && !trustData?.testimonials?.length) {
    return null;
  }

  return (
    <div className={className}>
      <div className="space-y-12">
        <TrustBadges />
        <Testimonials />
      </div>

      {/* Trust Guarantees */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Your Trust is Our Priority
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 mb-1">
              100% Satisfaction
            </h4>
            <p className="text-sm text-gray-600">
              Guaranteed or your money back
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 mb-1">Fully Insured</h4>
            <p className="text-sm text-gray-600">
              All cleaners are bonded & insured
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 mb-1">
              Vetted Professionals
            </h4>
            <p className="text-sm text-gray-600">
              Background checked & trained
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
