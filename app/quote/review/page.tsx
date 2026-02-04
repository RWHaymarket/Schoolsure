"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StepTransition, { useStepTransition } from "@/components/quote/StepTransition";
import SkeletonTable from "@/components/shared/SkeletonTable";
import { formatCurrency } from "@/lib/utils";
import { useQuoteStore, type Child } from "@/store/useQuoteStore";

const paymentOptions = {
  annual: "annual",
  monthly: "monthly",
} as const;

type PaymentOption = (typeof paymentOptions)[keyof typeof paymentOptions];

function QuoteReviewStepContent() {
  const router = useRouter();
  const store = useQuoteStore();
  const { startTransition, isTransitioning, buttonLabel, showButtonLoading } =
    useStepTransition();
  const {
    schoolName,
    annualFees,
    yearLevel,
    fullTermUpgrade,
    includeStudentCover,
    includeExpensesCover,
    parentFirstName,
    parentLastName,
    parentEmail,
    parentPhone,
    parentDob,
    parentTitle,
    parentPostcode,
    children,
    premiumBreakdown,
    quoteReference,
    generateQuoteRef,
  } = store;

  useEffect(() => {
    if (!quoteReference) {
      generateQuoteRef();
    }
  }, [quoteReference, generateQuoteRef]);

  const [paymentOption, setPaymentOption] = useState<PaymentOption>("annual");
  const [pdsAccepted, setPdsAccepted] = useState(false);
  const [pdsError, setPdsError] = useState(false);
  const [saveQuoteState, setSaveQuoteState] = useState<"idle" | "sent">("idle");
  const [showSaveInput, setShowSaveInput] = useState(!parentEmail);
  const [saveEmail, setSaveEmail] = useState(parentEmail || "");
  const pdsDesktopRef = useRef<HTMLDivElement | null>(null);
  const pdsMobileRef = useRef<HTMLDivElement | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const annualTotal = premiumBreakdown.annualTotal || 0;
  const annualWithDiscount = premiumBreakdown.annualWithDiscount || 0;
  const monthlyTotal = premiumBreakdown.monthlyTotal || 0;
  const savings = Math.max(0, annualTotal - annualWithDiscount);

  const coverSummary = useMemo(
    () => [
      {
        title: "Parent Continuity Cover",
        description:
          "Death, terminal illness, disablement, critical illness. Fees paid to school.",
        show: true,
      },
      {
        title: "Full Term Upgrade",
        description:
          "Death & terminal illness cover extended to full schooling term.",
        show: fullTermUpgrade,
      },
      {
        title: "Student Continuity Cover",
        description:
          "Severe illness, injury, or mental health condition. 25%+ absence threshold.",
        show: includeStudentCover,
      },
      {
        title: "School Expenses Cover",
        description: "Books, transport, uniform. Up to $2,500 combined.",
        show: includeExpensesCover,
      },
    ],
    [fullTermUpgrade, includeExpensesCover, includeStudentCover]
  );

  const handleSecureCover = () => {
    if (isTransitioning) return;
    if (!pdsAccepted) {
      setPdsError(true);
      const targetRef =
        typeof window !== "undefined" && window.innerWidth < 1024
          ? pdsMobileRef
          : pdsDesktopRef;
      targetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    startTransition({
      message: "Securing your cover...",
      buttonLabel: "Processing...",
      minDelay: 1500,
      maxDelay: 2000,
      onComplete: () => router.push("/quote/confirmation"),
    });
  };

  const handleSaveQuote = () => {
    if (parentEmail) {
      setSaveQuoteState("sent");
      return;
    }

    const trimmed = saveEmail.trim();
    const isValid = /^\S+@\S+\.\S+$/.test(trimmed);
    if (!isValid) return;
    setSaveQuoteState("sent");
  };

  const renderPdsConsent = (ref: RefObject<HTMLDivElement>) => (
    <div
      ref={ref}
      className={`rounded-xl border p-4 text-[12px] text-grey-500 ${
        pdsError && !pdsAccepted ? "border-error" : "border-grey-200"
      }`}
    >
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={pdsAccepted}
          onChange={(event) => {
            setPdsAccepted(event.target.checked);
            setPdsError(false);
          }}
          className="mt-1 h-4 w-4 rounded border-grey-300 text-magenta focus:ring-magenta"
        />
        <span>
          I confirm I have read the{" "}
          <a href="#" className="font-semibold text-magenta">
            Product Disclosure Statement
          </a>{" "}
          and{" "}
          <a href="#" className="font-semibold text-magenta">
            Financial Services Guide
          </a>
          , and agree to the terms and conditions.
        </span>
      </label>
    </div>
  );

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

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 pb-28 lg:pb-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-grey-500">
              Step 4 of 4
            </p>
            <h1 className="text-[36px] font-black text-navy tracking-tight">
              Review your quote
            </h1>
            <p className="mt-2 text-base text-grey-700">
              Check everything looks right, then secure your cover.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card className="rounded-2xl border border-grey-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="text-[20px] font-semibold text-navy">
                  Your details
                </div>
                <Link href="/quote/details" className="text-sm font-semibold text-magenta">
                  Edit
                </Link>
              </div>
              <div className="mt-4 grid gap-y-3 gap-x-6 md:grid-cols-2 text-sm">
                <div className="text-grey-500">Name</div>
                <div className="text-navy">
                  {[parentTitle, parentFirstName, parentLastName]
                    .filter(Boolean)
                    .join(" ") || "—"}
                </div>
                <div className="text-grey-500">Email</div>
                <div className="text-navy">{parentEmail || "—"}</div>
                <div className="text-grey-500">Mobile</div>
                <div className="text-navy">{parentPhone || "—"}</div>
                <div className="text-grey-500">Date of birth</div>
                <div className="text-navy">{parentDob || "—"}</div>
                <div className="text-grey-500">Postcode</div>
                <div className="text-navy">{parentPostcode || "—"}</div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-grey-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="text-[20px] font-semibold text-navy">
                  Children
                </div>
                <Link href="/quote/details" className="text-sm font-semibold text-magenta">
                  Edit
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {children.length ? (
                  children.map((child, index) => (
                    <div key={`${child.firstName || "child"}-${index}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="text-base font-semibold text-navy">
                            {[child.firstName, child.lastName].filter(Boolean).join(" ") ||
                              `Child ${index + 1}`}
                          </div>
                          <div className="text-[14px] text-grey-500">
                            {child.dateOfBirth || "DOB"} ·{" "}
                            {child.yearLevel || yearLevel || "Year level"}
                          </div>
                        </div>
                        <div className="text-right text-[14px] text-grey-700">
                          <div>{schoolName || "School name"}</div>
                          <div className="font-semibold text-navy">
                            {formatCurrency(annualFees || 0)}/year
                          </div>
                        </div>
                      </div>
                      {index < children.length - 1 ? (
                        <div className="mt-4 h-px bg-grey-200" />
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-grey-500">No children added.</div>
                )}
              </div>
            </Card>

            <Card className="rounded-2xl border border-grey-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="text-[20px] font-semibold text-navy">
                  Your cover
                </div>
                <Link href="/quote/coverage" className="text-sm font-semibold text-magenta">
                  Edit
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {coverSummary
                  .filter((item) => item.show)
                  .map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-magenta" />
                      <div>
                        <div className="text-sm font-semibold text-navy">
                          {item.title}
                        </div>
                        <div className="text-[14px] text-grey-500">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card
              className="rounded-2xl border border-grey-200 bg-white p-7"
              style={{ borderTopColor: "#2D3E50", borderTopWidth: "2px" }}
            >
              <div className="text-[20px] font-semibold text-navy">
                Price breakdown
              </div>
              {showSkeleton ? (
                <div className="mt-4">
                  <SkeletonTable rows={4} columns={2} />
                </div>
              ) : (
                <>
                  <div className="mt-4 space-y-6">
                    {premiumBreakdown.children?.map((child, index) => {
                      const childData: Child | undefined = children[index];
                      const childLabel =
                        [childData?.firstName, childData?.lastName]
                          .filter(Boolean)
                          .join(" ") || `Child ${index + 1}`;
                      return (
                        <div key={`breakdown-${index}`}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-base font-semibold text-navy">
                              {childLabel}
                            </div>
                            <div className="text-[14px] text-grey-500">
                              {schoolName || "School name"}
                            </div>
                          </div>
                          <div className="mt-2 h-px bg-grey-200" />
                          <div className="mt-3 space-y-1 text-[14px]">
                            <div className="flex items-center justify-between text-navy">
                              <span>Parent Continuity Cover</span>
                              <span>{formatCurrency(child.productA)}</span>
                            </div>
                            {child.fullTermUpgradeAmount ? (
                              <div className="flex items-center justify-between text-grey-700">
                                <span>Full Term Upgrade</span>
                                <span>
                                  +{formatCurrency(child.fullTermUpgradeAmount)}
                                </span>
                              </div>
                            ) : null}
                            {child.productB ? (
                              <div className="flex items-center justify-between text-grey-700">
                                <span>Student Continuity Cover</span>
                                <span>+{formatCurrency(child.productB)}</span>
                              </div>
                            ) : null}
                            {child.productC ? (
                              <div className="flex items-center justify-between text-grey-700">
                                <span>School Expenses Cover</span>
                                <span>+{formatCurrency(child.productC)}</span>
                              </div>
                            ) : null}
                            {child.multiChildDiscount ? (
                              <div className="flex items-center justify-between text-magenta font-semibold">
                                <span>Multi-child discount (10%)</span>
                                <span>
                                  −{formatCurrency(child.multiChildDiscount)}
                                </span>
                              </div>
                            ) : null}
                          </div>
                          <div className="mt-3 h-px bg-grey-200" />
                          <div className="mt-2 flex items-center justify-between text-[14px] font-semibold text-navy">
                            <span>Total for {childLabel}</span>
                            <span>{formatCurrency(child.childTotal)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 h-[2px] bg-navy" />
                  <div className="mt-4 flex items-center justify-between text-[24px] font-black text-navy">
                    <span>Annual premium</span>
                    <span>{formatCurrency(annualTotal)}</span>
                  </div>
                </>
              )}
            </Card>

            <div className="mt-6">
              <div className="text-[20px] font-semibold text-navy">
                How would you like to pay?
              </div>
              <div className="mt-4 space-y-4">
                <button
                  type="button"
                  className={`w-full rounded-xl border px-5 py-4 text-left transition-all duration-200 ease-out ${
                    paymentOption === "annual"
                      ? "border-magenta bg-off-white shadow-[0_0_0_1px_rgba(214,51,108,1)]"
                      : "border-grey-200 bg-white"
                  }`}
                  onClick={() => setPaymentOption("annual")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-3">
                        <span
                          className={`h-4 w-4 rounded-full border ${
                            paymentOption === "annual"
                              ? "border-magenta bg-magenta"
                              : "border-grey-300 bg-white"
                          }`}
                        />
                        <span className="text-base font-semibold text-navy">
                          Pay annually
                        </span>
                      </div>
                      <div className="mt-3 text-[24px] font-black text-navy">
                        {formatCurrency(annualWithDiscount)} per year
                      </div>
                      <div className="mt-1 text-[14px] font-semibold text-magenta">
                        Save {formatCurrency(savings)} (10% off)
                      </div>
                      <div className="mt-1 text-[14px] text-grey-500">
                        Single annual payment
                      </div>
                    </div>
                    <span className="h-fit rounded-full bg-magenta px-2.5 py-1 text-[12px] font-semibold uppercase text-white">
                      Recommended
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`w-full rounded-xl border px-5 py-4 text-left transition-all duration-200 ease-out ${
                    paymentOption === "monthly"
                      ? "border-magenta bg-off-white shadow-[0_0_0_1px_rgba(214,51,108,1)]"
                      : "border-grey-200 bg-white"
                  }`}
                  onClick={() => setPaymentOption("monthly")}
                >
                  <div className="inline-flex items-center gap-3">
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        paymentOption === "monthly"
                          ? "border-magenta bg-magenta"
                          : "border-grey-300 bg-white"
                      }`}
                    />
                    <span className="text-base font-semibold text-navy">
                      Pay monthly
                    </span>
                  </div>
                  <div className="mt-3 text-[24px] font-black text-navy">
                    {formatCurrency(monthlyTotal)} per month
                  </div>
                  <div className="mt-1 text-[14px] text-grey-500">
                    {formatCurrency(annualTotal)} total per year
                  </div>
                  <div className="mt-1 text-[14px] text-grey-500">
                    12 monthly payments by direct debit
                  </div>
                </button>
              </div>
            </div>

            <Card className="mt-8 rounded-xl border border-dashed border-grey-300 bg-off-white p-5">
              <div className="flex flex-wrap items-center gap-4">
                <Mail className="h-5 w-5 text-navy" />
                <div className="flex-1">
                  <div className="text-base font-semibold text-navy">
                    Not ready yet? Save your quote
                  </div>
                  <div className="text-[14px] text-grey-500">
                    We&apos;ll email you a link to pick up where you left off.
                  </div>
                </div>
                <button
                  type="button"
                  className="text-[14px] font-semibold text-magenta"
                  onClick={() => {
                    setShowSaveInput(true);
                    if (parentEmail) setSaveQuoteState("sent");
                  }}
                >
                  Save Quote →
                </button>
              </div>
              {showSaveInput && saveQuoteState === "idle" ? (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Input
                    type="email"
                    value={saveEmail}
                    onChange={(event) => setSaveEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 focus:border-magenta focus:ring-magenta/20"
                  />
                  <Button onClick={handleSaveQuote}>Send</Button>
                </div>
              ) : null}
              {saveQuoteState === "sent" ? (
                <p className="mt-3 text-[14px] text-grey-700">
                  Quote saved — check your email.
                </p>
              ) : null}
            </Card>

            <div className="rounded-2xl border border-grey-200 bg-white p-6">
              <div className="text-[20px] font-semibold text-navy">
                What happens next
              </div>
              <div className="mt-3 space-y-2 text-[14px] text-grey-700">
                <p>We confirm your cover and send your policy documents by email.</p>
                <p>Your school is paid directly if a covered event occurs.</p>
                <p>
                  You&apos;ll have a 30-day cooling off period from the start date.
                </p>
              </div>
            </div>

            <div className="lg:hidden">{renderPdsConsent(pdsMobileRef)}</div>
          </div>

          <div className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <Card className="rounded-2xl border border-grey-200 bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <div className="text-[14px] uppercase tracking-wide text-grey-500">
                Total to pay
              </div>
              <div className="mt-2 text-[36px] font-black text-navy">
                {paymentOption === "annual"
                  ? formatCurrency(annualWithDiscount)
                  : formatCurrency(monthlyTotal)}
              </div>
              <div className="text-[14px] text-grey-500">
                {paymentOption === "annual" ? "per year" : "per month"}
              </div>
              {paymentOption === "annual" ? (
                <div className="mt-2 text-[14px] font-semibold text-magenta">
                  You save {formatCurrency(savings)}
                </div>
              ) : (
                <div className="mt-2 text-[14px] text-grey-500">
                  {formatCurrency(annualTotal)} total per year
                </div>
              )}

              <div className="my-5 h-px bg-grey-200" />

              <Button className="w-full" onClick={handleSecureCover}>
                {showButtonLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
                    {buttonLabel}
                  </span>
                ) : (
                  "Secure Your Cover"
                )}
              </Button>
              <div className="mt-3 flex items-center justify-center gap-2 text-[13px] text-grey-500">
                <Lock className="h-4 w-4" />
                256-bit secure payment
              </div>

              <div className="mt-4 space-y-2 text-[13px] text-grey-500">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Underwritten at Lloyd&apos;s of London
                </div>
                <div className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  30-day cooling off period
                </div>
                <div className="inline-flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Instant policy documents by email
                </div>
              </div>

              <div className="mt-4">{renderPdsConsent(pdsDesktopRef)}</div>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-grey-200 bg-white px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] lg:hidden">
        <div className="text-[18px] font-black text-navy">
          {paymentOption === "annual"
            ? `${formatCurrency(annualWithDiscount)}/yr`
            : `${formatCurrency(monthlyTotal)}/mo`}
        </div>
        {paymentOption === "annual" ? (
          <div className="text-[14px] font-semibold text-magenta">
            You save {formatCurrency(savings)}
          </div>
        ) : (
          <div className="text-[14px] text-grey-500">
            {formatCurrency(annualTotal)} total per year
          </div>
        )}
        <Button className="mt-3 w-full" onClick={handleSecureCover}>
          {showButtonLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
              {buttonLabel}
            </span>
          ) : (
            "Secure Your Cover"
          )}
        </Button>
      </div>
    </section>
  );
}

export default function QuoteReviewStep() {
  return (
    <StepTransition>
      <QuoteReviewStepContent />
    </StepTransition>
  );
}
