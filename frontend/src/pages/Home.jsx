import { Link } from "react-router-dom";
import {
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { LazySection } from "../components/ui/LazyComponents";

const Home = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: "Professional Cleaners",
      description: "Vetted and trained cleaning professionals in your area",
    },
    {
      icon: ClockIcon,
      title: "Flexible Scheduling",
      description:
        "Book services at your convenience with same-day availability",
    },
    {
      icon: ShieldCheckIcon,
      title: "Insured & Bonded",
      description: "All cleaners are background-checked and fully insured",
    },
  ];

  const services = [
    {
      name: "Regular House Cleaning",
      description: "Weekly or bi-weekly cleaning to keep your home spotless",
      price: "Starting at $80",
      features: [
        "Dusting & vacuuming",
        "Kitchen & bathroom cleaning",
        "Trash removal",
      ],
    },
    {
      name: "Deep Cleaning",
      description: "Comprehensive cleaning for move-ins or seasonal refresh",
      price: "Starting at $150",
      features: [
        "Inside appliances",
        "Baseboards & windows",
        "Cabinet interiors",
      ],
    },
    {
      name: "Office Cleaning",
      description: "Professional cleaning services for your workplace",
      price: "Starting at $120",
      features: ["Desk sanitization", "Floor maintenance", "Restroom cleaning"],
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      {/* Hero Section */}
      <section className="text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Professional Cleaning Services
            <span className="text-blue-600 block sm:inline"> Made Simple</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-6 sm:leading-8 text-gray-600 max-w-2xl mx-auto">
            Connect with trusted, verified cleaners in your area. Book online,
            relax at home, and enjoy a spotless space without the hassle.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Why Choose CleanMatch?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              We make finding and booking cleaning services effortless
            </p>
          </div>
          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full">
                  <CardContent className="text-center p-4 sm:p-6">
                    <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-100">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Our Cleaning Services
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Professional cleaning solutions tailored to your needs
            </p>
          </div>
          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="relative h-full">
                <CardContent className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 flex-grow">
                    {service.description}
                  </p>
                  <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-blue-600">
                    {service.price}
                  </p>
                  <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/register">
                      <Button className="w-full">Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              What Our Customers Say
            </h2>
          </div>
          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Homeowner",
                content:
                  "CleanMatch made it so easy to find a reliable cleaner. The booking process was seamless and the service was exceptional!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Small Business Owner",
                content:
                  "Our office has never looked better. The cleaning team is professional and thorough. Highly recommend!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Working Mom",
                content:
                  "As a busy mom, CleanMatch has been a lifesaver. I can book cleaning services in minutes and trust they'll do a great job.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 flex-grow">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 rounded-lg sm:rounded-xl py-12 sm:py-16 lg:py-20 text-center text-white mx-4 sm:mx-6 lg:mx-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Ready to get started?
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust CleanMatch for their
            cleaning needs.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4"
              >
                Sign Up Today
              </Button>
            </Link>
            <Link
              to="/login"
              className="text-white hover:text-gray-200 text-sm sm:text-base"
            >
              Already have an account? Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* Lazy-loaded Testimonials Section */}
      <LazySection
        threshold={0.2}
        fallback={
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-lg shadow animate-pulse"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      >
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real reviews from satisfied customers who trust CleanMatch for
                their cleaning needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  location: "New York, NY",
                  rating: 5,
                  review:
                    "Amazing service! The cleaner was professional, thorough, and my apartment has never looked better. Highly recommend CleanMatch!",
                },
                {
                  name: "Michael Chen",
                  location: "San Francisco, CA",
                  rating: 5,
                  review:
                    "I've been using CleanMatch for 6 months now. The consistency and quality are outstanding. It's such a relief to come home to a spotless house.",
                },
                {
                  name: "Emily Rodriguez",
                  location: "Chicago, IL",
                  rating: 5,
                  review:
                    "The booking process was so easy and the cleaning was exceptional. The cleaner even organized my kitchen cabinets! Will definitely book again.",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <StarIcon
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current"
                          />
                        )
                      )}
                    </div>
                    <p className="text-gray-700 italic">
                      "{testimonial.review}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/loading-demo">
                <Button variant="outline" className="mx-auto">
                  View Loading Effects Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </LazySection>
    </div>
  );
};

export default Home;
