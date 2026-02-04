"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

type DateRange = { from: Date; to: Date };

const ALL_TIME_RANGE = {
  from: new Date(2026, 2, 1),
  to: new Date(2027, 7, 31),
};

const presetRanges: Record<string, () => DateRange> = {
  Today: () => {
    const now = new Date();
    return { from: now, to: now };
  },
  "This Week": () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { from: start, to: end };
  },
  "This Month": () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from, to };
  },
  "Last Month": () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from, to };
  },
  "This Quarter": () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const from = new Date(now.getFullYear(), quarter * 3, 1);
    const to = new Date(now.getFullYear(), quarter * 3 + 3, 0);
    return { from, to };
  },
  "Last Quarter": () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const from = new Date(now.getFullYear(), quarter * 3 - 3, 1);
    const to = new Date(now.getFullYear(), quarter * 3, 0);
    return { from, to };
  },
  "This Year": () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), 0, 1);
    const to = new Date(now.getFullYear(), 11, 31);
    return { from, to };
  },
  "Last Year": () => {
    const now = new Date();
    const from = new Date(now.getFullYear() - 1, 0, 1);
    const to = new Date(now.getFullYear() - 1, 11, 31);
    return { from, to };
  },
  "All Time": () => ALL_TIME_RANGE,
};

export default function DateRangeSelector({
  value,
  onChange,
  presets = true,
  compact = false,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(() => {
    const current = Object.entries(presetRanges).find(([, makeRange]) => {
      const range = makeRange();
      return (
        range.from.toDateString() === value.from.toDateString() &&
        range.to.toDateString() === value.to.toDateString()
      );
    });
    return current?.[0] ?? "Custom";
  }, [value]);

  const handlePreset = (label: string) => {
    const range = presetRanges[label]();
    onChange(range);
    if (compact) setOpen(false);
  };

  const format = (date: Date) =>
    date.toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const toInputValue = (date: Date) => {
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  const safeFormat = (date: Date) => {
    if (Number.isNaN(date.getTime())) return "—";
    return format(date);
  };

  if (compact) {
    return (
      <div className="relative" suppressHydrationWarning>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-sm text-[var(--admin-text)]"
        >
          {selectedLabel}
          <ChevronDown className="h-4 w-4" />
        </button>
        {open && (
          <div className="absolute right-0 top-full z-10 mt-2 w-60 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-lg">
            <div className="flex flex-col gap-1">
              {Object.keys(presetRanges).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handlePreset(label)}
                  className="w-full rounded px-3 py-2 text-left text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)]"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 border-t border-[var(--admin-border)] pt-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
                Custom range
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <input
                  type="date"
                  value={toInputValue(value.from)}
                  onChange={(event) =>
                  onChange({
                    from: event.target.value ? new Date(event.target.value) : value.from,
                    to: value.to,
                  })
                  }
                  className="admin-input h-9 px-2 text-xs"
                />
                <input
                  type="date"
                  value={toInputValue(value.to)}
                  onChange={(event) =>
                  onChange({
                    from: value.from,
                    to: event.target.value ? new Date(event.target.value) : value.to,
                  })
                  }
                  className="admin-input h-9 px-2 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-card flex flex-col gap-4 p-5" suppressHydrationWarning>
      {presets && (
        <div className="flex flex-wrap gap-2">
          {Object.keys(presetRanges).map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => handlePreset(label)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                selectedLabel === label
                  ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
                  : "border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:border-[var(--admin-accent)] hover:text-[var(--admin-text)]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-[var(--admin-text-muted)]">From</label>
        <div className="flex items-center gap-2 rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-sm text-[var(--admin-text)]">
          <CalendarDays className="h-4 w-4 text-[var(--admin-text-muted)]" />
          <input
            type="date"
            value={toInputValue(value.from)}
            onChange={(event) =>
              onChange({
                from: event.target.value ? new Date(event.target.value) : value.from,
                to: value.to,
              })
            }
            className="bg-transparent text-sm text-[var(--admin-text)] focus:outline-none"
          />
        </div>
        <label className="text-sm text-[var(--admin-text-muted)]">To</label>
        <div className="flex items-center gap-2 rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-sm text-[var(--admin-text)]">
          <CalendarDays className="h-4 w-4 text-[var(--admin-text-muted)]" />
          <input
            type="date"
            value={toInputValue(value.to)}
            onChange={(event) =>
              onChange({
                from: value.from,
                to: event.target.value ? new Date(event.target.value) : value.to,
              })
            }
            className="bg-transparent text-sm text-[var(--admin-text)] focus:outline-none"
          />
        </div>
        <div className="text-xs text-[var(--admin-text-muted)]">
          {safeFormat(value.from)} → {safeFormat(value.to)}
        </div>
      </div>
    </div>
  );
}
