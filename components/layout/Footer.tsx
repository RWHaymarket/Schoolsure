import Link from "next/link";

import { Shield } from "lucide-react";

const footerLinks = {
  product: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Coverage", href: "/coverage" },
    { label: "Pricing", href: "/pricing" },
    { label: "Claims", href: "/claims" },
    { label: "FAQs", href: "/faqs" },
    { label: "School Directory", href: "/school-directory" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Complaints", href: "/complaints" },
  ],
  legal: [
    { label: "Policy Wording", href: "/policy-wording" },
    { label: "Cover Summary", href: "/cover-summary" },
    { label: "Target Market", href: "/tmd" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#2D3E50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-magenta" />
              <span className="text-xl font-bold text-white">SchoolSure</span>
            </div>
            <p className="text-white/60 text-base leading-relaxed mb-6">
              Protecting your child's education with confidence.
            </p>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white rounded px-3 py-2">
                <span className="text-navy text-xs font-bold tracking-wider">LLOYD&apos;S</span>
              </div>
            </div>
            <p className="text-white/40 text-sm">Lloyd's Coverholder</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-8 space-y-4">
          <p className="text-sm text-white/40 leading-relaxed">
            "SchoolSure" is a registered business name of Niche Insurance Pty Ltd ("Niche"), ABN 85
            642 823 443, AFSL 530784. Before you buy, please read the Product Disclosure Statement.
            Any information contained on this website is general advice only and has been prepared
            without taking into account your objectives, financial situation or needs.
          </p>
          <p className="text-sm text-white/40 leading-relaxed">
            You should consider these having regard to the Product Disclosure Statement ("PDS").
            Please note in particular, the eligibility criteria and limitations to claim under
            multiple policy sections. This insurance is underwritten by Certain Underwriters at
            Lloyd&apos;s of London, Lloyd&apos;s Syndicate 2012.
          </p>
          <div className="pt-2">
            <p className="text-sm text-white/40">Niche Insurance Pty Ltd</p>
            <p className="text-sm text-white/40">
              Level 21, 68 Pitt Street, Sydney NSW 2000, Australia
            </p>
          </div>
        </div>

        <div className="py-4 border-t border-white/10">
          <p className="text-sm text-white/30">© 2026 SchoolSure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
