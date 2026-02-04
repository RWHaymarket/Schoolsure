"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Lock,
  CheckCircle2,
  GraduationCap,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

import StepTransition, { useStepTransition } from "@/components/quote/StepTransition";
import SkeletonCard from "@/components/shared/SkeletonCard";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { formatCurrency } from "@/lib/utils";
import { useQuoteStore } from "@/store/useQuoteStore";

const Toggle = ({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  ariaLabel: string;
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    aria-pressed={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out ${
      checked ? "bg-[#D6336C]" : "bg-[#E2E8F0]"
    } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2D3E50] focus-visible:outline-offset-2`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-all duration-200 ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

function QuoteCoverageStepContent() {
  const router = useRouter();
  const [showMobileBreakdown, setShowMobileBreakdown] = useState(false);
  const { startTransition, isTransitioning, buttonLabel, showButtonLoading } =
    useStepTransition();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const {
    schoolName,
    annualFees,
    fullTermUpgrade,
    includeStudentCover,
    includeExpensesCover,
    premiumBreakdown,
    setCoverageDetails,
  } = useQuoteStore();

  const hasPricing = annualFees > 0;
  const annualTotal = premiumBreakdown.annualTotal || 0;
  const monthlyTotal = premiumBreakdown.monthlyTotal || 0;
  const dailyEquivalent = premiumBreakdown.dailyEquivalent || 0;
  const fullTermUpgradeAmount = premiumBreakdown.children[0]?.fullTermUpgradeAmount || 0;
  const multiChildDiscountApplied =
    premiumBreakdown.children.some((child) => child.multiChildDiscount > 0);

  const priceDisplay = useMemo(() => {
    if (!hasPricing) {
      return {
        annual: "Complete Step 1 to see pricing",
        monthly: "",
        daily: "",
      };
    }
    return {
      annual: `${formatCurrency(annualTotal)}/year`,
      monthly: `${formatCurrency(monthlyTotal)}/month`,
      daily: `From ${formatCurrency(dailyEquivalent)} per day`,
    };
  }, [annualTotal, dailyEquivalent, hasPricing, monthlyTotal]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setShowSkeleton(false);
      return;
    }
    const minTimer = window.setTimeout(() => setShowSkeleton(false), 300);
    const maxTimer = window.setTimeout(() => setShowSkeleton(false), 2000);
    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  if (showSkeleton) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-12 py-12">
          <div className="mb-8">
            <div className="h-8 w-48 rounded-lg skeleton-shimmer" />
            <div className="mt-3 h-4 w-80 rounded-lg skeleton-shimmer" />
          </div>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <SkeletonCard lines={5} />
              <SkeletonCard lines={4} />
              <SkeletonCard lines={3} />
            </div>
            <div className="hidden lg:block lg:col-span-4">
              <SkeletonCard lines={4} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleContinue = () => {
    if (isTransitioning) return;
    if (!hasPricing) return;
    startTransition({
      message: "Saving your selections...",
      onComplete: () => router.push("/quote/details"),
    });
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 py-12">
        <div className="mb-8">
          <h2 className="text-[36px] font-black text-[#2D3E50] leading-[1.2]">
            Your cover
          </h2>
          <p className="mt-2 text-[16px] text-[#4A5568] leading-[1.6]">
            Your core protection is included. Add what matters to your family.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#D6336C] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.5px] text-white">
                  Core
                </span>
                <div className="text-right">
                  <div className="text-[28px] font-black text-[#2D3E50]">
                    {hasPricing ? formatCurrency(annualTotal) : "—"}
                    {hasPricing ? "/year" : ""}
                  </div>
                  <div className="text-[14px] text-[#A0AEC0]">
                    {hasPricing ? `from ${formatCurrency(dailyEquivalent)}/day` : "Complete Step 1 to see pricing"}
                  </div>
                  {hasPricing && annualTotal === PRICING_CONFIG.productA.minimumPremium && (
                    <div className="text-[14px] text-[#A0AEC0]">(minimum premium)</div>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-[24px] font-semibold text-[#2D3E50] leading-[1.3]">
                  Parent Continuity Cover
                </h4>
                <p className="mt-2 text-[16px] text-[#4A5568] leading-[1.6]">
                  If the fee payer dies, becomes seriously ill, or is disabled — school
                  fees continue. Paid directly to the school.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Death of fee payer",
                  "Terminal illness",
                  "Critical illness",
                  "Temporary disablement",
                  "Permanent disablement",
                  "No medical screening",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[16px] text-[#4A5568]">
                    <CheckCircle2 className="h-5 w-5 text-[#D6336C]" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-[#F8F9FA] p-5">
                <div className="flex items-start gap-4">
                  <Toggle
                    checked={fullTermUpgrade}
                    onChange={(value) => setCoverageDetails({ fullTermUpgrade: value })}
                    ariaLabel="Toggle full term upgrade"
                  />
                  <div>
                    <div className="text-[16px] font-semibold text-[#2D3E50]">
                      Extend cover for full schooling term
                    </div>
                    <div className="text-[14px] font-semibold text-[#D6336C]">
                      {hasPricing
                        ? `+${formatCurrency(fullTermUpgradeAmount)}/year`
                        : "+$XXX/year"}
                    </div>
                    <div className="text-[14px] text-[#A0AEC0]">
                      Death and terminal illness benefits continue until your child completes their schooling.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[24px] font-semibold text-[#2D3E50] mb-5">
                Enhance your cover
              </h4>
              <div className="grid gap-6 lg:grid-cols-2">
                <div
                  className={`rounded-2xl border ${
                    includeStudentCover
                      ? "border-[#D6336C] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                      : "border-[#E2E8F0] opacity-75"
                  } bg-white p-6 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-[#2D3E50] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.5px] text-white">
                      Add-on
                    </span>
                    <Toggle
                      checked={includeStudentCover}
                      onChange={(value) => setCoverageDetails({ includeStudentCover: value })}
                      ariaLabel="Toggle student continuity cover"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-[#D6336C]" />
                      <h4 className="text-[20px] font-semibold text-[#2D3E50]">
                        Student Continuity Cover
                      </h4>
                    </div>
                    <div className="mt-1 text-[16px] font-semibold text-[#D6336C]">
                      {hasPricing
                        ? `+${formatCurrency(premiumBreakdown.children[0]?.productB || 0)}/year`
                        : "+1% of annual fee"}
                    </div>
                    <p className="mt-2 text-[14px] text-[#4A5568] leading-[1.5]">
                      Covers fees if your child suffers a severe illness, injury, or mental health condition preventing attendance for 25%+ of the school year.
                    </p>
                  </div>
                  {includeStudentCover && (
                    <div className="mt-3 space-y-2 text-[14px] text-[#4A5568]">
                      {[
                        "Severe physical illness or injury",
                        "Severe mental health condition",
                        "Sustained bullying impact",
                        "Trauma response",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#D6336C]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`rounded-2xl border ${
                    includeExpensesCover
                      ? "border-[#D6336C] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                      : "border-[#E2E8F0] opacity-75"
                  } bg-white p-6 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-[#2D3E50] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.5px] text-white">
                      Add-on
                    </span>
                    <Toggle
                      checked={includeExpensesCover}
                      onChange={(value) => setCoverageDetails({ includeExpensesCover: value })}
                      ariaLabel="Toggle school expenses cover"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-[#D6336C]" />
                      <h4 className="text-[20px] font-semibold text-[#2D3E50]">
                        School Expenses Cover
                      </h4>
                    </div>
                    <div className="mt-1 text-[16px] font-semibold text-[#D6336C]">
                      {hasPricing
                        ? `+${formatCurrency(premiumBreakdown.children[0]?.productC || 0)}/year`
                        : "+$50/year"}
                    </div>
                    <p className="mt-2 text-[14px] text-[#4A5568] leading-[1.5]">
                      Covers non-refundable books, transport, and uniform costs when a covered event occurs.
                    </p>
                  </div>
                  {includeExpensesCover && (
                    <div className="mt-3 space-y-2 text-[14px] text-[#4A5568]">
                      {[
                        "Books & study aids — up to $1,000",
                        "School transport — up to $1,000",
                        "Uniform cover — up to $500",
                        "Combined maximum: $2,500",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#D6336C]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/quote/placement")}
              className="w-full rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8F9FA] px-5 py-4 text-left transition-colors duration-150 hover:bg-[#F7FAFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2D3E50] focus-visible:outline-offset-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-[#2D3E50]" />
                  <div>
                    <div className="text-[16px] font-semibold text-[#2D3E50]">
                      Securing a school place?
                    </div>
                    <div className="text-[14px] text-[#4A5568]">
                      Protect your deposit from $25
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#D6336C]" />
              </div>
            </button>
          </div>

          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <div className="text-[14px] uppercase tracking-[0.5px] text-[#A0AEC0]">
                Your premium
              </div>
              <div className="mt-2 text-[36px] font-black text-[#2D3E50]">
                {priceDisplay.annual}
              </div>
              {priceDisplay.monthly && (
                <div className="text-[16px] text-[#4A5568]">{priceDisplay.monthly}</div>
              )}
              {priceDisplay.daily && (
                <div className="text-[14px] text-[#A0AEC0]">{priceDisplay.daily}</div>
              )}
              {multiChildDiscountApplied && (
                <div className="mt-2 text-[14px] font-semibold text-[#D6336C]">
                  Includes 10% multi-child discount
                </div>
              )}

              <div className="my-5 h-px bg-[#E2E8F0]" />
              <div className="space-y-2 text-[14px] text-[#4A5568]">
                <div className="flex items-center justify-between">
                  <span>Parent Continuity Cover</span>
                  <span>{hasPricing ? formatCurrency(premiumBreakdown.children[0]?.productA || 0) : "—"}</span>
                </div>
                {fullTermUpgrade && (
                  <div className="flex items-center justify-between">
                    <span>Full Term Upgrade</span>
                    <span>+{formatCurrency(fullTermUpgradeAmount)}</span>
                  </div>
                )}
                {includeStudentCover && (
                  <div className="flex items-center justify-between">
                    <span>Student Continuity Cover</span>
                    <span>+{formatCurrency(premiumBreakdown.children[0]?.productB || 0)}</span>
                  </div>
                )}
                {includeExpensesCover && (
                  <div className="flex items-center justify-between">
                    <span>School Expenses Cover</span>
                    <span>+{formatCurrency(premiumBreakdown.children[0]?.productC || 0)}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!hasPricing}
                className={`mt-6 w-full rounded-[10px] px-6 py-3 text-[16px] font-semibold text-white transition-all duration-200 ease-out ${
                  hasPricing
                    ? "bg-[#D6336C] hover:bg-[#C2255C] hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                    : "bg-[#E2E8F0] text-[#A0AEC0] cursor-not-allowed"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2D3E50] focus-visible:outline-offset-2`}
              >
                {showButtonLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
                    {buttonLabel}
                  </span>
                ) : (
                  "Continue"
                )}
              </button>

              <div className="mt-4 text-[13px] text-[#A0AEC0] text-center">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#2D3E50]" />
                  Underwritten at Lloyd&apos;s of London
                </div>
                <div className="mt-1">No medical screening required</div>
              </div>

              <p className="mt-4 text-[12px] text-[#A0AEC0] leading-[1.4]">
                Cover is subject to the terms, conditions and exclusions of the policy. Please read the Product Disclosure Statement before making a decision.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.1)] px-6 py-4">
            <button
              type="button"
              onClick={() => setShowMobileBreakdown((prev) => !prev)}
              className="flex w-full items-center justify-between"
            >
              <div>
                <div className="text-[20px] font-black text-[#2D3E50]">
                  {hasPricing ? formatCurrency(annualTotal) : "—"}/yr
                </div>
                <div className="text-[14px] text-[#A0AEC0]">
                  {hasPricing ? formatCurrency(monthlyTotal) : ""}/mo
                </div>
              </div>
              <span className="text-[14px] font-semibold text-[#D6336C]">
                {showMobileBreakdown ? "Hide details" : "View details"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!hasPricing}
              className={`mt-3 w-full rounded-[10px] px-6 py-3 text-[16px] font-semibold text-white transition-all duration-200 ease-out ${
                hasPricing ? "bg-[#D6336C] hover:bg-[#C2255C]" : "bg-[#E2E8F0] text-[#A0AEC0] cursor-not-allowed"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2D3E50] focus-visible:outline-offset-2`}
            >
              {showButtonLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
                  {buttonLabel}
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </div>

          {showMobileBreakdown && (
            <div className="fixed bottom-24 left-0 right-0 z-50 mx-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <div className="text-[14px] uppercase tracking-[0.5px] text-[#A0AEC0]">
                Premium breakdown
              </div>
              <div className="mt-3 space-y-2 text-[14px] text-[#4A5568]">
                <div className="flex items-center justify-between">
                  <span>Parent Continuity Cover</span>
                  <span>{hasPricing ? formatCurrency(premiumBreakdown.children[0]?.productA || 0) : "—"}</span>
                </div>
                {fullTermUpgrade && (
                  <div className="flex items-center justify-between">
                    <span>Full Term Upgrade</span>
                    <span>+{formatCurrency(fullTermUpgradeAmount)}</span>
                  </div>
                )}
                {includeStudentCover && (
                  <div className="flex items-center justify-between">
                    <span>Student Continuity Cover</span>
                    <span>+{formatCurrency(premiumBreakdown.children[0]?.productB || 0)}</span>
                  </div>
                )}
                {includeExpensesCover && (
                  <div className="flex items-center justify-between">
                    <span>School Expenses Cover</span>
                    <span>+{formatCurrency(premiumBreakdown.children[0]?.productC || 0)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function QuoteCoverageStep() {
  return (
    <StepTransition>
      <QuoteCoverageStepContent />
    </StepTransition>
  );
}
