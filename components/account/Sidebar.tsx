"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  CreditCard,
  Download,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react";

import { mockAccount } from "@/lib/mock-account-data";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Policy", href: "/account/policy", icon: FileText },
  { label: "Children", href: "/account/children", icon: Users },
  { label: "Payments", href: "/account/payments", icon: CreditCard },
  { label: "Documents", href: "/account/documents", icon: Download },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

const actionItems = [
  { label: "Make a Claim", href: "/account/claims", icon: AlertCircle },
  { label: "Add Cover", href: "/account/add-cover", icon: PlusCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const initials = `${mockAccount.parent.firstName[0]}${mockAccount.parent.lastName[0]}`;

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[72px] lg:w-[260px] flex-col bg-navy px-4 lg:px-5 py-8 text-white">
      <div>
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="text-lg font-semibold">SchoolSure</span>
        </Link>
        <div className="mt-2 text-[12px] uppercase tracking-[1px] text-white/50">
          Parent Account
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-magenta text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="hidden lg:block">
          <div className="text-[16px] font-semibold text-white">
            {mockAccount.parent.firstName} {mockAccount.parent.lastName}
          </div>
          <div className="text-[12px] text-white/50">
            Policy {mockAccount.policy.id}
          </div>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-white/60 transition-colors",
                "hover:text-white/80 hover:bg-white/5",
                isActive && "text-white bg-white/10 border-l-2 border-magenta"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="my-5 h-px bg-white/10" />

      <nav className="space-y-1">
        {actionItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-white/50 transition-colors",
                "hover:text-white/80 hover:bg-white/5",
                isActive && "text-white bg-white/10 border-l-2 border-magenta"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <Link
          href="/contact"
          className="flex items-center gap-3 text-[14px] text-white/50 hover:text-white/80"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden lg:inline">Help & Support</span>
        </Link>
        <button className="flex items-center gap-3 text-[14px] text-white/40 hover:text-white/70">
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline">Log out</span>
        </button>
      </div>
    </aside>
  );
}
