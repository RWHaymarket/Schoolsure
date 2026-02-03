import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

import { PRICING_CONFIG } from "@/lib/pricing-config";
import { formatCurrency } from "@/lib/utils";

export default function CoverageCards() {
  const productARate = PRICING_CONFIG.productA.rate * 100;
  const productAWait = PRICING_CONFIG.productA.waitingPeriodDays;
  const expenses = PRICING_CONFIG.productC.components;
  const expensesMax = PRICING_CONFIG.productC.maxBenefit;
  const placementFrom = PRICING_CONFIG.productD.levels.level1.premium;

  return (
    <section id="coverage" className="bg-off-white py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[1px] text-magenta">
            Protection that covers the journey
          </p>
          <h2 className="mt-3 text-[36px] font-black text-navy">
            What does SchoolSure cover?
          </h2>
          <p className="mx-auto mt-2 max-w-[540px] text-[18px] text-grey-700">
            One core product. Three ways to build on it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-grey-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]" style={{ borderTopColor: "#D6336C", borderTopWidth: "2px" }}>
            <span className="inline-flex rounded bg-magenta px-3 py-1 text-[12px] font-semibold uppercase text-white">
              Core product
            </span>
            <div className="mt-4 text-magenta">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-[24px] font-semibold text-navy">
              Parent Continuity Cover
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-grey-700">
              If something happens to you, your child&apos;s school fees continue
              — paid directly to the school. Covers death, terminal illness,
              critical illness, and disablement.
            </p>
            <ul className="mt-4 space-y-2 text-[16px] text-grey-700">
              {[
                "No medical screening required",
                `From ${productARate}% of your annual school fee`,
                `Cover starts in ${productAWait} days`,
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-magenta" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/quote/school"
              className="mt-6 inline-flex items-center gap-2 text-[16px] font-semibold text-magenta transition-colors hover:text-magenta-dark hover:underline"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-grey-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <span className="inline-flex rounded bg-navy px-3 py-1 text-[12px] font-semibold uppercase text-white">
              Add-on
            </span>
            <div className="mt-4 text-navy">
              <HeartPulse className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-[24px] font-semibold text-navy">
              Student Continuity Cover
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-grey-700">
              Covers school fees if your child suffers a severe illness, injury,
              or mental health condition that prevents them attending for an
              extended period.
            </p>
            <ul className="mt-4 space-y-2 text-[16px] text-grey-700">
              {[
                "Severe physical illness or injury",
                "Mental health conditions",
                "Sustained bullying impact",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-magenta" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/quote/school"
              className="mt-6 inline-flex items-center gap-2 text-[16px] font-semibold text-magenta transition-colors hover:text-magenta-dark hover:underline"
            >
              Add to your quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-grey-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <span className="inline-flex rounded bg-navy px-3 py-1 text-[12px] font-semibold uppercase text-white">
              Add-on
            </span>
            <div className="mt-4 text-navy">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-[24px] font-semibold text-navy">
              School Expenses Cover
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-grey-700">
              Covers non-refundable school books, transport, and uniform costs
              when a covered event means your child can&apos;t use them. Up to
              {formatCurrency(expensesMax)} combined.
            </p>
            <ul className="mt-4 space-y-2 text-[16px] text-grey-700">
              {[
                `Books & study aids — up to ${formatCurrency(
                  expenses.booksAndStudyAids
                )}`,
                `School transport — up to ${formatCurrency(
                  expenses.schoolTransport
                )}`,
                `Uniform cover — up to ${formatCurrency(expenses.uniformCover)}`,
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-magenta" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/quote/school"
              className="mt-6 inline-flex items-center gap-2 text-[16px] font-semibold text-magenta transition-colors hover:text-magenta-dark hover:underline"
            >
              Add to your quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl bg-navy p-8 text-white">
            <span className="inline-flex rounded bg-white px-3 py-1 text-[12px] font-semibold uppercase text-navy">
              Standalone
            </span>
            <div className="mt-4 text-white">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-[24px] font-semibold text-white">
              School Place Deposit Cover
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-white/85">
              Protect non-refundable application, enrolment, and entrance fees
              if unforeseen events prevent your child taking up their school
              place.
            </p>
            <div className="mt-4 text-[28px] font-black text-magenta">
              from {formatCurrency(placementFrom)}
            </div>
            <div className="text-[14px] text-white/70">
              One-off payment. Instant cover.
            </div>
            <Link href="/quote/placement" className="mt-6 inline-flex">
              <span className="inline-flex h-11 items-center justify-center rounded-[10px] bg-magenta px-6 text-[16px] font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-magenta-dark">
                Get Covered →
              </span>
            </Link>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[640px] text-center text-[14px] text-grey-500 leading-relaxed">
          Parent Continuity Cover is the foundation. Add Student Cover and
          School Expenses to build your protection. Placement Insurance is
          available separately for families securing school places.
        </p>
      </div>
    </section>
  );
}
