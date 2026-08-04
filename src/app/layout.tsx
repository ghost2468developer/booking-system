import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoFix Pro - Car Repair & Maintenance Booking",
  description: "Book professional car repair and maintenance services online. Fast scheduling, transparent pricing, and quality workmanship guaranteed.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
