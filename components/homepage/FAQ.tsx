import Link from "next/link";

import FaqSection from "@/components/shared/FaqSection";
import { HOMEPAGE_FAQS } from "@/lib/homepage-faqs";

export default function FAQ() {
  return (
    <FaqSection
      title="Frequently asked questions"
      subtitle="Everything you need to know about SchoolSure"
      faqs={HOMEPAGE_FAQS}
      theme="light"
      footer={
        <div>
          <p className="text-[18px] font-semibold text-navy">
            Still have questions?
          </p>
          <p className="mt-2 text-[14px] text-grey-700">
            Get in touch and we&apos;ll get back to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="mt-2 inline-flex text-[14px] font-semibold text-magenta"
          >
            Contact us →
          </Link>
        </div>
      }
    />
  );
}
