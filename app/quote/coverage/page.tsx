"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Lock,
  CheckCircle2,
  GraduationCap,
  Wallet,
  BadgeCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import InfoBox from "@/components/shared/InfoBox";
import { formatCurrency } from "@/lib/utils";
import { useQuoteStore } from "@/store/useQuoteStore";

export default function QuoteCoverageStep() {
  const router = useRouter();
  const {
    schoolName,
    annualFees,
    yearLevel,
    fullTermUpgrade,
    includeStudentCover,
    includeExpensesCover,
    premiumBreakdown,
    setCoverageDetails,
  } = useQuoteStore();

  const feeValue = annualFees || 0;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-grey-500">
              Step 2 of 4
            </p>
            <h1 className="text-h1 text-navy tracking-tight">Your cover</h1>
            <p className="mt-3 text-lg text-grey-700">
              Choose the protection that fits your family.
            </p>
          </div>
          <div className="text-sm text-grey-500">
            Prices update instantly based on your selections
          </div>
        </div>

        <div className="mt-8">
          <Card className="border border-grey-100 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase text-grey-500">
                  Your school
                </div>
                <div className="mt-2 text-body font-semibold text-navy">
                  {schoolName || "School name"}
                </div>
                <div className="text-sm text-grey-500">
                  Annual fees: {formatCurrency(feeValue)} ·{" "}
                  {yearLevel || "Year level"}
                </div>
              </div>
              <div className="rounded-full bg-magenta/10 px-3 py-1 text-xs font-semibold text-magenta">
                Personalised estimate
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <Card className="border border-grey-200 shadow-[0_12px_28px_rgba(15,23,42,0.1)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase text-grey-500">
                    Core cover
                  </div>
                  <h3 className="text-2xl font-bold text-navy mt-1">
                    Parent Continuity Cover
                  </h3>
                  <p className="text-sm text-grey-600 mt-2">
                    Protects your child&apos;s education if something happens to you.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-grey-500">From</p>
                  <p className="text-2xl font-bold text-navy">
                    {formatCurrency(premiumBreakdown.productA)}
                  </p>
                  <p className="text-xs text-grey-500">per year</p>
                </div>
              </div>

              <ul className="mt-6 grid gap-2 text-sm text-grey-600">
                {[
                  "Death of fee payer",
                  "Terminal illness",
                  "Temporary disablement (30-day wait)",
                  "Permanent disablement",
                  "Critical illness (defined conditions)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-magenta" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-grey-200 bg-grey-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Full Term Upgrade
                  </p>
                  <p className="text-xs text-grey-500">
                    Extend death & terminal illness cover to the full schooling
                    term (+15%).
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                  <input
                    type="checkbox"
                    checked={fullTermUpgrade}
                    onChange={(event) =>
                      setCoverageDetails({ fullTermUpgrade: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-grey-300 text-magenta focus:ring-magenta"
                  />
                  Add
                </label>
              </div>

              <div className="mt-4 text-xs text-grey-500">
                No medical screening · Direct payment to school · Moratorium
                approach
              </div>
            </Card>

            <div>
              <div className="text-h4 font-headline text-navy">
                Optional add-ons
              </div>
              <div className="mt-4 grid gap-4">
                <div className="rounded-2xl border-2 border-grey-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-magenta/10">
                        <GraduationCap className="h-5 w-5 text-magenta" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">
                          Student Continuity Cover
                        </h4>
                        <p className="mt-1 text-sm text-grey-600">
                          Covers school fees if your child suffers a severe illness,
                          injury, or mental health condition preventing attendance.
                        </p>
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                      <input
                        type="checkbox"
                        checked={includeStudentCover}
                        onChange={(event) =>
                          setCoverageDetails({
                            includeStudentCover: event.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-grey-300 text-magenta focus:ring-magenta"
                      />
                      {formatCurrency(premiumBreakdown.productB)}/yr
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-grey-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10">
                        <Wallet className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">
                          Annual School Expenses Cover
                        </h4>
                        <p className="mt-1 text-sm text-grey-600">
                          Covers non-refundable books, transport, and uniform
                          costs when a covered event occurs.
                        </p>
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                      <input
                        type="checkbox"
                        checked={includeExpensesCover}
                        onChange={(event) =>
                          setCoverageDetails({
                            includeExpensesCover: event.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-grey-300 text-magenta focus:ring-magenta"
                      />
                      {formatCurrency(premiumBreakdown.productC)}/yr
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-magenta/30 bg-magenta/5 p-5">
              <div className="flex items-start gap-3">
                <BadgeCheck className="h-5 w-5 text-magenta mt-0.5" />
                <div>
                  <p className="font-semibold text-navy">
                    Securing a school place?
                  </p>
                  <p className="text-sm text-grey-600">
                    Protect your deposit from $25 with Placement Insurance.
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold text-magenta"
                    onClick={() => router.push("/quote/placement")}
                  >
                    Explore Placement Insurance →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="border border-grey-200 bg-grey-50 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
              <div className="text-sm font-semibold text-navy mb-3">
                Premium summary
              </div>
              <div className="space-y-2 text-sm text-grey-600">
                <div className="flex items-center justify-between">
                  <span>Annual total</span>
                  <span className="font-semibold text-navy">
                    {formatCurrency(premiumBreakdown.annualTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monthly equivalent</span>
                  <span className="font-semibold text-navy">
                    {formatCurrency(premiumBreakdown.monthlyTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Per day</span>
                  <span className="font-semibold text-navy">
                    From {formatCurrency(premiumBreakdown.dailyEquivalent)}
                  </span>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-white p-4 text-xs text-grey-500">
                Underwritten by Lloyd&apos;s of London · No medical screening
              </div>
              <p className="mt-3 text-[11px] text-grey-400">
                Cover is subject to policy terms, conditions, and exclusions.
                Please read the PDS before purchasing.
              </p>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <InfoBox variant="tip">
            Claims are paid net of any school hardship relief or bursary. Parents
            must engage with the school process first.
          </InfoBox>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Button variant="secondary" onClick={() => router.push("/quote/school")}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-4 text-xs text-grey-500">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-magenta" />
              Underwritten by Lloyd&apos;s
            </span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4 text-magenta" />
              Secure quote
            </span>
          </div>
          <Button onClick={() => router.push("/quote/details")}>
            Continue to Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
