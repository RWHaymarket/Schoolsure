"use client";

import Link from "next/link";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PaymentBadges from "@/components/shared/PaymentBadges";
import { useQuoteStore } from "@/store/useQuoteStore";

export default function PurchasePage() {
  const { schoolName, quoteReference, parentFirstName } = useQuoteStore();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="text-center mb-8">
          <h1 className="text-h1 text-navy tracking-tight">Payment</h1>
          <p className="mt-3 text-lg text-grey-700">
            Finalise your cover and lock in today&apos;s quote.
          </p>
        </div>

        <Card className="border border-grey-100 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <div className="grid gap-6">
            <div className="rounded-2xl border border-grey-200 bg-grey-50 p-5">
              <p className="text-sm uppercase font-semibold text-grey-500">
                Your quote
              </p>
              <p className="mt-2 text-lg font-semibold text-navy">
                {schoolName || "Your school"}
              </p>
              <p className="text-sm text-grey-500">
                Quote ref:{" "}
                <span className="font-mono">{quoteReference || "—"}</span>
              </p>
              <p className="mt-2 text-sm text-grey-600">
                {parentFirstName
                  ? `Prepared for ${parentFirstName}`
                  : "Prepared for you"}
              </p>
            </div>

            <div className="rounded-2xl border border-grey-200 bg-white p-5">
              <div className="flex items-center gap-3 text-navy">
                <CreditCard className="h-5 w-5 text-magenta" />
                <p className="font-semibold">Secure checkout (coming soon)</p>
              </div>
              <p className="mt-2 text-sm text-grey-600">
                We&apos;re finalising secure payments. In the meantime, our team can
                complete your purchase and confirm cover.
              </p>
              <PaymentBadges className="mt-4" />
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-grey-500">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-magenta" />
                  Underwritten by Lloyd&apos;s of London
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-magenta" />
                  AFSL 530784 · Secure and encrypted
                </span>
              </div>
              <div className="mt-4 rounded-xl bg-grey-50 p-4 text-sm text-grey-600">
                <p className="font-semibold text-navy mb-1">What happens next</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>We confirm your cover and policy schedule.</li>
                  <li>You receive a confirmation email and documents.</li>
                  <li>Your cover begins on the agreed start date.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/quote/review"
                className="text-sm font-semibold text-magenta"
              >
                Back to review
              </Link>
              <Link href="/contact">
                <Button size="lg">Contact to complete purchase</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
