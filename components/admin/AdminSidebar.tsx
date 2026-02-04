"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  DollarSign,
  FileBarChart,
  FileSearch,
  Settings,
  Shield,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/quotes", label: "Quotes", icon: FileSearch },
  { href: "/admin/policies", label: "Policies", icon: Shield },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/financials", label: "Financials", icon: DollarSign },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
];

const secondaryItems = [{ href: "/admin/settings", label: "Settings", icon: Settings }];

export default function AdminSidebar({
  onNavigate,
  mode = "desktop",
}: {
  onNavigate?: () => void;
  mode?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const isDesktop = mode === "desktop";

  return (
    <aside
      className={[
        "admin-print-hide flex-col border-r border-[var(--admin-border)] bg-[var(--admin-bg)]",
        mode === "desktop"
          ? "fixed left-0 top-0 z-40 hidden h-screen lg:flex lg:w-16 xl:w-60"
          : "flex h-full w-full",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] px-5 py-5">
        <div
          className={[
            "text-lg font-semibold text-[var(--admin-text)]",
            isDesktop ? "hidden xl:block" : "",
          ].join(" ")}
        >
          SchoolSure
        </div>
        <span className="rounded bg-[var(--admin-accent)] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Admin
        </span>
      </div>

      <nav
        className={[
          "flex flex-1 flex-col gap-2 px-4 py-5 text-sm",
          isDesktop ? "items-center xl:items-stretch" : "",
        ].join(" ")}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                isDesktop ? "justify-center xl:justify-start" : "",
                isActive
                  ? "bg-[var(--admin-surface)] text-white ring-1 ring-inset ring-[var(--admin-border)]"
                  : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)]",
                isActive ? "border-l-2 border-[var(--admin-accent)]" : "",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span className={isDesktop ? "hidden xl:inline" : ""}>{item.label}</span>
            </Link>
          );
        })}

        <div className="my-3 h-px bg-[var(--admin-border)]" />

        {secondaryItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                isDesktop ? "justify-center xl:justify-start" : "",
                isActive
                  ? "bg-[var(--admin-surface)] text-white ring-1 ring-inset ring-[var(--admin-border)]"
                  : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)]",
                isActive ? "border-l-2 border-[var(--admin-accent)]" : "",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span className={isDesktop ? "hidden xl:inline" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className={[
          "mt-auto flex items-center gap-3 border-t border-[var(--admin-border)] px-5 py-4",
          isDesktop ? "justify-center xl:justify-start" : "",
        ].join(" ")}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--admin-accent)] text-xs font-semibold text-white">
          RW
        </div>
        <div className={isDesktop ? "hidden xl:block" : ""}>
          <div className="text-sm font-semibold text-[var(--admin-text)]">
            Richard W.
          </div>
          <div className="text-xs text-[var(--admin-text-muted)]">Admin</div>
        </div>
      </div>
    </aside>
  );
}
