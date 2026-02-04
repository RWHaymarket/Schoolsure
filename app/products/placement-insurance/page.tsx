import type { Metadata } from "next";
import Script from "next/script";

import ProductLandingPage from "@/components/products/ProductLandingPage";
import { generateFaqSchema } from "@/lib/faq-schema";
import { PRODUCT_PAGES } from "@/lib/product-pages-config";

export const metadata: Metadata = {
  title: "School Deposit Protection — Protect Enrolment Fees from $25 | SchoolSure",
  description:
    "Protect non-refundable school application and enrolment fees. Cover from $25. Instant protection. No medical screening.",
};

export default function PlacementInsurancePage() {
  const faqSchema = generateFaqSchema(
    PRODUCT_PAGES.D.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  return (
    <>
      <Script
        id="placement-insurance-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ProductLandingPage product={PRODUCT_PAGES.D} />
    </>
  );
}
