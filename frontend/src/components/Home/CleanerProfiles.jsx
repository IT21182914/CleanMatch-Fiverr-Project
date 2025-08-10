import { UsersIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "../ui/Card";

const CleanerProfiles = () => {
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

  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-white relative">
      <div className="w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-16 xs:mb-20">
          <div className="inline-flex items-center px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-xs xs:text-sm mb-4 xs:mb-6">
            <UsersIcon className="h-3 xs:h-4 w-3 xs:w-4 mr-1.5 xs:mr-2" />
            Professional Team
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 xs:mb-6">
            Meet Our Expert Cleaners
          </h2>
          <p className="text-lg xs:text-xl text-slate-600 max-w-3xl mx-auto px-2 xs:px-0">
            All SIMORGH SERVICE professionals are thoroughly vetted, certified,
            insured, and rated by real customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8">
          {cleanerProfiles.map((cleaner, index) => (
            <Card
              key={index}
              className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer rounded-xl xs:rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90 group"
            >
              <CardContent className="p-6 xs:p-8 text-center">
                <div className="relative mx-auto w-20 xs:w-24 h-20 xs:h-24 mb-4 xs:mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl flex items-center justify-center text-white font-bold text-xl xs:text-2xl group-hover:scale-110 transition-transform duration-300">
                    {cleaner.avatar}
                  </div>
                </div>

                <h3 className="text-xl xs:text-2xl font-bold text-slate-900 mb-2 xs:mb-3 flex items-center justify-center">
                  {cleaner.name}
                  {cleaner.verified && (
                    <CheckCircleIcon className="h-5 xs:h-6 w-5 xs:w-6 text-[#4EC6E5] ml-2" />
                  )}
                </h3>

                <div className="flex items-center justify-center mb-3 xs:mb-4">
                  <svg
                    className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] fill-[#4EC6E5]"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold ml-2 text-base xs:text-lg">
                    {cleaner.rating}
                  </span>
                  <span className="text-slate-500 ml-2 text-sm xs:text-base">
                    ({cleaner.reviews} reviews)
                  </span>
                </div>

                <p className="text-slate-600 mb-3 xs:mb-4 text-base xs:text-lg font-medium">
                  {cleaner.experience} experience
                </p>

                <div className="flex flex-wrap gap-1.5 xs:gap-2 justify-center mb-3 xs:mb-4">
                  {cleaner.specialties.map((specialty, specialtyIndex) => (
                    <span
                      key={specialtyIndex}
                      className="px-2 xs:px-3 py-0.5 xs:py-1 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] text-[#2BA8CD] rounded-lg xs:rounded-xl text-xs xs:text-sm font-semibold border border-[#BAEDFB]/50"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 xs:gap-2 justify-center">
                  {cleaner.certifications.map((cert, certIndex) => (
                    <span
                      key={certIndex}
                      className="px-2 py-0.5 xs:py-1 bg-green-100 text-green-700 rounded-md xs:rounded-lg text-xs font-medium border border-green-200"
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
  );
};

export default CleanerProfiles;
