"use client";

import { useMemo, useState } from "react";
import { HeartPulse, PlusCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Toast from "@/components/shared/Toast";
import { mockAccount } from "@/lib/mock-account-data";
import { formatCurrencyWithCents } from "@/lib/utils";
import { PRICING_CONFIG } from "@/lib/pricing-config";

export default function AccountAddCoverPage() {
  const { policy, children } = mockAccount;
  const [toast, setToast] = useState(false);

  const totalAnnualFees = useMemo(
    () => children.reduce((sum, child) => sum + child.school.annualFee, 0),
    [children]
  );

  const studentCoverPrice = totalAnnualFees * PRICING_CONFIG.productB.rate;

  const availableAddOns = [
    !policy.productsIncluded.studentContinuityCover && {
      title: "Student Continuity Cover",
      description:
        "Protect fees if your child is too unwell to attend for an extended period.",
      price: `For ${children
        .map((child) => child.firstName)
        .join(" & ")}: ${formatCurrencyWithCents(studentCoverPrice)}/year`,
    },
    !policy.productsIncluded.schoolExpensesCover && {
      title: "School Expenses Cover",
      description:
        "Covers books, transport, and uniforms when a covered event occurs.",
      price: `Flat ${formatCurrencyWithCents(
        PRICING_CONFIG.productC.flatRate
      )} per child/year`,
    },
  ].filter(
    (
      addon
    ): addon is { title: string; description: string; price: string } => Boolean(addon)
  );

  return (
    <div className="space-y-6">
      {toast ? (
        <Toast
          title="Coming soon"
          message="Cover additions will be available at launch."
          variant="info"
          onClose={() => setToast(false)}
          className="absolute right-6 top-6"
        />
      ) : null}

      <div>
        <h1 className="text-[28px] font-black text-navy">Enhance your cover</h1>
        <p className="mt-1 text-[16px] text-grey-700">
          Add protection for your family.
        </p>
      </div>

      {availableAddOns.length ? (
        <div className="space-y-4">
          {availableAddOns.filter(Boolean).map((addon) => (
            <Card key={addon.title} className="rounded-2xl border border-grey-200">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-magenta/10">
                  <HeartPulse className="h-5 w-5 text-magenta" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-navy">
                    {addon.title}
                  </div>
                  <div className="text-[14px] text-grey-700">
                    {addon.description}
                  </div>
                  <div className="mt-2 text-[14px] font-semibold text-magenta">
                    {addon.price}
                  </div>
                  <Button className="mt-4" onClick={() => setToast(true)}>
                    Add to my policy
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border border-grey-200">
          <div className="text-[16px] font-semibold text-navy">
            You already have every available cover.
          </div>
          <div className="text-[14px] text-grey-700">
            We&apos;ll let you know when new products are available.
          </div>
        </Card>
      )}

      <Card className="rounded-2xl border border-grey-200">
        <div className="text-[20px] font-semibold text-navy">
          Add a child to your policy
        </div>
        <p className="mt-2 text-[14px] text-grey-700">
          Protect another child&apos;s education. You&apos;ll receive a 10% multi-child
          discount.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input placeholder="Child name" />
          <Input type="date" />
          <Input placeholder="School name" />
          <Input placeholder="Annual fee" inputMode="numeric" />
          <Input placeholder="Year level" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setToast(true)}>
            Calculate premium
          </Button>
          <Button onClick={() => setToast(true)}>
            <PlusCircle className="h-4 w-4" />
            Add to policy
          </Button>
        </div>
      </Card>
    </div>
  );
}
