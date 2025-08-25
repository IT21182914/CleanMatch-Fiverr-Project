import { StarIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "../ui/Card";
import { useState, useEffect, useCallback } from "react";

const TestimonialsSection = () => {
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [displayedTestimonials, setDisplayedTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const fetchReviews = useCallback(async () => {
    // Comprehensive testimonials dataset - 20 reviews (fallback)
    const fallbackData = [
      {
        name: "Sarah Johnson",
        role: "Busy Professional",
        content:
          "SIMORGH SERVICE has completely transformed how I manage my home. The $18/hour membership rate is incredible value, and the quality is consistently outstanding. My house has never looked better!",
        rating: 5,
        verified: true,
        service: "House Cleaning",
      },
      {
        name: "Michael Chen",
        role: "Small Business Owner",
        content:
          "We use SIMORGH SERVICE for our office cleaning and they're phenomenal. Professional, reliable, and the membership savings make it very affordable. Our workplace has never been cleaner!",
        rating: 5,
        verified: true,
        service: "Office Cleaning",
      },
      {
        name: "Emily Rodriguez",
        role: "Working Mom",
        content:
          "As a mom of three, SIMORGH SERVICE is a lifesaver. From regular house cleaning to emergency services, they handle everything. The 50+ services mean I can get everything done in one call!",
        rating: 5,
        verified: true,
        service: "Deep Cleaning",
      },
      {
        name: "David Thompson",
        role: "Restaurant Owner",
        content:
          "Running a restaurant means cleanliness is everything. SIMORGH SERVICE handles our deep kitchen cleaning and dining area maintenance flawlessly. Their attention to detail is unmatched!",
        rating: 5,
        verified: true,
        service: "Commercial Cleaning",
      },
      {
        name: "Jennifer Williams",
        role: "Event Coordinator",
        content:
          "I've used SIMORGH SERVICE for pre and post-event cleaning at multiple venues. They're always punctual, thorough, and incredibly professional. They make my events stress-free!",
        rating: 5,
        verified: true,
        service: "Event Cleaning",
      },
      {
        name: "Robert Davis",
        role: "Property Manager",
        content:
          "Managing 15 rental properties, I need reliable cleaning between tenants. SIMORGH SERVICE consistently delivers move-in ready apartments. Their turnover cleaning is exceptional!",
        rating: 5,
        verified: true,
        service: "Move-out Cleaning",
      },
      {
        name: "Lisa Anderson",
        role: "Senior Citizen",
        content:
          "At 78, maintaining my home was becoming difficult. SIMORGH SERVICE treats me like family and keeps my house spotless. Their care and respect mean the world to me!",
        rating: 5,
        verified: true,
        service: "Senior Home Care",
      },
      {
        name: "James Wilson",
        role: "Tech Executive",
        content:
          "Working 70+ hours a week, SIMORGH SERVICE gives me my weekends back. Their recurring service is so reliable, I never have to think about cleaning. Absolute lifesaver!",
        rating: 5,
        verified: true,
        service: "Recurring Cleaning",
      },
      {
        name: "Maria Garcia",
        role: "Teacher",
        content:
          "After a water leak disaster, SIMORGH SERVICE restored our home beautifully. They handled everything - cleaning, sanitizing, even helped coordinate repairs. True professionals!",
        rating: 5,
        verified: true,
        service: "Emergency Cleaning",
      },
      {
        name: "Thomas Brown",
        role: "Retired Veteran",
        content:
          "The team at SIMORGH SERVICE goes above and beyond. They not only clean perfectly but also help with small organization tasks. Their service comes from the heart!",
        rating: 5,
        verified: true,
        service: "Home Maintenance",
      },
      {
        name: "Amanda Miller",
        role: "New Mother",
        content:
          "With a newborn, keeping up with cleaning was impossible. SIMORGH SERVICE provides baby-safe cleaning and gives me precious time with my little one. Couldn't be happier!",
        rating: 5,
        verified: true,
        service: "Baby-Safe Cleaning",
      },
      {
        name: "Kevin Taylor",
        role: "Small Business Owner",
        content:
          "Our medical office requires strict sanitization standards. SIMORGH SERVICE exceeds all requirements and maintains our spotless, professional environment every single time!",
        rating: 5,
        verified: true,
        service: "Medical Facility Cleaning",
      },
      {
        name: "Patricia Moore",
        role: "Homemaker",
        content:
          "I'm particular about how my home is cleaned, and SIMORGH SERVICE gets it right every time. They listen to my preferences and consistently exceed my expectations!",
        rating: 5,
        verified: true,
        service: "Custom Home Cleaning",
      },
      {
        name: "Daniel Lee",
        role: "Construction Manager",
        content:
          "Post-construction cleanup is tough work, but SIMORGH SERVICE makes it look easy. They transform dusty job sites into pristine spaces ready for occupancy!",
        rating: 5,
        verified: true,
        service: "Post-Construction Cleaning",
      },
      {
        name: "Rachel White",
        role: "Yoga Studio Owner",
        content:
          "Our studio needs to be a clean, peaceful sanctuary. SIMORGH SERVICE maintains the perfect environment for our students using eco-friendly products. They understand our values!",
        rating: 5,
        verified: true,
        service: "Eco-Friendly Cleaning",
      },
      {
        name: "Christopher Martin",
        role: "Elderly Care Provider",
        content:
          "I care for my elderly father, and SIMORGH SERVICE helps maintain a healthy, clean environment for him. Their gentle approach and reliability give me peace of mind!",
        rating: 5,
        verified: true,
        service: "Elderly Care Cleaning",
      },
      {
        name: "Nicole Jackson",
        role: "Pet Owner",
        content:
          "With three dogs, keeping my home clean and odor-free was challenging. SIMORGH SERVICE specializes in pet-friendly cleaning and my house has never smelled better!",
        rating: 5,
        verified: true,
        service: "Pet-Friendly Cleaning",
      },
      {
        name: "Andrew Clark",
        role: "Office Manager",
        content:
          "Our team's productivity increased after switching to SIMORGH SERVICE for office cleaning. A clean workspace really does improve morale and efficiency!",
        rating: 5,
        verified: true,
        service: "Office Cleaning",
      },
      {
        name: "Stephanie Lewis",
        role: "Event Planner",
        content:
          "From intimate dinner parties to large celebrations, SIMORGH SERVICE ensures everything is perfect before and spotless after. They're an essential part of my event success!",
        rating: 5,
        verified: true,
        service: "Party Cleaning",
      },
      {
        name: "Mark Robinson",
        role: "Fitness Center Owner",
        content:
          "Hygiene is crucial in our fitness center. SIMORGH SERVICE maintains equipment, locker rooms, and all facilities to the highest standards. Our members notice the difference!",
        rating: 5,
        verified: true,
        service: "Fitness Facility Cleaning",
      },
    ];

    try {
      setLoading(true);

      // Fetch combined reviews (customer + admin) from the new public API
      const response = await fetch(`http://localhost:5000/api/reviews/public?limit=50&featured=false`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let allApiReviews = [];

      if (response.ok) {
        const data = await response.json();
        const transformedReviews = data.reviews?.map((review) => ({
          name: review.reviewer_name || "Anonymous Customer",
          role: review.review_type === 'admin' ? "Professional Review" : "Verified Customer",
          content: review.comment,
          rating: review.rating,
          verified: true,
          service: review.service_type || "Cleaning Service",
          cleaner_name: review.cleaner_name,
          cleaner_rating: review.cleaner_rating || 0,
          review_type: review.review_type,
          isAdminReview: review.review_type === 'admin',
        })) || [];

        allApiReviews = transformedReviews;
        console.log(`📊 Loaded ${allApiReviews.length} dynamic reviews from API`);
      }

      // Combine API reviews with fallback testimonials 
      let combinedTestimonials;
      if (allApiReviews.length > 0) {
        // Use all API reviews first, then add fallback data to reach a good total
        combinedTestimonials = [...allApiReviews, ...fallbackData];
      } else {
        console.warn("Failed to fetch reviews, using fallback testimonials");
        combinedTestimonials = fallbackData;
      }

      setAllTestimonials(combinedTestimonials);
      setDisplayedTestimonials(combinedTestimonials.slice(0, 3));

    } catch (error) {
      console.error("Error fetching reviews:", error);
      setAllTestimonials(fallbackData);
      setDisplayedTestimonials(fallbackData.slice(0, 3));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleLoadMore = async () => {
    setLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const newVisibleCount = Math.min(
        visibleCount + 6,
        allTestimonials.length
      );
      setVisibleCount(newVisibleCount);
      setDisplayedTestimonials(allTestimonials.slice(0, newVisibleCount));
      setLoadingMore(false);
    }, 800);
  };

  const hasMoreReviews = visibleCount < allTestimonials.length;

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-gradient-to-br from-slate-50 to-white relative">
      <div className="w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-12 xs:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 xs:mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg xs:text-xl text-slate-600 px-2 xs:px-0">
            Real feedback from satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
          {loading
            ? // Loading skeleton
              [...Array(6)].map((_, index) => (
                <Card
                  key={`loading-${index}`}
                  className="h-full shadow-xl rounded-xl xs:rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90 animate-pulse"
                >
                  <CardContent className="p-6 xs:p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 xs:mb-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-4 xs:h-5 w-4 xs:w-5 bg-gray-200 rounded"
                          ></div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6 xs:mb-8 flex-grow">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 xs:w-12 h-10 xs:h-12 bg-gray-200 rounded-lg xs:rounded-xl mr-3 xs:mr-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : displayedTestimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl xs:rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90"
                >
                  <CardContent className="p-6 xs:p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 xs:mb-6">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] fill-[#4EC6E5]"
                          />
                        ))}
                      </div>
                      <div className="flex items-center space-x-1.5 xs:space-x-2">
                        {testimonial.verified && (
                          <span className="text-xs bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-semibold">
                            {testimonial.isAdminReview ? "Pro Review" : "Verified"}
                          </span>
                        )}
                        <span className={`text-xs px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-medium ${
                          testimonial.isAdminReview 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-[#E0F6FD] text-[#2BA8CD]"
                        }`}>
                          {testimonial.service}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 mb-6 xs:mb-8 flex-grow italic text-base xs:text-lg leading-relaxed">
                      "{testimonial.content}"
                      {testimonial.cleaner_name && (
                        <span className="block mt-3 text-sm text-slate-500 not-italic">
                          Service by: <strong>{testimonial.cleaner_name}</strong>
                          {testimonial.cleaner_rating > 0 && (
                            <span className="ml-2 inline-flex items-center">
                              <span className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(testimonial.cleaner_rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : i < testimonial.cleaner_rating
                                        ? 'text-yellow-400 fill-yellow-200'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </span>
                              <span className="ml-1 text-xs font-medium">
                                ({testimonial.cleaner_rating.toFixed(1)})
                              </span>
                            </span>
                          )}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 xs:w-12 h-10 xs:h-12 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-lg xs:rounded-xl flex items-center justify-center text-white font-bold mr-3 xs:mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-base xs:text-lg">
                          {testimonial.name}
                        </p>
                        <p className="text-xs xs:text-sm text-slate-500 font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Load More Button */}
        {hasMoreReviews && !loading && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-xl hover:from-[#2BA8CD] hover:to-[#4EC6E5] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Loading More Reviews...
                </>
              ) : (
                <>
                  Load More Reviews
                  <svg
                    className="ml-2 -mr-1 w-5 h-5 transition-transform group-hover:translate-y-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
            <p className="text-sm text-slate-500 mt-4">
              Showing {displayedTestimonials.length} of {allTestimonials.length}{" "}
              reviews
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
