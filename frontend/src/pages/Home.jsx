import { useState } from "react";
import {
  HeroSection,
  FeaturedServices,
  StepsSection,
  ServicesShowcase,
  MembershipSection,
  TrustStats,
  TestimonialsSection,
  CleanerProfiles,
  ContactSection,
  TermsModal,
  FinalCTA,
} from "../components/Home";
import MembershipCTA from "../components/membership/MembershipCTA";
import DirectMembershipSignup from "../components/membership/DirectMembershipSignup";

const Home = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showMembershipSignup, setShowMembershipSignup] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(true);

  return (
    <div className="bg-white overflow-hidden">
      {/* Top Banner CTA */}
      <MembershipCTA
        variant="banner"
        onClose={() => setShowFloatingCTA(false)}
      />

      <HeroSection />
      <FeaturedServices />

      {/* Membership CTA after featured services */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <MembershipCTA
            variant="default"
            customText="Transform Your Cleaning Experience - Save 50% Today!"
          />
        </div>
      </div>

      <StepsSection />
      <ServicesShowcase />
      <MembershipSection />
      <TrustStats />
      <TestimonialsSection />
      <CleanerProfiles />
      <ContactSection />
      <FinalCTA setShowTermsModal={setShowTermsModal} />

      {/* Floating CTA */}
      {showFloatingCTA && (
        <MembershipCTA
          variant="floating"
          onClose={() => setShowFloatingCTA(false)}
        />
      )}

      {/* Modals */}
      <TermsModal
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
      />

      {showMembershipSignup && (
        <DirectMembershipSignup
          onClose={() => setShowMembershipSignup(false)}
          selectedTier="supersaver"
        />
      )}
    </div>
  );
};

export default Home;
