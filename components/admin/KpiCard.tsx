"use client";

import { useEffect, useState } from "react";

import Sparkline from "@/components/admin/Sparkline";

type KpiCardProps = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: string;
  trendTone?: "positive" | "neutral" | "negative";
  sparkline: number[];
  formatValue?: (value: number) => string;
};

function useCountUp(value: number, duration = 500) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const next = start + (value - start) * progress;
      setDisplay(next);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  return display;
}

export default function KpiCard({
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
  trendTone = "positive",
  sparkline,
  formatValue,
}: KpiCardProps) {
  const display = useCountUp(value);
  const toneClass =
    trendTone === "negative"
      ? "text-[var(--admin-error)]"
      : trendTone === "neutral"
      ? "text-[var(--admin-text)]"
      : "text-[var(--admin-success)]";

  return (
    <div className="admin-card flex flex-col gap-4 p-6">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--admin-text-muted)]">
          {label}
        </div>
        <div className="text-3xl font-black text-[var(--admin-text)]">
          {prefix}
          {formatValue
            ? formatValue(display)
            : Math.round(display).toLocaleString("en-AU")}
          {suffix}
        </div>
        <div className={`text-sm font-semibold ${toneClass}`}>{trend}</div>
      </div>
      <Sparkline data={sparkline} />
    </div>
  );
}
