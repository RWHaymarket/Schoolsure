"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { mockAccount } from "@/lib/mock-account-data";
import { formatCurrencyWithCents } from "@/lib/utils";
import { formatDateLong } from "@/lib/account-utils";
import { PRICING_CONFIG } from "@/lib/pricing-config";

const productDetails = {
  parentContinuityCover: {
    name: "Parent Continuity Cover",
    description: "Death, terminal illness, critical illness, and disablement.",
    covered: [
      "Death of fee payer",
      "Terminal illness",
      "Critical illness",
      "Temporary disablement",
      "Permanent disablement",
    ],
    exclusions: ["Redundancy", "Voluntary unemployment", "Pre-existing conditions"],
    waiting: `30-day waiting period (death & terminal illness immediate)`,
  },
  fullTermUpgrade: {
    name: "Full Term Upgrade",
    description: "Extends death & terminal illness cover to full schooling term.",
    covered: ["Death", "Terminal illness"],
    exclusions: ["Critical illness", "Disablement"],
    waiting: "Immediate for death and terminal illness",
  },
  studentContinuityCover: {
    name: "Student Continuity Cover",
    description: "Severe illness, injury, or mental health absence coverage.",
    covered: [
      "Severe physical illness or injury",
      "Severe mental health conditions",
      "Sustained bullying impact",
    ],
    exclusions: ["Absences under 25% of the year", "Routine illness"],
    waiting: "Claimable after 25% absence threshold",
  },
  schoolExpensesCover: {
    name: "School Expenses Cover",
    description: "Books, transport, uniform costs up to $2,500 combined.",
    covered: ["Books & study aids", "School transport", "Uniforms"],
    exclusions: ["Non-required items", "Items without receipts"],
    waiting: "Triggered only on valid core cover claim",
  },
};

export default function AccountPolicyPage() {
  const { policy, children, pricing } = mockAccount;
  const [openKey, setOpenKey] = useState<string | null>(null);
  const totalAnnualFees = children.reduce(
    (sum, child) => sum + child.school.annualFee,
    0
  );
  const waitingPeriodEnd = new Date(policy.startDate);
  waitingPeriodEnd.setDate(
    waitingPeriodEnd.getDate() + PRICING_CONFIG.productA.waitingPeriodDays
  );

  const productPremiums = useMemo(() => {
    return children.reduce(
      (acc, child) => {
        acc.parentContinuityCover += child.premium.productA || 0;
        acc.fullTermUpgrade += child.premium.fullTermUpgrade || 0;
        acc.studentContinuityCover += child.premium.productB || 0;
        acc.schoolExpensesCover += child.premium.productC || 0;
        return acc;
      },
      {
        parentContinuityCover: 0,
        fullTermUpgrade: 0,
        studentContinuityCover: 0,
        schoolExpensesCover: 0,
      }
    );
  }, [children]);

  const includedMap = policy.productsIncluded;

  const rows = [
    {
      key: "parentContinuityCover",
      included: includedMap.parentContinuityCover,
    },
    {
      key: "fullTermUpgrade",
      included: includedMap.fullTermUpgrade,
    },
    {
      key: "studentContinuityCover",
      included: includedMap.studentContinuityCover,
    },
    {
      key: "schoolExpensesCover",
      included: includedMap.schoolExpensesCover,
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-black text-navy">My policy</h1>
        <p className="mt-1 text-[16px] text-grey-500">
          Policy {policy.id} · Active since {formatDateLong(policy.startDate)}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="text-[20px] font-semibold text-navy">
          What you&apos;re covered for
        </h2>
        <div className="mt-5 divide-y divide-grey-200">
          {rows.map((row) => {
            const detail = productDetails[row.key];
            const premiumValue = productPremiums[row.key];
            const isOpen = openKey === row.key;
            return (
              <div key={row.key} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {row.included ? (
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-grey-300 mt-0.5" />
                    )}
                    <div>
                      <div
                        className={`text-[16px] font-semibold ${
                          row.included ? "text-navy" : "text-grey-500"
                        }`}
                      >
                        {detail.name}
                      </div>
                      <div className="text-[14px] text-grey-700">
                        {detail.description}
                      </div>
                      {row.included ? (
                        <button
                          type="button"
                          onClick={() => setOpenKey(isOpen ? null : row.key)}
                          className="mt-2 inline-flex items-center gap-2 text-[14px] text-grey-500"
                        >
                          Details
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-[14px] text-navy">
                    {row.included ? (
                      formatCurrencyWithCents(premiumValue)
                    ) : (
                      <span className="text-magenta font-semibold">
                        Add from{" "}
                        {row.key === "schoolExpensesCover"
                          ? formatCurrencyWithCents(
                              PRICING_CONFIG.productC.flatRate
                            )
                          : formatCurrencyWithCents(
                              totalAnnualFees *
                                (row.key === "studentContinuityCover"
                                  ? PRICING_CONFIG.productB.rate
                                  : row.key === "fullTermUpgrade"
                                    ? PRICING_CONFIG.productA.rate *
                                      PRICING_CONFIG.productA.fullTermLoading
                                    : PRICING_CONFIG.productA.rate)
                            )}
                        /yr →
                      </span>
                    )}
                  </div>
                </div>
                {row.included && isOpen ? (
                  <div className="mt-4 grid gap-4 rounded-xl bg-grey-100 p-4 text-[14px] text-grey-700">
                    <div>
                      <div className="font-semibold text-navy">Covered events</div>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {detail.covered.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-navy">Key exclusions</div>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {detail.exclusions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 text-grey-600">
                      <Clock className="h-4 w-4 text-navy" />
                      {detail.waiting}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="text-[20px] font-semibold text-navy">Policy details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-[14px]">
          {[
            { label: "Policy number", value: policy.id },
            { label: "Status", value: "Active" },
            { label: "Start date", value: formatDateLong(policy.startDate) },
            { label: "Renewal date", value: formatDateLong(policy.renewalDate) },
            {
              label: "Payment frequency",
              value: policy.paymentFrequency,
            },
            { label: "Underwriter", value: "Lloyd's of London" },
            { label: "Licence holder", value: "Niche Insurance Pty Ltd" },
            { label: "AFSL", value: "530784" },
            { label: "ABN", value: "85 642 823 443" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-grey-500">{item.label}</div>
              <div className="font-semibold text-navy capitalize">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-[18px] font-semibold text-navy">Important dates</h2>
        <div className="mt-4 space-y-3 text-[14px] text-grey-700">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-navy" />
              Policy started
            </div>
            <span>{formatDateLong(policy.startDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-navy" />
              30-day waiting period ended
            </div>
            <span>{formatDateLong(waitingPeriodEnd.toISOString())}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-navy" />
              Next renewal
            </div>
            <span>{formatDateLong(policy.renewalDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-navy" />
              5-year moratorium applies from
            </div>
            <span>1 March 2021</span>
          </div>
        </div>
      </div>
    </div>
  );
}
