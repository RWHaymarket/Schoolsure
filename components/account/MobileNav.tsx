"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CreditCard,
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Users,
  X,
  AlertCircle,
  Settings,
} from "lucide-react";

import { mockAccount } from "@/lib/mock-account-data";
import { cn } from "@/lib/utils";

const mainItems = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Policy", href: "/account/policy", icon: FileText },
  { label: "Payments", href: "/account/payments", icon: CreditCard },
  { label: "Documents", href: "/account/documents", icon: Download },
];

const moreItems = [
  { label: "Children", href: "/account/children", icon: Users },
  { label: "Settings", href: "/account/settings", icon: Settings },
  { label: "Make a Claim", href: "/account/claims", icon: AlertCircle },
  { label: "Add Cover", href: "/account/add-cover", icon: PlusCircle },
];

export default function AccountMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initials = `${mockAccount.parent.firstName[0]}${mockAccount.parent.lastName[0]}`;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-grey-300">
        <Link href="/" className="text-navy font-semibold">
          SchoolSure
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 w-10 rounded-full border border-grey-300 flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-navy" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-navy text-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-magenta flex items-center justify-center font-semibold">
                {initials}
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {mockAccount.parent.firstName} {mockAccount.parent.lastName}
                </div>
                <div className="text-xs text-white/50">
                  Policy {mockAccount.policy.id}
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="px-5 py-6 space-y-2">
            {[...mainItems, ...moreItems].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-white/70",
                    isActive && "bg-white/10 text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-grey-300">
        <div className="grid grid-cols-5 text-[12px] text-grey-500">
          {[
            { label: "Dashboard", href: "/account", icon: LayoutDashboard },
            { label: "Policy", href: "/account/policy", icon: FileText },
            { label: "Payments", href: "/account/payments", icon: CreditCard },
            { label: "Documents", href: "/account/documents", icon: Download },
            { label: "More", href: "/account/children", icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2",
                  isActive ? "text-magenta" : "text-grey-500"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
