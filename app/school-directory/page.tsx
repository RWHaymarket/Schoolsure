import type { Metadata } from "next";

import { SchoolDirectoryListing } from "@/components/school-directory/SchoolDirectoryListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "School Directory — Find Your School | SchoolSure",
  description:
    "Browse schools across Australia and find key details, contact information, and enrolment links.",
};

export default function SchoolDirectoryPage() {
  return <SchoolDirectoryListing />;
}
