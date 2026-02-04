import Link from "next/link";
import { ExternalLink, PlusCircle, CheckCircle2 } from "lucide-react";

import SchoolBadge from "@/components/account/SchoolBadge";
import { mockAccount } from "@/lib/mock-account-data";
import { calculateAge, formatDateLong } from "@/lib/account-utils";
import { formatCurrencyWithCents } from "@/lib/utils";

export default function AccountChildrenPage() {
  const { children } = mockAccount;

  return (
    <div>
      <h1 className="text-[28px] font-black text-navy">Children & schools</h1>

      <div className="mt-6 space-y-6">
        {children.map((child) => {
          const age = calculateAge(child.dateOfBirth);
          return (
            <div key={child.id} className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-start gap-5">
                <SchoolBadge
                  name={child.school.name}
                  badgeUrl={child.school.badgeUrl}
                  size="lg"
                />
                <div>
                  <div className="text-[22px] font-semibold text-navy">
                    {child.firstName} {child.lastName}
                  </div>
                  <div className="text-[16px] text-grey-700">
                    {child.school.name}, {child.school.suburb} {child.school.state}
                  </div>
                  <div className="text-[14px] text-grey-500">
                    {child.yearLevel} · Born {formatDateLong(child.dateOfBirth)}
                    {age ? ` · Age ${age}` : ""}
                  </div>
                  <Link
                    href={child.school.website}
                    target="_blank"
                    className="mt-2 inline-flex items-center gap-2 text-[14px] font-semibold text-magenta"
                  >
                    {child.school.website.replace("https://", "")} →
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="my-6 h-px bg-grey-300" />

              <div>
                <div className="text-[18px] font-semibold text-navy">
                  {child.firstName}&apos;s cover
                </div>
                <div className="mt-4 space-y-2 text-[14px] text-navy">
                  {[
                    { label: "Parent Continuity Cover", value: child.premium.productA },
                    {
                      label: "Full Term Upgrade",
                      value: child.premium.fullTermUpgrade,
                    },
                    {
                      label: "Student Continuity Cover",
                      value: child.premium.productB,
                    },
                    { label: "School Expenses Cover", value: child.premium.productC },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        {item.label}
                      </span>
                      <span>{formatCurrencyWithCents(item.value)}</span>
                    </div>
                  ))}
                  {child.premium.multiChildDiscount ? (
                    <div className="flex items-center justify-between text-magenta font-semibold">
                      <span>Multi-child discount (10%)</span>
                      <span>{formatCurrencyWithCents(child.premium.multiChildDiscount)}</span>
                    </div>
                  ) : null}
                </div>
                <div className="mt-3 h-px bg-grey-300" />
                <div className="mt-3 flex items-center justify-between text-[16px] font-semibold text-navy">
                  <span>{child.firstName}&apos;s annual premium</span>
                  <span>{formatCurrencyWithCents(child.premium.total)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-off-white p-4">
                <div className="flex items-center gap-3">
                  <SchoolBadge name={child.school.name} size="sm" />
                  <div>
                    <div className="text-[14px] font-semibold text-navy">
                      {child.school.name}
                    </div>
                    <div className="text-[14px] text-grey-700">
                      Annual fee: {formatCurrencyWithCents(child.school.annualFee)}
                    </div>
                    <div className="text-[14px] text-grey-500">
                      Fee increase since policy start: —
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-grey-300 bg-off-white p-5">
        <div className="flex items-start gap-3">
          <PlusCircle className="h-6 w-6 text-magenta" />
          <div>
            <div className="text-[16px] font-semibold text-navy">
              Add another child
            </div>
            <div className="text-[14px] text-grey-500">
              Adding a child? You&apos;ll receive a 10% multi-child discount.
            </div>
            <Link
              href="/account/add-cover"
              className="mt-2 inline-flex text-[14px] font-semibold text-magenta"
            >
              Add child →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
