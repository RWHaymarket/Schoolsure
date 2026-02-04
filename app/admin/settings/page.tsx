"use client";

import { STAMP_DUTY_RATES, COMMISSION_RATE, GST_RATE } from "@/lib/insurance-tax";
import { PRICING_CONFIG } from "@/lib/pricing-config";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl font-semibold text-[var(--admin-text)]">Settings</div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-base font-semibold text-[var(--admin-text)]">
          Rate Configuration
        </div>
        <div className="grid gap-3 text-sm text-[var(--admin-text)] lg:grid-cols-2">
          <div>Commission rate: {(COMMISSION_RATE * 100).toFixed(0)}%</div>
          <div>Profit share: 50/50</div>
          <div>GST rate: {(GST_RATE * 100).toFixed(0)}%</div>
          <div>Parent cover rate: {(PRICING_CONFIG.productA.rate * 100).toFixed(1)}%</div>
          <div>Student cover rate: {(PRICING_CONFIG.productB.rate * 100).toFixed(1)}%</div>
          <div>Expenses cover flat rate: ${PRICING_CONFIG.productC.flatRate}</div>
          <div>Minimum premium: ${PRICING_CONFIG.productA.minimumPremium}</div>
          <div>Multi-child discount: {(PRICING_CONFIG.discounts.multiChild * 100).toFixed(0)}%</div>
          <div>Annual payment discount: {(PRICING_CONFIG.discounts.annualPayment * 100).toFixed(0)}%</div>
          <div>Full term upgrade loading: {(PRICING_CONFIG.productA.fullTermLoading * 100).toFixed(0)}%</div>
          <div>Renewal loading: {(PRICING_CONFIG.renewal.annualLoading * 100).toFixed(0)}%</div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[420px]">
            <div className="grid grid-cols-[80px_1fr_1fr] border-b border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
              <div>State</div>
              <div>Rate</div>
              <div>Notes</div>
            </div>
            <div className="divide-y divide-[var(--admin-border)]">
              {Object.entries(STAMP_DUTY_RATES).map(([state, data]) => (
                <div
                  key={state}
                  className="grid grid-cols-[80px_1fr_1fr] px-4 py-2 text-sm text-[var(--admin-text)]"
                >
                  <div>{state}</div>
                  <div>{Math.round(data.rate * 100)}%</div>
                  <div className="text-[var(--admin-text-muted)]">
                    {data.notes ?? data.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-xs text-[var(--admin-text-muted)]">
          Rates locked at policy inception. Contact underwriting to modify.
        </div>
      </div>

      <div className="admin-card flex flex-col gap-4 p-6">
        <div className="text-base font-semibold text-[var(--admin-text)]">
          Admin Users
        </div>
        <div className="grid gap-2 text-sm text-[var(--admin-text)]">
          <div className="flex items-center justify-between rounded-md bg-[var(--admin-surface)] px-4 py-3">
            <span>Richard Warburton — Super Admin</span>
            <span className="text-[var(--admin-text-muted)]">
              richard@nicheinsurance.com.au
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-[var(--admin-surface)] px-4 py-3">
            <span>Eddie Feltham — Super Admin</span>
            <span className="text-[var(--admin-text-muted)]">
              eddie@nicheinsurance.com.au
            </span>
          </div>
        </div>
        <button className="w-fit rounded-md border border-[var(--admin-border)] px-4 py-2 text-sm text-[var(--admin-text)]">
          Add user
        </button>
      </div>

      <div className="admin-card flex flex-col gap-2 p-6 text-sm text-[var(--admin-text)]">
        <div className="text-base font-semibold">Business Details</div>
        <div>Niche Insurance Pty Ltd</div>
        <div>ABN: 85 642 823 443</div>
        <div>AFSL: 530784</div>
        <div>Underwriter: Arch Insurance / Lloyd's of London</div>
      </div>
    </div>
  );
}
