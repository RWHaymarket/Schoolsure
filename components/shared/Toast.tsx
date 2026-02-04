"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "success" | "error" | "info";

const variantConfig: Record<
  Variant,
  { border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  success: { border: "border-success", icon: CheckCircle2 },
  error: { border: "border-error", icon: AlertCircle },
  info: { border: "border-navy", icon: Info },
};

export default function Toast({
  title,
  message,
  variant = "info",
  onClose,
  className,
}: {
  title: string;
  message: string;
  variant?: Variant;
  onClose: () => void;
  className?: string;
}) {
  const Icon = variantConfig[variant].icon;

  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "rounded-[10px] border-l-4 border-grey-300 bg-white p-4 shadow-md max-w-[360px] transition-all duration-200 ease-out",
        variantConfig[variant].border,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-navy mt-0.5" />
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-navy">{title}</div>
          <div className="mt-1 text-[14px] text-grey-700">{message}</div>
        </div>
        <button type="button" onClick={onClose} aria-label="Dismiss">
          <X className="h-4 w-4 text-grey-500" />
        </button>
      </div>
    </div>
  );
}
