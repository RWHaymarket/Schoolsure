import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold leading-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-magenta text-white shadow-[0_2px_8px_rgba(214,51,108,0.25)] hover:bg-magenta-dark hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(214,51,108,0.35)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(214,51,108,0.2)]",
  secondary:
    "border-2 border-navy bg-transparent text-navy hover:bg-navy/5",
  ghost: "bg-transparent text-navy hover:bg-off-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-5 py-2 text-sm rounded-[10px]",
  md: "min-h-[48px] px-8 py-3 text-base rounded-[10px]",
  lg: "min-h-[52px] px-10 py-4 text-base rounded-[10px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      <span className="inline-flex items-center gap-2 leading-none">{children}</span>
    </button>
  );
}
