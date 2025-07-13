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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Professional Cleaning Services
            <span className="text-blue-600"> Made Simple</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with trusted, verified cleaners in your area. Book online,
            relax at home, and enjoy a spotless space without the hassle.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register">
              <Button size="lg" className="px-8 py-4">
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 py-4">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose CleanMatch?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We make finding and booking cleaning services effortless
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardContent className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-16 -mx-8">
        <div className="mx-auto max-w-7xl px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Cleaning Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional cleaning solutions tailored to your needs
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <p className="mt-4 text-gray-600">{service.description}</p>
                  <p className="mt-4 text-2xl font-bold text-blue-600">
                    {service.price}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-sm text-gray-600">{feature}</span>
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
      <section>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
              <Card key={index}>
                <CardContent>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 rounded-xl py-16 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg">
            Join thousands of satisfied customers who trust CleanMatch for their
            cleaning needs.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Link to="/register">
              <Button variant="secondary" size="lg" className="px-8 py-4">
                Sign Up Today
              </Button>
            </Link>
            <Link to="/login" className="text-white hover:text-gray-200">
              Already have an account? Sign in →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
