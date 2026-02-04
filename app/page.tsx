import Script from "next/script";

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
import { generateFaqSchema } from "@/lib/faq-schema";
import { HOMEPAGE_FAQS } from "@/lib/homepage-faqs";

export default function Home() {
  const faqSchema = generateFaqSchema(
    HOMEPAGE_FAQS.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  return (
    <div className="bg-off-white">
      <Script
        id="homepage-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
