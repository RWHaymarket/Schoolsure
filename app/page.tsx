import CoverageCards from "@/components/homepage/CoverageCards";
import EmotionalHook from "@/components/homepage/EmotionalHook";
import FAQ from "@/components/homepage/FAQ";
import FeaturesBenefits from "@/components/homepage/FeaturesBenefits";
import FinalCTA from "@/components/homepage/FinalCTA";
import Hero from "@/components/homepage/Hero";
import HowItWorks from "@/components/homepage/HowItWorks";
import StatsBar from "@/components/homepage/StatsBar";
import StickyQuoteCTA from "@/components/homepage/StickyQuoteCTA";
import Testimonials from "@/components/homepage/Testimonials";

export default function Home() {
  return (
    <div className="bg-off-white">
      <Hero />
      <StatsBar />
      <EmotionalHook />
      <CoverageCards />
      <FeaturesBenefits />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <StickyQuoteCTA />
    </div>
  );
}
