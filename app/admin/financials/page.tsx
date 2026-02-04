"use client";

import { useMemo, useState } from "react";

import BarChart from "@/components/admin/BarChart";
import DateRangeSelector from "@/components/admin/DateRangeSelector";
import { dashboardStats, placements, policies, quotes } from "@/lib/mock-admin-data";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_RANGE = {
  from: new Date(2026, 2, 1),
  to: new Date(2027, 7, 31),
};

export default function AdminFinancialsPage() {
  const [range, setRange] = useState(DEFAULT_RANGE);

  const filteredPolicies = useMemo(
    () =>
      policies.filter(
        (policy) => policy.startDate >= range.from && policy.startDate <= range.to
      ),
    [range]
  );

  const totals = useMemo(() => {
    const gwp = filteredPolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0);
    const commission = filteredPolicies.reduce(
      (sum, policy) => sum + policy.premiums.commission,
      0
    );
    const netToUnderwriter = filteredPolicies.reduce(
      (sum, policy) => sum + policy.premiums.archShare,
      0
    );
    const stampDuty = filteredPolicies.reduce(
      (sum, policy) => sum + policy.premiums.stampDuty,
      0
    );
    return { gwp, commission, netToUnderwriter, stampDuty };
  }, [filteredPolicies]);

  const stateRows = useMemo(() => {
    return dashboardStats.byState.map((item) => {
      const policiesForState = filteredPolicies.filter(
        (policy) => policy.parent.state === item.state
      );
      const gwp = policiesForState.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0);
      const gst = policiesForState.reduce((sum, policy) => sum + policy.premiums.gst, 0);
      const premiumIncGst = gwp + gst;
      const stampDuty = policiesForState.reduce(
        (sum, policy) => sum + policy.premiums.stampDuty,
        0
      );
      const totalPayable = policiesForState.reduce(
        (sum, policy) => sum + policy.premiums.totalPayable,
        0
      );
      const dutyRate = premiumIncGst ? stampDuty / premiumIncGst : 0;
      return {
        state: item.state,
        policies: policiesForState.length,
        gwp,
        gst,
        premiumIncGst,
        dutyRate,
        stampDuty,
        totalPayable,
      };
    });
  }, [filteredPolicies]);

  const monthlyGwp = dashboardStats.monthlyGwp.map((item) => ({
    label: item.month.split(" ")[0],
    value: item.gwp,
  }));
  const cumulativeGwp = dashboardStats.monthlyGwp.reduce<number[]>((acc, item) => {
    const previous = acc[acc.length - 1] ?? 0;
    acc.push(previous + item.gwp);
    return acc;
  }, []);
  const cumulativeCommission = dashboardStats.monthlyGwp.reduce<number[]>((acc, item) => {
    const previous = acc[acc.length - 1] ?? 0;
    acc.push(previous + item.gwp * 0.35);
    return acc;
  }, []);

  const productMix = [
    {
      label: "Parent Continuity Cover",
      value: filteredPolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0),
    },
    {
      label: "Full Term Upgrades",
      value: filteredPolicies
        .filter((policy) => policy.products.fullTermUpgrade)
        .reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0),
    },
    {
      label: "Student Continuity Cover",
      value: filteredPolicies
        .filter((policy) => policy.products.studentCover)
        .reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0),
    },
    {
      label: "School Expenses Cover",
      value: filteredPolicies
        .filter((policy) => policy.products.expensesCover)
        .reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0),
    },
    {
      label: "Placement Insurance",
      value: placements.reduce((sum, placement) => sum + placement.premium, 0),
    },
  ];

  const paymentFrequencySplit = useMemo(() => {
    const monthlyPolicies = filteredPolicies.filter(
      (policy) => policy.paymentFrequency === "monthly"
    );
    const annualPolicies = filteredPolicies.filter(
      (policy) => policy.paymentFrequency === "annual"
    );
    return {
      monthly: {
        count: monthlyPolicies.length,
        gwp: monthlyPolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0),
      },
      annual: {
        count: annualPolicies.length,
        gwp: annualPolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0),
      },
    };
  }, [filteredPolicies]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-2xl font-semibold text-[var(--admin-text)]">Financials</div>
        <DateRangeSelector value={range} onChange={setRange} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total GWP", totals.gwp, "Year to date"],
          ["Commission (35%)", totals.commission, "Niche Insurance revenue", true],
          ["Net to Arch", totals.netToUnderwriter, "Underwriter share (65%)"],
          ["Stamp Duty Collected", totals.stampDuty, "Payable to state revenue offices"],
        ].map(([label, value, note, highlight]) => (
          <div key={label} className="admin-card flex flex-col gap-2 p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
              {label}
            </div>
            <div
              className={`text-3xl font-black ${
                highlight ? "text-[var(--admin-accent)]" : "text-[var(--admin-text)]"
              }`}
            >
              {formatCurrency(Number(value))}
            </div>
            <div className="text-xs text-[var(--admin-text-muted)]">{note}</div>
          </div>
        ))}
      </div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div>
          <div className="text-lg font-semibold text-[var(--admin-text)]">
            Insurance Stamp Duty by State
          </div>
          <div className="text-xs text-[var(--admin-text-muted)]">
            Duty calculated on GST-inclusive premium ("tax on tax")
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
              <div>State</div>
              <div className="text-right">Policies</div>
              <div className="text-right">GWP</div>
              <div className="text-right">GST</div>
              <div className="text-right">Premium + GST</div>
              <div className="text-right">Duty Rate</div>
              <div className="text-right">Stamp Duty</div>
              <div className="text-right">Total</div>
            </div>
            <div className="divide-y divide-[var(--admin-border)]">
              {stateRows.map((row) => (
                <div
                  key={row.state}
                  className="grid grid-cols-[80px_repeat(7,1fr)] px-4 py-3 text-sm text-[var(--admin-text)]"
                >
                  <div>{row.state}</div>
                  <div className="text-right">{row.policies}</div>
                  <div className="text-right">{formatCurrency(row.gwp)}</div>
                  <div className="text-right">{formatCurrency(row.gst)}</div>
                  <div className="text-right">{formatCurrency(row.premiumIncGst)}</div>
                  <div className="text-right">{Math.round(row.dutyRate * 100)}%</div>
                  <div className="text-right">{formatCurrency(row.stampDuty)}</div>
                  <div className="text-right">{formatCurrency(row.totalPayable)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-lg font-semibold text-[var(--admin-text)]">Revenue Split</div>
        <div className="rounded-full bg-[var(--admin-border)]">
          <div
            className="h-3 rounded-full bg-[var(--admin-accent)]"
            style={{ width: "35%" }}
          />
        </div>
        <div className="flex flex-wrap justify-between text-xs text-[var(--admin-text-muted)]">
          <span>Commission (35%): {formatCurrency(totals.commission)}</span>
          <span>Net to Arch (65%): {formatCurrency(totals.netToUnderwriter)}</span>
        </div>
        <div className="text-xs text-[var(--admin-text-muted)]">
          Profit share: 50/50 on underwriting profit · Target loss ratio &lt;60%
        </div>
      </div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-lg font-semibold text-[var(--admin-text)]">
          Monthly GWP Trend
        </div>
        <div className="h-[280px]">
          <BarChart
            data={monthlyGwp}
            height={240}
            lines={[
              { values: cumulativeGwp, color: "rgba(255,255,255,0.85)", opacity: 0.45 },
              {
                values: cumulativeCommission,
                color: "rgba(214,51,108,0.8)",
                dashed: true,
                opacity: 0.5,
              },
            ]}
          />
        </div>
      </div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-lg font-semibold text-[var(--admin-text)]">
          Product Mix Revenue
        </div>
        <div className="divide-y divide-[var(--admin-border)] text-sm">
          {productMix.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3">
              <span className="text-[var(--admin-text-muted)]">{item.label}</span>
              <span className="font-semibold text-[var(--admin-text)]">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(dashboardStats.totalGwp)}</span>
          </div>
        </div>
      </div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-lg font-semibold text-[var(--admin-text)]">
          Payment Frequency Split
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Monthly", paymentFrequencySplit.monthly],
            ["Annual", paymentFrequencySplit.annual],
          ].map(([label, data]) => (
            <div key={label} className="rounded-md bg-[var(--admin-surface)] p-4">
              <div className="text-xs text-[var(--admin-text-muted)]">{label}</div>
              <div className="text-lg font-semibold text-[var(--admin-text)]">
                {data.count} policies · {formatCurrency(data.gwp)} GWP
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-[var(--admin-text-muted)]">
          Annual payers save 10%: net discount given ={" "}
          {formatCurrency(
            quotes
              .filter(
                (quote) =>
                  quote.paymentFrequency === "annual" &&
                  quote.createdAt >= range.from &&
                  quote.createdAt <= range.to
              )
              .reduce((sum, quote) => sum + quote.premiumCalculation.grossAnnual * 0.1, 0)
          )}
        </div>
      </div>
    </div>
  );
}
