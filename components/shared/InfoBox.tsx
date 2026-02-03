import * as React from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

type InfoBoxVariant = "tip" | "warning" | "success" | "info";

export interface InfoBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: InfoBoxVariant;
}

const variants: Record<InfoBoxVariant, { container: string; icon: React.ReactNode; text: string }> = {
  tip: {
    container: "bg-blue-50 border-l-4 border-blue-500",
    icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
    text: "text-blue-800",
  },
  warning: {
    container: "bg-grey-100 border-l-4 border-grey-300",
    icon: <AlertTriangle className="h-5 w-5 text-grey-500" />,
    text: "text-grey-700",
  },
  success: {
    container: "bg-green-50 border-l-4 border-green-500",
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    text: "text-green-800",
  },
  info: {
    container: "bg-grey-50 border-l-4 border-grey-400",
    icon: <Lock className="h-5 w-5 text-grey-500" />,
    text: "text-grey-700",
  },
};

export default function InfoBox({
  variant = "info",
  className,
  children,
  ...props
}: InfoBoxProps) {
  const styles = variants[variant];
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-r-lg p-4",
        styles.container,
        className,
      )}
      {...props}
    >
      <div className="mt-0.5">{styles.icon}</div>
      <p className={cn("text-sm", styles.text)}>{children}</p>
    </div>
  );
}
