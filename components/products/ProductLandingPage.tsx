"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Info, Lock, Shield, XCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import FaqAccordion from "@/components/products/FaqAccordion";
import ScenariosSection, {
  ICONS,
  type IconKey,
} from "@/components/products/ScenariosSection";

type BadgeVariant = "magenta" | "navy" | "white-on-navy";

type Step = {
  title: string;
  description: string;
};

type CoveredEvent = {
  title: string;
  description: string;
};

type PricingTableSection = {
  type: "table";
  columns: string[];
  rows: string[][];
  note: string;
  ctaLabel: string;
};

type PricingCardSection = {
  type: "card";
  price: string;
  subtext: string;
  items: { icon: IconKey; label: string; value: string }[];
  maxLabel: string;
  note: string;
  ctaLabel: string;
};

type PricingSection = PricingTableSection | PricingCardSection;

type Scenario = {
  title: string;
  story: string;
  outcome: string;
  tag: string;
  icon: IconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

type CrossSell = {
  name: string;
  badge: string;
  description: string;
  link: string;
  priceAnchor?: string;
  ctaText?: string;
};

export type ProductLandingConfig = {
  id: "A" | "B" | "C" | "D";
  name: string;
  tagline: string;
  heroQuestion: string;
  heroAnswer: string;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  icon: IconKey;
  priceDisplay: string;
  priceSubtext: string;
  ctaText: string;
  ctaLink: string;
  trustLine: string;
  problemSection: {
    heading: string;
    paragraphs: string[];
    stat: string;
    statLabel: string;
    statSource: string;
  };
  howItWorks: {
    subtitle: string;
    steps: Step[];
  };
  coveredEvents: CoveredEvent[];
  notCovered: string[];
  importantNote: string;
  pricingSection: PricingSection;
  scenarios: Scenario[];
  faqs: FaqItem[];
  crossSells: CrossSell[];
};

const badgeStyles: Record<BadgeVariant, string> = {
  magenta: "bg-magenta text-white",
  navy: "border border-white/40 text-white",
  "white-on-navy": "bg-white text-navy",
};

export default function ProductLandingPage({
  product,
}: {
  product: ProductLandingConfig;
}) {
  const isStandaloneCrossSell = product.id === "D";

  return (
    <div className="bg-white">
      <section className="bg-navy py-20 md:py-24">
        <div className="mx-auto max-w-[720px] px-6 text-center text-white">
          <span
            className={`inline-flex rounded px-3 py-1 text-[12px] font-semibold uppercase tracking-[1px] ${badgeStyles[product.badgeVariant]}`}
          >
            {product.badgeLabel}
          </span>
          <div className="mt-4 text-[16px] font-semibold uppercase tracking-[1px] text-white/70">
            {product.name}
          </div>
          <h1 className="mt-3 text-[28px] font-black leading-tight text-white md:text-[40px]">
            {product.heroQuestion}
          </h1>
          <p className="mx-auto mt-4 max-w-[600px] text-[18px] leading-relaxed text-white/85">
            {product.heroAnswer}
          </p>
          <div className="mt-6 text-[24px] font-black text-magenta">
            {product.priceDisplay}
          </div>
          <div className="mt-1 text-[14px] text-white/60">
            {product.priceSubtext}
          </div>
          <div className="mt-7 flex justify-center">
            <Link href={product.ctaLink}>
              <Button size="lg">{product.ctaText}</Button>
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-6 text-[13px] text-white/60">
            <div className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-white/50" />
              Lloyd&apos;s of London
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-white/50" />
              Instant quote
            </div>
            <div className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4 text-white/50" />
              {product.trustLine}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-[960px] gap-10 px-6 md:grid-cols-[7fr_5fr]">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[1px] text-magenta">
              The problem
            </div>
            <h2 className="mt-3 text-[28px] font-black text-navy">
              {product.problemSection.heading}
            </h2>
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-grey-700">
              {product.problemSection.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-off-white p-8 text-center">
            <div className="text-[48px] font-black text-magenta">
              {product.problemSection.stat}
            </div>
            <div className="mt-2 text-[16px] text-grey-700">
              {product.problemSection.statLabel}
            </div>
            <div className="mt-3 text-[12px] text-grey-500">
              {product.problemSection.statSource}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-[960px] px-6 text-center">
          <h2 className="text-[28px] font-black text-navy">How it works</h2>
          <p className="mx-auto mt-2 max-w-[540px] text-[16px] text-grey-700">
            {product.howItWorks.subtitle}
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {product.howItWorks.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl bg-white p-7 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-navy text-[16px] font-semibold text-white">
                  {index + 1}
                </div>
                <div className="mt-4 text-[16px] font-semibold text-navy">
                  {step.title}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-grey-700">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-[960px] gap-10 px-6 md:grid-cols-2">
          <div>
            <h3 className="text-[24px] font-semibold text-navy">
              What&apos;s covered
            </h3>
            <div className="mt-6 space-y-4">
              {product.coveredEvents.map((event) => (
                <div key={event.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-[16px] font-semibold text-navy">
                      {event.title}
                    </div>
                    <div className="text-[14px] text-grey-700">
                      {event.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[24px] font-semibold text-navy">
              What&apos;s not covered
            </h3>
            <div className="mt-6 space-y-4">
              {product.notCovered.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 text-error" />
                  <div className="text-[16px] text-grey-700">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-[960px] px-6">
          <div className="rounded-xl border border-grey-300 bg-off-white p-5">
            <div className="flex items-start gap-3 text-[14px] text-grey-700">
              <Info className="mt-0.5 h-5 w-5 text-navy" />
              <div>
                <span className="font-semibold text-navy">Important:</span>{" "}
                {product.importantNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <h2 className="text-[28px] font-black text-navy">Transparent pricing</h2>
          <p className="mt-2 text-[16px] text-grey-700">
            No hidden fees. No surprises.
          </p>
          {product.pricingSection.type === "table" ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-grey-300 bg-white text-left">
              <div
                className="grid bg-navy text-[14px] font-semibold text-white"
                style={{
                  gridTemplateColumns: `repeat(${product.pricingSection.columns.length}, minmax(0, 1fr))`,
                }}
              >
                {product.pricingSection.columns.map((column) => (
                  <div key={column} className="px-4 py-3">
                    {column}
                  </div>
                ))}
              </div>
              <div>
                {product.pricingSection.rows.map((row, index) => (
                <div
                  key={`${row[0]}-${index}`}
                  className={`grid text-[16px] text-navy ${
                    index % 2 === 1 ? "bg-grey-100" : "bg-white"
                  }`}
                  style={{
                    gridTemplateColumns: `repeat(${product.pricingSection.columns.length}, minmax(0, 1fr))`,
                  }}
                >
                    {row.map((cell, cellIndex) => (
                      <div key={`${cell}-${cellIndex}`} className="px-4 py-3">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 mx-auto max-w-[400px] rounded-2xl border border-grey-300 bg-white p-8 text-center">
              <div className="text-[48px] font-black text-magenta">
                {product.pricingSection.price}
              </div>
              <div className="text-[16px] text-grey-700">
                {product.pricingSection.subtext}
              </div>
              <div className="my-4 h-px bg-grey-300" />
              <div className="space-y-3 text-left text-[14px] text-grey-700">
                {product.pricingSection.items.map((item) => {
                  const ItemIcon = ICONS[item.icon];
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="inline-flex items-center gap-2 text-navy">
                        <ItemIcon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-semibold text-navy">{item.value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="my-4 h-px bg-grey-300" />
              <div className="text-[16px] font-semibold text-navy">
                {product.pricingSection.maxLabel}
              </div>
            </div>
          )}
          <p className="mt-4 text-[14px] text-grey-500">
            {product.pricingSection.note}
          </p>
          <Link
            href={product.ctaLink}
            className="mt-4 inline-flex items-center gap-2 text-[16px] font-semibold text-magenta"
          >
            {product.pricingSection.ctaLabel} →
          </Link>
        </div>
      </section>

      <section className="bg-white py-20">
        <ScenariosSection
          heading="When families are glad they had it"
          scenarios={product.scenarios}
        />
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 className="text-center text-[28px] font-black text-navy">
            Common questions
          </h2>
          <div className="mt-8">
            <FaqAccordion items={product.faqs} />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[960px] px-6 text-center">
          <h3 className="text-[24px] font-semibold text-navy">
            Build your protection
          </h3>
          <div
            className={`mt-8 grid gap-6 ${
              isStandaloneCrossSell ? "md:grid-cols-1" : "md:grid-cols-3"
            }`}
          >
            {product.crossSells.map((crossSell) => (
              <div
                key={crossSell.name}
                className={`rounded-xl border border-grey-300 bg-white p-6 text-left ${
                  isStandaloneCrossSell
                    ? "mx-auto max-w-[560px] border-l-2 border-l-magenta p-8"
                    : ""
                }`}
              >
                <div className="text-[12px] font-semibold uppercase text-grey-500">
                  {crossSell.badge}
                </div>
                <div className="mt-2 text-[16px] font-semibold text-navy">
                  {crossSell.name}
                </div>
                <div className="mt-2 text-[14px] text-grey-700">
                  {crossSell.description}
                </div>
                {crossSell.priceAnchor ? (
                  <div className="mt-3 text-[14px] font-semibold text-magenta">
                    {crossSell.priceAnchor}
                  </div>
                ) : null}
                {isStandaloneCrossSell ? (
                  <Link href={crossSell.link} className="mt-4 inline-flex">
                    <Button size="md">{crossSell.ctaText || "Get a Quote"}</Button>
                  </Link>
                ) : (
                  <Link
                    href={crossSell.link}
                    className="mt-4 inline-flex text-[14px] font-semibold text-magenta"
                  >
                    Learn more →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="mx-auto max-w-[640px] px-6 text-center text-white">
          <h3 className="text-[28px] font-black">
            Protect what matters most
          </h3>
          <p className="mt-2 text-[16px] text-white/80">
            Get your personalised quote in under 2 minutes.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href={product.ctaLink}>
              <Button size="lg">{product.ctaText}</Button>
            </Link>
          </div>
          <div className="mt-3 text-[13px] text-white/50">
            No obligation. No medical screening. 30-day cooling off.
          </div>
        </div>
      </section>
    </div>
  );
}
