import type { Metadata } from "next";

import ProductLandingPage from "@/components/products/ProductLandingPage";
import { PRODUCT_PAGES } from "@/lib/product-pages-config";

export const metadata: Metadata = {
  title: "School Deposit Protection — Protect Enrolment Fees from $25 | SchoolSure",
  description:
    "Protect non-refundable school application and enrolment fees. Cover from $25. Instant protection. No medical screening.",
};

export default function PlacementInsurancePage() {
  return <ProductLandingPage product={PRODUCT_PAGES.D} />;
}
