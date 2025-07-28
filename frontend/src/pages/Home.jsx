import { useState } from "react";
import {
  HeroSection,
  FeaturedServices,
  StepsSection,
  ProfessionalTrustSection,
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

      <StepsSection />

      {/* Professional Trust Section - Strategic placement for psychological impact */}
      <ProfessionalTrustSection />

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
