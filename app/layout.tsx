import type { Metadata } from "next";
import "../styles/globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
