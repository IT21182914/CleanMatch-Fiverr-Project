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
  BuildingOffice2Icon,
  WindowIcon,
  BugAntIcon,
  FireIcon,
  TruckIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { LazySection } from "../components/ui/LazyComponents";
import { getServiceImage } from "../utils/serviceImages";
import LazyImage from "../components/ui/LazyImage";

const Home = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);

  const steps = [
    {
      number: "1",
      title: "Choose Service",
      description: "Select from 50+ professional cleaning solutions",
      icon: SparklesIcon,
    },
    {
      number: "2",
      title: "Book Online",
      description: "Schedule your preferred date and time instantly",
      icon: CalendarDaysIcon,
    },
    {
      number: "3",
      title: "Enjoy Results",
      description: "Relax while our vetted professionals transform your space",
      icon: HomeIcon,
    },
  ];

  const services = [
    {
      name: "House & Apartment Cleaning",
      description:
        "Complete residential cleaning for homes and apartments with professional attention to detail",
      price: "$18",
      originalPrice: "$36",
      membershipDiscount: "50% OFF",
      features: [
        "All rooms thoroughly cleaned",
        "Kitchen & bathroom deep sanitization",
        "Dusting, vacuuming & mopping",
        "Trash removal & organization",
        "Window sills & surface cleaning",
      ],
      addOns: [
        { name: "Inside oven cleaning", price: "+$15" },
        { name: "Refrigerator interior", price: "+$12" },
        { name: "Interior window cleaning", price: "+$20" },
        { name: "Garage cleaning", price: "+$25" },
      ],
      popular: true,
      icon: HomeIcon,
    },
    {
      name: "Deep Cleaning Service",
      description:
        "Comprehensive deep cleaning that reaches every corner - perfect for move-ins or seasonal refresh",
      price: "$22",
      originalPrice: "$45",
      membershipDiscount: "51% OFF",
      features: [
        "Everything in house cleaning",
        "Inside all appliances",
        "Baseboards & detailed dusting",
        "Cabinet interior cleaning",
        "Light fixtures & ceiling fans",
        "Detailed grout & tile work",
      ],
      addOns: [
        { name: "Carpet deep cleaning", price: "+$30" },
        { name: "Upholstery cleaning", price: "+$25" },
        { name: "Pressure washing", price: "+$40" },
        { name: "Attic organization", price: "+$50" },
      ],
      popular: false,
      icon: SparklesIcon,
    },
    {
      name: "Commercial & Office Cleaning",
      description:
        "Professional workplace cleaning services to maintain productive and healthy business environments",
      price: "$22",
      originalPrice: "$45",
      membershipDiscount: "51% OFF",
      features: [
        "Workstation sanitization",
        "Floor maintenance & care",
        "Restroom deep cleaning",
        "Common area maintenance",
        "Conference room setup",
        "After-hours availability",
      ],
      addOns: [
        { name: "Window cleaning", price: "+$20" },
        { name: "Carpet cleaning", price: "+$25" },
        { name: "Kitchen deep clean", price: "+$18" },
        { name: "Emergency 24/7 service", price: "+$45" },
      ],
      popular: false,
      icon: BuildingOffice2Icon,
    },
  ];

  const trustStats = [
    { label: "Average Rating", value: "4.9/5", icon: StarIcon },
    { label: "Customers Served", value: "75,000+", icon: UsersIcon },
    { label: "Services Available", value: "50+", icon: SparklesIcon },
    { label: "Cities Covered", value: "35+", icon: TrophyIcon },
  ];

  const testimonials = [
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
  ];

  const cleanerProfiles = [
    {
      name: "Maria Santos",
      rating: 4.9,
      reviews: 347,
      experience: "7+ years",
      specialties: ["Deep Cleaning", "Eco-Friendly", "Move-in/out"],
      verified: true,
      avatar: "MS",
      certifications: ["EPA Certified", "Bonded & Insured"],
    },
    {
      name: "David Kim",
      rating: 4.8,
      reviews: 289,
      experience: "5+ years",
      specialties: ["Office Cleaning", "Commercial", "Industrial"],
      verified: true,
      avatar: "DK",
      certifications: ["Safety Certified", "Commercial Licensed"],
    },
    {
      name: "Lisa Thompson",
      rating: 5.0,
      reviews: 256,
      experience: "6+ years",
      specialties: ["Luxury Homes", "Pet-Friendly", "Medical Facilities"],
      verified: true,
      avatar: "LT",
      certifications: ["Health & Safety", "Luxury Certified"],
    },
  ];

  const featuredServices = [
    {
      name: "Emergency Cleaning 24/7",
      price: "$45/h",
      originalPrice: "$99/h",
      icon: ClockIcon,
      description: "Round-the-clock emergency response",
      popular: true,
    },
    {
      name: "Window & Glass Cleaning",
      price: "$22/h",
      originalPrice: "$45/h",
      icon: WindowIcon,
      description: "Crystal-clear professional results",
    },
    {
      name: "Mold & Pest Control",
      price: "$24/h",
      originalPrice: "$54/h",
      icon: BugAntIcon,
      description: "Health-focused remediation services",
    },
    {
      name: "Move In/Out Cleaning",
      price: "$24/h",
      originalPrice: "$54/h",
      icon: TruckIcon,
      description: "Complete transition cleaning",
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
                50+ Professional Services • Up to 55% OFF with Membership
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Professional Cleaning Solutions
              </span>
              <span className="block bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent mt-2 py-1">
                Starting at $18/hour
              </span>
            </h1>

            {/* First Clean Offer */}
            <div className="relative group mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-6 px-10 rounded-3xl inline-block transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#4EC6E5]/25">
                <p className="text-3xl sm:text-4xl font-bold mb-1">
                  $18/hour with Membership
                </p>
                <p className="text-sm opacity-90 font-medium">
                  50+ services at incredible member rates
                </p>
              </div>
            </div>

            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              From house cleaning to luxury yacht maintenance - 50+ professional
              services with vetted, insured cleaners. Join 75,000+ satisfied
              customers across 35+ cities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <Link to="/register" className="w-full sm:w-auto group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1B7A95] to-[#2293B5] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    size="lg"
                    className="relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#1B7A95] to-[#2293B5] hover:from-[#2293B5] hover:to-[#2BA8CD] text-white font-bold text-xl rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-105"
                  >
                    Get Membership - $18/hr
                    <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </Link>
              <Link to="/services" className="w-full sm:w-auto group">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-10 py-5 border-2 border-slate-300 hover:border-[#4EC6E5] text-slate-700 hover:text-[#4EC6E5] font-bold text-xl rounded-2xl backdrop-blur-sm bg-white/70 hover:bg-white transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
                >
                  View All 50+ Services
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-sm text-slate-500">
              <div className="flex flex-col md:flex-row items-center">
                <StarIcon className="h-5 w-5 text-[#4EC6E5] fill-[#4EC6E5] mr-2 mb-1 md:mb-0" />
                <span className="font-semibold text-center md:text-left">
                  4.9/5 Rating
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <ShieldCheckIcon className="h-5 w-5 text-[#4EC6E5] mr-2 mb-1 md:mb-0" />
                <span className="font-semibold text-center md:text-left">
                  Insured & Bonded
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <UsersIcon className="h-5 w-5 text-[#4EC6E5] mr-2 mb-1 md:mb-0" />
                <span className="font-semibold text-center md:text-left">
                  75,000+ Customers
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <SparklesIcon className="h-5 w-5 text-[#4EC6E5] mr-2 mb-1 md:mb-0" />
                <span className="font-semibold text-center md:text-left">
                  50+ Services
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Quick Preview */}
      <section className="py-16 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              Popular Services
            </h2>
            <p className="text-lg text-slate-600">
              Most requested cleaning solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, index) => {
              return (
                <Link
                  key={index}
                  to="/services"
                  className="group relative bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border border-slate-200/60 hover:border-[#4EC6E5]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden"
                >
                  {service.popular && (
                    <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-3 py-1 rounded-full text-xs font-bold">
                      Popular
                    </div>
                  )}

                  {/* Service Image */}
                  <div className="relative h-32 w-full overflow-hidden">
                    <LazyImage
                      src={getServiceImage(service.name)}
                      alt={service.name}
                      className="transition-all duration-300 group-hover:scale-110"
                      aspectRatio="w-full h-32"
                      fallbackSrc="/services/1/House & Apartment Cleaning.png"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-[#2BA8CD] transition-colors duration-200">
                      {service.name}
                    </h3>

                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center">
                      <span className="text-lg font-bold text-[#4EC6E5]">
                        {service.price}
                      </span>
                      <span className="text-sm text-slate-400 line-through ml-2">
                        {service.originalPrice}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#F0FBFE] to-white relative overflow-hidden">
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
              How SIMORGH SERVICE Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional cleaning made simple - choose, book, and enjoy
              perfect results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative group">
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

      {/* Main Service Showcase */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-sm mb-6">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Core Services
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6 leading-tight py-2">
              Professional Cleaning Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From residential to commercial, luxury to emergency - we have the
              perfect cleaning solution for every need
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
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
                    {/* Service Image Header */}
                    <div className="relative mb-6">
                      <div className="w-full h-32 rounded-xl overflow-hidden">
                        <LazyImage
                          src={getServiceImage(service.name)}
                          alt={service.name}
                          className="transition-all duration-300 group-hover:scale-110"
                          aspectRatio="w-full h-32"
                          fallbackSrc="/services/1/House & Apartment Cleaning.png"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      </div>

                      <div className="absolute top-3 right-3">
                        <div className="text-xs bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-3 py-1 rounded-full font-bold">
                          {service.membershipDiscount}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {service.name}
                    </h3>
                    <p className="text-lg text-slate-600 mb-8 flex-grow leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-8">
                      <div className="flex items-baseline mb-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent">
                          {service.price}/hour
                        </span>
                        <span className="text-xl text-slate-400 line-through ml-3">
                          {service.originalPrice}/hour
                        </span>
                      </div>
                      <p className="text-sm text-[#2BA8CD] font-semibold">
                        With membership • Save up to 55%
                      </p>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-bold text-slate-900 mb-4 text-lg">
                        Service Includes:
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
                        Optional Add-ons:
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
                        Get Started - {service.price}/hr
                        <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* View All Services CTA */}
          <div className="text-center mt-16">
            <Link to="/services" className="group">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  size="lg"
                  className="relative px-10 py-5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold text-xl rounded-2xl transition-all duration-300 group-hover:scale-105"
                >
                  Explore All 50+ Services
                  <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </Link>
            <p className="text-slate-600 mt-4 text-lg">
              Emergency cleaning • Luxury services • Specialized solutions
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Membership Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#1B7A95] via-[#2293B5] to-[#2BA8CD] text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#4EC6E5]/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-sm mb-6">
              <TrophyIcon className="h-4 w-4 mr-2" />
              Membership Program
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              SIMORGH SERVICE Membership
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Get access to all 50+ services at member rates - save up to 55% on
              every booking
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-10 max-w-6xl mx-auto shadow-2xl border border-white/20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] mb-6">
                <SparklesIcon className="h-5 w-5 mr-2" />
                <span className="font-bold">
                  All-Access Professional Cleaning
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Professional Membership
              </h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-6xl font-bold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent">
                  $18-45
                </span>
                <span className="text-2xl text-slate-500 ml-3">/hour</span>
              </div>
              <p className="text-slate-600 text-lg">
                50+ services • Member rates • Professional cleaners
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
              <div>
                <h4 className="font-bold text-xl mb-6 text-slate-900">
                  Membership Benefits:
                </h4>
                <ul className="space-y-4">
                  {[
                    "Access to all 50+ professional services",
                    "Member rates: $18-45/hour (save up to 55%)",
                    "Priority booking & flexible scheduling",
                    "Vetted, insured & bonded professionals",
                    "Satisfaction guarantee on all services",
                    "24/7 emergency cleaning available",
                    "No long-term contracts required",
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
                  Service Examples & Savings
                </h4>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center">
                    <span>House Cleaning:</span>
                    <div className="text-right">
                      <span className="text-[#4EC6E5] font-bold">$18/h</span>
                      <span className="text-slate-400 line-through text-sm ml-2">
                        $36/h
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Deep Cleaning:</span>
                    <div className="text-right">
                      <span className="text-[#4EC6E5] font-bold">$22/h</span>
                      <span className="text-slate-400 line-through text-sm ml-2">
                        $45/h
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Office Cleaning:</span>
                    <div className="text-right">
                      <span className="text-[#4EC6E5] font-bold">$22/h</span>
                      <span className="text-slate-400 line-through text-sm ml-2">
                        $45/h
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Emergency Service:</span>
                    <div className="text-right">
                      <span className="text-[#4EC6E5] font-bold">$45/h</span>
                      <span className="text-slate-400 line-through text-sm ml-2">
                        $99/h
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-[#BAEDFB] pt-4 flex justify-between items-center font-bold text-xl">
                    <span>You Save:</span>
                    <span className="text-[#4EC6E5] text-2xl">Up to 55%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/register" className="group">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    size="lg"
                    className="relative px-10 py-5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold text-xl rounded-2xl transition-all duration-300 group-hover:scale-105"
                  >
                    Join SIMORGH SERVICE Today
                    <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </Link>
              <p className="text-slate-500 mt-4 text-lg">
                Instant access • No setup fees • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Trust Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-slate-50 to-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-sm mb-6">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Trusted Excellence
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              Why Choose SIMORGH SERVICE
            </h2>
            <p className="text-xl text-slate-600">
              Join our growing community of satisfied customers across 35+
              cities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
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
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-lg text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-5 w-5 text-[#4EC6E5] fill-[#4EC6E5]"
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      {testimonial.verified && (
                        <span className="text-xs bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-3 py-1 rounded-full font-semibold">
                          Verified
                        </span>
                      )}
                      <span className="text-xs bg-[#E0F6FD] text-[#2BA8CD] px-3 py-1 rounded-full font-medium">
                        {testimonial.service}
                      </span>
                    </div>
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

      {/* Enhanced Cleaner Profiles Section */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-sm mb-6">
              <UsersIcon className="h-4 w-4 mr-2" />
              Professional Team
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              Meet Our Expert Cleaners
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              All SIMORGH SERVICE professionals are thoroughly vetted,
              certified, insured, and rated by real customers
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

                  <p className="text-slate-600 mb-4 text-lg font-medium">
                    {cleaner.experience} experience
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {cleaner.specialties.map((specialty, specialtyIndex) => (
                      <span
                        key={specialtyIndex}
                        className="px-3 py-1 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] text-[#2BA8CD] rounded-xl text-sm font-semibold border border-[#BAEDFB]/50"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {cleaner.certifications.map((cert, certIndex) => (
                      <span
                        key={certIndex}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium border border-green-200"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#F0FBFE] to-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-sm mb-6">
              <PhoneIcon className="h-4 w-4 mr-2" />
              Get In Touch
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              Need Help or Have Questions?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our customer service team is here to help you 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <PhoneIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Call Us
                </h3>
                <p className="text-slate-600 mb-4">Speak with our experts</p>
                <p className="text-2xl font-bold text-[#4EC6E5]">
                  1-800-SIMORGH
                </p>
                <p className="text-sm text-slate-500 mt-2">Available 24/7</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Live Chat
                </h3>
                <p className="text-slate-600 mb-4">Instant support online</p>
                <Button className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white px-6 py-2 rounded-xl">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Help Center
                </h3>
                <p className="text-slate-600 mb-4">Find answers quickly</p>
                <Button
                  variant="outline"
                  className="border-2 border-[#4EC6E5] text-[#4EC6E5] hover:bg-[#4EC6E5] hover:text-white px-6 py-2 rounded-xl"
                >
                  Browse FAQs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#4EC6E5] via-[#2BA8CD] to-[#1B7A95] text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Ready for Professional Cleaning?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join 75,000+ satisfied customers who trust SIMORGH SERVICE for all
            their cleaning needs. Get instant access to 50+ professional
            services at member rates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <Link to="/register" className="w-full sm:w-auto group">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  size="lg"
                  className="relative w-full sm:w-auto px-10 py-5 bg-white text-[#2BA8CD] hover:bg-slate-50 font-bold text-xl rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-105"
                  style={{ color: "#2BA8CD" }}
                >
                  Start Your Membership
                  <ArrowRightIcon
                    className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200"
                    style={{ color: "#2BA8CD" }}
                  />
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
          <div className="mt-8 text-white/80 text-lg">
            <span className="font-semibold">No setup fees</span> •{" "}
            <span className="font-semibold">Cancel anytime</span> •{" "}
            <span className="font-semibold">Satisfaction guaranteed</span>
          </div>
        </div>
      </section>

      {/* Enhanced Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  SIMORGH SERVICE Terms & Conditions
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
                      Membership Program
                    </h4>
                    <p className="leading-relaxed">
                      SIMORGH SERVICE membership provides access to all 50+
                      professional cleaning services at member rates ranging
                      from $18-45/hour. Membership includes priority booking,
                      satisfaction guarantee, and access to emergency services.
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      Service Coverage & Pricing
                    </h4>
                    <p className="leading-relaxed">
                      Member rates apply to all 50+ services including
                      residential, commercial, luxury, and emergency cleaning.
                      Pricing ranges from $18/hour (house cleaning) to $45/hour
                      (emergency services). All services include professional,
                      vetted, insured cleaners.
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      Professional Standards
                    </h4>
                    <p className="leading-relaxed">
                      All SIMORGH SERVICE professionals are background-checked,
                      certified, insured, and bonded. We guarantee your
                      satisfaction with our work. If you're not completely
                      satisfied, we'll return within 24 hours to address any
                      concerns at no additional charge.
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      Booking & Cancellation
                    </h4>
                    <p className="leading-relaxed">
                      Members enjoy priority booking and flexible scheduling.
                      Services can be booked online 24/7. Cancellations or
                      rescheduling must be made at least 24 hours before the
                      scheduled appointment to avoid fees.
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-2xl border border-[#BAEDFB]/50">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg">
                      Membership Terms
                    </h4>
                    <p className="leading-relaxed">
                      No long-term contracts required. Membership can be
                      cancelled anytime through your account dashboard or by
                      contacting customer service. No setup fees or cancellation
                      penalties apply.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowTermsModal(false)}
                  className="px-8 py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  I Understand & Agree
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
