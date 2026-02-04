"use client";

import { useMemo, useState } from "react";

import DataTable from "@/components/admin/DataTable";
import DateRangeSelector from "@/components/admin/DateRangeSelector";
import SlidePanel from "@/components/admin/SlidePanel";
import StatusBadge from "@/components/admin/StatusBadge";
import { amendments, policies, renewals, Policy } from "@/lib/mock-admin-data";
import { formatCurrency } from "@/lib/utils";

const statusOptions = ["all", "active", "pending_payment", "lapsed", "cancelled"] as const;
const stateOptions = ["all", "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"] as const;

const defaultRange = {
  from: new Date(2026, 2, 1),
  to: new Date(2027, 7, 31),
};

export default function AdminPoliciesPage() {
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("all");
  const [state, setState] = useState<(typeof stateOptions)[number]>("all");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState(defaultRange);
  const [selected, setSelected] = useState<Policy | null>(null);

  const filtered = useMemo(() => {
    return policies.filter((policy) => {
      if (status !== "all" && policy.status !== status) return false;
      if (state !== "all" && policy.parent.state !== state) return false;
      if (policy.startDate < range.from || policy.startDate > range.to) return false;
      if (search) {
        const term = search.toLowerCase();
        const matchesParent =
          `${policy.parent.firstName} ${policy.parent.lastName}`.toLowerCase().includes(term) ||
          policy.parent.email.toLowerCase().includes(term);
        const matchesPolicy = policy.id.toLowerCase().includes(term);
        const matchesSchool = policy.children.some((child) =>
          child.school.toLowerCase().includes(term)
        );
        if (!matchesParent && !matchesPolicy && !matchesSchool) return false;
      }
      return true;
    });
  }, [range, search, state, status]);

  const renewalsDue = renewals.filter(
    (renewal) => renewal.status === "pending"
  ).length;
  const activeCount = policies.filter((policy) => policy.status === "active").length;
  const totalGwp = policies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl font-semibold text-[var(--admin-text)]">Policies</div>

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
                {option === "all" ? "All" : option.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs text-[var(--admin-text-muted)]">
          Date range
          <DateRangeSelector value={range} onChange={setRange} compact />
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
            placeholder="Name, email, policy ID, school"
          />
        </label>
      </div>

      <div className="text-sm text-[var(--admin-text-muted)]">
        {activeCount} active policies · {formatCurrency(totalGwp)} annual GWP ·{" "}
        {renewalsDue} renewals due · {policies.reduce((sum, policy) => sum + policy.claims.length, 0)}{" "}
        claims
      </div>

      <DataTable
        data={filtered}
        getRowKey={(row) => row.id}
        onRowClick={(row) => setSelected(row)}
        columns={[
          {
            key: "id",
            label: "Policy ID",
            sortable: true,
            render: (row) => (
              <span className="font-semibold text-[var(--admin-accent)]">{row.id}</span>
            ),
            sortValue: (row) => row.id,
          },
          {
            key: "start",
            label: "Start Date",
            sortable: true,
            render: (row) =>
              row.startDate.toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            sortValue: (row) => row.startDate.getTime(),
          },
          {
            key: "parent",
            label: "Parent",
            render: (row) => `${row.parent.firstName} ${row.parent.lastName}`,
          },
          {
            key: "children",
            label: "Children",
            render: (row) => `${row.children.length} child${row.children.length > 1 ? "ren" : ""}`,
          },
          {
            key: "products",
            label: "Products",
            render: (row) => (
              <div className="flex flex-wrap gap-1 text-xs">
                <span className="rounded-full bg-[var(--admin-surface)] px-2 py-1">A</span>
                {row.products.studentCover && (
                  <span className="rounded-full bg-[var(--admin-surface)] px-2 py-1">
                    B
                  </span>
                )}
                {row.products.expensesCover && (
                  <span className="rounded-full bg-[var(--admin-surface)] px-2 py-1">
                    C
                  </span>
                )}
                {row.products.fullTermUpgrade && (
                  <span className="rounded-full bg-[var(--admin-accent)] px-2 py-1 text-white">
                    FT
                  </span>
                )}
              </div>
            ),
          },
          {
            key: "premium",
            label: "Annual Premium",
            sortable: true,
            render: (row) => formatCurrency(row.premiums.grossAnnual),
            sortValue: (row) => row.premiums.grossAnnual,
          },
          {
            key: "payment",
            label: "Payment",
            render: (row) => (
              <div className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)]">
                <span>{row.paymentFrequency === "monthly" ? "Monthly" : "Annual"}</span>
                <span className="admin-pulse h-2 w-2 rounded-full bg-[var(--admin-success)]" />
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
        ]}
      />

      <SlidePanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Policy ${selected.id}` : "Policy Detail"}
      >
        {selected && (
          <div className="flex flex-col gap-6 text-sm">
            <div className="flex items-center justify-between">
              <StatusBadge status={selected.status} />
              <span className="text-xs text-[var(--admin-text-muted)]">
                Renewal {selected.renewalDate.toLocaleDateString("en-AU")}
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
                Children & schools
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
                Premium breakdown
              </div>
              <div className="mt-2 space-y-2 text-[var(--admin-text)]">
                <div className="flex items-center justify-between">
                  <span>Gross premium</span>
                  <span>{formatCurrency(selected.premiums.grossAnnual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST</span>
                  <span>{formatCurrency(selected.premiums.gst)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stamp duty</span>
                  <span>{formatCurrency(selected.premiums.stampDuty)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Total payable</span>
                  <span>{formatCurrency(selected.premiums.totalPayable)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--admin-text-muted)]">
                  <span>Commission (35%)</span>
                  <span>{formatCurrency(selected.premiums.commission)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--admin-text-muted)]">
                  <span>Arch share</span>
                  <span>{formatCurrency(selected.premiums.archShare)}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Payment history
              </div>
              <div className="mt-2 space-y-2">
                {selected.payments.slice(0, 6).map((payment) => (
                  <div
                    key={payment.date.toISOString()}
                    className="flex items-center justify-between rounded-md bg-[var(--admin-surface)] px-3 py-2"
                  >
                    <span>{payment.date.toLocaleDateString("en-AU")}</span>
                    <span>{formatCurrency(payment.amount)}</span>
                    <span
                      className={
                        payment.status === "paid"
                          ? "text-[var(--admin-success)]"
                          : payment.status === "failed"
                          ? "text-[var(--admin-error)]"
                          : "text-[var(--admin-warning)]"
                      }
                    >
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selected.claims.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                  Claims
                </div>
                <div className="mt-2 space-y-2">
                  {selected.claims.map((claim) => (
                    <div key={claim.id} className="rounded-md bg-[var(--admin-surface)] p-3">
                      <div className="font-semibold text-[var(--admin-text)]">
                        {claim.id} · {claim.childName}
                      </div>
                      <div className="text-xs text-[var(--admin-text-muted)]">
                        {claim.type.replace("_", " ")} · {claim.status} ·{" "}
                        {formatCurrency(claim.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Amendments
              </div>
              <div className="mt-2 space-y-2">
                {amendments
                  .filter((amendment) => amendment.policyId === selected.id)
                  .map((amendment) => (
                    <div key={amendment.id} className="rounded-md bg-[var(--admin-surface)] p-3">
                      <div className="font-semibold text-[var(--admin-text)]">
                        {amendment.description}
                      </div>
                      <div className="text-xs text-[var(--admin-text-muted)]">
                        {amendment.type.replace("_", " ")} · {formatCurrency(amendment.premiumImpact)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="rounded-md border border-[var(--admin-border)] px-3 py-2 text-sm text-[var(--admin-text)]">
                Process Amendment
              </button>
              <button className="rounded-md border border-[var(--admin-error)] px-3 py-2 text-sm text-[var(--admin-error)]">
                Cancel Policy
              </button>
              <button className="rounded-md border border-[var(--admin-border)] px-3 py-2 text-sm text-[var(--admin-text)]">
                Issue Renewal
              </button>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
