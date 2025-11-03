import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner"
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SFPZK - Şaxê Ewropa",
  description: "SFPZK - Şaxê Ewropa",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-gray-900`}
      >
        <Navbar />
        {children}
        <Footer />
        <Toaster /> {/* Sonner toast notifications, used in /fêrbûn and /new-entry */}
        <SpeedInsights /> {/* Vercel Speed Insights for performance monitoring */}
      </body>
    </html>
  );
}
