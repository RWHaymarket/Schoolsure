"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  getRowKey: (row: T) => string;
};

export default function DataTable<T>({
  columns,
  data,
  onRowClick,
  getRowKey,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const column = columns.find((col) => col.key === sortKey);
    if (!column) return data;
    const sorter = column.sortValue;
    const sortedData = [...data].sort((a, b) => {
      const aValue = sorter ? sorter(a) : String(column.render(a));
      const bValue = sorter ? sorter(b) : String(column.render(b));
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [columns, data, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="admin-card overflow-hidden">
      <div className="admin-scrollbar overflow-x-auto">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] border-b border-[var(--admin-border)] bg-[var(--admin-bg)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--admin-text-muted)]">
            {columns.map((column) => (
              <button
                key={column.key}
                type="button"
                onClick={() => column.sortable && handleSort(column.key)}
                className={[
                  "flex items-center gap-1 text-left",
                  column.sortable ? "hover:text-[var(--admin-text)]" : "cursor-default",
                  column.className ?? "",
                ].join(" ")}
              >
                {column.label}
                {column.sortable && sortKey === column.key && (
                  <>
                    {sortDirection === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
          <div className="divide-y divide-[var(--admin-border)]">
            {sorted.map((row) => (
              <div
                key={getRowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={[
                  "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] px-5 py-3 text-sm text-[var(--admin-text)]",
                  onRowClick
                    ? "cursor-pointer border-l-2 border-transparent transition hover:border-[var(--admin-accent)] hover:bg-[var(--admin-surface-hover)]"
                    : "",
                ].join(" ")}
              >
                {columns.map((column) => (
                  <div key={column.key} className={column.className}>
                    {column.render(row)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
