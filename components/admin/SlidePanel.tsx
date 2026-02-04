"use client";

import { X } from "lucide-react";

export default function SlidePanel({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--admin-bg)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
          <div className="text-lg font-semibold text-[var(--admin-text)]">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--admin-border)] text-[var(--admin-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="admin-scrollbar h-full overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
