"use client";

import { useEffect, useMemo, useState } from "react";

import BarChart from "@/components/admin/BarChart";
import DateRangeSelector from "@/components/admin/DateRangeSelector";
import KpiCard from "@/components/admin/KpiCard";
import {
  activityFeed,
  amendments,
  dashboardStats,
  placements,
  policies,
  quotes,
  renewals,
} from "@/lib/mock-admin-data";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_RANGE = {
  from: new Date(2027, 7, 1),
  to: new Date(2027, 7, 31),
};

const toneToColor: Record<string, string> = {
  success: "bg-[var(--admin-success)]",
  info: "bg-[var(--admin-info)]",
  accent: "bg-[var(--admin-accent)]",
  warning: "bg-[var(--admin-warning)]",
  error: "bg-[var(--admin-error)]",
};

function getTrend(current: number, previous: number) {
  if (!previous) return "—";
  const diff = ((current - previous) / previous) * 100;
  const arrow = diff >= 0 ? "↑" : "↓";
  return `${arrow} ${Math.abs(diff).toFixed(1)}% vs prev period`;
}

export default function AdminDashboardPage() {
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const monthlyGwp = dashboardStats.monthlyGwp;
  const cumulativeGwp = monthlyGwp.reduce<number[]>((acc, item) => {
    const previous = acc[acc.length - 1] ?? 0;
    acc.push(previous + item.gwp);
    return acc;
  }, []);

  const revenueChartData = monthlyGwp.map((item) => ({
    label: item.month.split(" ")[0],
    value: item.gwp,
  }));

  const currentMonthIndex = Math.max(monthlyGwp.length - 1, 1);
  const currentMonth = monthlyGwp[currentMonthIndex];
  const previousMonth = monthlyGwp[currentMonthIndex - 1];

  const thisPeriodQuotes = quotes.filter(
    (quote) => quote.createdAt >= range.from && quote.createdAt <= range.to
  );
  const thisPeriodConversions = thisPeriodQuotes.filter(
    (quote) => quote.status === "converted"
  );
  const avgPremium =
    thisPeriodConversions.reduce(
      (sum, quote) => sum + quote.premiumCalculation.grossAnnual,
      0
    ) / Math.max(thisPeriodConversions.length, 1);
  const avgSchoolFee =
    thisPeriodQuotes.reduce(
      (sum, quote) =>
        sum + quote.children.reduce((childSum, child) => childSum + child.annualFee, 0),
      0
    ) / Math.max(thisPeriodQuotes.length, 1);

  const periodPlacements = placements.filter(
    (placement) => placement.purchaseDate >= range.from && placement.purchaseDate <= range.to
  );
  const periodAmendments = amendments.filter(
    (amendment) => amendment.createdAt >= range.from && amendment.createdAt <= range.to
  );
  const periodRenewals = renewals.filter(
    (renewal) => renewal.renewalDate >= range.from && renewal.renewalDate <= range.to
  );

  const lastUpdatedText = (() => {
    const diffMinutes = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    return diffMinutes === 0 ? "just now" : `${diffMinutes} mins ago`;
  })();

  const productMix = [
    { label: "Parent Continuity Cover", value: 100, color: "bg-white" },
    {
      label: "School Expenses Cover",
      value: Math.round((dashboardStats.byProduct.expensesCover / quotes.length) * 100),
      color: "bg-[var(--admin-accent)]",
    },
    {
      label: "Full Term Upgrade",
      value: Math.round((dashboardStats.byProduct.fullTerm / quotes.length) * 100),
      color: "bg-[rgba(214,51,108,0.8)]",
    },
    {
      label: "Student Continuity Cover",
      value: Math.round((dashboardStats.byProduct.studentCover / quotes.length) * 100),
      color: "bg-[rgba(214,51,108,0.6)]",
    },
    {
      label: "Placement Insurance",
      value: placements.length,
      color: "bg-[rgba(214,51,108,0.4)]",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold text-[var(--admin-text)]">Dashboard</div>
          <div className="text-xs text-[var(--admin-text-muted)]">
            Last updated: {lastUpdatedText}
          </div>
        </div>
        <DateRangeSelector value={range} onChange={setRange} compact />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Gross Written Premium"
          value={dashboardStats.totalGwp}
          prefix="$"
          trend={getTrend(currentMonth.gwp, previousMonth.gwp)}
          sparkline={monthlyGwp.map((item) => item.gwp)}
        />
        <KpiCard
          label="Active Policies"
          value={dashboardStats.totalPolicies}
          trend={`↑ ${currentMonth.policies} this month`}
          sparkline={monthlyGwp.map((item) => item.policies)}
        />
        <KpiCard
          label="Conversion Rate"
          value={dashboardStats.conversionRate}
          suffix="%"
          trend="↑ 4.2% vs prev period"
          formatValue={(value) => value.toFixed(1)}
          sparkline={monthlyGwp.map((item) =>
            item.quotes === 0 ? 0 : (item.policies / item.quotes) * 100
          )}
        />
        <KpiCard
          label="Total Quotes"
          value={dashboardStats.totalQuotes}
          trend={`${currentMonth.quotes} this month`}
          trendTone="neutral"
          sparkline={monthlyGwp.map((item) => item.quotes)}
        />
        <KpiCard
          label="Commission (35%)"
          value={dashboardStats.totalCommission}
          prefix="$"
          trend={getTrend(
            currentMonth.gwp * 0.35,
            previousMonth.gwp * 0.35
          )}
          sparkline={monthlyGwp.map((item) => item.gwp * 0.35)}
        />
        <KpiCard
          label="Avg Annual Premium"
          value={dashboardStats.avgPremium}
          prefix="$"
          trend={`Avg school fee: ${formatCurrency(dashboardStats.avgSchoolFee)}`}
          trendTone="neutral"
          sparkline={monthlyGwp.map((item) =>
            item.policies === 0 ? 0 : item.gwp / item.policies
          )}
        />
      </div>

      <div className="admin-card flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-lg font-semibold text-[var(--admin-text)]">
            Revenue Overview
          </div>
          <div className="flex gap-2">
            <button className="rounded-full bg-[var(--admin-accent)] px-4 py-2 text-xs font-semibold text-white">
              Monthly
            </button>
            <button className="rounded-full border border-[var(--admin-border)] px-4 py-2 text-xs font-semibold text-[var(--admin-text-muted)]">
              Quarterly
            </button>
          </div>
        </div>
        <div className="h-[320px]">
          <BarChart
            data={revenueChartData}
            height={280}
            lines={[
              { values: cumulativeGwp, color: "rgba(255,255,255,0.85)", opacity: 0.45 },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[7fr_5fr]">
        <div className="admin-card flex flex-col gap-4 p-6">
          <div className="text-base font-semibold text-[var(--admin-text)]">
            Recent Activity
          </div>
          <div className="admin-scrollbar flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-2">
            {activityFeed.slice(0, 20).map((item, index) => (
              <div
                key={item.id}
                className="admin-activity-item flex items-start gap-3 text-sm"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <span
                  className={`mt-2 h-2 w-2 rounded-full ${toneToColor[item.tone]} ${
                    item.tone === "success" ? "admin-pulse" : ""
                  }`}
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="text-[var(--admin-text)]">
                    {item.href ? (
                      <a href={item.href} className="hover:text-white">
                        {item.description}
                      </a>
                    ) : (
                      item.description
                    )}
                  </div>
                  <div className="text-xs text-[var(--admin-text-muted)]">
                    {item.date.toLocaleDateString("en-AU", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card flex flex-col gap-4 p-6">
          <div className="text-base font-semibold text-[var(--admin-text)]">
            This Month
          </div>
          <div className="divide-y divide-[var(--admin-border)] text-sm">
            {[
              ["New quotes", thisPeriodQuotes.length],
              ["Conversions", thisPeriodConversions.length],
              ["Avg premium", formatCurrency(avgPremium)],
              ["Avg school fee", formatCurrency(avgSchoolFee)],
              [
                "Multi-child %",
                `${Math.round(
                  (thisPeriodQuotes.filter((quote) => quote.children.length > 1).length /
                    Math.max(thisPeriodQuotes.length, 1)) *
                    100
                )}%`,
              ],
              [
                "Full term upgrade %",
                `${Math.round(
                  (thisPeriodQuotes.filter((quote) => quote.products.fullTermUpgrade).length /
                    Math.max(thisPeriodQuotes.length, 1)) *
                    100
                )}%`,
              ],
              [
                "Student cover %",
                `${Math.round(
                  (thisPeriodQuotes.filter((quote) => quote.products.studentCover).length /
                    Math.max(thisPeriodQuotes.length, 1)) *
                    100
                )}%`,
              ],
              [
                "Expenses cover %",
                `${Math.round(
                  (thisPeriodQuotes.filter((quote) => quote.products.expensesCover).length /
                    Math.max(thisPeriodQuotes.length, 1)) *
                    100
                )}%`,
              ],
              ["Placement sales", periodPlacements.length],
              ["Amendments", periodAmendments.length],
              ["Renewals due", periodRenewals.length],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="text-[var(--admin-text-muted)]">{label}</span>
                <span className="font-semibold text-[var(--admin-text)]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-base font-semibold text-[var(--admin-text)]">
          Policies by State
        </div>
        <div className="flex flex-col gap-3">
          {dashboardStats.byState.map((item, index) => (
            <div key={item.state} className="flex items-center gap-3 text-sm">
              <div className="w-12 text-[var(--admin-text-muted)]">{item.state}</div>
              <div className="relative h-7 flex-1 rounded bg-[var(--admin-border)]">
                <div
                  className="h-7 rounded bg-[var(--admin-accent)]"
                  style={{
                    width: `${(item.policies / policies.length) * 100}%`,
                    opacity: 0.8 - index * 0.05,
                  }}
                />
              </div>
              <div className="w-24 text-right text-[var(--admin-text)]">
                {item.policies} ({((item.policies / policies.length) * 100).toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-base font-semibold text-[var(--admin-text)]">
          Product Uptake
        </div>
        <div className="flex flex-col gap-3 text-sm">
          {productMix.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-48 text-[var(--admin-text-muted)]">{item.label}</div>
              <div className="relative h-6 flex-1 rounded bg-[var(--admin-border)]">
                <div
                  className={`h-6 rounded ${item.color}`}
                  style={{ width: `${Math.min(item.value, 100)}%` }}
                />
              </div>
              <div className="w-20 text-right text-[var(--admin-text)]">
                {item.label === "Placement Insurance" ? `${item.value} sales` : `${item.value}%`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
