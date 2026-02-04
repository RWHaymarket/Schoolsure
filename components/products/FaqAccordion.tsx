"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({
  items,
  initialOpenIndex = 0,
}: {
  items: FaqItem[];
  initialOpenIndex?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number>(initialOpenIndex);

  return (
    <div className="divide-y divide-grey-300 rounded-xl border border-grey-300 bg-white">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <button
            key={faq.question}
            type="button"
            className="w-full text-left"
            onClick={() => setOpenIndex(isOpen ? -1 : index)}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[16px] font-semibold text-navy">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-grey-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {isOpen ? (
              <div className="px-5 pb-4 text-[16px] leading-relaxed text-grey-700">
                {faq.answer}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
