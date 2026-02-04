import type { Metadata } from "next";
import Script from "next/script";

import ProductLandingPage from "@/components/products/ProductLandingPage";
import { generateFaqSchema } from "@/lib/faq-schema";
import { PRODUCT_PAGES } from "@/lib/product-pages-config";

export const metadata: Metadata = {
  title:
    "School Expenses Cover — Books, Transport & Uniform Protection | SchoolSure",
  description:
    "Protect non-refundable school expenses — books, transport, uniforms — for just $50/year per child. Add-on to SchoolSure.",
};

export default function SchoolExpensesCoverPage() {
  const faqSchema = generateFaqSchema(
    PRODUCT_PAGES.C.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  return (
    <>
      <Script
        id="school-expenses-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ProductLandingPage product={PRODUCT_PAGES.C} />
    </>
  );
}
