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
  PlayIcon,
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
        "SIMORGH SERVICE has been a game-changer for my hectic schedule. The $19 first clean got me hooked, and now I'm a loyal ForeverClean member!",
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
        "As a mom of three, SIMORGH SERVICE is a lifesaver. The booking process is seamless and the quality is consistently outstanding.",
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
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-[#F0FBFE] pt-16 pb-24 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#6ED1EA]/10 to-[#4EC6E5]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Special Offer Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] border border-[#BAEDFB]/50 mb-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-2 h-2 bg-[#4EC6E5] rounded-full mr-3 animate-pulse"></div>
              <SparklesIcon className="h-5 w-5 text-[#4EC6E5] mr-2" />
              <span className="text-sm font-semibold bg-gradient-to-r from-[#2BA8CD] to-[#1B7A95] bg-clip-text text-transparent">
                Limited Time Offer
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Professional House Cleaning
              </span>
              <span className="block bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent mt-2">
                Starting at $19
              </span>
            </h1>

            {/* First Clean Offer */}
            <div className="relative group mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-6 px-10 rounded-3xl inline-block transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#4EC6E5]/25">
                <p className="text-3xl sm:text-4xl font-bold mb-1">
                  $19 First Clean
                </p>
                <p className="text-sm opacity-90 font-medium">
                  Book your trial cleaning today
                </p>
              </div>
            </div>

            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Trusted, vetted cleaners in your area. Professional cleaning
              services with seamless booking and satisfaction guaranteed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <Link to="/register" className="w-full sm:w-auto group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1B7A95] to-[#2293B5] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    size="lg"
                    className="relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#1B7A95] to-[#2293B5] hover:from-[#2293B5] hover:to-[#2BA8CD] text-white font-bold text-xl rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-105"
                  >
                    Book $19 First Clean
                    <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </Link>
              <Link to="/login" className="w-full sm:w-auto group">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-10 py-5 border-2 border-slate-300 hover:border-[#4EC6E5] text-slate-700 hover:text-[#4EC6E5] font-bold text-xl rounded-2xl backdrop-blur-sm bg-white/70 hover:bg-white transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-[#4EC6E5] fill-[#4EC6E5] mr-2" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-[#4EC6E5] mr-2" />
                <span className="font-semibold">Insured & Bonded</span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-[#4EC6E5] mr-2" />
                <span className="font-semibold">50,000+ Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Booking Process */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#F0FBFE] to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4EC6E5] to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-sm mb-6">
              <ClockIcon className="h-4 w-4 mr-2" />
              Simple Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Getting your home cleaned is as easy as 1, 2, 3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative group">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#BAEDFB] to-[#7FE0F8] z-0 transform translate-x-1/2"></div>
                  )}

                  <div className="relative z-10 mb-8">
                    <div className="relative mx-auto w-32 h-32 rounded-3xl overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#6ED1EA]/20 to-transparent"></div>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Icon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#1B7A95] to-[#2293B5] rounded-2xl flex items-center justify-center text-white font-bold text-lg z-20 shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Service Listing */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-sm mb-6">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              Professional Cleaning Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Tailored cleaning services designed for your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`relative h-full group transition-all duration-300 hover:scale-105 ${
                  service.popular
                    ? "ring-2 ring-[#4EC6E5] shadow-2xl shadow-[#4EC6E5]/20"
                    : "shadow-xl hover:shadow-2xl"
                } rounded-3xl overflow-hidden backdrop-blur-sm`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-6 py-2 rounded-2xl text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50"></div>

                <CardContent className="relative p-8 lg:p-10 h-full flex flex-col">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {service.name}
                  </h3>
                  <p className="text-lg text-slate-600 mb-8 flex-grow leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent">
                        {service.price}
                      </span>
                      <span className="text-xl text-slate-400 line-through ml-3">
                        {service.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-bold text-slate-900 mb-4 text-lg">
                      What's Included:
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-[#4EC6E5] mr-3 flex-shrink-0 mt-1" />
                          <span className="text-slate-600 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-10">
                    <h4 className="font-bold text-slate-900 mb-4 text-lg">
                      Premium Add-ons:
                    </h4>
                    <ul className="space-y-3">
                      {service.addOns.map((addOn, addOnIndex) => (
                        <li
                          key={addOnIndex}
                          className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] border border-[#BAEDFB]/30"
                        >
                          <span className="text-slate-700 font-medium">
                            {addOn.name}
                          </span>
                          <span className="text-sm font-bold text-[#2BA8CD]">
                            {addOn.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to="/register" className="mt-auto group">
                    <Button
                      className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 ${
                        service.popular
                          ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white shadow-lg shadow-[#4EC6E5]/25"
                          : "border-2 border-slate-300 hover:border-[#4EC6E5] text-slate-700 hover:text-[#4EC6E5] bg-white hover:bg-[#F0FBFE]"
                      } group-hover:scale-105`}
                      variant={service.popular ? "primary" : "outline"}
                    >
                      Book Now
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ForeverClean Membership Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#1B7A95] via-[#2293B5] to-[#2BA8CD] text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#4EC6E5]/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-sm mb-6">
              <TrophyIcon className="h-4 w-4 mr-2" />
              Premium Membership
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              ForeverClean Membership
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Join our exclusive membership program for unlimited cleaning and
              premium benefits
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-10 max-w-5xl mx-auto shadow-2xl border border-white/20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] mb-6">
                <SparklesIcon className="h-5 w-5 mr-2" />
                <span className="font-bold">Best Value Package</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">ForeverClean Plan</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-6xl font-bold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent">
                  $49
                </span>
                <span className="text-2xl text-slate-500 ml-3">/month</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
              <div>
                <h4 className="font-bold text-xl mb-6 text-slate-900">
                  What's Included:
                </h4>
                <ul className="space-y-4">
                  {[
                    "2 cleaning sessions per month",
                    "Priority booking & scheduling",
                    "20% off all premium add-ons",
                    "Free re-cleaning guarantee",
                    "Dedicated customer support",
                    "Flexible rescheduling",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="h-6 w-6 text-[#4EC6E5] mr-4 flex-shrink-0" />
                      <span className="text-slate-700 text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] p-8 rounded-2xl border border-[#BAEDFB]/50">
                <h4 className="font-bold text-xl mb-6 text-center text-slate-900">
                  Monthly Savings
                </h4>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center">
                    <span>Regular pricing (2 cleans):</span>
                    <span className="line-through text-slate-500 font-semibold">
                      $160
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ForeverClean membership:</span>
                    <span className="text-[#4EC6E5] font-bold">$49</span>
                  </div>
                  <div className="border-t border-[#BAEDFB] pt-4 flex justify-between items-center font-bold text-xl">
                    <span>You Save:</span>
                    <span className="text-[#4EC6E5] text-2xl">$111</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/customer/membership" className="group">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    size="lg"
                    className="relative px-10 py-5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold text-xl rounded-2xl transition-all duration-300 group-hover:scale-105"
                  >
                    Start ForeverClean Membership
                    <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </Link>
              <p className="text-slate-500 mt-4 text-lg">
                Cancel anytime • No long-term contracts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-slate-50 to-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-sm mb-6">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Trusted Excellence
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-slate-600">
              Join our growing community of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {trustStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-lg text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="flex mr-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-5 w-5 text-[#4EC6E5] fill-[#4EC6E5]"
                        />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <span className="text-xs bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-3 py-1 rounded-full font-semibold">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 mb-8 flex-grow italic text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cleaner Profiles Section */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-sm mb-6">
              <UsersIcon className="h-4 w-4 mr-2" />
              Our Team
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              Meet Our Top-Rated Cleaners
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              All our cleaners are thoroughly vetted, professionally trained,
              and rated by real customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cleanerProfiles.map((cleaner, index) => (
              <Card
                key={index}
                className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                      {cleaner.avatar}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center justify-center">
                    {cleaner.name}
                    {cleaner.verified && (
                      <CheckCircleIcon className="h-6 w-6 text-[#4EC6E5] ml-2" />
                    )}
                  </h3>

                  <div className="flex items-center justify-center mb-4">
                    <StarIcon className="h-5 w-5 text-[#4EC6E5] fill-[#4EC6E5]" />
                    <span className="font-bold ml-2 text-lg">
                      {cleaner.rating}
                    </span>
                    <span className="text-slate-500 ml-2">
                      ({cleaner.reviews} reviews)
                    </span>
                  </div>

                  <p className="text-slate-600 mb-6 text-lg font-medium">
                    {cleaner.experience} experience
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {cleaner.specialties.map((specialty, specialtyIndex) => (
                      <span
                        key={specialtyIndex}
                        className="px-4 py-2 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] text-[#2BA8CD] rounded-xl text-sm font-semibold border border-[#BAEDFB]/50"
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
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#4EC6E5] via-[#2BA8CD] to-[#1B7A95] text-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust SIMORGH SERVICE for
            their cleaning needs. Book your $19 trial cleaning today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <Link to="/register" className="w-full sm:w-auto group">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  size="lg"
                  className="relative w-full sm:w-auto px-10 py-5 bg-white text-[#2BA8CD] hover:bg-slate-50 font-bold text-xl rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-105"
                >
                  Book $19 First Clean
                  <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </Link>
            <button
              onClick={() => setShowTermsModal(true)}
              className="text-white hover:text-white/80 text-lg underline font-medium transition-colors duration-200"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </section>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Terms & Conditions
                </h3>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
                <div className="prose text-slate-600 space-y-6">
                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      $19 First Clean Offer
                    </h4>
                    <p className="leading-relaxed">
                      The $19 first clean offer is valid for new customers only
                      and applies to standard cleaning services up to 1,500 sq
                      ft. Additional charges may apply for larger homes or
                      premium add-on services.
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      ForeverClean Membership
                    </h4>
                    <p className="leading-relaxed">
                      ForeverClean membership is $49/month and includes 2
                      standard cleaning sessions. Membership can be canceled
                      anytime with 30 days notice. Premium add-ons are subject
                      to additional charges with member discount.
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      Service Guarantee
                    </h4>
                    <p className="leading-relaxed">
                      We guarantee your satisfaction. If you're not happy with
                      your cleaning, we'll return within 24 hours to re-clean
                      the area at no additional charge.
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      Cancellation Policy
                    </h4>
                    <p className="leading-relaxed">
                      Bookings can be cancelled or rescheduled up to 24 hours
                      before the scheduled appointment without penalty.
                      Cancellations within 24 hours may be subject to a fee.
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      Insurance & Bonding
                    </h4>
                    <p className="leading-relaxed">
                      All cleaners are background-checked, insured, and bonded.
                      SIMORGH SERVICE carries comprehensive liability insurance
                      for your complete peace of mind.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowTermsModal(false)}
                  className="px-8 py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105"
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
