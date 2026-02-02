import * as React from "react";

import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  return (
    <ShadTooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-sm">
        {content}
      </TooltipContent>
    </ShadTooltip>
  );
}
