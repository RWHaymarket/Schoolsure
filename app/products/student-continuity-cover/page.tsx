import type { Metadata } from "next";

import ProductLandingPage from "@/components/products/ProductLandingPage";
import { PRODUCT_PAGES } from "@/lib/product-pages-config";

export const metadata: Metadata = {
  title:
    "Student Continuity Cover — Protect School Fees During Child Illness | SchoolSure",
  description:
    "Protect school fees if your child suffers severe illness, injury, or mental health condition. Covers extended absence. Add-on to Parent Continuity Cover.",
};

export default function StudentContinuityCoverPage() {
  return <ProductLandingPage product={PRODUCT_PAGES.B} />;
}
