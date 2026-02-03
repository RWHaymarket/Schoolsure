"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Calendar, ChevronDown, Heart, Shield } from "lucide-react";

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "School Directory", href: "/school-directory" },
  { label: "Claims", href: "/claims" },
  { label: "FAQs", href: "/faqs" },
];

export default function Navigation() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-4 py-2 text-base font-semibold rounded-lg transition-colors ${
      pathname === href
        ? "text-magenta underline underline-offset-8"
        : "text-navy hover:text-magenta hover:bg-off-white"
    }`;

  return (
    <nav className="hidden lg:flex items-center gap-1">
      <Link href="/how-it-works" className={linkClass("/how-it-works")}>
        How It Works
      </Link>

      <div className="relative group">
        <button className="px-4 py-2 text-base font-semibold text-navy hover:text-magenta transition-colors rounded-lg hover:bg-off-white flex items-center gap-1">
          Coverage
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-[520px] bg-white rounded-2xl shadow-xl border border-grey-300 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/coverage/parent-cover"
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-off-white transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Parent Continuity Cover</p>
                <p className="text-xs text-grey-500 mt-0.5">
                  Fees paid if something happens to you
                </p>
              </div>
            </Link>

            <Link
              href="/coverage/student-cover"
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-off-white transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-magenta flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Student Continuity Cover</p>
                <p className="text-xs text-grey-500 mt-0.5">
                  When your child can&apos;t attend
                </p>
              </div>
            </Link>

            <Link
              href="/coverage/deposits"
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-off-white transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-grey-700 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Deposits & Booking</p>
                <p className="text-xs text-grey-500 mt-0.5">
                  Protect deposits before term starts
                </p>
              </div>
            </Link>

            <Link
              href="/coverage"
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-off-white transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-off-white border border-grey-300 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">View All Coverage</p>
                <p className="text-xs text-grey-500 mt-0.5">Compare all cover options</p>
              </div>
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-grey-300">
            <Link
              href="/quote/school"
              className="flex items-center justify-between p-3 bg-off-white rounded-xl hover:bg-grey-100 transition-colors"
            >
              <div>
                <p className="font-semibold text-navy text-sm">Not sure what you need?</p>
                <p className="text-xs text-grey-500">
                  Get a personalised recommendation fast
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-magenta flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {navLinks.map((link) => (
        <Link key={link.href} href={link.href} className={linkClass(link.href)}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
