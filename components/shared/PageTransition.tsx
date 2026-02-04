"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "idle" | "exit" | "enter";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [displayPath, setDisplayPath] = useState(pathname);
  const [phase, setPhase] = useState<Phase>("idle");
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayChildren(children);
      setDisplayPath(pathname);
      return;
    }

    if (pathname === displayPath) return;

    setPhase("exit");
    const exitTimer = window.setTimeout(() => {
      setDisplayChildren(children);
      setDisplayPath(pathname);
      setPhase("enter");
      requestAnimationFrame(() => setPhase("idle"));
    }, 150);

    return () => window.clearTimeout(exitTimer);
  }, [children, displayPath, pathname, prefersReducedMotion]);

  const transitionClass = prefersReducedMotion
    ? "opacity-100 translate-y-0"
    : phase === "exit"
      ? "opacity-0 -translate-y-1"
      : phase === "enter"
        ? "opacity-0 translate-y-1"
        : "opacity-100 translate-y-0";

  return (
    <div
      className={`transition-all duration-200 ease-out will-change-transform ${transitionClass}`}
    >
      {displayChildren}
    </div>
  );
}
