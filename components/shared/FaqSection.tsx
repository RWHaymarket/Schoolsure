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
          className={`mt-10 grid gap-0 ${
            columns === 2 ? "md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            const previousCategory = items[index - 1]?.category;
            const showCategory =
              faq.category && faq.category !== previousCategory;
            const answerId = `faq-answer-${index}`;
            const questionId = `faq-question-${index}`;
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
                    "overflow-hidden border-b border-grey-200",
                    itemBgClass,
                    showCategory ? "mt-3" : "mt-0",
                    index === 0 ? "border-t" : "border-t-0"
                  )}
                >
                  <button
                    type="button"
                    id={questionId}
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
                    aria-labelledby={questionId}
                    style={{ transition: "max-height 0.3s ease, opacity 0.2s ease" }}
                    className={cn(
                      "overflow-hidden",
                      isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div
                      className={cn(
                        "px-6 text-[16px] leading-relaxed text-grey-600",
                        isOpen ? "pb-5" : "pb-0"
                      )}
                    >
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
