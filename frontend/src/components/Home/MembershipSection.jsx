import { Link } from "react-router-dom";
import {
  TrophyIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";

const MembershipSection = () => {
  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-gradient-to-br from-[#1B7A95] via-[#2293B5] to-[#2BA8CD] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-gradient-to-br from-[#4EC6E5]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-16 xs:mb-20">
          <div className="inline-flex items-center px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-xs xs:text-sm mb-4 xs:mb-6">
            <TrophyIcon className="h-3 xs:h-4 w-3 xs:w-4 mr-1.5 xs:mr-2" />
            Membership Program
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-4 xs:mb-6">
            SIMORGH SERVICE Membership
          </h2>
          <p className="text-lg xs:text-xl opacity-90 max-w-3xl mx-auto px-2 xs:px-0">
            Get access to all 50+ services at member rates - save up to 55% on
            every booking
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-2xl xs:rounded-3xl p-6 xs:p-8 sm:p-10 max-w-6xl mx-auto shadow-2xl border border-white/20">
          <div className="text-center mb-8 xs:mb-10">
            <div className="inline-flex items-center px-4 xs:px-6 py-2 xs:py-3 rounded-xl xs:rounded-2xl bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] mb-4 xs:mb-6">
              <SparklesIcon className="h-4 xs:h-5 w-4 xs:w-5 mr-1.5 xs:mr-2" />
              <span className="font-bold text-sm xs:text-base">
                All-Access Professional Cleaning
              </span>
            </div>
            <h3 className="text-2xl xs:text-3xl font-bold mb-3 xs:mb-4">
              Professional Membership
            </h3>
            <div className="flex items-baseline justify-center mb-3 xs:mb-4">
              <span className="text-4xl xs:text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent">
                $18-45
              </span>
              <span className="text-xl xs:text-2xl text-slate-500 ml-2 xs:ml-3">
                /hour
              </span>
            </div>
            <p className="text-slate-600 text-base xs:text-lg">
              50+ services • Member rates • Professional cleaners
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 mb-8 xs:mb-10">
            <div>
              <h4 className="font-bold text-lg xs:text-xl mb-4 xs:mb-6 text-slate-900">
                Membership Benefits:
              </h4>
              <ul className="space-y-3 xs:space-y-4">
                {[
                  "Access to all 50+ professional services",
                  "Member rates: $18-45/hour (save up to 55%)",
                  "Priority booking & flexible scheduling",
                  "Vetted, insured & bonded professionals",
                  "Satisfaction guarantee on all services",
                  "24/7 emergency cleaning available",
                  "No long-term contracts required",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 xs:h-6 w-5 xs:w-6 text-[#4EC6E5] mr-3 xs:mr-4 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-base xs:text-lg">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] p-6 xs:p-8 rounded-xl xs:rounded-2xl border border-[#BAEDFB]/50">
              <h4 className="font-bold text-lg xs:text-xl mb-4 xs:mb-6 text-center text-slate-900">
                Service Examples & Savings
              </h4>
              <div className="space-y-3 xs:space-y-4 text-base xs:text-lg">
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
                <div className="border-t border-[#BAEDFB] pt-3 xs:pt-4 flex justify-between items-center font-bold text-lg xs:text-xl">
                  <span>You Save:</span>
                  <span className="text-[#4EC6E5] text-xl xs:text-2xl">
                    50% OFF
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              state={{
                membershipIntent: true,
                redirectTo: "/memberships/subscribe",
              }}
              className="group"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  size="lg"
                  className="relative px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold text-lg xs:text-xl rounded-xl xs:rounded-2xl transition-all duration-300 group-hover:scale-105"
                >
                  Start Saving 50% Today
                  <ArrowRightIcon className="ml-2 xs:ml-3 h-5 xs:h-6 w-5 xs:w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </Link>
            <p className="text-slate-500 mt-3 xs:mt-4 text-base xs:text-lg">
              Instant access • $59/month • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
