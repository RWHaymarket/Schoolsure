"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function Logo({
  variant = "dark",
  size = "md",
  showIcon = true,
  className,
}: LogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-lg" },
    md: { icon: "w-8 h-8", text: "text-xl" },
    lg: { icon: "w-10 h-10", text: "text-2xl" },
  };

  const colors = {
    dark: { icon: "text-navy", text: "text-navy", accent: "text-magenta" },
    light: {
      icon: "text-white",
      text: "text-white",
      accent: "text-magenta-light",
    },
  };

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      {showIcon ? (
        <div
          className={cn(
            "relative flex items-center justify-center",
            sizes[size].icon
          )}
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className={cn("w-full h-full", colors[variant].icon)}
          >
            <path
              d="M16 2L4 7v8c0 7.73 5.12 14.95 12 17 6.88-2.05 12-9.27 12-17V7L16 2z"
              fill="currentColor"
              opacity="0.1"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M16 10l-8 4 8 4 8-4-8-4z" fill="currentColor" />
            <path
              d="M10 15.5v4c0 1.5 2.69 3 6 3s6-1.5 6-3v-4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="24"
              y1="14"
              x2="24"
              y2="20"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      ) : null}
      <span
        className={cn(
          "font-black tracking-tight",
          sizes[size].text,
          colors[variant].text
        )}
      >
        School<span className={colors[variant].accent}>Sure</span>
      </span>
    </Link>
  );
}
