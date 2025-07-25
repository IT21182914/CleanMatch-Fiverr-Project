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

const Home = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <div className="bg-white overflow-hidden">
      <HeroSection />
      <FeaturedServices />
      <StepsSection />
      <ServicesShowcase />
      <MembershipSection />
      <TrustStats />
      <TestimonialsSection />
      <CleanerProfiles />
      <ContactSection />
      <FinalCTA setShowTermsModal={setShowTermsModal} />
      <TermsModal 
        showTermsModal={showTermsModal} 
        setShowTermsModal={setShowTermsModal} 
      />
    </div>
  );
};

export default Home;
