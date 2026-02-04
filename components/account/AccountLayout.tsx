"use client";

import { usePathname } from "next/navigation";

import Sidebar from "@/components/account/Sidebar";
import AccountMobileNav from "@/components/account/MobileNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/account/login";

  if (isLogin) {
    return <div className="min-h-screen bg-grey-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-grey-100">
      <Sidebar />
      <div className="md:ml-[72px] lg:ml-[260px] min-h-screen">
        <AccountMobileNav />
        <div className="relative px-5 py-6 md:px-8 lg:px-12 lg:py-10 pb-24 md:pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}
