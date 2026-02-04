import { cn } from "@/lib/utils";

export default function SkeletonTable({
  rows = 4,
  columns = 3,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-grey-300 bg-white",
        className
      )}
    >
      <div className="skeleton-shimmer h-10 w-full" />
      <div className="divide-y divide-grey-300">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid gap-4 px-4 py-3 ${
              rowIndex % 2 === 1 ? "bg-grey-100" : "bg-white"
            }`}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((__, colIndex) => (
              <div key={colIndex} className="skeleton-shimmer h-4 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
