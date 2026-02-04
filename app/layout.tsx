import type { Metadata } from "next";
import "../styles/globals.css";
import AppShell from "../components/layout/AppShell";
import PageTransition from "../components/shared/PageTransition";

export const metadata: Metadata = {
  title: "SchoolSure",
  description: "School fee protection insurance for Australian families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <AppShell>
          <PageTransition>{children}</PageTransition>
        </AppShell>
      </body>
    </html>
  );
}
