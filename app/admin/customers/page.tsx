"use client";

import { useMemo, useState } from "react";

import DataTable from "@/components/admin/DataTable";
import SlidePanel from "@/components/admin/SlidePanel";
import StatusBadge from "@/components/admin/StatusBadge";
import { amendments, policies, quotes } from "@/lib/mock-admin-data";
import { formatCurrency } from "@/lib/utils";

type CustomerRecord = {
  name: string;
  email: string;
  mobile: string;
  state: string;
  children: number;
  status: "Policyholder" | "Quoted" | "Lapsed" | "Cancelled";
  premium: number;
  memberSince: Date;
};

export default function AdminCustomersPage() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const customers = useMemo(() => {
    const byEmail = new Map<string, CustomerRecord>();
    quotes.forEach((quote) => {
      const email = quote.parent.email;
      if (!byEmail.has(email)) {
        byEmail.set(email, {
          name: `${quote.parent.firstName} ${quote.parent.lastName}`,
          email,
          mobile: quote.parent.mobile,
          state: quote.parent.state,
          children: quote.children.length,
          status: "Quoted",
          premium: quote.premiumCalculation.grossAnnual,
          memberSince: quote.createdAt,
        });
      }
    });

    policies.forEach((policy) => {
      const email = policy.parent.email;
      const status =
        policy.status === "cancelled"
          ? "Cancelled"
          : policy.status === "lapsed"
          ? "Lapsed"
          : "Policyholder";
      const existing = byEmail.get(email);
      byEmail.set(email, {
        name: `${policy.parent.firstName} ${policy.parent.lastName}`,
        email,
        mobile: policy.parent.mobile,
        state: policy.parent.state,
        children: policy.children.length,
        status,
        premium: policy.premiums.grossAnnual,
        memberSince: policy.startDate,
      });
      if (existing && existing.memberSince < policy.startDate) {
        byEmail.set(email, { ...byEmail.get(email)!, memberSince: existing.memberSince });
      }
    });

    return Array.from(byEmail.values());
  }, []);

  const selected = customers.find((customer) => customer.email === selectedEmail);
  const selectedQuotes = quotes.filter((quote) => quote.parent.email === selectedEmail);
  const selectedPolicies = policies.filter((policy) => policy.parent.email === selectedEmail);
  const selectedAmendments = amendments.filter((amendment) =>
    selectedPolicies.some((policy) => policy.id === amendment.policyId)
  );
  const lifetimeValue = selectedPolicies.reduce(
    (sum, policy) => sum + policy.premiums.totalPayable,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl font-semibold text-[var(--admin-text)]">Customers</div>

      <DataTable
        data={customers}
        getRowKey={(row) => row.email}
        onRowClick={(row) => setSelectedEmail(row.email)}
        columns={[
          {
            key: "name",
            label: "Name",
            sortable: true,
            render: (row) => row.name,
            sortValue: (row) => row.name,
          },
          {
            key: "email",
            label: "Email",
            render: (row) => row.email,
          },
          {
            key: "mobile",
            label: "Mobile",
            render: (row) => row.mobile,
          },
          {
            key: "state",
            label: "State",
            render: (row) => row.state,
          },
          {
            key: "children",
            label: "Children",
            render: (row) => row.children,
          },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <StatusBadge
                status={
                  row.status === "Policyholder"
                    ? "active"
                    : row.status === "Lapsed"
                    ? "lapsed"
                    : row.status === "Cancelled"
                    ? "cancelled"
                    : "pending"
                }
              />
            ),
          },
          {
            key: "premium",
            label: "Premium",
            render: (row) => formatCurrency(row.premium),
          },
          {
            key: "member",
            label: "Member Since",
            sortable: true,
            render: (row) =>
              row.memberSince.toLocaleDateString("en-AU", {
                month: "short",
                year: "numeric",
              }),
            sortValue: (row) => row.memberSince.getTime(),
          },
        ]}
      />

      <SlidePanel
        open={Boolean(selected)}
        onClose={() => setSelectedEmail(null)}
        title={selected ? selected.name : "Customer Detail"}
      >
        {selected && (
          <div className="flex flex-col gap-6 text-sm">
            <div className="admin-card flex flex-col gap-2 p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Profile
              </div>
              <div className="text-[var(--admin-text)]">{selected.name}</div>
              <div className="text-[var(--admin-text-muted)]">{selected.email}</div>
              <div className="text-[var(--admin-text-muted)]">{selected.mobile}</div>
              <div className="text-[var(--admin-text-muted)]">
                {selected.state} · {selected.children} child
                {selected.children > 1 ? "ren" : ""}
              </div>
              <div className="mt-2 text-xs text-[var(--admin-text-muted)]">
                Lifetime value: {formatCurrency(lifetimeValue)}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Quote history
              </div>
              <div className="mt-2 space-y-2">
                {selectedQuotes.map((quote) => (
                  <div key={quote.id} className="rounded-md bg-[var(--admin-surface)] p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--admin-text)]">{quote.id}</span>
                      <StatusBadge status={quote.status} />
                    </div>
                    <div className="text-xs text-[var(--admin-text-muted)]">
                      {quote.createdAt.toLocaleDateString("en-AU")} ·{" "}
                      {formatCurrency(quote.premiumCalculation.grossAnnual)}/yr
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Policy history
              </div>
              <div className="mt-2 space-y-2">
                {selectedPolicies.length === 0 && (
                  <div className="text-xs text-[var(--admin-text-muted)]">
                    No active policies
                  </div>
                )}
                {selectedPolicies.map((policy) => (
                  <div key={policy.id} className="rounded-md bg-[var(--admin-surface)] p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--admin-text)]">
                        {policy.id}
                      </span>
                      <StatusBadge status={policy.status} />
                    </div>
                    <div className="text-xs text-[var(--admin-text-muted)]">
                      Started {policy.startDate.toLocaleDateString("en-AU")} ·{" "}
                      {formatCurrency(policy.premiums.grossAnnual)}/yr
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Amendment history
              </div>
              <div className="mt-2 space-y-2">
                {selectedAmendments.length === 0 && (
                  <div className="text-xs text-[var(--admin-text-muted)]">
                    No amendments recorded
                  </div>
                )}
                {selectedAmendments.map((amendment) => (
                  <div key={amendment.id} className="rounded-md bg-[var(--admin-surface)] p-3">
                    <div className="font-semibold text-[var(--admin-text)]">
                      {amendment.description}
                    </div>
                    <div className="text-xs text-[var(--admin-text-muted)]">
                      {amendment.type.replace("_", " ")} ·{" "}
                      {formatCurrency(amendment.premiumImpact)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Payment history
              </div>
              <div className="mt-2 space-y-2">
                {selectedPolicies
                  .flatMap((policy) => policy.payments)
                  .slice(0, 6)
                  .map((payment) => (
                    <div
                      key={payment.date.toISOString()}
                      className="flex items-center justify-between rounded-md bg-[var(--admin-surface)] px-3 py-2"
                    >
                      <span>{payment.date.toLocaleDateString("en-AU")}</span>
                      <span>{formatCurrency(payment.amount)}</span>
                      <span className="text-xs text-[var(--admin-text-muted)]">
                        {payment.method}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Communication log
              </div>
              <div className="mt-2 rounded-md border border-dashed border-[var(--admin-border)] px-3 py-4 text-xs text-[var(--admin-text-muted)]">
                No communications recorded
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                Notes
              </div>
              <textarea
                className="admin-input mt-2 h-24 w-full p-3 text-sm text-[var(--admin-text)]"
                placeholder="Add a note about this customer..."
              />
              <button className="mt-3 rounded-md border border-[var(--admin-border)] px-3 py-2 text-sm text-[var(--admin-text)]">
                Save note
              </button>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
