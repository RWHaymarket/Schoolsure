import * as React from "react";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "interactive" | "selected" | "accent";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 md:p-8",
  interactive:
    "bg-white rounded-2xl border-2 border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 md:p-8 transition-all duration-250 ease-out cursor-pointer hover:border-magenta/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1",
  selected:
    "bg-white rounded-2xl border-2 border-magenta shadow-[0_0_0_4px_rgba(214,51,108,0.1),0_8px_24px_rgba(0,0,0,0.1)] p-6 md:p-8",
  accent: "bg-navy text-white rounded-2xl p-6 md:p-8",
};

export default function Card({
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
}
