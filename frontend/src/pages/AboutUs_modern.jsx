import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-80"
          style={{
            backgroundImage: 'url("/images/cleaner-hero.webp")',
          }}
        ></div>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5]/20 via-transparent to-[#2BA8CD]/20 animate-pulse"></div>

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                ✨ Trusted by 10,000+ customers
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your trusted cleaning service partner,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F0FBFE]">
                private and commercial cleaning
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Transforming spaces with excellence, innovation, and care for over
              three decades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-[#2BA8CD] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#F0FBFE] transition-all duration-300 hover:scale-105 shadow-lg">
                Book a service
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-[#F0FBFE]/20 rounded-full blur-2xl animate-pulse"></div>
      </section>

      {/* Discover Our Commitment Section */}
      <section className="py-24 bg-gradient-to-b from-[#F0FBFE] to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#4EC6E5]/10 text-[#4EC6E5] mb-4">
              🏆 Our Excellence
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover our commitment
            </h2>
            <p className="text-2xl text-[#2BA8CD] font-semibold">
              Your trusted partner for cleaning solutions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Over 30 years of experience in the field
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    With over three decades of dedicated service, we have
                    established ourselves as the leading cleaning service
                    provider in the region. Our expertise spans across
                    residential, commercial, and industrial cleaning solutions.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">★</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Our journey began with a simple mission: to provide
                    reliable, efficient, and eco-friendly cleaning services that
                    exceed expectations while embracing innovative technologies
                    and sustainable practices.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] p-6 rounded-2xl border border-[#4EC6E5]/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#2BA8CD]">
                      10K+
                    </div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#2BA8CD]">30+</div>
                    <div className="text-sm text-gray-600">
                      Years Experience
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#2BA8CD]">99%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center group shadow-lg shadow-[#4EC6E5]/25">
                Book a service
                <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-[#4EC6E5]/20 to-[#2BA8CD]/20 rounded-full blur-3xl"></div>
              <img
                src="/images/cleaning.jpg"
                alt="Professional cleaning team at work"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover border-4 border-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-[#4EC6E5]/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">4.9</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      Excellent Rating
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on 2,500+ reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story of Success Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-to-r from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-full blur-3xl"></div>
              <img
                src="/about-us/collaborate.jpg"
                alt="Modern office cleaning collaboration"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover border-4 border-[#F0FBFE]"
              />
              <div className="absolute top-6 right-6 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white p-4 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold">2024</div>
                <div className="text-sm opacity-90">Industry Leader</div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#4EC6E5]/10 text-[#4EC6E5] mb-4">
                📈 Our Journey
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Our story of success
              </h3>
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed text-lg">
                  What started as a small family business has grown into a
                  trusted network of cleaning professionals serving thousands of
                  satisfied customers. Our success story is built on the
                  foundation of reliability, quality, and unwavering commitment
                  to excellence.
                </p>
                <div className="bg-gradient-to-r from-[#F0FBFE] to-white p-6 rounded-2xl border-l-4 border-[#4EC6E5]">
                  <p className="text-gray-700 italic leading-relaxed">
                    "Through continuous improvement and customer-focused
                    innovation, we have expanded our services to meet the
                    evolving needs of modern homes and businesses."
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Today, we are proud to be recognized as an industry leader,
                  with a reputation built on trust, transparency, and
                  exceptional results that speak for themselves.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <button className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center group shadow-lg shadow-[#4EC6E5]/25">
                  Book a service
                  <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="text-[#4EC6E5] font-semibold hover:text-[#2BA8CD] transition-colors duration-200">
                  View our portfolio →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-24 bg-gradient-to-b from-[#F0FBFE] to-[#E0F6FD]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 text-[#4EC6E5] mb-4 backdrop-blur-sm">
                🎯 Our Mission
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Our Mission
              </h3>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#4EC6E5]/10 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">🔒</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">
                        Reliability
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        We understand that consistency is key to building
                        lasting relationships. Our clients can depend on us to
                        deliver exceptional service, on time, every time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#4EC6E5]/10 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">🌱</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">
                        Eco-friendly practices
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        We are committed to protecting our environment through
                        the use of sustainable cleaning products and methods
                        that are safe for your family, pets, and the planet.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#4EC6E5]/10 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">👔</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">
                        Professionalism
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Our team embodies the highest standards of
                        professionalism, from initial consultation to project
                        completion, ensuring a seamless and stress-free
                        experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center group shadow-lg shadow-[#4EC6E5]/25">
                Book a service
                <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-[#4EC6E5]/20 to-[#2BA8CD]/20 rounded-full blur-3xl"></div>
              <img
                src="/about-us/team.jpg"
                alt="Professional cleaning team collaboration"
                className="rounded-3xl shadow-2xl w-full h-[600px] object-cover border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#4EC6E5]/10 text-[#4EC6E5] mb-6">
              👥 Our Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet our team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The dedicated professionals behind our success, committed to
              delivering excellence in every service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <div className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#4EC6E5]/10 hover:border-[#4EC6E5]/30">
              <div className="relative overflow-hidden">
                <img
                  src="/about-us/team-photo.jpg"
                  alt="John Doe"
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  JOHN DOE
                </h3>
                <p className="text-[#4EC6E5] font-semibold mb-4 text-lg">
                  CEO & Founder
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Visionary leader with 30+ years in the cleaning industry,
                  passionate about innovation and excellence.
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#4EC6E5]/10 hover:border-[#4EC6E5]/30">
              <div className="relative overflow-hidden">
                <img
                  src="/about-us/team-photo.jpg"
                  alt="John Doe"
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  JOHN DOE
                </h3>
                <p className="text-[#4EC6E5] font-semibold mb-4 text-lg">
                  Operations Manager
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Expert in operations optimization and quality assurance,
                  ensuring every service meets our high standards.
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#4EC6E5]/10 hover:border-[#4EC6E5]/30">
              <div className="relative overflow-hidden">
                <img
                  src="/about-us/team-photo.jpg"
                  alt="John Doe"
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  JOHN DOE
                </h3>
                <p className="text-[#4EC6E5] font-semibold mb-4 text-lg">
                  Customer Success Director
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Dedicated to customer satisfaction and building lasting
                  relationships with our valued clients.
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to experience the difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their
            cleaning needs.
          </p>
          <button className="bg-white text-[#2BA8CD] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#F0FBFE] transition-all duration-300 hover:scale-105 shadow-xl">
            Get started today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
