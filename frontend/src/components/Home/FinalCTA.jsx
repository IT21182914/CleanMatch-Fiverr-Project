import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";

const FinalCTA = ({ setShowTermsModal }) => {
  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-gradient-to-br from-[#4EC6E5] via-[#2BA8CD] to-[#1B7A95] text-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-5xl xl:mx-auto">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-6 xs:mb-8">
          Ready for Professional Cleaning?
        </h2>
        <p className="text-lg xs:text-xl text-white/90 mb-8 xs:mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2 xs:px-0">
          Join 900,000+ satisfied customers who trust SIMORGH SERVICE for all
          their cleaning needs. Get instant access to 50+ professional services
          at member rates.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 xs:gap-6 sm:gap-8">
          <Link to="/register" className="w-full sm:w-auto group">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-xl xs:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Button
                size="lg"
                className="relative w-full sm:w-auto px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 bg-white text-[#2BA8CD] hover:bg-slate-50 font-bold text-lg xs:text-xl rounded-xl xs:rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-105"
                style={{ color: "#2BA8CD" }}
              >
                Start Your Membership
                <ArrowRightIcon
                  className="ml-2 xs:ml-3 h-5 xs:h-6 w-5 xs:w-6 group-hover:translate-x-1 transition-transform duration-200"
                  style={{ color: "#2BA8CD" }}
                />
              </Button>
            </div>
          </Link>
          <button
            onClick={() => setShowTermsModal(true)}
            className="text-white hover:text-white/80 text-base xs:text-lg underline font-medium transition-colors duration-200"
          >
            Terms & Conditions
          </button>
        </div>
        <div className="mt-6 xs:mt-8 text-white/80 text-base xs:text-lg">
          <span className="font-semibold">No setup fees</span> •{" "}
          <span className="font-semibold">Cancel anytime</span> •{" "}
          <span className="font-semibold">Satisfaction guaranteed</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
