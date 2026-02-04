"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
  category?: string;
};

type Theme = "light" | "dark";

export default function FaqSection({
  title = "Frequently asked questions",
  subtitle,
  faqs,
  theme = "light",
  columns = 1,
  footer,
}: {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
  theme?: Theme;
  columns?: 1 | 2;
  footer?: React.ReactNode;
}) {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const bgClass = theme === "light" ? "bg-off-white" : "bg-white";
  const itemBgClass = theme === "light" ? "bg-white" : "bg-grey-100";

  const items = useMemo(() => faqs, [faqs]);

  return (
    <section className={`${bgClass} py-16 md:py-24`}>
      <div className="mx-auto max-w-[760px] px-6">
        <div className="text-center">
          <h2 className="text-[32px] font-black text-navy">{title}</h2>
          {subtitle ? (
            <p className="mt-2 text-[16px] text-grey-700">{subtitle}</p>
          ) : null}
        </div>

        <div
          className={`mt-10 grid gap-2 ${
            columns === 2 ? "md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            const previousCategory = items[index - 1]?.category;
            const showCategory =
              faq.category && faq.category !== previousCategory;
            const answerId = `faq-answer-${index}`;
            return (
              <div key={faq.question} className="flex flex-col">
                {showCategory ? (
                  <div
                    className={cn(
                      "text-[12px] font-semibold uppercase tracking-[0.5px] text-magenta",
                      index === 0 ? "mt-0" : "mt-8"
                    )}
                  >
                    {faq.category}
                  </div>
                ) : null}
                <div
                  className={cn(
                    "rounded-xl overflow-hidden",
                    itemBgClass,
                    showCategory ? "mt-3" : "mt-0"
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-150 hover:bg-grey-50"
                  >
                    <span className="text-[16px] font-semibold text-navy">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-magenta" : "text-grey-500"
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    role="region"
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden px-6 pb-5 text-[16px] leading-relaxed text-grey-700">
                      {faq.answer.split("\n\n").map((paragraph) => (
                        <p key={paragraph} className="mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {footer ? <div className="mt-10 text-center">{footer}</div> : null}
      </div>
    </section>
  );
}
