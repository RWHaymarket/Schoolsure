"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Copy,
  Download,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import PaymentBadges from "@/components/shared/PaymentBadges";
import QuoteSummary from "@/components/quote/QuoteSummary";
import { formatCurrency } from "@/lib/utils";
import { useQuoteStore } from "@/store/useQuoteStore";

export default function QuoteReviewStep() {
  const [copied, setCopied] = useState(false);
  const {
    schoolName,
    annualFees,
    yearLevel,
    includeStudentCover,
    includeExpensesCover,
    coverageYears,
    parentFirstName,
    parentLastName,
    parentEmail,
    parentPhone,
    children,
    premiumBreakdown,
    quoteReference,
    generateQuoteRef,
  } = useQuoteStore();

  useEffect(() => {
    if (!quoteReference) {
      generateQuoteRef();
    }
  }, [quoteReference, generateQuoteRef]);

  const summaryPricing = {
    weekly: Math.round((premiumBreakdown.annualTotal || 0) / 52),
    monthly: Math.round(premiumBreakdown.monthlyTotal || 0),
    annual: Math.round(premiumBreakdown.annualTotal || 0),
    annualWithDiscount: Math.round(premiumBreakdown.annualWithDiscount || 0),
    totalProtection: Math.round((annualFees || 0) * coverageYears * (children.length || 1)),
    savings: Math.max(
      0,
      Math.round((premiumBreakdown.annualTotal || 0) - (premiumBreakdown.annualWithDiscount || 0))
    ),
  };

  const primaryChild = children[0];
  const displayName = parentFirstName || "there";
  const childName = primaryChild?.firstName || "your child";

  const quoteLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const handleCopyLink = async () => {
    if (!quoteLink) return;
    await navigator.clipboard.writeText(quoteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailSubject = `Your SchoolSure quote ${quoteReference ? `(${quoteReference})` : ""}`;
  const mailBody = `Hi${parentFirstName ? ` ${parentFirstName}` : ""},%0D%0A%0D%0AHere is your SchoolSure quote for ${childName} at ${schoolName || "your school"}.%0D%0A%0D%0AWeekly: ${formatCurrency(summaryPricing.weekly)}%0D%0AMonthly: ${formatCurrency(summaryPricing.monthly)}%0D%0AAnnual: ${formatCurrency(summaryPricing.annual)}%0D%0A%0D%0AView your quote here: ${encodeURIComponent(
    quoteLink
  )}%0D%0A%0D%0AQuote reference: ${quoteReference || "—"}%0D%0A`;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-grey-500">
            Step 4 of 4
          </p>
          <h1 className="text-h1 text-navy mb-2 tracking-tight">
            Great news, {displayName}!
          </h1>
          <p className="text-lg text-grey-700">
            {childName}&apos;s education at {schoolName || "your school"} is ready to
            be protected.
          </p>
        </div>

        <QuoteSummary
          schoolName={schoolName}
          yearLevel={yearLevel}
          yearsRemaining={coverageYears}
          includeStudentCover={includeStudentCover}
          includeExpensesCover={includeExpensesCover}
          pricing={summaryPricing}
          quoteReference={quoteReference}
        />

        <div className="mt-8 space-y-6">
          <div>
            <div className="text-sm font-semibold uppercase text-grey-500">
              Your details
            </div>
            <div className="mt-2 text-sm text-grey-700">
              {parentFirstName} {parentLastName}
            </div>
            <div className="text-sm text-grey-500">
              {parentEmail} · {parentPhone}
            </div>
            <div className="mt-2 text-sm text-grey-700">
              Covering: {primaryChild?.firstName || "Child"} ({primaryChild?.yearLevel || "Year level"})
            </div>
            <Link href="/quote/details" className="mt-2 inline-block text-sm font-semibold text-magenta">
              Edit details
            </Link>
          </div>

          <div className="rounded-2xl bg-grey-50 p-6 md:p-8 text-center shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
            <p className="text-sm text-grey-500 mb-2">Quote valid for 14 days</p>
            <h3 className="text-2xl font-bold text-navy mb-2">
              Purchase now — {formatCurrency(summaryPricing.monthly)}/month
            </h3>
            <p className="text-grey-600 mb-6">
              or pay {formatCurrency(summaryPricing.annualWithDiscount)}/year and
              save 10%
            </p>
            <Link href="/quote/purchase">
              <Button size="lg">
                Purchase Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-grey-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-magenta" />
                Underwritten by Lloyd&apos;s of London
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 text-magenta" />
                Secure checkout
              </span>
            </div>
            <PaymentBadges className="mt-4 justify-center" />
          </div>

          <div className="rounded-2xl border border-grey-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <div className="text-sm font-semibold text-navy mb-4">
              Save and share your quote
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-grey-200 px-4 py-2 text-sm font-semibold text-navy hover:border-grey-300 hover:bg-grey-50 transition-all"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
              <a
                href={`mailto:${parentEmail || ""}?subject=${encodeURIComponent(
                  mailSubject
                )}&body=${mailBody}`}
                className="inline-flex items-center gap-2 rounded-xl border border-grey-200 px-4 py-2 text-sm font-semibold text-navy hover:border-grey-300 hover:bg-grey-50 transition-all"
              >
                <Mail className="h-4 w-4" />
                Email quote
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  mailSubject
                )}&body=${mailBody}`}
                className="inline-flex items-center gap-2 rounded-xl border border-grey-200 px-4 py-2 text-sm font-semibold text-navy hover:border-grey-300 hover:bg-grey-50 transition-all"
              >
                <Mail className="h-4 w-4" />
                Email to partner
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 rounded-xl border border-grey-200 px-4 py-2 text-sm font-semibold text-navy hover:border-grey-300 hover:bg-grey-50 transition-all"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Link copied" : "Copy quote link"}
              </button>
            </div>
            <p className="mt-3 text-xs text-grey-500">
              Quote reference:{" "}
              <span className="font-mono">{quoteReference || "—"}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
