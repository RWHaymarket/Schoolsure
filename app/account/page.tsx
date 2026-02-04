"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Download,
  FileText,
  PlusCircle,
  ShieldCheck,
  X,
} from "lucide-react";

import SchoolBadge from "@/components/account/SchoolBadge";
import { mockAccount } from "@/lib/mock-account-data";
import {
  calculateAge,
  formatDateLong,
  getGreeting,
} from "@/lib/account-utils";
import { formatCurrencyWithCents } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "text-success",
  pending: "text-warning",
  lapsed: "text-error",
  cancelled: "text-grey-500",
};

export default function AccountDashboardPage() {
  const { parent, policy, children, pricing } = mockAccount;
  const greeting = getGreeting();
  const isActive = policy.status === "active";
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value = window.sessionStorage.getItem("account-nudge-dismissed");
    setDismissed(value === "true");
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("account-nudge-dismissed", "true");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-black text-navy">
            {greeting}, {parent.firstName}
          </h1>
          <p className="mt-1 text-[16px] text-grey-700">
            Your family&apos;s education is protected.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[14px] font-semibold capitalize">
          <span
            className={`h-2 w-2 rounded-full ${
              isActive ? "bg-success" : "bg-warning"
            }`}
          />
          <span className={statusStyles[policy.status]}>{policy.status}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[14px] text-grey-500">
              Policy {policy.id}
            </div>
            <div className="mt-1 text-[20px] font-semibold text-navy">
              SchoolSure School Fee Protection
            </div>
          </div>
          <div className="text-right">
            <div className="text-[14px] text-grey-500">
              Renews {formatDateLong(policy.renewalDate)}
            </div>
            <Link
              href="/account/policy"
              className="mt-1 inline-flex text-[14px] font-semibold text-magenta"
            >
              View policy →
            </Link>
          </div>
        </div>

        <div className="my-5 h-px bg-grey-300" />

        <div className="flex flex-wrap gap-2">
          {policy.productsIncluded.parentContinuityCover ? (
            <span className="rounded-full bg-navy px-4 py-1 text-[12px] font-semibold text-white">
              Parent Continuity Cover
            </span>
          ) : null}
          {policy.productsIncluded.fullTermUpgrade ? (
            <span className="rounded-full bg-magenta px-4 py-1 text-[12px] font-semibold text-white">
              Full Term Upgrade
            </span>
          ) : null}
          {policy.productsIncluded.studentContinuityCover ? (
            <span className="rounded-full border border-grey-300 bg-grey-100 px-4 py-1 text-[12px] font-semibold text-navy">
              Student Continuity Cover
            </span>
          ) : null}
          {policy.productsIncluded.schoolExpensesCover ? (
            <span className="rounded-full border border-grey-300 bg-grey-100 px-4 py-1 text-[12px] font-semibold text-navy">
              School Expenses Cover
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {children.map((child) => {
          const age = calculateAge(child.dateOfBirth);
          return (
            <div key={child.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <SchoolBadge
                  name={child.school.name}
                  badgeUrl={child.school.badgeUrl}
                  size="md"
                />
                <div>
                  <div className="text-[18px] font-semibold text-navy">
                    {child.firstName} {child.lastName}
                  </div>
                  <div className="text-[14px] text-grey-700">
                    {child.school.name}
                  </div>
                  <div className="text-[14px] text-grey-500">
                    {child.yearLevel}
                    {age ? ` · ${age} years old` : ""}
                  </div>
                </div>
              </div>

              <div className="my-4 h-px bg-grey-300" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-grey-500">Annual school fee</span>
                  <span className="font-semibold text-navy">
                    {formatCurrencyWithCents(child.school.annualFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-grey-500">Your premium</span>
                  <span className="font-semibold text-magenta">
                    {formatCurrencyWithCents(child.premium.total)}/year
                  </span>
                </div>
                {child.premium.multiChildDiscount ? (
                  <div className="text-[12px] font-semibold text-magenta">
                    Includes 10% multi-child discount
                  </div>
                ) : null}
              </div>

              <Link
                href="/account/children"
                className="mt-4 inline-flex text-[14px] font-semibold text-magenta"
              >
                View details →
              </Link>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-3 lg:divide-x lg:divide-grey-300">
          <div className="space-y-2 lg:pr-6">
            <div className="text-[12px] uppercase text-grey-500 font-semibold">
              Next payment
            </div>
            <div className="text-[24px] font-black text-navy">
              {formatCurrencyWithCents(pricing.nextPaymentAmount)}
            </div>
            <div className="text-[14px] text-grey-700">
              {formatDateLong(pricing.nextPaymentDate)}
            </div>
          </div>

          <div className="space-y-2 lg:px-6">
            <div className="text-[12px] uppercase text-grey-500 font-semibold">
              Payment method
            </div>
            <div className="text-[16px] font-semibold text-navy">
              Visa •••• {pricing.paymentMethod.last4}
            </div>
            <div className="text-[14px] text-grey-500">
              Expires {pricing.paymentMethod.expiry}
            </div>
            <Link
              href="/account/payments"
              className="inline-flex text-[14px] font-semibold text-magenta"
            >
              Update →
            </Link>
          </div>

          <div className="space-y-2 lg:pl-6">
            <div className="text-[12px] uppercase text-grey-500 font-semibold">
              Annual premium
            </div>
            <div className="text-[24px] font-black text-navy">
              {formatCurrencyWithCents(pricing.annualTotal)}/year
            </div>
            <div className="text-[14px] text-grey-500">
              Paying {policy.paymentFrequency}
            </div>
            {policy.paymentFrequency === "monthly" ? (
              <Link
                href="/account/payments"
                className="inline-flex text-[14px] font-semibold text-magenta"
              >
                Switch to annual — save $
                {formatCurrencyWithCents(
                  pricing.annualTotal - pricing.annualWithDiscount
                )}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/account/documents"
          className="flex items-center gap-2 rounded-xl border border-grey-300 bg-white px-4 py-3 text-[14px] font-semibold text-navy hover:bg-grey-50"
        >
          <Download className="h-4 w-4" />
          Download Policy
        </Link>
        <Link
          href="/account/documents"
          className="flex items-center gap-2 rounded-xl border border-grey-300 bg-white px-4 py-3 text-[14px] font-semibold text-navy hover:bg-grey-50"
        >
          <FileText className="h-4 w-4" />
          View PDS
        </Link>
        <Link
          href="/account/claims"
          className="flex items-center gap-2 rounded-xl border border-grey-300 bg-white px-4 py-3 text-[14px] font-semibold text-navy hover:bg-grey-50"
        >
          <AlertCircle className="h-4 w-4" />
          Make a Claim
        </Link>
        <Link
          href="/account/add-cover"
          className="flex items-center gap-2 rounded-xl border border-grey-300 bg-white px-4 py-3 text-[14px] font-semibold text-magenta hover:bg-grey-50"
        >
          <PlusCircle className="h-4 w-4" />
          Add Cover
        </Link>
      </div>

      {!policy.productsIncluded.studentContinuityCover && !dismissed ? (
        <div className="relative rounded-xl border border-dashed border-grey-300 bg-off-white p-5">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-3 top-3 text-grey-400"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-magenta" />
            <div>
              <div className="text-[16px] font-semibold text-navy">
                Add Student Continuity Cover
              </div>
              <div className="text-[14px] text-grey-700">
                Protect your school fees if Oliver or Isabelle becomes seriously
                ill.
              </div>
              <Link
                href="/account/add-cover"
                className="mt-2 inline-flex text-[14px] font-semibold text-magenta"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
