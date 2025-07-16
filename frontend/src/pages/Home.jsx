import { Link } from "react-router-dom";
import { useState } from "react";
import {
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UsersIcon,
  TrophyIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  HomeIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { LazySection } from "../components/ui/LazyComponents";

const Home = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);

  const steps = [
    {
      number: "1",
      title: "Buy Voucher",
      description: "Purchase your cleaning voucher online",
      icon: CreditCardIcon,
    },
    {
      number: "2",
      title: "Schedule Online",
      description: "Book your preferred date and time",
      icon: CalendarDaysIcon,
    },
    {
      number: "3",
      title: "Enjoy the Clean",
      description: "Relax while we make your home spotless",
      icon: HomeIcon,
    },
  ];

  const services = [
    {
      name: "Regular House Cleaning",
      description: "Weekly or bi-weekly cleaning to keep your home spotless",
      price: "$80",
      originalPrice: "$99",
      features: [
        "Dusting & vacuuming all rooms",
        "Kitchen & bathroom deep clean",
        "Trash removal & bed making",
        "Window sill cleaning",
      ],
      addOns: [
        { name: "Inside oven cleaning", price: "+$25" },
        { name: "Inside refrigerator", price: "+$20" },
        { name: "Interior window cleaning", price: "+$30" },
      ],
      popular: false,
    },
    {
      name: "Deep Cleaning",
      description: "Comprehensive cleaning for move-ins or seasonal refresh",
      price: "$150",
      originalPrice: "$200",
      features: [
        "Everything in regular cleaning",
        "Inside appliances cleaning",
        "Baseboards & window cleaning",
        "Cabinet interior cleaning",
        "Light fixture cleaning",
      ],
      addOns: [
        { name: "Garage cleaning", price: "+$50" },
        { name: "Basement cleaning", price: "+$40" },
        { name: "Attic organization", price: "+$60" },
      ],
      popular: true,
    },
    {
      name: "Office Cleaning",
      description: "Professional cleaning services for your workplace",
      price: "$120",
      originalPrice: "$150",
      features: [
        "Desk sanitization & organization",
        "Floor maintenance & vacuuming",
        "Restroom deep cleaning",
        "Common area cleaning",
      ],
      addOns: [
        { name: "Conference room setup", price: "+$35" },
        { name: "Kitchen area cleaning", price: "+$25" },
        { name: "After-hours service", price: "+$40" },
      ],
      popular: false,
    },
  ];

  const trustStats = [
    { label: "Average Rating", value: "4.9/5", icon: StarIcon },
    { label: "Customers Served", value: "50,000+", icon: UsersIcon },
    { label: "Cities Available", value: "25+", icon: TrophyIcon },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Busy Professional",
      content:
        "CleanMatch has been a game-changer for my hectic schedule. The $19 first clean got me hooked, and now I'm a loyal ForeverClean member!",
      rating: 5,
      verified: true,
      brandLogo: null,
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      content:
        "Our office has never looked better. The team is professional, reliable, and always exceeds expectations. Worth every penny!",
      rating: 5,
      verified: true,
      brandLogo: null,
    },
    {
      name: "Emily Rodriguez",
      role: "Working Mom",
      content:
        "As a mom of three, CleanMatch is a lifesaver. The booking process is seamless and the quality is consistently outstanding.",
      rating: 5,
      verified: true,
      brandLogo: null,
    },
  ];

  const cleanerProfiles = [
    {
      name: "Maria Santos",
      rating: 4.9,
      reviews: 247,
      experience: "5+ years",
      specialties: ["Deep Cleaning", "Eco-Friendly"],
      verified: true,
      avatar: "MS",
    },
    {
      name: "David Kim",
      rating: 4.8,
      reviews: 189,
      experience: "3+ years",
      specialties: ["Office Cleaning", "Post-Construction"],
      verified: true,
      avatar: "DK",
    },
    {
      name: "Lisa Thompson",
      rating: 5.0,
      reviews: 156,
      experience: "4+ years",
      specialties: ["Move-in/out", "Pet-Friendly"],
      verified: true,
      avatar: "LT",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Special Offer Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 mb-6">
              <SparklesIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Limited Time Offer
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Professional House Cleaning
              <span className="block text-yellow-500">Starting at $19</span>
            </h1>

            {/* First Clean Offer */}
            <div className="bg-yellow-500 text-white py-4 px-8 rounded-2xl inline-block mb-8 transform hover:scale-105 transition-transform duration-200">
              <p className="text-2xl sm:text-3xl font-bold">$19 First Clean</p>
              <p className="text-sm opacity-90">
                Book your trial cleaning today
              </p>
            </div>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Trusted, vetted cleaners in your area. Professional cleaning
              services with seamless booking and satisfaction guaranteed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 bg-navy-blue hover:bg-navy-blue/90 text-white font-semibold text-lg"
                  style={{ backgroundColor: "#1F2A44" }}
                >
                  Book $19 First Clean
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold text-lg"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Booking Process */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting your home cleaned is as easy as 1, 2, 3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-yellow-300 z-0 transform translate-x-1/2"></div>
                  )}

                  <div className="relative z-10">
                    <div className="mx-auto w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-navy-blue rounded-full flex items-center justify-center text-white font-bold text-sm z-20"
                      style={{ backgroundColor: "#1F2A44" }}
                    >
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Service Listing */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Cleaning Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional cleaning solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`relative h-full ${
                  service.popular
                    ? "ring-2 ring-yellow-500 shadow-xl"
                    : "shadow-lg"
                } hover:shadow-xl transition-shadow duration-300`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardContent className="p-6 lg:p-8 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">
                        {service.price}
                      </span>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        {service.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Included:
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Premium Add-ons:
                    </h4>
                    <ul className="space-y-2">
                      {service.addOns.map((addOn, addOnIndex) => (
                        <li
                          key={addOnIndex}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600">
                            {addOn.name}
                          </span>
                          <span className="text-sm font-medium text-yellow-600">
                            {addOn.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to="/register" className="mt-auto">
                    <Button
                      className={`w-full font-semibold ${
                        service.popular
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "border-2 border-gray-300 hover:border-gray-400 text-gray-700"
                      }`}
                      variant={service.popular ? "primary" : "outline"}
                    >
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ForeverClean Membership Section */}
      <section
        className="py-16 sm:py-20 bg-navy-blue text-white"
        style={{ backgroundColor: "#1F2A44" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              ForeverClean Membership
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join our membership program for unlimited cleaning and exclusive
              benefits
            </p>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 mb-4">
                <SparklesIcon className="h-5 w-5 mr-2" />
                <span className="font-semibold">Best Value</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">ForeverClean Plan</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-yellow-500">$49</span>
                <span className="text-lg text-gray-500 ml-2">/month</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-4">What's Included:</h4>
                <ul className="space-y-3">
                  {[
                    "2 cleaning sessions per month",
                    "Priority booking & scheduling",
                    "20% off all premium add-ons",
                    "Free re-cleaning guarantee",
                    "Dedicated customer support",
                    "Flexible rescheduling",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-semibold mb-4 text-center">
                  Savings Calculator
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Regular pricing (2 cleans):</span>
                    <span className="line-through text-gray-500">$160</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ForeverClean membership:</span>
                    <span className="text-green-600 font-semibold">$49</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>You Save:</span>
                    <span className="text-green-600">$111/month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/customer/membership">
                <Button
                  size="lg"
                  className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                >
                  Start ForeverClean Membership
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-3">
                Cancel anytime • No long-term contracts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600">
              Join our growing community of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {trustStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow italic">
                    "{testimonial.content}"
                  </p>
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

      {/* Cleaner Profiles Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Top-Rated Cleaners
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All our cleaners are vetted, trained, and rated by real customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cleanerProfiles.map((cleaner, index) => (
              <Card
                key={index}
                className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    {cleaner.avatar}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {cleaner.name}
                    {cleaner.verified && (
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 inline ml-2" />
                    )}
                  </h3>

                  <div className="flex items-center justify-center mb-3">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold ml-1">{cleaner.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({cleaner.reviews} reviews)
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {cleaner.experience} experience
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {cleaner.specialties.map((specialty, specialtyIndex) => (
                      <span
                        key={specialtyIndex}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 bg-yellow-500 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Home?
          </h2>
          <p className="text-lg text-yellow-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust CleanMatch for their
            cleaning needs. Book your $19 trial cleaning today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-4 bg-white text-yellow-600 hover:bg-gray-50 font-semibold text-lg"
              >
                Book $19 First Clean
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <button
              onClick={() => setShowTermsModal(true)}
              className="text-white hover:text-yellow-100 text-sm underline"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </section>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Terms & Conditions
                </h3>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="prose text-sm text-gray-600 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    $19 First Clean Offer
                  </h4>
                  <p>
                    The $19 first clean offer is valid for new customers only
                    and applies to standard cleaning services up to 1,500 sq ft.
                    Additional charges may apply for larger homes or premium
                    add-on services.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    ForeverClean Membership
                  </h4>
                  <p>
                    ForeverClean membership is $49/month and includes 2 standard
                    cleaning sessions. Membership can be canceled anytime with
                    30 days notice. Premium add-ons are subject to additional
                    charges with member discount.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Service Guarantee
                  </h4>
                  <p>
                    We guarantee your satisfaction. If you're not happy with
                    your cleaning, we'll return within 24 hours to re-clean the
                    area at no additional charge.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Cancellation Policy
                  </h4>
                  <p>
                    Bookings can be cancelled or rescheduled up to 24 hours
                    before the scheduled appointment without penalty.
                    Cancellations within 24 hours may be subject to a fee.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Insurance & Bonding
                  </h4>
                  <p>
                    All cleaners are background-checked, insured, and bonded.
                    CleanMatch carries liability insurance for your peace of
                    mind.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowTermsModal(false)}
                  className="px-6 py-2"
                >
                  I Understand
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
