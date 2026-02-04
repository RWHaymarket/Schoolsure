import type { Metadata } from "next";

import ProductLandingPage from "@/components/products/ProductLandingPage";
import { PRODUCT_PAGES } from "@/lib/product-pages-config";

export const metadata: Metadata = {
  title: "Parent Continuity Cover — School Fee Protection | SchoolSure",
  description:
    "Protect your child's school fees if something happens to you. Covers death, critical illness, disablement. From 2.5% of your annual fee. No medical screening.",
};

export default function ParentContinuityCoverPage() {
  return <ProductLandingPage product={PRODUCT_PAGES.A} />;
}
