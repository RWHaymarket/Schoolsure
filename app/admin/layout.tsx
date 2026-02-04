import type { Metadata } from "next";

import AdminLayout from "@/components/admin/AdminLayout";

export const metadata: Metadata = {
  title: "SchoolSure Admin",
  description: "SchoolSure admin command centre.",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
