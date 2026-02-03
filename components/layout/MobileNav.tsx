"use client";

import Link from "next/link";
import { ArrowRight, Menu, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  {
    name: "How It Works",
    href: "/how-it-works",
    desc: "See how SchoolSure protects your family",
  },
  {
    name: "Coverage",
    href: "/coverage",
    desc: "Parent, Student & School Expenses cover",
  },
  {
    name: "Pricing",
    href: "/pricing",
    desc: "See cover options and pricing details",
  },
  {
    name: "School Directory",
    href: "/school-directory",
    desc: "Find your school in our database",
  },
  {
    name: "Claims",
    href: "/claims",
    desc: "Simple, compassionate claims process",
  },
  {
    name: "FAQs",
    href: "/faqs",
    desc: "Common questions answered",
  },
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
        <Menu className="h-6 w-6" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-navy lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-magenta" />
                <span className="text-lg font-bold text-white">SchoolSure</span>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-white/10 group"
                  >
                    <div>
                      <p className="text-xl font-semibold text-white group-hover:text-magenta transition-colors">
                        {link.name}
                      </p>
                      <p className="text-sm text-white/50 mt-0.5">{link.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-magenta transition-colors" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="px-6 py-6 border-t border-white/10">
              <Link
                href="/quote/school"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-magenta hover:bg-magenta-dark text-white font-semibold text-lg rounded-xl transition-all"
              >
                Get Your Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="bg-white/10 rounded px-2 py-1">
                  <span className="text-white text-[10px] font-bold tracking-wider uppercase">
                    Lloyd&apos;s
                  </span>
                </div>
                <span className="text-sm text-white/40">Backed by Lloyd&apos;s of London</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
