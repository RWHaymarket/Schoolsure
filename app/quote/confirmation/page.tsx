"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

import Card from "@/components/ui/Card";
import { useQuoteStore } from "@/store/useQuoteStore";

const buildReference = () =>
  `SS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function QuoteConfirmationPage() {
  const { parentEmail } = useQuoteStore();
  const [reference, setReference] = useState("");

  useEffect(() => {
    setReference(buildReference());
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Card className="rounded-2xl border border-grey-200 bg-white p-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-magenta/10">
            <CheckCircle2 className="h-8 w-8 text-magenta" />
          </div>
          <h1 className="mt-6 text-[32px] font-black text-navy">
            Thank you! Your quote has been saved.
          </h1>
          <p className="mt-3 text-base text-grey-700">
            We&apos;re finalising SchoolSure and will be in touch when cover is
            available.
          </p>

          <div className="mt-6 rounded-xl bg-grey-50 p-5 text-left">
            <div className="text-sm font-semibold text-navy">
              Quote reference
            </div>
            <div className="mt-2 text-lg font-semibold text-navy">{reference}</div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-grey-700">
            <Mail className="h-4 w-4 text-magenta" />
            {parentEmail
              ? `We've sent a copy of your quote to ${parentEmail}.`
              : "We'll email a copy of your quote shortly."}
          </div>
        </Card>
      </div>
    </section>
  );
}
