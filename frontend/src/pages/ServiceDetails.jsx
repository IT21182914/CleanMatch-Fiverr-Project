import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { servicesAPI } from "../lib/api";
import { getServiceImage } from "../utils/serviceImages";
import LoginRequiredModal from "../components/ui/LoginRequiredModal";
import { useAuth } from "../hooks/useAuth";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);

        // Multiple scroll-to-top approaches to ensure it works
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Fetch service data from API
        const response = await servicesAPI.getById(id);

        if (response.data?.success) {
          const serviceData = response.data.data;

          // Transform API data to match the expected structure
          const transformedService = {
            id: serviceData.id,
            name: serviceData.name,
            description: serviceData.description,
            category: serviceData.category,
            memberPrice: `$${serviceData.membership_price}/h`,
            regularPrice: `$${serviceData.base_price}/h`,
            duration: serviceData.duration_hours,
            features: serviceData.features || [],
            benefits: serviceData.benefits || [],
            process: serviceData.process || [],
            pricing_details: serviceData.pricing_details || {},
            frequently_asked_questions: serviceData.frequently_asked_questions || [],
            created_at: serviceData.created_at,
            updated_at: serviceData.updated_at
          };

          setService(transformedService);

          // Update page title
          document.title = `${transformedService.name} - CleanMatch`;
        } else {
          setService(null);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        setService(null);
      } finally {
        setLoading(false);

        // Additional scroll after state update
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        }, 0);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  // Additional useEffect to ensure scroll to top after component is fully rendered
  useEffect(() => {
    if (!loading && service) {
      // Force scroll to top after the component is fully rendered
      const forceScrollToTop = () => {
        // Try multiple scroll methods
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Target main element
        const mainElement = document.querySelector("main");
        if (mainElement) {
          mainElement.scrollTop = 0;
        }
      };

      // Execute immediately
      forceScrollToTop();

      // Execute with requestAnimationFrame
      requestAnimationFrame(forceScrollToTop);

      // Execute with small delay
      setTimeout(forceScrollToTop, 50);

      // Execute with longer delay as backup
      setTimeout(forceScrollToTop, 200);
    }
  }, [loading, service]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4EC6E5] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/services")}
            className="bg-[#4EC6E5] text-white px-6 py-3 rounded-lg hover:bg-[#3AA8CC] transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // If authenticated, proceed with booking - navigate to book page with service ID
    // Use replace to remove navigation history
    navigate(`/book?serviceId=${service.id}&serviceName=${encodeURIComponent(service.name)}&view=booking`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header Navigation */}
      <div className="sticky top-0 z-[10] bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center py-2 sm:py-3">
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium p-2 -ml-2 rounded-lg touch-manipulation hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="text-sm sm:text-base">Back to Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8">
        {/* Service Details Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
          {/* Service Image */}
          <div className="relative h-40 sm:h-56 lg:h-80 bg-gradient-to-br from-blue-50 to-cyan-50">
            <img
              src={getServiceImage(service.name)}
              alt={service.name}
              className="w-full h-full object-contain p-2 sm:p-4"
              loading="lazy"
            />
            {/* Category Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="inline-block bg-[#4EC6E5] text-white rounded-lg text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 shadow-lg">
                {service.category}
              </span>
            </div>
            {/* Popular Badge */}
            {service.popular && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <div className="flex items-center gap-1 bg-yellow-500 text-yellow-900 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
                  <StarIconSolid className="h-3 w-3" />
                  <span>Popular</span>
                </div>
              </div>
            )}
          </div>

          {/* Service Information */}
          <div className="p-3 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                  {service.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <StarIconSolid className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    <span className="font-semibold text-sm sm:text-base">4.8</span>
                    <span className="text-gray-600 text-xs sm:text-sm">(324 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckBadgeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    <span className="text-gray-700 text-xs sm:text-sm">Verified Service</span>
                  </div>
                  {service.duration && (
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4EC6E5]" />
                      <span className="text-gray-700 text-xs sm:text-sm">{service.duration} hours</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Pricing & Booking Section */}
              <div className="w-full lg:min-w-[280px] lg:max-w-[300px] bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] rounded-lg lg:rounded-xl p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {service.memberPrice}
                    <span className="text-sm sm:text-base lg:text-lg font-normal text-gray-500 ml-1">
                      per hour
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 line-through mb-1">
                    Regular: {service.regularPrice}
                  </div>
                  <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                    Save up to 50% with Membership
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-3 sm:py-4 rounded-lg lg:rounded-xl font-semibold hover:from-[#3BB8DF] hover:to-[#2293B5] transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 active:scale-95"
                >
                  Book Service Now
                </button>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckBadgeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span>Satisfaction guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span>Flexible scheduling</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Features */}
            {service.features && service.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">What's Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckBadgeIcon className="h-5 w-5 text-[#4EC6E5] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] rounded-lg">
                      <SparklesIcon className="h-5 w-5 text-[#4EC6E5] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Process */}
            {service.process && service.process.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-3">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="bg-[#4EC6E5] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 text-sm sm:text-base">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {service.frequently_asked_questions && service.frequently_asked_questions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {service.frequently_asked_questions.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{faq.question}</h4>
                      <p className="text-gray-700 text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Default Service Features if no API features */}
            {(!service.features || service.features.length === 0) && (
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Service Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckBadgeIcon className="h-5 w-5 text-[#4EC6E5] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Professional service guaranteed</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <ShieldCheckIcon className="h-5 w-5 text-[#4EC6E5] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Insured and bonded cleaners</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-[#4EC6E5] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Flexible scheduling available</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <StarIcon className="h-5 w-5 text-[#4EC6E5] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Satisfaction guaranteed</span>
                  </div>
                </div>
              </div>
            )}

            {/* Final CTA Section */}
            <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">Ready to Book?</h3>
              <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 text-white/90">
                Get professional {service.name.toLowerCase()} service today
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
                <button
                  onClick={handleBookNow}
                  className="w-full sm:w-auto bg-white text-[#4EC6E5] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg lg:rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-lg active:scale-95"
                >
                  Book Service Now
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg lg:rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 text-sm sm:text-base lg:text-lg border border-white/30 active:scale-95"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        service={service}
      />
    </div>
  );
};

export default ServiceDetails;
