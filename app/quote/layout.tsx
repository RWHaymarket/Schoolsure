"use client";

import { usePathname } from "next/navigation";
import { Lock, ShieldCheck, BadgeCheck } from "lucide-react";

import ProgressBar from "@/components/quote/ProgressBar";

const stepMap: Record<string, 1 | 2 | 3 | 4> = {
  "/quote/school": 1,
  "/quote/coverage": 2,
  "/quote/details": 3,
  "/quote/review": 4,
};

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/quote/placement")) {
    return <div className="bg-white">{children}</div>;
  }
  const currentStep = stepMap[pathname] ?? 1;

  return (
    <div className="bg-off-white">
      <div className="mx-auto max-w-5xl px-4 pt-8">
        <div className="rounded-2xl border border-grey-100 bg-white px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <ProgressBar currentStep={currentStep} />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-grey-500">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-magenta" />
              Underwritten by Lloyd&apos;s of London
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-magenta" />
              AFSL 530784 · Australian regulated
            </span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4 text-magenta" />
              Secure and encrypted
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
