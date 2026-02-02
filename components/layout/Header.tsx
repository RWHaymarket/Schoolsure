"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Navigation from "@/components/layout/Navigation";
import MobileNav from "@/components/layout/MobileNav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-lg font-semibold text-navy">
          SchoolSure
        </Link>
        <Navigation />
        <div className="hidden items-center gap-4 lg:flex">
          <Button variant="primary" size="sm">
            Get a Quote
          </Button>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
