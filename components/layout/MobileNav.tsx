"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Coverage", href: "/coverage" },
  { label: "Pricing", href: "/pricing" },
  { label: "Claims", href: "/claims" },
  { label: "FAQs", href: "/faq" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-grey-300 text-navy"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-navy text-white">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-lg font-semibold">SchoolSure</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-6 px-6 py-8 text-lg font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
