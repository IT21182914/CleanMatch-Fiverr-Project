import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";

const TermsModal = ({ showTermsModal, setShowTermsModal }) => {
  if (!showTermsModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 xs:p-4 z-50">
      <div className="bg-white rounded-2xl xs:rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="p-6 xs:p-8">
          <div className="flex items-center justify-between mb-6 xs:mb-8">
            <h3 className="text-2xl xs:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              SIMORGH SERVICE Terms & Conditions
            </h3>
            <button
              onClick={() => setShowTermsModal(false)}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
            >
              <XMarkIcon className="h-5 xs:h-6 w-5 xs:w-6" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
            <div className="prose text-slate-600 space-y-4 xs:space-y-6">
              <div className="p-4 xs:p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-xl xs:rounded-2xl border border-[#BAEDFB]/50">
                <h4 className="font-bold text-slate-900 mb-2 xs:mb-3 text-base xs:text-lg">
                  Membership Program
                </h4>
                <p className="leading-relaxed text-sm xs:text-base">
                  SIMORGH SERVICE membership provides access to all 50+
                  professional cleaning services at member rates ranging
                  from $18-45/hour. Membership includes priority booking,
                  satisfaction guarantee, and access to emergency services.
                </p>
              </div>

              <div className="p-4 xs:p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-xl xs:rounded-2xl border border-[#BAEDFB]/50">
                <h4 className="font-bold text-slate-900 mb-2 xs:mb-3 text-base xs:text-lg">
                  Service Coverage & Pricing
                </h4>
                <p className="leading-relaxed text-sm xs:text-base">
                  Member rates apply to all 50+ services including
                  residential, commercial, luxury, and emergency cleaning.
                  Pricing ranges from $18/hour (house cleaning) to $45/hour
                  (emergency services). All services include professional,
                  vetted, insured cleaners.
                </p>
              </div>

              <div className="p-4 xs:p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-xl xs:rounded-2xl border border-[#BAEDFB]/50">
                <h4 className="font-bold text-slate-900 mb-2 xs:mb-3 text-base xs:text-lg">
                  Professional Standards
                </h4>
                <p className="leading-relaxed text-sm xs:text-base">
                  All SIMORGH SERVICE professionals are background-checked,
                  certified, insured, and bonded. We guarantee your
                  satisfaction with our work. If you're not completely
                  satisfied, we'll return within 24 hours to address any
                  concerns at no additional charge.
                </p>
              </div>

              <div className="p-4 xs:p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-xl xs:rounded-2xl border border-[#BAEDFB]/50">
                <h4 className="font-bold text-slate-900 mb-2 xs:mb-3 text-base xs:text-lg">
                  Booking & Cancellation
                </h4>
                <p className="leading-relaxed text-sm xs:text-base">
                  Members enjoy priority booking and flexible scheduling.
                  Services can be booked online 24/7. Cancellations or
                  rescheduling must be made at least 24 hours before the
                  scheduled appointment to avoid fees.
                </p>
              </div>

              <div className="p-4 xs:p-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-xl xs:rounded-2xl border border-[#BAEDFB]/50">
                <h4 className="font-bold text-slate-900 mb-2 xs:mb-3 text-base xs:text-lg">
                  Membership Terms
                </h4>
                <p className="leading-relaxed text-sm xs:text-base">
                  No long-term contracts required. Membership can be
                  cancelled anytime through your account dashboard or by
                  contacting customer service. No setup fees or cancellation
                  penalties apply.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 xs:mt-8 text-center">
            <Button
              onClick={() => setShowTermsModal(false)}
              className="px-6 xs:px-8 py-2.5 xs:py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold rounded-xl xs:rounded-2xl transition-all duration-300 hover:scale-105 text-sm xs:text-base"
            >
              I Understand & Agree
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
