"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import DataTable from "@/components/admin/DataTable";
import DateRangeSelector from "@/components/admin/DateRangeSelector";
import SlidePanel from "@/components/admin/SlidePanel";
import StatusBadge from "@/components/admin/StatusBadge";
import { quotes, Quote, policies } from "@/lib/mock-admin-data";
import { formatCurrency } from "@/lib/utils";

const statusOptions = ["all", "converted", "pending", "abandoned", "expired"] as const;
const sourceOptions = [
  "all",
  "google_ads",
  "google_organic",
  "direct",
  "facebook",
  "instagram",
  "referral",
  "school_partner",
  "edstart",
] as const;
const stateOptions = ["all", "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"] as const;

const defaultRange = {
  from: new Date(2026, 2, 1),
  to: new Date(2027, 7, 31),
};

export default function AdminQuotesPage() {
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("all");
  const [source, setSource] = useState<(typeof sourceOptions)[number]>("all");
  const [state, setState] = useState<(typeof stateOptions)[number]>("all");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState(defaultRange);
  const [selected, setSelected] = useState<Quote | null>(null);

  const filtered = useMemo(() => {
    return quotes.filter((quote) => {
      if (status !== "all" && quote.status !== status) return false;
      if (source !== "all" && quote.source !== source) return false;
      if (state !== "all" && quote.parent.state !== state) return false;
      if (quote.createdAt < range.from || quote.createdAt > range.to) return false;
      if (search) {
        const term = search.toLowerCase();
        const matchesParent =
          `${quote.parent.firstName} ${quote.parent.lastName}`.toLowerCase().includes(term) ||
          quote.parent.email.toLowerCase().includes(term);
        const matchesQuote = quote.id.toLowerCase().includes(term);
        const matchesSchool = quote.children.some((child) =>
          child.school.toLowerCase().includes(term)
        );
        if (!matchesParent && !matchesQuote && !matchesSchool) return false;
      }
      return true;
    });
  }, [range, search, source, state, status]);

  const filtersActive =
    status !== "all" || source !== "all" || state !== "all" || search.trim().length > 0;

  const summary = useMemo(() => {
    const converted = filtered.filter((quote) => quote.status === "converted");
    const pending = filtered.filter((quote) => quote.status === "pending");
    const abandoned = filtered.filter((quote) => quote.status === "abandoned");
    const expired = filtered.filter((quote) => quote.status === "expired");
    const gwp = policies
      .filter((policy) => converted.some((quote) => quote.id === policy.quoteId))
      .reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0);
    return { converted, pending, abandoned, expired, gwp };
  }, [filtered]);

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const headers = [
      "Quote ID",
      "Date",
      "Parent",
      "Children",
      "School(s)",
      "Fee Total",
      "Premium",
      "Status",
      "Source",
    ];
    const rows = filtered.map((quote) => [
      quote.id,
      quote.createdAt.toLocaleDateString("en-AU"),
      `${quote.parent.firstName} ${quote.parent.lastName}`,
      quote.children.length,
      quote.children.map((child) => child.school).join("; "),
      quote.children.reduce((sum, child) => sum + child.annualFee, 0),
      quote.premiumCalculation.grossAnnual,
      quote.status,
      quote.source,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "SchoolSure_Quotes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-2xl font-semibold text-[var(--admin-text)]">Quotes</div>
        <span className="rounded-full bg-[var(--admin-surface)] px-3 py-1 text-xs font-semibold text-[var(--admin-text)]">
          {filtered.length} total
        </span>
        <button
          type="button"
          onClick={handleExport}
          className="ml-auto flex items-center gap-2 rounded-md border border-[var(--admin-border)] px-3 py-2 text-xs text-[var(--admin-text)]"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="admin-card flex flex-wrap items-end gap-3 p-4">
        <label className="flex flex-col gap-2 text-xs text-[var(--admin-text-muted)]">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
            className="admin-input h-10 px-3 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All" : option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs text-[var(--admin-text-muted)]">
          Date range
          <DateRangeSelector value={range} onChange={setRange} compact />
        </label>
        <label className="flex flex-col gap-2 text-xs text-[var(--admin-text-muted)]">
          Source
          <select
            value={source}
            onChange={(event) => setSource(event.target.value as typeof source)}
            className="admin-input h-10 px-3 text-sm"
          >
            {sourceOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All" : option.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs text-[var(--admin-text-muted)]">
          State
          <select
            value={state}
            onChange={(event) => setState(event.target.value as typeof state)}
            className="admin-input h-10 px-3 text-sm"
          >
            {stateOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs text-[var(--admin-text-muted)]">
          Search
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="admin-input h-10 w-56 px-3 text-sm"
            placeholder="Name, email, quote ID, school"
          />
        </label>
        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setStatus("all");
              setSource("all");
              setState("all");
              setSearch("");
            }}
            className="text-sm font-semibold text-[var(--admin-accent)]"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="text-sm text-[var(--admin-text-muted)]">
        Showing {filtered.length} quotes · {summary.converted.length} converted (
        {formatCurrency(summary.gwp)} GWP) · {summary.pending.length} pending ·{" "}
        {summary.abandoned.length} abandoned · {summary.expired.length} expired
      </div>

      <DataTable
        data={filtered}
        getRowKey={(row) => row.id}
        onRowClick={(row) => setSelected(row)}
        columns={[
          {
            key: "id",
            label: "Quote ID",
            sortable: true,
            render: (row) => (
              <span className="font-semibold text-[var(--admin-accent)]">{row.id}</span>
            ),
            sortValue: (row) => row.id,
          },
          {
            key: "date",
            label: "Date",
            sortable: true,
            render: (row) =>
              row.createdAt.toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            sortValue: (row) => row.createdAt.getTime(),
          },
          {
            key: "parent",
            label: "Parent",
            render: (row) => `${row.parent.firstName} ${row.parent.lastName}`,
          },
          {
            key: "children",
            label: "Children",
            render: (row) =>
              `${row.children.length} child${row.children.length > 1 ? "ren" : ""}`,
          },
          {
            key: "schools",
            label: "School(s)",
            render: (row) =>
              row.children
                .map((child) => child.school)
                .join(", ")
                .slice(0, 28),
          },
          {
            key: "fees",
            label: "Fee Total",
            sortable: true,
            render: (row) =>
              formatCurrency(
                row.children.reduce((sum, child) => sum + child.annualFee, 0)
              ),
            sortValue: (row) =>
              row.children.reduce((sum, child) => sum + child.annualFee, 0),
          },
          {
            key: "premium",
            label: "Premium",
            sortable: true,
            render: (row) => `${formatCurrency(row.premiumCalculation.grossAnnual)}/yr`,
            sortValue: (row) => row.premiumCalculation.grossAnnual,
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "source",
            label: "Source",
            render: (row) => row.source.replace("_", " "),
          },
        ]}
      />

      <div className="flex items-center justify-between text-xs text-[var(--admin-text-muted)]">
        <span>Showing 1-{Math.min(filtered.length, 25)} of {filtered.length}</span>
        <div className="flex gap-2">
          <button className="rounded border border-[var(--admin-border)] px-3 py-1">
            Previous
          </button>
          <button className="rounded border border-[var(--admin-border)] px-3 py-1">
            Next
          </button>
        </div>
      </div>

      <SlidePanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Quote ${selected.id}` : "Quote Detail"}
      >
        {selected && (
          <div className="flex flex-col gap-6 text-sm">
            <div className="flex items-center justify-between">
              <StatusBadge status={selected.status} />
              <span className="text-xs text-[var(--admin-text-muted)]">
                {selected.updatedAt.toLocaleString("en-AU")}
              </span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Parent details
              </div>
              <div className="mt-2 space-y-1 text-[var(--admin-text)]">
                <div>
                  {selected.parent.firstName} {selected.parent.lastName}
                </div>
                <div>{selected.parent.email}</div>
                <div>{selected.parent.mobile}</div>
                <div>
                  {selected.parent.postcode}, {selected.parent.state}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Children
              </div>
              <div className="mt-2 space-y-2">
                {selected.children.map((child) => (
                  <div key={child.firstName} className="rounded-md bg-[var(--admin-surface)] p-3">
                    <div className="font-semibold text-[var(--admin-text)]">
                      {child.firstName} {child.lastName} · {child.yearLevel}
                    </div>
                    <div className="text-xs text-[var(--admin-text-muted)]">
                      {child.school}, {child.suburb} · {formatCurrency(child.annualFee)} fee
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Products selected
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--admin-surface)] px-3 py-1 text-xs">
                  Parent Continuity
                </span>
                {selected.products.fullTermUpgrade && (
                  <span className="rounded-full bg-[var(--admin-accent)] px-3 py-1 text-xs text-white">
                    Full Term
                  </span>
                )}
                {selected.products.studentCover && (
                  <span className="rounded-full bg-[var(--admin-surface)] px-3 py-1 text-xs">
                    Student Continuity
                  </span>
                )}
                {selected.products.expensesCover && (
                  <span className="rounded-full bg-[var(--admin-surface)] px-3 py-1 text-xs">
                    Expenses Cover
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Pricing
              </div>
              <div className="mt-2 space-y-2 text-[var(--admin-text)]">
                <div className="flex items-center justify-between">
                  <span>Gross premium</span>
                  <span>{formatCurrency(selected.premiumCalculation.grossAnnual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST</span>
                  <span>{formatCurrency(selected.premiumCalculation.gst)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    Stamp duty ({selected.parent.state}{" "}
                    {Math.round(selected.premiumCalculation.stampDutyRate * 100)}%)
                  </span>
                  <span>{formatCurrency(selected.premiumCalculation.stampDuty)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Total payable</span>
                  <span>{formatCurrency(selected.premiumCalculation.totalPayable)}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Timeline
              </div>
              <div className="mt-2 space-y-2 text-sm text-[var(--admin-text)]">
                <div>
                  Quote created — {selected.createdAt.toLocaleDateString("en-AU")}
                </div>
                {selected.status === "converted" && (
                  <div>
                    Converted → {selected.policyId ?? "Policy created"} —{" "}
                    {selected.convertedAt?.toLocaleDateString("en-AU")}
                  </div>
                )}
                {selected.status === "abandoned" && selected.abandonedAt && (
                  <div>
                    Quote abandoned — {selected.abandonedAt.toLocaleDateString("en-AU")}
                  </div>
                )}
                {selected.status === "expired" && <div>Quote expired</div>}
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
