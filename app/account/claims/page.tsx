"use client";

import { useState } from "react";
import { AlertCircle, PhoneCall } from "lucide-react";

import Button from "@/components/ui/Button";
import Toast from "@/components/shared/Toast";
import { mockAccount } from "@/lib/mock-account-data";

export default function AccountClaimsPage() {
  const [toast, setToast] = useState(false);

  return (
    <div className="space-y-6">
      {toast ? (
        <Toast
          title="Online claims coming soon"
          message="Online claims will be available at launch. Please call us for now."
          variant="info"
          onClose={() => setToast(false)}
          className="absolute right-6 top-6"
        />
      ) : null}
      <div>
        <h1 className="text-[28px] font-black text-navy">Make a claim</h1>
        <p className="mt-1 text-[16px] text-grey-700">
          We&apos;re here to help. Here&apos;s what to do next.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="text-[20px] font-semibold text-navy">
          What you&apos;ll need
        </h2>
        <div className="mt-4 space-y-3 text-[14px] text-grey-700">
          {[
            `Your policy number (${mockAccount.policy.id})`,
            "Details of the event (what happened and when)",
            "Supporting evidence (medical certificate, death certificate, or specialist report)",
            "Your school's contact details (we'll liaise with them directly)",
          ].map((item, index) => (
            <div key={item} className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[12px] font-semibold text-white">
                {index + 1}
              </div>
              <div>{item}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="text-[20px] font-semibold text-navy">
          How the claims process works
        </h2>
        <div className="mt-5 space-y-4">
          {[
            {
              title: "Notify us",
              description: "Tell us what happened. We'll acknowledge within 24 hours.",
            },
            {
              title: "We guide you",
              description:
                "We'll explain what evidence we need and support you through the process.",
            },
            {
              title: "School engagement",
              description:
                "We'll work with your school's hardship process to determine the net fee payable.",
            },
            {
              title: "Fees paid",
              description:
                "Once assessed, we pay fees directly to the school. Your child stays.",
            },
          ].map((step, index) => (
            <div key={step.title} className="flex items-start gap-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-grey-300 text-[12px] font-semibold text-navy">
                {index + 1}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-navy">
                  {step.title}
                </div>
                <div className="text-[14px] text-grey-700">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-t-2 border-magenta bg-white p-7 shadow-sm">
        <h2 className="text-[20px] font-semibold text-navy">Ready to start?</h2>
        <p className="mt-2 text-[14px] text-grey-700">
          You can begin your claim online or call us directly.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Button onClick={() => setToast(true)}>
            Start claim online
          </Button>
          <a href="tel:1300123456">
            <Button variant="secondary" className="w-full">
              <PhoneCall className="h-4 w-4" />
              Call us: 1300 123 456
            </Button>
          </a>
        </div>
        <div className="mt-3 text-[12px] text-grey-500">
          Available Monday–Friday, 9am–5pm AEST
        </div>
      </div>

      <div className="rounded-xl bg-off-white p-4">
        <div className="flex items-start gap-3 text-[14px] text-grey-700">
          <AlertCircle className="h-5 w-5 text-navy" />
          If you&apos;re unsure whether your event is covered, call us and we&apos;ll
          guide you.
        </div>
      </div>
    </div>
  );
}
