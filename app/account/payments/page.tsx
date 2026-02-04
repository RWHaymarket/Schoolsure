"use client";

import { useState } from "react";
import {
  AlertCircle,
  Calendar,
  CreditCard,
  Lightbulb,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Toast from "@/components/shared/Toast";
import { mockAccount } from "@/lib/mock-account-data";
import { formatCurrencyWithCents } from "@/lib/utils";
import { formatDateLong } from "@/lib/account-utils";

export default function AccountPaymentsPage() {
  const { pricing, payments, policy } = mockAccount;
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    variant: "success" | "error" | "info";
  } | null>(null);

  const handleUpdate = () => {
    setToast({
      title: "Update coming soon",
      message: "Payment method updates will be available at launch. Contact support for now.",
      variant: "info",
    });
  };

  return (
    <div className="space-y-6">
      {toast ? (
        <Toast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
          className="absolute right-6 top-6"
        />
      ) : null}

      <div>
        <h1 className="text-[28px] font-black text-navy">Payments</h1>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-[20px] font-semibold text-navy">
              Your payment plan
            </div>
            <div className="mt-3 text-[16px] text-navy font-semibold capitalize">
              {policy.paymentFrequency} by direct debit
            </div>
            <div className="mt-2 text-[24px] font-black text-navy">
              {formatCurrencyWithCents(pricing.monthlyAmount)} per month
            </div>
            <div className="text-[14px] text-grey-500">
              Total {formatCurrencyWithCents(pricing.annualTotal)} per year
            </div>

            {policy.paymentFrequency === "monthly" ? (
              <div className="mt-4 rounded-lg bg-off-white p-4">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-navy">
                  <Lightbulb className="h-4 w-4 text-navy" />
                  Switch to annual and save $
                  {formatCurrencyWithCents(
                    pricing.annualTotal - pricing.annualWithDiscount
                  )}
                  /year
                </div>
                <button className="mt-2 text-[14px] font-semibold text-magenta">
                  Switch to annual →
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <div className="text-[16px] font-semibold text-navy">
              Payment method
            </div>
            <div className="mt-3 rounded-xl bg-navy p-5 text-white max-w-[280px]">
              <div className="flex items-center justify-between">
                <CreditCard className="h-5 w-5 text-white/70" />
                <span className="text-xs uppercase text-white/60">Visa</span>
              </div>
              <div className="mt-3 text-[18px] font-semibold tracking-[2px]">
                •••• •••• •••• {pricing.paymentMethod.last4}
              </div>
              <div className="mt-3 text-[12px] uppercase text-white/70">
                {mockAccount.parent.firstName} {mockAccount.parent.lastName}
              </div>
              <div className="text-[12px] text-white/70">
                {pricing.paymentMethod.expiry}
              </div>
            </div>
            <div className="mt-3">
              <Button variant="secondary" onClick={handleUpdate}>
                Update payment method
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-navy font-semibold">
            <Calendar className="h-5 w-5" />
            Next payment: {formatDateLong(pricing.nextPaymentDate)}
          </div>
          <div className="text-[16px] font-semibold text-navy">
            {formatCurrencyWithCents(pricing.nextPaymentAmount)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <div className="text-[20px] font-semibold text-navy">
          Payment history
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-grey-200">
          <div className="grid grid-cols-4 bg-grey-100 px-4 py-3 text-[12px] font-semibold uppercase text-grey-500">
            <div>Date</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Method</div>
          </div>
          {payments.map((payment, index) => (
            <div
              key={`${payment.date}-${index}`}
              className={`grid grid-cols-4 px-4 py-3 text-[14px] text-navy ${
                index % 2 === 1 ? "bg-grey-50" : "bg-white"
              } border-t border-grey-200`}
            >
              <div>{formatDateLong(payment.date)}</div>
              <div>{formatCurrencyWithCents(payment.amount)}</div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                Paid
              </div>
              <div>{payment.method}</div>
            </div>
          ))}
        </div>
        <button className="mt-3 text-[14px] font-semibold text-magenta">
          View all payments ▾
        </button>
      </div>

      <div className="rounded-xl border border-grey-300 bg-off-white p-4">
        <div className="flex items-start gap-3 text-[14px] text-grey-700">
          <AlertCircle className="h-5 w-5 text-navy" />
          Payments are debited automatically. If a payment fails, we&apos;ll notify
          you and retry within 3 business days.
        </div>
      </div>
    </div>
  );
}
