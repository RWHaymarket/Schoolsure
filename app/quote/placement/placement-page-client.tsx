"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Heart,
  Home,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { formatCurrency } from "@/lib/utils";

type LevelKey = keyof typeof PRICING_CONFIG.productD.levels;

const levels = PRICING_CONFIG.productD.levels;

const levelOrder: LevelKey[] = ["level1", "level2", "level3"];

const buildReference = () =>
  `SS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const formatLimit = (limit: number) => `Up to ${formatCurrency(limit)}`;

const emailRegex = /^\S+@\S+\.\S+$/;

export default function PlacementPageClient() {
  const [selectedLevel, setSelectedLevel] = useState<LevelKey>("level2");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [pdsAccepted, setPdsAccepted] = useState(false);
  const [pdsError, setPdsError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteReference, setQuoteReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailCaptureVisible, setEmailCaptureVisible] = useState(false);
  const [emailCaptureSaved, setEmailCaptureSaved] = useState(false);
  const [emailCaptureDismissed, setEmailCaptureDismissed] = useState(false);
  const [emailCaptureValue, setEmailCaptureValue] = useState("");

  const ctaRef = useRef<HTMLDivElement | null>(null);
  const pdsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed =
      window.sessionStorage.getItem("placementEmailCaptureDismissed") === "true";
    const saved =
      window.sessionStorage.getItem("placementEmailCaptureSaved") === "true";
    setEmailCaptureDismissed(dismissed || saved);
    setEmailCaptureSaved(saved);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !ctaRef.current) return;
    if (isSubmitted || emailCaptureDismissed || emailCaptureSaved) return;

    let timer: number | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          if (timer) {
            window.clearTimeout(timer);
            timer = null;
          }
          return;
        }
        if (entry.boundingClientRect.top < 0 && !emailCaptureVisible) {
          timer = window.setTimeout(() => {
            setEmailCaptureVisible(true);
          }, 3000);
        }
      },
      { threshold: 0 }
    );

    observer.observe(ctaRef.current);

    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [
    emailCaptureDismissed,
    emailCaptureSaved,
    emailCaptureVisible,
    isSubmitted,
  ]);

  const selectedData = levels[selectedLevel];
  const depositValue = Number.parseFloat(depositAmount);
  const depositOverLimit =
    Number.isFinite(depositValue) && depositValue > selectedData.limit;

  const validateField = (field: string, value: string) => {
    if (field === "firstName") {
      if (!value || value.trim().length < 2) return "First name is required";
    }
    if (field === "lastName") {
      if (!value || value.trim().length < 2) return "Last name is required";
    }
    if (field === "email") {
      if (!value || !emailRegex.test(value))
        return "Please enter a valid email";
    }
    if (field === "depositAmount") {
      if (!value) return "";
      const numeric = Number.parseFloat(value);
      if (!Number.isFinite(numeric) || numeric <= 0)
        return "Deposit amount must be a positive number";
    }
    return "";
  };

  const updateError = (field: string, value: string) => {
    const message = validateField(field, value);
    setErrors((prev) => {
      if (!message) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: message };
    });
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    const firstNameError = validateField("firstName", firstName);
    if (firstNameError) nextErrors.firstName = firstNameError;
    const lastNameError = validateField("lastName", lastName);
    if (lastNameError) nextErrors.lastName = lastNameError;
    const emailError = validateField("email", email);
    if (emailError) nextErrors.email = emailError;
    const depositError = validateField("depositAmount", depositAmount);
    if (depositError) nextErrors.depositAmount = depositError;
    setErrors(nextErrors);
    return nextErrors;
  };

  const scrollToFirstError = (nextErrors: Record<string, string>) => {
    const order = ["firstName", "lastName", "email", "depositAmount"];
    const firstKey = order.find((key) => nextErrors[key]);
    if (!firstKey) return;
    const element = document.getElementById(`placement-${firstKey}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      (element as HTMLElement).focus();
    }
  };

  const handleSubmit = () => {
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
      return;
    }
    if (!pdsAccepted) {
      setPdsError(true);
      pdsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPdsError(false);
    setQuoteReference(buildReference());
    setIsSubmitted(true);
    setEmailCaptureVisible(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleEmailCapture = () => {
    if (!emailRegex.test(emailCaptureValue)) return;
    setEmailCaptureSaved(true);
    setEmailCaptureVisible(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("placementEmailCaptureSaved", "true");
    }
  };

  const handleDismissCapture = () => {
    setEmailCaptureDismissed(true);
    setEmailCaptureVisible(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("placementEmailCaptureDismissed", "true");
    }
  };

  const confirmationDetails = useMemo(
    () => ({
      level: selectedData.label,
      limit: selectedData.limit,
      premium: selectedData.premium,
      school: schoolName || "Not specified",
      policyHolder: `${firstName} ${lastName}`.trim() || "Not provided",
      email: email || "Not provided",
    }),
    [selectedData, schoolName, firstName, lastName, email]
  );

  if (isSubmitted) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-[960px] px-6 py-16 md:px-12">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-[36px] font-black text-navy">
              You&apos;re covered
            </h1>
            <p className="mt-2 text-lg text-grey-700">
              Your school deposit is now protected.
            </p>
          </div>

          <Card className="mx-auto mt-8 max-w-[480px] rounded-2xl border border-grey-200 bg-white p-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-grey-500">Quote reference</span>
                <span className="font-semibold text-navy">{quoteReference}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-grey-500">Cover level</span>
                <span className="font-semibold text-navy">
                  {confirmationDetails.level} — {formatLimit(confirmationDetails.limit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-grey-500">Premium paid</span>
                <span className="font-semibold text-navy">
                  {formatCurrency(confirmationDetails.premium)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-grey-500">School</span>
                <span className="font-semibold text-navy">
                  {confirmationDetails.school}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-grey-500">Policy holder</span>
                <span className="font-semibold text-navy">
                  {confirmationDetails.policyHolder}
                </span>
              </div>
            </div>

            <div className="my-4 h-px bg-grey-200" />
            <p className="text-[14px] text-grey-700">
              We&apos;ve sent your policy documents to{" "}
              <span className="font-semibold text-navy">
                {confirmationDetails.email}
              </span>
              .
            </p>
            <p className="mt-2 text-[14px] text-grey-500">
              Your 30-day cooling off period starts today.
            </p>
          </Card>

          <Card className="mx-auto mt-12 max-w-[560px] rounded-2xl border-l-2 border-l-magenta bg-white p-7">
            <div className="text-[20px] font-semibold text-navy">
              Your deposit is protected. What about your school fees?
            </div>
            <p className="mt-2 text-base text-grey-700">
              When your child starts school, protect your ongoing fees from just
              $2.74/day. If something happens to you, SchoolSure ensures your
              child&apos;s education continues — fees paid directly to the school.
            </p>
            <Link href="/quote/school">
              <Button className="mt-6 w-full">Get a School Fee Quote</Button>
            </Link>
            <p className="mt-3 text-center text-[14px] text-grey-500">
              We&apos;ll also remind you closer to your child&apos;s school start
              date.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[960px] px-6 py-12 md:px-12">
        <div className="text-center">
          <h1 className="text-[28px] font-black text-navy md:text-[36px]">
            Protect Your School Deposit{" "}
            <span className="text-magenta">from {formatCurrency(levels.level1.premium)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[640px] text-[18px] leading-relaxed text-grey-700">
            Non-refundable application and enrolment fees covered if unforeseen
            events prevent your child taking up their place.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-6 text-[14px] text-grey-700">
            <div className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-navy" />
              Underwritten at Lloyd&apos;s
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-navy" />
              Instant cover
            </div>
            <div className="inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-navy" />
              From {formatCurrency(levels.level1.premium)}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {levelOrder.map((levelKey) => {
            const level = levels[levelKey];
            const isSelected = selectedLevel === levelKey;
            return (
              <button
                key={levelKey}
                type="button"
                onClick={() => setSelectedLevel(levelKey)}
                className={`relative rounded-2xl border bg-white p-7 text-left transition-all duration-200 ease-out ${
                  isSelected
                    ? "border-2 border-magenta shadow-[0_4px_12px_rgba(214,51,108,0.15)] -translate-y-0.5"
                    : "border-grey-300 hover:border-grey-500 hover:bg-grey-100"
                }`}
              >
                {levelKey === "level2" ? (
                  <span className="absolute right-4 top-4 rounded bg-magenta px-2.5 py-1 text-[11px] font-semibold uppercase text-white">
                    Most popular
                  </span>
                ) : null}
                <div className="text-[12px] font-semibold uppercase tracking-wide text-grey-500">
                  {level.label}
                </div>
                <div className="mt-3 text-[28px] font-black text-navy">
                  {formatLimit(level.limit)}
                </div>
                <div className="mt-4 text-[24px] font-black text-magenta">
                  {formatCurrency(level.premium)}
                </div>
                <div className="text-[14px] text-grey-500">one-off payment</div>
                <div className="mt-4 text-[12px] font-semibold uppercase text-grey-500">
                  Best for:
                </div>
                <div className="text-[14px] text-grey-700">{level.description}</div>
                <div className="mt-6 flex items-center gap-2 text-[14px] font-semibold">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-magenta bg-magenta text-white"
                        : "border-grey-300 text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span className={isSelected ? "text-magenta" : "text-grey-500"}>
                    {isSelected ? "Selected" : ""}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-off-white py-12">
        <div className="mx-auto max-w-[960px] px-6 md:px-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="text-[20px] font-semibold text-navy">
                What&apos;s covered
              </div>
              <ul className="mt-4 space-y-3 text-[16px] text-grey-700">
                {[
                  "Critical illness or death of parent or guardian",
                  "Critical illness or death of child",
                  "Forced relocation due to employment transfer",
                  "Bereavement of parent or sibling",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[20px] font-semibold text-navy">
                What&apos;s not covered
              </div>
              <ul className="mt-4 space-y-3 text-[16px] text-grey-700">
                {["Change of mind", "Financial difficulty", "Voluntary relocation"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-5 w-5 text-error" />
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center text-[14px] font-semibold text-navy">
            Cover starts immediately. No waiting period. No medical screening.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[960px] px-6 py-12 md:px-12">
        <div className="text-[20px] font-semibold text-navy">
          When families are glad they had it
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Briefcase,
              title: "Unexpected relocation",
              body:
                "James secured a place at his top-choice school with a $2,500 deposit. Three months later, his mum was transferred to Perth. Without cover, the deposit was gone.",
              note: "Covered under Level 2 or 3",
            },
            {
              icon: Heart,
              title: "Family illness",
              body:
                "Sophia's parents paid a $1,200 enrolment fee. Her father was then diagnosed with a critical illness, and the family needed to reassess their finances and schooling plans.",
              note: "Covered under Level 2 or 3",
            },
            {
              icon: Home,
              title: "Bereavement",
              body:
                "After the sudden loss of a sibling, Liam's family decided he needed to be closer to home rather than attend the boarding school they'd enrolled him in.",
              note: "Covered under all levels",
            },
          ].map((scenario) => (
            <Card
              key={scenario.title}
              className="rounded-xl border border-grey-200 bg-off-white p-5 shadow-none"
            >
              <scenario.icon className="h-5 w-5 text-navy" />
              <div className="mt-3 text-[16px] font-semibold text-navy">
                {scenario.title}
              </div>
              <p className="mt-2 text-[14px] text-grey-700">{scenario.body}</p>
              <p className="mt-3 text-[14px] font-semibold text-magenta">
                {scenario.note}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[960px] px-6 py-12 md:px-12">
        <Card className="mx-auto max-w-[560px] rounded-2xl border border-grey-200 bg-white p-7">
          <div className="text-[20px] font-semibold text-navy">Your details</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                First name <span className="text-grey-500">*</span>
              </label>
              <Input
                id="placement-firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                onBlur={(event) => updateError("firstName", event.target.value)}
                error={!!errors.firstName}
                className="focus:border-magenta focus:ring-magenta/20"
              />
              {errors.firstName ? (
                <p className="mt-1 text-[14px] text-error">{errors.firstName}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-1.5 block text-[14px] font-semibold text-navy">
                Last name <span className="text-grey-500">*</span>
              </label>
              <Input
                id="placement-lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                onBlur={(event) => updateError("lastName", event.target.value)}
                error={!!errors.lastName}
                className="focus:border-magenta focus:ring-magenta/20"
              />
              {errors.lastName ? (
                <p className="mt-1 text-[14px] text-error">{errors.lastName}</p>
              ) : null}
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-[14px] font-semibold text-navy">
              Email address <span className="text-grey-500">*</span>
            </label>
            <Input
              id="placement-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={(event) => updateError("email", event.target.value)}
              error={!!errors.email}
              className="focus:border-magenta focus:ring-magenta/20"
            />
            {errors.email ? (
              <p className="mt-1 text-[14px] text-error">{errors.email}</p>
            ) : null}
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-[14px] font-semibold text-navy">
              School name
            </label>
            <Input
              value={schoolName}
              onChange={(event) => setSchoolName(event.target.value)}
              placeholder="e.g. Sydney Grammar School"
              className="focus:border-magenta focus:ring-magenta/20"
            />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-[14px] font-semibold text-navy">
              Deposit amount paid
            </label>
            <Input
              id="placement-depositAmount"
              type="number"
              inputMode="decimal"
              value={depositAmount}
              onChange={(event) => setDepositAmount(event.target.value)}
              onBlur={(event) => updateError("depositAmount", event.target.value)}
              placeholder="e.g. 2500"
              error={!!errors.depositAmount}
              className="focus:border-magenta focus:ring-magenta/20"
            />
            {errors.depositAmount ? (
              <p className="mt-1 text-[14px] text-error">
                {errors.depositAmount}
              </p>
            ) : null}
            {depositOverLimit ? (
              <p className="mt-2 text-[14px] text-magenta">
                Your deposit exceeds {selectedData.label} cover (
                {formatCurrency(selectedData.limit)}). Consider Level 2 or 3.
              </p>
            ) : null}
          </div>
        </Card>

        <div
          ref={ctaRef}
          className="mx-auto mt-8 max-w-[560px] rounded-2xl border border-grey-200 bg-white p-7"
          style={{ borderTopColor: "#D6336C", borderTopWidth: "2px" }}
        >
          <div className="text-[16px] font-semibold text-navy">Your cover</div>
          <div className="mt-4 space-y-2 text-sm text-grey-700">
            <div className="flex items-center justify-between">
              <span>School Fee Placement Insurance</span>
              <span className="font-semibold text-navy">{selectedData.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Coverage up to</span>
              <span className="font-semibold text-navy">
                {formatCurrency(selectedData.limit)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Premium</span>
              <span className="text-[20px] font-black text-magenta">
                {formatCurrency(selectedData.premium)}
              </span>
            </div>
          </div>
          <div className="my-4 h-px bg-grey-200" />
          <div className="flex items-center justify-between text-[24px] font-black text-navy">
            <span>Total to pay</span>
            <span>{formatCurrency(selectedData.premium)}</span>
          </div>
          <div className="mt-2 text-[14px] text-grey-500">
            One-off payment. No ongoing commitment.
          </div>

          <Button className="mt-5 w-full" onClick={handleSubmit}>
            Get Covered — {formatCurrency(selectedData.premium)}
          </Button>

          <div className="mt-3 space-y-1 text-center text-[13px] text-grey-500">
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              Secure payment
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Underwritten at Lloyd&apos;s of London
            </div>
            <div>30-day cooling off period — cancel anytime for a full refund</div>
          </div>

          <div
            ref={pdsRef}
            className={`mt-4 rounded-xl border p-4 text-[12px] text-grey-500 ${
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
                I have read the{" "}
                <a href="#" className="font-semibold text-magenta">
                  Product Disclosure Statement
                </a>{" "}
                and agree to the terms.
              </span>
            </label>
          </div>
        </div>
      </div>

      {emailCaptureVisible ? (
        <div className="mx-auto max-w-[960px] px-6 md:px-12">
          <div className="rounded-xl border border-grey-300 bg-off-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-navy" />
                <div>
                  <div className="text-base font-semibold text-navy">
                    Want to think about it?
                  </div>
                  <div className="text-[14px] text-grey-500">
                    Enter your email and we&apos;ll save your quote.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismissCapture}
                className="text-grey-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {!emailCaptureSaved ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Input
                  type="email"
                  value={emailCaptureValue}
                  onChange={(event) => setEmailCaptureValue(event.target.value)}
                  placeholder="Email address"
                  className="h-11 focus:border-magenta focus:ring-magenta/20"
                />
                <Button size="sm" onClick={handleEmailCapture}>
                  Save
                </Button>
              </div>
            ) : (
              <p className="mt-3 text-[14px] font-semibold text-green-600">
                Saved — we&apos;ll send you a reminder.
              </p>
            )}
          </div>
        </div>
      ) : null}

      <div className="bg-off-white py-12 mt-8">
        <div className="mx-auto max-w-[640px] px-6 text-center md:px-12">
          <div className="text-[24px] font-semibold text-navy">
            Starting school soon?
          </div>
          <p className="mt-3 text-base leading-relaxed text-grey-700">
            SchoolSure also protects your ongoing school fees — from $2.74 per
            day. If something happens to you, your child&apos;s education continues.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-10">
            <div>
              <div className="text-[28px] font-black text-navy">1.5m</div>
              <div className="text-[14px] text-grey-500">
                students in fee-paying schools
              </div>
            </div>
            <div>
              <div className="text-[28px] font-black text-navy">$14-16bn</div>
              <div className="text-[14px] text-grey-500">
                annual school fees at risk
              </div>
            </div>
          </div>
          <Link
            href="/quote/school"
            className="mt-6 inline-flex items-center gap-2 text-[16px] font-semibold text-magenta"
          >
            Get a School Fee Quote →
          </Link>
        </div>
      </div>
    </section>
  );
}
