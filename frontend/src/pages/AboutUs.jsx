import React from "react";
import {
  ChevronRightIcon,
  StarIcon,
  CheckCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  Users,
  Award,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Leaf,
  Briefcase,
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Fully Responsive */}
      <section className="relative min-h-screen sm:h-[80vh] md:h-[70vh] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/cleaner-hero.webp")',
          }}
        ></div>
        {/* Professional overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-slate-800/40"></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-6 h-full flex items-center">
          <div className="w-full max-w-4xl">
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">
                  Trusted by 10,000+ customers
                </span>
                <span className="xs:hidden">10,000+ customers</span>
              </span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Your trusted cleaning service partner,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 block xs:inline">
                private and commercial cleaning
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              Transforming spaces with excellence, innovation, and care for over
              three decades.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="bg-white text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                Book a service
              </button>
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Floating elements - Responsive */}
        <div className="absolute top-10 sm:top-20 right-5 sm:right-20 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-white/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-20 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-gray-300/20 rounded-full blur-2xl animate-pulse"></div>
      </section>

      {/* Discover Our Commitment Section - Fully Responsive */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#F0FBFE] to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-[#4EC6E5]/10 text-[#4EC6E5] mb-3 sm:mb-4">
              <TrophyIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Our Excellence
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Discover our commitment
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#2BA8CD] font-semibold px-4">
              Your trusted partner for cleaning solutions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <h3 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Over 30 years of experience in the field
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                    With over three decades of dedicated service, we have
                    established ourselves as the leading cleaning service
                    provider in the region. Our expertise spans across
                    residential, commercial, and industrial cleaning solutions.
                  </p>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] flex items-center justify-center flex-shrink-0 mt-1">
                    <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                    Our journey began with a simple mission: to provide
                    reliable, efficient, and eco-friendly cleaning services that
                    exceed expectations while embracing innovative technologies
                    and sustainable practices.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#4EC6E5]/10">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-[#2BA8CD]">
                      10K+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Happy Customers
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-[#2BA8CD]">
                      30+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Years Experience
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-[#2BA8CD]">
                      99%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Satisfaction
                    </div>
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 inline-flex items-center group shadow-lg shadow-[#4EC6E5]/25">
                Book a service
                <ChevronRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-gradient-to-r from-[#4EC6E5]/20 to-[#2BA8CD]/20 rounded-full blur-3xl"></div>
              <img
                src="/images/cleaning.jpg"
                alt="Professional cleaning team at work"
                className="rounded-2xl sm:rounded-3xl shadow-2xl w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover border-2 sm:border-4 border-white"
              />
              <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-[#4EC6E5]/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">
                      4.9
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">
                      Excellent Rating
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Based on 2,500+ reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story of Success Section - Fully Responsive */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-3 sm:-top-6 -left-3 sm:-left-6 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-gradient-to-r from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-full blur-3xl"></div>
              <img
                src="/about-us/collaborate.jpg"
                alt="Modern office cleaning collaboration"
                className="rounded-2xl sm:rounded-3xl shadow-2xl w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover border-2 sm:border-4 border-[#F0FBFE]"
              />
              <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                <div className="text-lg sm:text-2xl font-bold">2024</div>
                <div className="text-xs sm:text-sm opacity-90">
                  Industry Leader
                </div>
              </div>
            </div>
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-[#4EC6E5]/10 text-[#4EC6E5] mb-3 sm:mb-4">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Our Journey
              </div>
              <h3 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Our story of success
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                  What started as a small family business has grown into a
                  trusted network of cleaning professionals serving thousands of
                  satisfied customers. Our success story is built on the
                  foundation of reliability, quality, and unwavering commitment
                  to excellence.
                </p>
                <div className="bg-gradient-to-r from-[#F0FBFE] to-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border-l-4 border-[#4EC6E5]">
                  <p className="text-gray-700 italic leading-relaxed text-sm sm:text-base">
                    "Through continuous improvement and customer-focused
                    innovation, we have expanded our services to meet the
                    evolving needs of modern homes and businesses."
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                  Today, we are proud to be recognized as an industry leader,
                  with a reputation built on trust, transparency, and
                  exceptional results that speak for themselves.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <button className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 inline-flex items-center group shadow-lg shadow-[#4EC6E5]/25">
                  Book a service
                  <ChevronRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="text-[#4EC6E5] font-semibold hover:text-[#2BA8CD] transition-colors duration-200 text-sm sm:text-base">
                  View our portfolio →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section - Fully Responsive */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#F0FBFE] to-[#E0F6FD]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-white/80 text-[#4EC6E5] mb-3 sm:mb-4 backdrop-blur-sm">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Our Mission
              </div>
              <h3 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Our Mission
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-[#4EC6E5]/10 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                        Reliability
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        We understand that consistency is key to building
                        lasting relationships. Our clients can depend on us to
                        deliver exceptional service, on time, every time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-[#4EC6E5]/10 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                        Eco-friendly practices
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        We are committed to protecting our environment through
                        the use of sustainable cleaning products and methods
                        that are safe for your family, pets, and the planet.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-[#4EC6E5]/10 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                        Professionalism
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        Our team embodies the highest standards of
                        professionalism, from initial consultation to project
                        completion, ensuring a seamless and stress-free
                        experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 inline-flex items-center group shadow-lg shadow-[#4EC6E5]/25">
                Book a service
                <ChevronRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-gradient-to-r from-[#4EC6E5]/20 to-[#2BA8CD]/20 rounded-full blur-3xl"></div>
              <img
                src="/about-us/team.jpg"
                alt="Professional cleaning team collaboration"
                className="rounded-2xl sm:rounded-3xl shadow-2xl w-full h-64 sm:h-80 md:h-96 lg:h-[600px] object-cover border-2 sm:border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section - Fully Responsive */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-[#4EC6E5]/10 text-[#4EC6E5] mb-4 sm:mb-6">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Our Team
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Meet our team
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              The dedicated professionals behind our success, committed to
              delivering excellence in every service.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#4EC6E5]/10 hover:border-[#4EC6E5]/30">
              <div className="relative overflow-hidden">
                <img
                  src="/ceo1.jpg"
                  alt="Michael Rodriguez - CEO & Founder"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  MICHAEL RODRIGUEZ
                </h3>
                <p className="text-[#4EC6E5] font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                  CEO & Founder
                </p>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Visionary leader with 30+ years in the cleaning industry,
                  passionate about innovation and excellence.
                </p>
                <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <FacebookIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <TwitterIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <LinkedinIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <InstagramIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#4EC6E5]/10 hover:border-[#4EC6E5]/30">
              <div className="relative overflow-hidden">
                <img
                  src="/ceo2.jpg"
                  alt="David Chen - Operations Manager"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  DAVID CHEN
                </h3>
                <p className="text-[#4EC6E5] font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                  Operations Manager
                </p>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Expert in operations optimization and quality assurance,
                  ensuring every service meets our high standards.
                </p>
                <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <FacebookIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <TwitterIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <LinkedinIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <InstagramIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#4EC6E5]/10 hover:border-[#4EC6E5]/30 sm:col-span-2 lg:col-span-1">
              <div className="relative overflow-hidden">
                <img
                  src="/ceo3.jpg"
                  alt="Sarah Mitchell - Customer Success Director"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  SARAH MITCHELL
                </h3>
                <p className="text-[#4EC6E5] font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                  Customer Success Director
                </p>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Dedicated to customer satisfaction and building lasting
                  relationships with our valued clients.
                </p>
                <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <FacebookIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <TwitterIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <LinkedinIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <InstagramIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Fully Responsive */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-white/10 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to experience the difference?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of satisfied customers who trust us with their
            cleaning needs.
          </p>
          <button className="bg-white text-[#2BA8CD] px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-[#F0FBFE] transition-all duration-300 hover:scale-105 shadow-xl">
            Get started today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
