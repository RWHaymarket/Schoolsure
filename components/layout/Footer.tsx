import Link from "next/link";

const legalDisclaimer = `"SchoolSure" is a registered business name of Niche Insurance Pty Ltd ("Niche"), 
ABN 85 642 823 443, AFSL 530784. Before you buy, please read the Product Disclosure 
Statement. Any information contained on this website is general advice only and has 
been prepared without taking into account your objectives, financial situation or needs.

You should consider these having regard to the Product Disclosure Statement ("PDS"). 
Please note in particular, the eligibility criteria and limitations to claim under 
multiple policy sections. This insurance is underwritten by Certain Underwriters at 
Lloyd's led by Arch Managing Agency Limited, Lloyd's Syndicate 2012.

Niche Insurance Pty Ltd
Level 21, 68 Pitt Street, Sydney NSW 2000, Australia`;

const footerLinks = {
  policy: [
    { label: "Policy Wording", href: "/policy-wording" },
    { label: "Cover Summary", href: "/cover-summary" },
    { label: "FAQs", href: "/faq" },
    { label: "Making a Claim", href: "/claims" },
    { label: "Target Market", href: "/tmd" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Complaints", href: "/complaints" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="text-lg font-semibold">SchoolSure</div>
            <p className="text-sm text-white/70">
              Protecting your child's education with confidence.
            </p>
            <div className="text-sm text-white/60">
              Lloyd's Coverholder · Backed by Arch
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Policy
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.policy.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Company
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-xs text-white/70 whitespace-pre-line">
          {legalDisclaimer}
        </div>
        <div className="mt-4 text-xs text-white/50">
          © 2026 SchoolSure. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
