import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import QnASection from "@/components/landing/QnASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import RoadmapSection from "@/components/landing/RoadmapSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/Footer";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Page-wide moving background */}
      <div className="fixed inset-0 z-0 opacity-100 pointer-events-none">
        <InfiniteGrid className="!bg-transparent" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <QnASection />
        <FeaturesSection />
        <HowItWorksSection />
        <RoadmapSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
