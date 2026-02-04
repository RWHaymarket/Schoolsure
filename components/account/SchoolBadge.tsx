"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type BadgeSize = "sm" | "md" | "lg";

const sizeMap: Record<BadgeSize, string> = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-[72px] w-[72px] text-lg",
};

const imageSizeMap: Record<BadgeSize, number> = {
  sm: 40,
  md: 56,
  lg: 72,
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase())
    .join("");

export default function SchoolBadge({
  name,
  badgeUrl,
  size = "md",
}: {
  name: string;
  badgeUrl?: string;
  size?: BadgeSize;
}) {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => getInitials(name), [name]);
  const imageSize = imageSizeMap[size];

  if (!badgeUrl || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full border border-grey-300 bg-white text-navy font-semibold",
          sizeMap[size]
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={badgeUrl}
      alt={`${name} badge`}
      width={imageSize}
      height={imageSize}
      className={cn(
        "rounded-lg border border-grey-300 bg-white object-contain p-1",
        sizeMap[size]
      )}
      onError={() => setFailed(true)}
    />
  );
}
