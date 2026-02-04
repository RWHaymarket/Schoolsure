import SkeletonText from "@/components/shared/SkeletonText";
import { cn } from "@/lib/utils";

export default function SkeletonCard({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-grey-300 bg-white p-6 shadow-sm",
        className
      )}
    >
      <SkeletonText width="60%" height={18} />
      <div className="mt-4 space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonText key={index} height={12} />
        ))}
      </div>
    </div>
  );
}
