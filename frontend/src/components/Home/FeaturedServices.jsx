import { Link } from "react-router-dom";
import {
  ClockIcon,
  WindowIcon,
  BugAntIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { getServiceImage } from "../../utils/serviceImages";
import LazyImage from "../ui/LazyImage";

const FeaturedServices = () => {
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
    <section className="py-12 xs:py-16 sm:py-20 lg:py-24 bg-white relative">
      <div className="w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-8 xs:mb-10 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3 xs:mb-4">
            Popular Services
          </h2>
          <p className="text-base xs:text-lg text-slate-600">
            Most requested cleaning solutions
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6">
          {featuredServices.map((service, index) => {
            return (
              <Link
                key={index}
                to="/services"
                className="group relative bg-gradient-to-br from-white to-slate-50/50 rounded-xl xs:rounded-2xl border border-slate-200/60 hover:border-[#4EC6E5]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden"
              >
                {service.popular && (
                  <div className="absolute top-2 xs:top-3 right-2 xs:right-3 z-10 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-xs font-bold">
                    Popular
                  </div>
                )}

                {/* Service Image - Responsive */}
                <div className="relative h-24 xs:h-28 sm:h-32 w-full overflow-hidden">
                  <LazyImage
                    src={getServiceImage(service.name)}
                    alt={service.name}
                    className="transition-all duration-300 group-hover:scale-110"
                    aspectRatio="w-full h-24 xs:h-28 sm:h-32"
                    fallbackSrc="/services/1/House & Apartment Cleaning.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content - Responsive */}
                <div className="p-4 xs:p-5 sm:p-6">
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-[#2BA8CD] transition-colors duration-200 text-sm xs:text-base line-clamp-2">
                    {service.name}
                  </h3>

                  <p className="text-xs xs:text-sm text-slate-600 mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center">
                    <span className="text-base xs:text-lg font-bold text-[#4EC6E5]">
                      {service.price}
                    </span>
                    <span className="text-xs xs:text-sm text-slate-400 line-through ml-2">
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
  );
};

export default FeaturedServices;
