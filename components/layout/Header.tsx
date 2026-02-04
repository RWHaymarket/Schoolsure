"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Button from "@/components/ui/Button";
import Navigation from "@/components/layout/Navigation";
import MobileNav from "@/components/layout/MobileNav";
import { Logo } from "@/components/ui/Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isPlacementPage = pathname === "/quote/placement";

  useEffect(() => {
    if (typeof window === "undefined") return;
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="lg" className="gap-3" />
        {isPlacementPage ? (
          <div className="flex flex-1 items-center justify-end gap-4 text-sm font-semibold text-navy">
            <Link href="/quote/school">
              School Fee Protection
            </Link>
            <a href="tel:1300123456" className="text-grey-700">
              1300 123 456
            </a>
          </div>
        ) : (
          <>
            <Navigation />
            <div className="hidden items-center gap-4 lg:flex">
              <Link
                href="/account/login"
                className="text-base font-semibold text-navy hover:text-magenta"
              >
                Login
              </Link>
              <Link href="/quote/school">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-6 py-3 rounded-xl shadow-sm hover:shadow-md"
                >
                  Get a Quote
                </Button>
              </Link>
            </div>
            <MobileNav />
          </>
        )}
      </div>
    </header>
  );
}
