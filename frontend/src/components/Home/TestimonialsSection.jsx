import { StarIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "../ui/Card";

const TestimonialsSection = () => {
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

  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-gradient-to-br from-slate-50 to-white relative">
      <div className="w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-12 xs:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 xs:mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg xs:text-xl text-slate-600 px-2 xs:px-0">
            Real feedback from satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl xs:rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90"
            >
              <CardContent className="p-6 xs:p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 xs:mb-6">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] fill-[#4EC6E5]"
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1.5 xs:space-x-2">
                    {testimonial.verified && (
                      <span className="text-xs bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-semibold">
                        Verified
                      </span>
                    )}
                    <span className="text-xs bg-[#E0F6FD] text-[#2BA8CD] px-2 xs:px-3 py-0.5 xs:py-1 rounded-full font-medium">
                      {testimonial.service}
                    </span>
                  </div>
                </div>
                <p className="text-slate-700 mb-6 xs:mb-8 flex-grow italic text-base xs:text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 xs:w-12 h-10 xs:h-12 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-lg xs:rounded-xl flex items-center justify-center text-white font-bold mr-3 xs:mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base xs:text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-xs xs:text-sm text-slate-500 font-medium">
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
  );
};

export default TestimonialsSection;
