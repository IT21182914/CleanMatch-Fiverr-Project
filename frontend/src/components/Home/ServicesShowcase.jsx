import { Link } from "react-router-dom";
import {
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HomeIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { getServiceImage } from "../../utils/serviceImages";
import LazyImage from "../ui/LazyImage";

const ServicesShowcase = () => {
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

  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-white relative">
      <div className="w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-16 xs:mb-20">
          <div className="inline-flex items-center px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-xs xs:text-sm mb-4 xs:mb-6">
            <SparklesIcon className="h-3 xs:h-4 w-3 xs:w-4 mr-1.5 xs:mr-2" />
            Core Services
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 xs:mb-6 leading-tight py-2">
            Professional Cleaning Solutions
          </h2>
          <p className="text-lg xs:text-xl text-slate-600 max-w-3xl mx-auto px-2 xs:px-0">
            From residential to commercial, luxury to emergency - we have the
            perfect cleaning solution for every need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className={`relative h-full group transition-all duration-300 hover:scale-105 ${
                  service.popular
                    ? "ring-2 ring-[#4EC6E5] shadow-2xl shadow-[#4EC6E5]/20"
                    : "shadow-xl hover:shadow-2xl"
                } rounded-2xl xs:rounded-3xl overflow-hidden backdrop-blur-sm`}
              >
                {service.popular && (
                  <div className="absolute -top-3 xs:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-4 xs:px-6 py-1.5 xs:py-2 rounded-xl xs:rounded-2xl text-xs xs:text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50"></div>

                <CardContent className="relative p-6 xs:p-8 lg:p-10 h-full flex flex-col">
                  {/* Service Image Header - Responsive */}
                  <div className="relative mb-4 xs:mb-6">
                    <div className="w-full h-24 xs:h-28 sm:h-32 rounded-lg xs:rounded-xl overflow-hidden">
                      <LazyImage
                        src={getServiceImage(service.name)}
                        alt={service.name}
                        className="transition-all duration-300 group-hover:scale-110"
                        aspectRatio="w-full h-24 xs:h-28 sm:h-32"
                        fallbackSrc="/services/1/House & Apartment Cleaning.png"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>

                    <div className="absolute top-2 xs:top-3 right-2 xs:right-3">
                      <div className="text-xs bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-bold">
                        {service.membershipDiscount}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl xs:text-2xl font-bold text-slate-900 mb-3 xs:mb-4">
                    {service.name}
                  </h3>
                  <p className="text-base xs:text-lg text-slate-600 mb-6 xs:mb-8 flex-grow leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-6 xs:mb-8">
                    <div className="flex items-baseline mb-2">
                      <span className="text-3xl xs:text-4xl font-bold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent">
                        {service.price}/hour
                      </span>
                      <span className="text-lg xs:text-xl text-slate-400 line-through ml-2 xs:ml-3">
                        {service.originalPrice}/hour
                      </span>
                    </div>
                    <p className="text-xs xs:text-sm text-[#2BA8CD] font-semibold">
                      With membership • Save up to 55%
                    </p>
                  </div>

                  <div className="mb-6 xs:mb-8">
                    <h4 className="font-bold text-slate-900 mb-3 xs:mb-4 text-base xs:text-lg">
                      Service Includes:
                    </h4>
                    <ul className="space-y-2 xs:space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircleIcon className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] mr-2 xs:mr-3 flex-shrink-0 mt-0.5 xs:mt-1" />
                          <span className="text-slate-600 leading-relaxed text-sm xs:text-base">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8 xs:mb-10">
                    <h4 className="font-bold text-slate-900 mb-3 xs:mb-4 text-base xs:text-lg">
                      Optional Add-ons:
                    </h4>
                    <ul className="space-y-2 xs:space-y-3">
                      {service.addOns.map((addOn, addOnIndex) => (
                        <li
                          key={addOnIndex}
                          className="flex items-center justify-between p-2.5 xs:p-3 rounded-lg xs:rounded-xl bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] border border-[#BAEDFB]/30"
                        >
                          <span className="text-slate-700 font-medium text-sm xs:text-base">
                            {addOn.name}
                          </span>
                          <span className="text-xs xs:text-sm font-bold text-[#2BA8CD]">
                            {addOn.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to="/register" className="mt-auto group">
                    <Button
                      className={`w-full font-bold py-3 xs:py-4 rounded-xl xs:rounded-2xl transition-all duration-300 ${
                        service.popular
                          ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white shadow-lg shadow-[#4EC6E5]/25"
                          : "border-2 border-slate-300 hover:border-[#4EC6E5] text-slate-700 hover:text-[#4EC6E5] bg-white hover:bg-[#F0FBFE]"
                      } group-hover:scale-105 text-sm xs:text-base`}
                      variant={service.popular ? "primary" : "outline"}
                    >
                      Get Started - {service.price}/hr
                      <ArrowRightIcon className="ml-2 h-4 xs:h-5 w-4 xs:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Services CTA - Responsive */}
        <div className="text-center mt-12 xs:mt-16">
          <Link to="/services" className="group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Button
                size="lg"
                className="relative px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold text-lg xs:text-xl rounded-xl xs:rounded-2xl transition-all duration-300 group-hover:scale-105"
              >
                Explore All 50+ Services
                <ArrowRightIcon className="ml-2 xs:ml-3 h-5 xs:h-6 w-5 xs:w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </Link>
          <p className="text-slate-600 mt-3 xs:mt-4 text-base xs:text-lg px-2 xs:px-0">
            Emergency cleaning • Luxury services • Specialized solutions
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
