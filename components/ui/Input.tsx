import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export default function Input({
  className,
  error = false,
  success = false,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        "w-full h-[52px] px-4 bg-grey-100 border-2 border-transparent rounded-[10px] text-base text-navy placeholder:text-grey-500 transition-all duration-150 ease-out focus:bg-white focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10",
        error && "border-error ring-4 ring-error/10",
        success && "border-success ring-4 ring-success/10",
        className,
      )}
      data-error={error}
      {...props}
    />
  );
}
