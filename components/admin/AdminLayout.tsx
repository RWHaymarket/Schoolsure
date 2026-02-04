"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-root min-h-screen">
      <AdminSidebar />

      <div className="admin-print-hide lg:hidden">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text)]">
            SchoolSure
            <span className="rounded bg-[var(--admin-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Admin
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--admin-border)] text-[var(--admin-text)]"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="admin-print-hide fixed inset-0 z-50 bg-black/70 lg:hidden">
          <div className="absolute inset-y-0 left-0 w-72 bg-[var(--admin-bg)]">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
              <div className="text-sm font-semibold text-[var(--admin-text)]">
                SchoolSure Admin
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--admin-border)] text-[var(--admin-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AdminSidebar mode="mobile" onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[var(--admin-bg)] px-4 py-6 lg:ml-16 lg:px-6 lg:py-8 xl:ml-60 xl:px-8">
        {children}
      </main>
    </div>
  );
}
