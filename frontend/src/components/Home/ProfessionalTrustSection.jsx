import React from "react";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

const ProfessionalTrustSection = () => {
  const trustPoints = [
    {
      icon: ShieldCheckIcon,
      title: "Fully Insured & Bonded",
      description:
        "Every cleaner is fully insured and background-checked for your peace of mind",
    },
    {
      icon: StarIcon,
      title: "5-Star Rated Professionals",
      description:
        "Our cleaners maintain the highest standards with verified customer reviews",
    },
    {
      icon: CheckCircleIcon,
      title: "Quality Guaranteed",
      description:
        "100% satisfaction guarantee or we'll make it right at no extra cost",
    },
    {
      icon: ClockIcon,
      title: "Always On Time",
      description:
        "Punctual, reliable service that respects your schedule and time",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNEVDNkU1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/cleaning.jpg"
                  alt="Professional cleaning team at work"
                  className="w-full h-[500px] object-cover"
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4EC6E5] mb-1">
                    900K+
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    Happy Customers
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quality Badge */}
              <div className="absolute top-6 left-6 bg-[#4EC6E5] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                ✓ Verified Professionals
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <div className="max-w-lg">
              {/* Section Header */}
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#4EC6E5]/10 text-[#4EC6E5] text-sm font-semibold mb-4">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  Why Choose Our Professionals
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Trusted by Families
                  <span className="block text-[#4EC6E5]">
                    Across 36+ Cities
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Every professional on our platform goes through rigorous
                  screening, training, and verification processes. Your home
                  deserves nothing less than exceptional care.
                </p>
              </div>

              {/* Trust Points */}
              <div className="space-y-6">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;
                  return (
                    <div key={index} className="flex items-start group">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 bg-[#4EC6E5]/10 rounded-xl flex items-center justify-center group-hover:bg-[#4EC6E5]/20 transition-colors duration-200">
                          <Icon className="h-6 w-6 text-[#4EC6E5]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {point.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#4EC6E5] mb-1">
                      24/7
                    </div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#4EC6E5] mb-1">
                      98%
                    </div>
                    <div className="text-sm text-gray-600">On-Time Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#4EC6E5] mb-1">
                      100%
                    </div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalTrustSection;
