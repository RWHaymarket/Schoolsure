import type { Metadata } from "next";
import Script from "next/script";

import ProductLandingPage from "@/components/products/ProductLandingPage";
import { generateFaqSchema } from "@/lib/faq-schema";
import { PRODUCT_PAGES } from "@/lib/product-pages-config";

export const metadata: Metadata = {
  title: "Parent Continuity Cover — School Fee Protection | SchoolSure",
  description:
    "Protect your child's school fees if something happens to you. Covers death, critical illness, disablement. From 2.5% of your annual fee. No medical screening.",
};

export default function ParentContinuityCoverPage() {
  const faqSchema = generateFaqSchema(
    PRODUCT_PAGES.A.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  return (
    <>
      <Script
        id="parent-continuity-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ProductLandingPage product={PRODUCT_PAGES.A} />
    </>
  );
}
