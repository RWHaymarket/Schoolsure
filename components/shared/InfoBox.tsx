import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";

type InfoBoxVariant = "tip" | "warning" | "success" | "info";

export interface InfoBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: InfoBoxVariant;
}

const variantStyles: Record<InfoBoxVariant, string> = {
  tip: "bg-[#EBF8FF] border-l-4 border-[#3182CE]",
  warning: "bg-[#FFFBEB] border-l-4 border-[#D97706]",
  success: "bg-[#F0FFF4] border-l-4 border-[#38A169]",
  info: "bg-off-white border-l-4 border-navy",
};

const variantIcons: Record<InfoBoxVariant, React.ReactNode> = {
  tip: <Lightbulb className="h-5 w-5 text-[#3182CE]" />,
  warning: <AlertTriangle className="h-5 w-5 text-[#D97706]" />,
  success: <CheckCircle2 className="h-5 w-5 text-[#38A169]" />,
  info: <Info className="h-5 w-5 text-navy" />,
};

export default function InfoBox({
  variant = "info",
  className,
  children,
  ...props
}: InfoBoxProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-r-lg p-4 text-sm text-navy",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <div className="mt-0.5">{variantIcons[variant]}</div>
      <div>{children}</div>
    </div>
  );
}
