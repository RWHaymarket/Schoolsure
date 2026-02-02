import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "magenta";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-grey-100 text-grey-700",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  magenta: "bg-magenta-light text-magenta-dark",
};

export default function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
