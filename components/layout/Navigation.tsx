import Link from "next/link";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Coverage", href: "/coverage" },
  { label: "Pricing", href: "/pricing" },
  { label: "Claims", href: "/claims" },
  { label: "FAQs", href: "/faq" },
];

export default function Navigation() {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-semibold text-navy transition-colors hover:text-magenta"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
