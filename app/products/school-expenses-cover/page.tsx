import type { Metadata } from "next";

import ProductLandingPage from "@/components/products/ProductLandingPage";
import { PRODUCT_PAGES } from "@/lib/product-pages-config";

export const metadata: Metadata = {
  title:
    "School Expenses Cover — Books, Transport & Uniform Protection | SchoolSure",
  description:
    "Protect non-refundable school expenses — books, transport, uniforms — for just $50/year per child. Add-on to SchoolSure.",
};

export default function SchoolExpensesCoverPage() {
  return <ProductLandingPage product={PRODUCT_PAGES.C} />;
}
