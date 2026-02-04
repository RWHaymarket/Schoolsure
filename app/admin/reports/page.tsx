"use client";

import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";

import DateRangeSelector from "@/components/admin/DateRangeSelector";
import { amendments, dashboardStats, policies, quotes, renewals } from "@/lib/mock-admin-data";
import { formatCurrency } from "@/lib/utils";

const initialRange = {
  from: new Date(2026, 2, 1),
  to: new Date(2027, 7, 31),
};

function toDateString(date: Date) {
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminReportsPage() {
  const [range, setRange] = useState(initialRange);
  const [generated, setGenerated] = useState(false);

  const reportQuotes = useMemo(
    () => quotes.filter((quote) => quote.createdAt >= range.from && quote.createdAt <= range.to),
    [range]
  );
  const reportPolicies = useMemo(
    () => policies.filter((policy) => policy.startDate >= range.from && policy.startDate <= range.to),
    [range]
  );

  const monthRows = useMemo(() => {
    return dashboardStats.monthlyGwp.filter((row) => {
      const [labelMonth, labelYear] = row.month.split(" ");
      const monthIndex = new Date(`${labelMonth} 1, 20${labelYear}`).getMonth();
      const year = Number(`20${labelYear}`);
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0);
      return monthStart >= range.from && monthEnd <= range.to;
    });
  }, [range]);

  const monthOnMonth = useMemo(() => {
    let cumulative = 0;
    return monthRows.map((row) => {
      const [labelMonth, labelYear] = row.month.split(" ");
      const monthIndex = new Date(`${labelMonth} 1, 20${labelYear}`).getMonth();
      const year = Number(`20${labelYear}`);
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0);
      const monthPolicies = policies.filter(
        (policy) =>
          policy.startDate >= monthStart && policy.startDate <= monthEnd
      );
      const monthQuotes = quotes.filter(
        (quote) =>
          quote.createdAt >= monthStart && quote.createdAt <= monthEnd
      );
      const conversions = monthQuotes.filter((quote) => quote.status === "converted").length;
      cumulative += row.gwp;
      return {
        month: row.month,
        quotes: monthQuotes.length,
        conversions,
        rate: monthQuotes.length ? (conversions / monthQuotes.length) * 100 : 0,
        gwp: row.gwp,
        cumulative,
        avgPremium: monthPolicies.length ? row.gwp / monthPolicies.length : 0,
        activePolicies: policies.filter((policy) => policy.startDate <= monthEnd).length,
      };
    });
  }, [monthRows]);

  const bySource = useMemo(() => {
    const sources = Array.from(new Set(reportQuotes.map((quote) => quote.source)));
    return sources.map((source) => {
      const sourceQuotes = reportQuotes.filter((quote) => quote.source === source);
      const conversions = sourceQuotes.filter((quote) => quote.status === "converted");
      const gwp = reportPolicies
        .filter((policy) => conversions.some((quote) => quote.id === policy.quoteId))
        .reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0);
      return {
        source,
        quotes: sourceQuotes.length,
        conversions: conversions.length,
        rate: sourceQuotes.length ? (conversions.length / sourceQuotes.length) * 100 : 0,
        gwp,
      };
    });
  }, [reportPolicies, reportQuotes]);

  const byState = useMemo(() => {
    const states = Array.from(new Set(reportPolicies.map((policy) => policy.parent.state)));
    return states.map((state) => {
      const statePolicies = reportPolicies.filter((policy) => policy.parent.state === state);
      const gwp = statePolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0);
      return {
        state,
        policies: statePolicies.length,
        gwp,
      };
    });
  }, [reportPolicies]);

  const amendmentsByType = useMemo(() => {
    return amendments.reduce<Record<string, number>>((acc, amendment) => {
      if (amendment.createdAt < range.from || amendment.createdAt > range.to) return acc;
      acc[amendment.type] = (acc[amendment.type] ?? 0) + 1;
      return acc;
    }, {});
  }, [range]);

  const renewalsInRange = renewals.filter(
    (renewal) => renewal.renewalDate >= range.from && renewal.renewalDate <= range.to
  );
  const renewalsSummary = {
    renewed: renewalsInRange.filter((renewal) => renewal.status === "renewed").length,
    pending: renewalsInRange.filter((renewal) => renewal.status === "pending").length,
    declined: renewalsInRange.filter((renewal) => renewal.status === "declined").length,
  };
  const retentionRate = renewalsInRange.length
    ? (renewalsSummary.renewed / renewalsInRange.length) * 100
    : 0;

  const handleExportCsv = () => {
    if (typeof window === "undefined") return;
    const headers = [
      "Month",
      "Quotes",
      "Conversions",
      "Conv Rate",
      "New GWP",
      "Cumulative GWP",
      "Avg Premium",
    ];
    const rows = monthOnMonth.map((row) => [
      row.month,
      row.quotes,
      row.conversions,
      row.rate.toFixed(1),
      row.gwp,
      row.cumulative,
      Math.round(row.avgPremium),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `SchoolSure_Report_${range.from.toISOString().slice(0, 10)}_${range.to
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl font-semibold text-[var(--admin-text)]">Reports</div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-base font-semibold text-[var(--admin-text)]">
          Select period
        </div>
        <DateRangeSelector value={range} onChange={setRange} presets />
        <button
          type="button"
          onClick={() => setGenerated(true)}
          className="mt-2 h-11 w-fit rounded-md bg-[var(--admin-accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--admin-accent-hover)]"
        >
          Generate Report
        </button>
      </div>

      {generated && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["GWP", reportPolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0)],
              ["Policies Sold", reportPolicies.length],
              [
                "Avg Premium",
                reportPolicies.length
                  ? reportPolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0) /
                    reportPolicies.length
                  : 0,
              ],
              [
                "Conversion Rate",
                reportQuotes.length
                  ? (reportQuotes.filter((quote) => quote.status === "converted").length /
                      reportQuotes.length) *
                    100
                  : 0,
              ],
            ].map(([label, value]) => (
              <div key={label} className="admin-card p-5">
                <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                  {label}
                </div>
                <div className="mt-2 text-2xl font-semibold text-[var(--admin-text)]">
                  {label === "Conversion Rate"
                    ? `${Number(value).toFixed(1)}%`
                    : formatCurrency(Number(value))}
                </div>
                <div className="text-xs text-[var(--admin-text-muted)]">
                  vs previous equivalent period
                </div>
              </div>
            ))}
          </div>

          <div className="admin-card flex flex-col gap-4 p-6">
            <div className="text-base font-semibold text-[var(--admin-text)]">
              Month-on-Month Performance
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[820px]">
                <div className="grid grid-cols-[120px_repeat(7,1fr)] border-b border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
                  <div>Month</div>
                  <div className="text-right">Quotes</div>
                  <div className="text-right">Conversions</div>
                  <div className="text-right">Conv Rate</div>
                  <div className="text-right">New GWP</div>
                  <div className="text-right">Cumulative GWP</div>
                  <div className="text-right">Avg Premium</div>
                  <div className="text-right">Policies Active</div>
                </div>
                <div className="divide-y divide-[var(--admin-border)]">
                  {monthOnMonth.map((row) => (
                    <div
                      key={row.month}
                      className="grid grid-cols-[120px_repeat(7,1fr)] px-4 py-3 text-sm text-[var(--admin-text)]"
                    >
                      <div>{row.month}</div>
                      <div className="text-right">{row.quotes}</div>
                      <div className="text-right">{row.conversions}</div>
                      <div className="text-right">{row.rate.toFixed(1)}%</div>
                      <div className="text-right">{formatCurrency(row.gwp)}</div>
                      <div className="text-right">{formatCurrency(row.cumulative)}</div>
                      <div className="text-right">{formatCurrency(row.avgPremium)}</div>
                      <div className="text-right">{row.activePolicies}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card flex flex-col gap-4 p-6">
            <div className="text-base font-semibold text-[var(--admin-text)]">
              Financial Summary
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md bg-[var(--admin-surface)] p-4">
                <div className="text-xs text-[var(--admin-text-muted)]">GWP by product</div>
                {Object.entries(dashboardStats.byProduct).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--admin-text-muted)]">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-md bg-[var(--admin-surface)] p-4">
                <div className="text-xs text-[var(--admin-text-muted)]">Commission</div>
                <div className="text-lg font-semibold text-[var(--admin-text)]">
                  {formatCurrency(dashboardStats.totalCommission)}
                </div>
                <div className="text-xs text-[var(--admin-text-muted)]">
                  Stamp duty collected: {formatCurrency(dashboardStats.totalStampDuty)}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card flex flex-col gap-4 p-6">
            <div className="text-base font-semibold text-[var(--admin-text)]">
              Channel Performance
            </div>
            <div className="divide-y divide-[var(--admin-border)] text-sm">
              {bySource.map((row) => (
                <div key={row.source} className="flex flex-wrap justify-between gap-3 py-2">
                  <span className="text-[var(--admin-text-muted)]">{row.source}</span>
                  <span>{row.quotes} quotes</span>
                  <span>{row.conversions} conversions</span>
                  <span>{row.rate.toFixed(1)}%</span>
                  <span>{formatCurrency(row.gwp)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card flex flex-col gap-4 p-6">
            <div className="text-base font-semibold text-[var(--admin-text)]">
              Geographic Analysis
            </div>
            <div className="divide-y divide-[var(--admin-border)] text-sm">
              {byState.map((row) => (
                <div key={row.state} className="flex flex-wrap justify-between gap-3 py-2">
                  <span className="text-[var(--admin-text-muted)]">{row.state}</span>
                  <span>{row.policies} policies</span>
                  <span>{formatCurrency(row.gwp)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card flex flex-col gap-4 p-6">
            <div className="text-base font-semibold text-[var(--admin-text)]">
              Amendments & Renewals
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md bg-[var(--admin-surface)] p-4 text-sm">
                <div className="text-xs text-[var(--admin-text-muted)]">Amendments</div>
                {Object.entries(amendmentsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span>{type.replace("_", " ")}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-md bg-[var(--admin-surface)] p-4 text-sm">
                <div className="text-xs text-[var(--admin-text-muted)]">Renewals</div>
                <div className="flex items-center justify-between">
                  <span>Renewed</span>
                  <span>{renewalsSummary.renewed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pending</span>
                  <span>{renewalsSummary.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Declined</span>
                  <span>{renewalsSummary.declined}</span>
                </div>
                <div className="mt-2 text-xs text-[var(--admin-text-muted)]">
                  Retention rate: {retentionRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card admin-print-hide flex flex-wrap gap-3 p-6">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-2 rounded-md border border-[var(--admin-border)] px-4 py-2 text-sm text-[var(--admin-text)]"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.print();
                }
              }}
              className="flex items-center gap-2 rounded-md border border-[var(--admin-border)] px-4 py-2 text-sm text-[var(--admin-text)]"
            >
              <Printer className="h-4 w-4" />
              Print Report
            </button>
          </div>

          <div className="admin-print-only hidden">
            <div className="mb-2 text-xl font-semibold">SchoolSure Confidential</div>
            <div className="text-sm">
              Report period: {toDateString(range.from)} – {toDateString(range.to)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
