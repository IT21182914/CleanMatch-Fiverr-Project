import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarIcon,
  UsersIcon,
  PhoneIcon,
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  ShareIcon,
  GlobeAltIcon,
  FireIcon,
  TrophyIcon,
  SparklesIcon,
  TruckIcon,
  HomeIcon,
  KeyIcon,
  EyeIcon,
  WindowIcon,
  SunIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  BugAntIcon,
  UserGroupIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { allServices } from "../data/services";
import { getServiceImage } from "../utils/serviceImages";
import ServiceImage from "../components/ui/ServiceImage";

// Import individual service components
import Service1 from "../components/services/Service1";
import Service2 from "../components/services/Service2";
import Service3 from "../components/services/Service3";
import Service4 from "../components/services/Service4";
import Service5 from "../components/services/Service5";
import Service6 from "../components/services/Service6";
import Service7 from "../components/services/Service7";
import Service8 from "../components/services/Service8";
import Service9 from "../components/services/Service9";
import Service10 from "../components/services/Service10";
import Service11 from "../components/services/Service11";
import Service12 from "../components/services/Service12";
import Service13 from "../components/services/Service13";
import Service14 from "../components/services/Service14";
import Service15 from "../components/services/Service15";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the service by id
    const foundService = allServices.find((s) => s.id === parseInt(id));
    setService(foundService);
    setLoading(false);

    if (foundService) {
      // Update page title
      document.title = `${foundService.name} - CleanMatch`;
    }
  }, [id]);

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
    navigate("/customer/book-service", {
      state: {
        selectedService: service,
        fromServiceDetails: true,
      },
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: service.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  // Render custom service component if available
  const renderServiceComponent = () => {
    switch (service.id) {
      case 1:
        return <Service1 service={service} handleBookNow={handleBookNow} />;
      case 2:
        return <Service2 service={service} handleBookNow={handleBookNow} />;
      case 3:
        return <Service3 service={service} handleBookNow={handleBookNow} />;
      case 4:
        return <Service4 service={service} handleBookNow={handleBookNow} />;
      case 5:
        return <Service5 service={service} handleBookNow={handleBookNow} />;
      case 6:
        return <Service6 service={service} handleBookNow={handleBookNow} />;
      case 7:
        return <Service7 service={service} handleBookNow={handleBookNow} />;
      case 8:
        return <Service8 service={service} handleBookNow={handleBookNow} />;
      case 9:
        return <Service9 service={service} handleBookNow={handleBookNow} />;
      case 10:
        return <Service10 service={service} handleBookNow={handleBookNow} />;
      case 11:
        return <Service11 service={service} handleBookNow={handleBookNow} />;
      case 12:
        return <Service12 service={service} handleBookNow={handleBookNow} />;
      case 13:
        return <Service13 service={service} handleBookNow={handleBookNow} />;
      case 14:
        return <Service14 service={service} handleBookNow={handleBookNow} />;
      case 15:
        return <Service15 service={service} handleBookNow={handleBookNow} />;
      default:
        return renderDefaultService();
    }
  };

  const renderDefaultService = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <ServiceImage
          service={service}
          className="w-full h-64 sm:h-80 object-cover rounded-xl mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Professional {service.name}
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {service.description}
        </p>
      </div>

      {/* Service Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <CheckBadgeIcon className="h-5 w-5 text-[#4EC6E5] mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Professional service guaranteed
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <ShieldCheckIcon className="h-5 w-5 text-[#4EC6E5] mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Insured and bonded cleaners
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <ClockIcon className="h-5 w-5 text-[#4EC6E5] mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Flexible scheduling available
          </span>
        </div>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <StarIcon className="h-5 w-5 text-[#4EC6E5] mt-1 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Satisfaction guaranteed
          </span>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Book?</h3>
        <p className="text-lg mb-6 text-white/90">
          Get professional {service.name.toLowerCase()} service today
        </p>
        <button
          onClick={handleBookNow}
          className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Book Service Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header Navigation */}
      <div className="sticky top-0 z-[60] bg-white backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 min-h-[60px] sm:min-h-[64px]">
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium p-2 -ml-2 rounded-lg touch-manipulation"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="text-sm sm:text-base">Back to Services</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-manipulation"
              >
                {isLiked ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-manipulation"
              >
                <ShareIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Title Section */}
      <div className="relative z-20 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            {service.popular && (
              <div className="flex items-center gap-1 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                <StarIconSolid className="h-3 w-3" />
                <span>Popular</span>
              </div>
            )}
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
              {service.category}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            {service.name}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">4.8</span>
              <span className="text-white/80">(324 reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckBadgeIcon className="h-5 w-5 text-green-400" />
              <span className="text-white/90">Verified Service</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {renderServiceComponent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Service Image */}
              <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                <img
                  src={getServiceImage(service.name)}
                  alt={service.name}
                  className="w-full h-40 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {service.memberPrice}
                  <span className="text-lg font-normal text-gray-500">
                    /session
                  </span>
                </div>
                <div className="text-sm text-gray-500 line-through">
                  Regular: {service.regularPrice}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Save{" "}
                  {(
                    ((parseFloat(service.regularPrice.replace("$", "")) -
                      parseFloat(service.memberPrice.replace("$", ""))) /
                      parseFloat(service.regularPrice.replace("$", ""))) *
                    100
                  ).toFixed(0)}
                  % with membership
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-[#4EC6E5] text-white py-4 rounded-xl font-semibold hover:bg-[#3AA8CC] transition-colors mb-4 text-lg"
              >
                Book Now
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <CheckBadgeIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Satisfaction guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Flexible scheduling</span>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <PhoneIcon className="h-5 w-5 text-[#4EC6E5]" />
                  <span className="font-medium">Call Us</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-[#4EC6E5]" />
                  <span className="font-medium">Live Chat</span>
                </button>
              </div>
            </div>

            {/* Service Highlights */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Why Choose Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-[#4EC6E5]/10 rounded-full">
                    <CheckBadgeIcon className="h-4 w-4 text-[#4EC6E5]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      Vetted Professionals
                    </div>
                    <div className="text-gray-600 text-xs">
                      Background checked & insured
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-[#4EC6E5]/10 rounded-full">
                    <StarIconSolid className="h-4 w-4 text-[#4EC6E5]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      Top Rated Service
                    </div>
                    <div className="text-gray-600 text-xs">
                      4.8+ average rating
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-[#4EC6E5]/10 rounded-full">
                    <ShieldCheckIcon className="h-4 w-4 text-[#4EC6E5]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      Satisfaction Guarantee
                    </div>
                    <div className="text-gray-600 text-xs">
                      100% satisfaction or we'll make it right
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
