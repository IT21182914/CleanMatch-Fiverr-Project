import { ClockIcon, SparklesIcon, CalendarDaysIcon, HomeIcon } from "@heroicons/react/24/outline";

const StepsSection = () => {
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

  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-gradient-to-br from-[#F0FBFE] to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4EC6E5] to-transparent"></div>
      </div>

      <div className="relative w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-16 xs:mb-20">
          <div className="inline-flex items-center px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-xs xs:text-sm mb-4 xs:mb-6">
            <ClockIcon className="h-3 xs:h-4 w-3 xs:w-4 mr-1.5 xs:mr-2" />
            Simple Process
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 xs:mb-6">
            How SIMORGH SERVICE Works
          </h2>
          <p className="text-lg xs:text-xl text-slate-600 max-w-3xl mx-auto px-2 xs:px-0">
            Professional cleaning made simple - choose, book, and enjoy
            perfect results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xs:gap-10 sm:gap-12 lg:gap-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center relative group">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 xs:top-14 sm:top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#BAEDFB] to-[#7FE0F8] z-0 transform translate-x-1/2"></div>
                )}

                <div className="relative z-10 mb-6 xs:mb-8">
                  <div className="relative mx-auto w-24 xs:w-28 sm:w-32 h-24 xs:h-28 sm:h-32 rounded-2xl xs:rounded-3xl overflow-hidden group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6ED1EA]/20 to-transparent"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Icon className="h-8 xs:h-10 sm:h-12 w-8 xs:w-10 sm:w-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute -top-2 xs:-top-3 -right-2 xs:-right-3 w-8 xs:w-10 h-8 xs:h-10 bg-gradient-to-br from-[#1B7A95] to-[#2293B5] rounded-xl xs:rounded-2xl flex items-center justify-center text-white font-bold text-base xs:text-lg z-20 shadow-lg">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl xs:text-2xl font-bold text-slate-900 mb-3 xs:mb-4">
                  {step.title}
                </h3>
                <p className="text-base xs:text-lg text-slate-600 leading-relaxed px-2 xs:px-0">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
