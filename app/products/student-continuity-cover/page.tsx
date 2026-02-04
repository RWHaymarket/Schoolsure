import type { Metadata } from "next";
import Script from "next/script";

import ProductLandingPage from "@/components/products/ProductLandingPage";
import { generateFaqSchema } from "@/lib/faq-schema";
import { PRODUCT_PAGES } from "@/lib/product-pages-config";

export const metadata: Metadata = {
  title:
    "Student Continuity Cover — Protect School Fees During Child Illness | SchoolSure",
  description:
    "Protect school fees if your child suffers severe illness, injury, or mental health condition. Covers extended absence. Add-on to Parent Continuity Cover.",
};

export default function StudentContinuityCoverPage() {
  const faqSchema = generateFaqSchema(
    PRODUCT_PAGES.B.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  return (
    <>
      <Script
        id="student-continuity-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ProductLandingPage product={PRODUCT_PAGES.B} />
    </>
  );
}
