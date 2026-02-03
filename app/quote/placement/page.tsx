import type { Metadata } from "next";

import PlacementPageClient from "./placement-page-client";

export const metadata: Metadata = {
  title: "Protect Your School Deposit | SchoolSure",
  description:
    "Protect non-refundable school application and enrolment fees from $25. Cover for unforeseen events. Instant policy.",
};

export default function PlacementPage() {
  return <PlacementPageClient />;
}
