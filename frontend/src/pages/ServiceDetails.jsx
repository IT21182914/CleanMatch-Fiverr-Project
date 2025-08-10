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
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { allServices } from "../data/services";
import { getServiceImage } from "../utils/serviceImages";
import ServiceImage from "../components/ui/ServiceImage";

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4EC6E5] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
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
          <p className="text-gray-600 mb-8">
            The service you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/services")}
            className="bg-[#4EC6E5] text-white px-6 py-3 rounded-lg hover:bg-[#2BA8CD] transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  // Special content for "Cleaning of the house and apartment" service
  const isHouseCleaningService = service.id === 1;

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
            {isHouseCleaningService ? (
              <>
                {/* Special content for house cleaning service */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Always tired of cleaning after a long day?
                  </h2>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    Let Simorgh take care of your home so you can come back to a
                    space that feels fresh, organized, and welcoming. Whether
                    it's your apartment or house, our professional cleaning team
                    makes sure every corner shines.
                  </p>

                  {/* Limited Time Offer */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-8 rounded-xl mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-500 rounded-full">
                        <FireIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-green-900">
                        Limited Time Offer
                      </h3>
                    </div>
                    <p className="text-green-800 text-xl leading-relaxed">
                      Enjoy our expert cleaning service for only{" "}
                      <span className="font-bold text-3xl text-green-900">
                        {service.memberPrice}
                      </span>{" "}
                      with membership, instead of the regular{" "}
                      <span className="line-through text-gray-500 text-lg">
                        {service.regularPrice}
                      </span>
                      . That's professional-quality cleaning at half the price.
                    </p>
                  </div>

                  {/* Service Image Display */}
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={getServiceImage(service.name)}
                      alt={service.name}
                      className="w-full h-auto object-contain bg-gradient-to-br from-blue-50 to-cyan-50"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Why choose Simorgh for your home cleaning?
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-green-500 rounded-full">
                        <CheckBadgeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Skilled cleaners
                        </h4>
                        <p className="text-gray-600 text-base">
                          trained to handle every detail of your home
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-blue-500 rounded-full">
                        <ShieldCheckIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Consistent quality
                        </h4>
                        <p className="text-gray-600 text-base">
                          and reliability every time you book
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-purple-500 rounded-full">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Flexible scheduling
                        </h4>
                        <p className="text-gray-600 text-base">
                          to fit your lifestyle
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-yellow-500 rounded-full">
                        <SparklesIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Perfect for regular upkeep
                        </h4>
                        <p className="text-gray-600 text-base">
                          or one-time deep cleaning
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-full">
                        <TrophyIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        Book Now and Experience the Difference
                      </h3>
                    </div>
                    <p className="mb-6 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                      Say goodbye to stress and hours of cleaning — simply book
                      online and enjoy a spotless home without lifting a finger.
                    </p>
                    <button
                      onClick={handleBookNow}
                      className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      Book Your Cleaning Now
                    </button>
                  </div>
                </div>

                {/* Website Link */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-[#4EC6E5]/10 rounded-full">
                      <GlobeAltIcon className="h-6 w-6 text-[#4EC6E5]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Visit Our Website
                    </h3>
                  </div>
                  <a
                    href="https://www.simorghservice.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4EC6E5] hover:text-[#2BA8CD] underline font-medium text-lg"
                  >
                    https://www.simorghservice.com/
                  </a>
                </div>

                {/* Social Media & Tags */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 bg-[#4EC6E5]/10 rounded-full">
                      <ShareIcon className="h-6 w-6 text-[#4EC6E5]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Follow Us on Social Media
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "#simorghservicegroup",
                      "#simorghcleaning",
                      "#cleaningagentinamerica",
                      "#cleaningservicesinlosangeles",
                      "#apartmentcleaninginlosanngeles",
                      "#apartmentcleaning",
                      "#housecleaning",
                      "#housecleaninginlosangeles",
                      "#cleanliving",
                      "#homerefresh",
                      "#bedroomsanctuary",
                      "#cleanhomevibes",
                      "#homecleaning",
                      "#homecareexpertsinlosangeles",
                    ].map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-[#4EC6E5]/10 to-[#2BA8CD]/10 text-[#4EC6E5] px-4 py-2 rounded-full text-sm font-medium border border-[#4EC6E5]/20 hover:border-[#4EC6E5]/40 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Default service content */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    About This Service
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckBadgeIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              {/* Service Image Preview */}
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={getServiceImage(service.name)}
                  alt={service.name}
                  className="w-full h-32 object-contain bg-gradient-to-br from-slate-50 to-blue-50"
                  loading="lazy"
                />
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-3 mb-3">
                  <span className="text-4xl font-bold text-[#4EC6E5]">
                    {service.memberPrice}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {service.regularPrice}
                  </span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 inline-block">
                  <p className="text-sm font-semibold text-green-700">
                    Save up to 50% with membership
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-gray-700 p-3 bg-gray-50 rounded-lg">
                  <div className="p-1 bg-[#4EC6E5]/10 rounded-full">
                    <ClockIcon className="h-4 w-4 text-[#4EC6E5]" />
                  </div>
                  <span className="font-medium">Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700 p-3 bg-gray-50 rounded-lg">
                  <div className="p-1 bg-[#4EC6E5]/10 rounded-full">
                    <UsersIcon className="h-4 w-4 text-[#4EC6E5]" />
                  </div>
                  <span className="font-medium">Professional cleaners</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700 p-3 bg-gray-50 rounded-lg">
                  <div className="p-1 bg-[#4EC6E5]/10 rounded-full">
                    <ShieldCheckIcon className="h-4 w-4 text-[#4EC6E5]" />
                  </div>
                  <span className="font-medium">
                    100% satisfaction guaranteed
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-[#4EC6E5] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2BA8CD] transition-colors mb-3"
              >
                Book Now
              </button>

              <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
                Contact Us
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Service Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bookings this month</span>
                  <span className="font-semibold">324</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average rating</span>
                  <div className="flex items-center gap-1">
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Availability</span>
                  <span className="text-green-600 font-semibold">Today</span>
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
