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

  // Special content for specific services
  const isHouseCleaningService = service.id === 1;
  const isDeepCleaningService = service.id === 2;
  const isOfficeCleaningService = service.id === 3;

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
              </>
            ) : isDeepCleaningService ? (
              <>
                {/* Special content for deep cleaning service */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    When surface cleaning isn't enough, we go deeper.
                  </h2>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    Simorgh's deep cleaning service targets every hidden corner,
                    removing dust, dirt, and buildup even in places you didn't
                    know needed attention. Perfect for when you want your home
                    to feel truly refreshed from top to bottom.
                  </p>

                  {/* Special Membership Price */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 rounded-xl mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500 rounded-full">
                        <SparklesIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-blue-900">
                        Special Membership Price
                      </h3>
                    </div>
                    <p className="text-blue-800 text-xl leading-relaxed">
                      Get our deep cleaning service for just{" "}
                      <span className="font-bold text-3xl text-blue-900">
                        {service.memberPrice}
                      </span>{" "}
                      with membership, instead of the regular{" "}
                      <span className="line-through text-gray-500 text-lg">
                        {service.regularPrice}
                      </span>
                      .
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
                    Why choose Simorgh deep cleaning?
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-blue-500 rounded-full">
                        <CheckBadgeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Cleans areas that regular cleaning can't reach
                        </h4>
                        <p className="text-gray-600 text-base">
                          Deep into corners and hidden spaces
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-purple-500 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Ideal for seasonal refreshes
                        </h4>
                        <p className="text-gray-600 text-base">
                          or special occasions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-green-500 rounded-full">
                        <SparklesIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Attention to detail
                        </h4>
                        <p className="text-gray-600 text-base">
                          in every room, every surface, every corner
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-yellow-500 rounded-full">
                        <TrophyIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Leaves your home brand new
                        </h4>
                        <p className="text-gray-600 text-base">
                          looking and feeling refreshed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-full">
                        <GlobeAltIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        Book Your Deep Clean Today
                      </h3>
                    </div>
                    <button
                      onClick={handleBookNow}
                      className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      Book Your Deep Cleaning Now
                    </button>
                  </div>
                </div>
              </>
            ) : isOfficeCleaningService ? (
              <>
                {/* Special content for office cleaning service */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    A clean office makes work easier and better.
                  </h2>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    A tidy, fresh workspace sets the tone for productivity,
                    professionalism, and focus. Let Simorgh handle the cleaning
                    so you and your team can concentrate on what truly matters —
                    growing your business.
                  </p>

                  {/* Special Membership Price */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-8 rounded-xl mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-500 rounded-full">
                        <FireIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-indigo-900">
                        Special Membership Price
                      </h3>
                    </div>
                    <p className="text-indigo-800 text-xl leading-relaxed">
                      Get professional office cleaning for just{" "}
                      <span className="font-bold text-3xl text-indigo-900">
                        {service.memberPrice}
                      </span>{" "}
                      with membership, instead of the regular{" "}
                      <span className="line-through text-gray-500 text-lg">
                        {service.regularPrice}
                      </span>
                      .
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Our office cleaning covers:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        Desks, chairs, and workstations
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        Floors, carpets, and entryways
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        Meeting rooms and reception areas
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        Break rooms, kitchens, and restrooms
                      </span>
                    </div>
                  </div>

                  {/* Service Image Display */}
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={getServiceImage(service.name)}
                      alt={service.name}
                      className="w-full h-auto object-contain bg-gradient-to-br from-indigo-50 to-purple-50"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Why choose Simorgh for your office cleaning?
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-green-500 rounded-full">
                        <CheckBadgeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Healthier work environment
                        </h4>
                        <p className="text-gray-600 text-base">
                          Creates a more inviting workspace for your team
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-red-500 rounded-full">
                        <ShieldCheckIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Reduces dust and allergens
                        </h4>
                        <p className="text-gray-600 text-base">
                          Eliminates germs in the workplace
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-blue-500 rounded-full">
                        <UsersIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Professional image
                        </h4>
                        <p className="text-gray-600 text-base">
                          for clients and visitors
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
                          to fit your office hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-indigo-500 rounded-full">
                        <ShieldCheckIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          Reliable cleaners
                        </h4>
                        <p className="text-gray-600 text-base">
                          who respect your workspace and confidentiality
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    How it works:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="text-center p-6 bg-indigo-50 rounded-xl">
                      <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Book Online
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Select your preferred date, time, and service.
                      </p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        We Arrive Ready
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Our team comes prepared with the right tools and
                        supplies.
                      </p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Enjoy a Spotless Office
                      </h4>
                      <p className="text-gray-600 text-sm">
                        A fresh, organized space that boosts morale and
                        productivity.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-full">
                        <GlobeAltIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        Book Your Office Cleaning Now
                      </h3>
                    </div>
                    <button
                      onClick={handleBookNow}
                      className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      Book Office Cleaning Now
                    </button>
                  </div>
                </div>
              </>
            ) : id === "4" ? (
              <>
                {/* Move in & out Cleaning - Service ID 4 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-lg">
                      <TruckIcon className="h-5 w-5" />
                      Moving Special - Complete Transition Service
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Make Your Move Stress-Free
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      Whether you're moving out and want your security deposit
                      back, or moving into a new space that needs to be
                      spotless, our comprehensive move-in/out cleaning service
                      ensures a seamless transition.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <div className="bg-[#4EC6E5]/10 border-l-4 border-[#4EC6E5] p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <HomeIcon className="h-5 w-5 text-[#4EC6E5]" />
                          Move-Out Cleaning
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Get your full security deposit back with our thorough
                          move-out cleaning service.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Deep clean all rooms and surfaces</li>
                          <li>• Inside appliances (oven, fridge, microwave)</li>
                          <li>• Bathroom deep sanitization</li>
                          <li>• Window and mirror cleaning</li>
                        </ul>
                      </div>

                      <div className="bg-[#2BA8CD]/10 border-l-4 border-[#2BA8CD] p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <KeyIcon className="h-5 w-5 text-[#2BA8CD]" />
                          Move-In Cleaning
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Start fresh in your new home with a pristine, move-in
                          ready space.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Complete property sanitization</li>
                          <li>• All surfaces disinfected</li>
                          <li>• Cabinets and drawers cleaned</li>
                          <li>• Final inspection included</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Why Choose Our Moving Cleaning?
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <CheckBadgeIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Deposit Back Guarantee
                            </p>
                            <p className="text-xs text-gray-600">
                              We ensure move-out cleaning meets landlord
                              standards
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <ClockIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Same-Day Service
                            </p>
                            <p className="text-xs text-gray-600">
                              Quick turnaround for urgent moving dates
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <UsersIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Experienced Team
                            </p>
                            <p className="text-xs text-gray-600">
                              Specialists in transition cleaning requirements
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Image Display */}
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={getServiceImage(service.name)}
                      alt={service.name}
                      className="w-full h-auto object-contain bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10"
                      loading="lazy"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Complete Moving Cleaning Checklist
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#4EC6E5]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <SparklesIcon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Deep Surface Clean
                        </h4>
                        <p className="text-gray-600 text-xs">
                          All surfaces wiped and disinfected
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#2BA8CD]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FireIcon className="h-6 w-6 text-[#2BA8CD]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Appliance Interior
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Inside ovens, fridges, microwaves
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#4EC6E5]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <GlobeAltIcon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Full Property Scope
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Every room, closet, and corner
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#2BA8CD]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <EyeIcon className="h-6 w-6 text-[#2BA8CD]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Final Inspection
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Quality check before handover
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-full">
                        <TruckIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        Book Your Moving Cleaning Today
                      </h3>
                    </div>
                    <p className="mb-6 opacity-90">
                      Make your move stress-free with professional cleaning
                      service
                    </p>
                    <button
                      onClick={handleBookNow}
                      className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      Book Moving Cleaning Now
                    </button>
                  </div>
                </div>
              </>
            ) : id === "5" ? (
              <>
                {/* Glass and Window Cleaning - Service ID 5 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-lg">
                      <WindowIcon className="h-5 w-5" />
                      Crystal Clear Views - Professional Window Service
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Let Natural Light Transform Your Space
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      Our expert window and glass cleaning service ensures
                      crystal-clear views and enhanced natural light throughout
                      your home or office. From interior and exterior windows to
                      glass doors and mirrors, we bring shine to every surface.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <div className="bg-[#4EC6E5]/10 border-l-4 border-[#4EC6E5] p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <WindowIcon className="h-5 w-5 text-[#4EC6E5]" />
                          Interior & Exterior Windows
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Complete window cleaning service for both inside and
                          outside surfaces.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Streak-free window cleaning</li>
                          <li>• Window frame and sill cleaning</li>
                          <li>• Screen removal and cleaning</li>
                          <li>• Water stain removal</li>
                        </ul>
                      </div>

                      <div className="bg-[#2BA8CD]/10 border-l-4 border-[#2BA8CD] p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <SunIcon className="h-5 w-5 text-[#2BA8CD]" />
                          Glass Doors & Surfaces
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Professional cleaning for all glass surfaces in your
                          property.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Sliding glass doors</li>
                          <li>• Glass partitions and walls</li>
                          <li>• Mirrors and reflective surfaces</li>
                          <li>• Glass furniture and fixtures</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Why Choose Our Glass Cleaning?
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <CheckBadgeIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Streak-Free Results
                            </p>
                            <p className="text-xs text-gray-600">
                              Professional techniques for crystal-clear finish
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <ShieldCheckIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Safe & Insured
                            </p>
                            <p className="text-xs text-gray-600">
                              Fully insured professionals with safety equipment
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <WrenchScrewdriverIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Professional Tools
                            </p>
                            <p className="text-xs text-gray-600">
                              Squeegees, scrapers, and eco-friendly solutions
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Image Display */}
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={getServiceImage(service.name)}
                      alt={service.name}
                      className="w-full h-auto object-contain bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10"
                      loading="lazy"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Complete Glass Cleaning Process
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#4EC6E5]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <EyeIcon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Pre-Inspection
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Assessment of glass condition and stains
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#2BA8CD]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <SparklesIcon className="h-6 w-6 text-[#2BA8CD]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Deep Cleaning
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Thorough cleaning with specialized solutions
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#4EC6E5]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <WindowIcon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Professional Squeegee
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Streak-free finish with expert technique
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#2BA8CD]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckBadgeIcon className="h-6 w-6 text-[#2BA8CD]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Quality Check
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Final inspection for perfect results
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-full">
                        <WindowIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        Book Your Window Cleaning Today
                      </h3>
                    </div>
                    <p className="mb-6 opacity-90">
                      Experience crystal-clear views and enhanced natural light
                    </p>
                    <button
                      onClick={handleBookNow}
                      className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      Book Glass Cleaning Now
                    </button>
                  </div>
                </div>
              </>
            ) : id === "6" ? (
              <>
                {/* Disinfect cleaning - Service ID 6 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-lg">
                      <ShieldCheckIcon className="h-5 w-5" />
                      Health Protection - Hospital-Grade Disinfection
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Advanced Disinfection for Maximum Safety
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      Our professional disinfection service uses EPA-approved,
                      hospital-grade products to eliminate germs, bacteria, and
                      viruses from all surfaces. Perfect for homes, offices, and
                      high-traffic areas requiring the highest level of
                      cleanliness and safety.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <div className="bg-[#4EC6E5]/10 border-l-4 border-[#4EC6E5] p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <BeakerIcon className="h-5 w-5 text-[#4EC6E5]" />
                          EPA-Approved Disinfectants
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Hospital-grade products that meet the highest safety
                          and efficacy standards.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• EPA-registered disinfectants</li>
                          <li>• Eliminates 99.9% of pathogens</li>
                          <li>• Safe for homes and offices</li>
                          <li>• Non-toxic when used properly</li>
                        </ul>
                      </div>

                      <div className="bg-[#2BA8CD]/10 border-l-4 border-[#2BA8CD] p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <HeartIconSolid className="h-5 w-5 text-[#2BA8CD]" />
                          High-Touch Surface Focus
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Targeted disinfection of areas with the highest
                          contamination risk.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Door handles and light switches</li>
                          <li>• Desks, keyboards, and phones</li>
                          <li>• Bathroom fixtures and surfaces</li>
                          <li>• Kitchen counters and appliances</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Why Choose Our Disinfection Service?
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <ShieldCheckIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Health Certification
                            </p>
                            <p className="text-xs text-gray-600">
                              Certified technicians with health safety training
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <BugAntIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Pathogen Elimination
                            </p>
                            <p className="text-xs text-gray-600">
                              Destroys viruses, bacteria, and harmful
                              microorganisms
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <SunIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Air Quality Improvement
                            </p>
                            <p className="text-xs text-gray-600">
                              Reduces airborne contaminants and allergens
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Image Display */}
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={getServiceImage(service.name)}
                      alt={service.name}
                      className="w-full h-auto object-contain bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10"
                      loading="lazy"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Professional Disinfection Process
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#4EC6E5]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <EyeIcon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Area Assessment
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Identify high-risk areas and contamination points
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#2BA8CD]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <BeakerIcon className="h-6 w-6 text-[#2BA8CD]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          EPA-Grade Treatment
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Apply hospital-grade disinfectants systematically
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#4EC6E5]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ClockIcon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Dwell Time
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Allow proper contact time for maximum effectiveness
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#2BA8CD]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckBadgeIcon className="h-6 w-6 text-[#2BA8CD]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Safety Verification
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Confirm all areas are safe and sanitized
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-full">
                        <ShieldCheckIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        Book Your Disinfection Service Today
                      </h3>
                    </div>
                    <p className="mb-6 opacity-90">
                      Protect your space with professional-grade disinfection
                    </p>
                    <button
                      onClick={handleBookNow}
                      className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      Book Disinfection Now
                    </button>
                  </div>
                </div>
              </>
            ) : id === "7" ? (
              <>
                {/* Maid service - Service ID 7 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-lg">
                      <UserGroupIcon className="h-5 w-5" />
                      Regular Service - Trusted Professional Maids
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Consistent Quality Home Maintenance
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      Our professional maid service provides regular, reliable
                      home maintenance with trusted professionals who understand
                      your cleaning preferences. Perfect for busy families and
                      professionals who want to maintain a consistently clean
                      home.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <div className="bg-[#4EC6E5]/10 border-l-4 border-[#4EC6E5] p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <CalendarDaysIcon className="h-5 w-5 text-[#4EC6E5]" />
                          Flexible Scheduling Options
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Choose the cleaning schedule that works best for your
                          lifestyle and budget.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Weekly regular cleaning service</li>
                          <li>• Bi-weekly maintenance visits</li>
                          <li>• Monthly deep cleaning</li>
                          <li>• One-time or seasonal cleaning</li>
                        </ul>
                      </div>

                      <div className="bg-[#2BA8CD]/10 border-l-4 border-[#2BA8CD] p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <UserGroupIcon className="h-5 w-5 text-[#2BA8CD]" />
                          Trusted Professionals
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Background-checked, trained professionals who take
                          pride in their work.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Background checked and insured</li>
                          <li>• Consistent team assignment</li>
                          <li>• Trained in professional techniques</li>
                          <li>• Respectful of your home and privacy</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Why Choose Our Maid Service?
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <CheckBadgeIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Consistent Quality
                            </p>
                            <p className="text-xs text-gray-600">
                              Same high standards every visit with detailed
                              checklists
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <HomeIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Complete Home Care
                            </p>
                            <p className="text-xs text-gray-600">
                              All rooms and areas cleaned systematically
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-[#4EC6E5]/20 rounded-full">
                            <ClockIcon className="h-4 w-4 text-[#4EC6E5]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              Time Saving
                            </p>
                            <p className="text-xs text-gray-600">
                              Reclaim your weekends and free time
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Image Display */}
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={getServiceImage(service.name)}
                      alt={service.name}
                      className="w-full h-auto object-contain bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10"
                      loading="lazy"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      What's Included in Every Visit
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#4EC6E5]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <SparklesIcon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Dusting & Vacuuming
                        </h4>
                        <p className="text-gray-600 text-xs">
                          All surfaces, furniture, and floor cleaning
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#2BA8CD]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FireIcon className="h-6 w-6 text-[#2BA8CD]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Kitchen Deep Clean
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Counters, appliances, sink, and stovetop
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#4EC6E5]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ShieldCheckIcon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Bathroom Sanitization
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Complete bathroom cleaning and disinfection
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-[#2BA8CD]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <HomeIcon className="h-6 w-6 text-[#2BA8CD]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Living Areas
                        </h4>
                        <p className="text-gray-600 text-xs">
                          Bedrooms, living room, and common spaces
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-2xl p-8 text-center shadow-lg">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-full">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        Start Your Regular Maid Service Today
                      </h3>
                    </div>
                    <p className="mb-6 opacity-90">
                      Enjoy a consistently clean home with trusted professionals
                    </p>
                    <button
                      onClick={handleBookNow}
                      className="bg-white text-[#4EC6E5] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      Book Maid Service Now
                    </button>
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
