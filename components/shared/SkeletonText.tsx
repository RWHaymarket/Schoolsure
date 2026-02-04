import { cn } from "@/lib/utils";

export default function SkeletonText({
  width = "100%",
  height = 16,
  className,
}: {
  width?: string | number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-lg", className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: `${height}px`,
      }}
    />
  );
}
