"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function StickyQuoteCTA() {
  const [visible, setVisible] = useState(false);
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const hero = document.getElementById("hero");
    const footer = document.querySelector("footer");
    if (!hero) {
      setVisible(true);
    }

    if (!footer) {
      return;
    }

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    heroObserver.observe(hero);

    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        setOverFooter(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    footerObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  if (!visible || overFooter) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
      <Link
        href="/quote/school"
        className="flex items-center gap-2 px-5 py-3 bg-magenta text-white font-semibold rounded-xl shadow-lg shadow-magenta/30 hover:bg-magenta-dark transition-all"
      >
        Get a Quote
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
