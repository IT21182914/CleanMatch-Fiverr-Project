import {
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
  SparklesIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const TrustStats = () => {
  const trustStats = [
    { label: "Average Rating", value: "4.9/5", icon: StarIcon },
    { label: "Customers Served", value: "900,000+", icon: UsersIcon },
    { label: "Services Available", value: "50+", icon: SparklesIcon },
    { label: "Cities Covered", value: "36+", icon: TrophyIcon },
  ];

  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-gradient-to-br from-slate-50 to-white relative">
      <div className="w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-16 xs:mb-20">
          <div className="inline-flex items-center px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-xs xs:text-sm mb-4 xs:mb-6">
            <ShieldCheckIcon className="h-3 xs:h-4 w-3 xs:w-4 mr-1.5 xs:mr-2" />
            Trusted Excellence
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 xs:mb-6">
            Why Choose SIMORGH SERVICE
          </h2>
          <p className="text-lg xs:text-xl text-slate-600 px-2 xs:px-0">
            Join our growing community of satisfied customers across 35+ cities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 xs:gap-8 mb-16 xs:mb-20">
          {trustStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="relative mx-auto w-16 xs:w-18 sm:w-20 h-16 xs:h-18 sm:h-20 mb-4 xs:mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 xs:h-9 sm:h-10 w-8 xs:w-9 sm:w-10 text-white" />
                  </div>
                </div>
                <div className="text-xl xs:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 xs:mb-3">
                  {stat.value}
                </div>
                <div className="text-xs xs:text-sm md:text-base lg:text-lg text-slate-600 font-medium px-1 xs:px-0">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
