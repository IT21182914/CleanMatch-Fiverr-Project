import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "../../ui/Button";

const SubmitButton = ({ membershipIntent, loading }) => {
  if (membershipIntent) {
    return (
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#4EC6E5] via-[#2BA8CD] to-[#1E90B8] p-0.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#4EC6E5]/25 focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="relative rounded-[11px] bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] px-6 py-3.5 sm:py-4 text-white transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[11px]"></div>

          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              <span className="font-semibold text-sm sm:text-base">
                Creating your membership account...
              </span>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 mr-2 animate-pulse" />
              <span className="font-bold text-sm sm:text-base">
                Join & Save 50% Now
              </span>
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}

          {/* Floating sparkles animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-ping"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute top-3 right-6 w-1 h-1 bg-white/40 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute bottom-3 left-6 w-1 h-1 bg-white/50 rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-2 right-4 w-1 h-1 bg-white/60 rounded-full animate-ping"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="w-full flex justify-center py-2.5 sm:py-3 text-sm sm:text-base font-semibold cursor-pointer"
      loading={loading}
      loadingVariant="spinner"
      loadingText="Creating your account..."
      disabled={loading}
    >
      {!loading && (
        <>
          Create Account
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
