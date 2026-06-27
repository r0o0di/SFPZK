import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#7bf1a8",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sfpzk.vercel.app"),

  title: "SFPZK",

  description: "SFPZK - Saziya Fêrkirin û Parastina Zimanê Kurdî",

  keywords: [
    "SFPZK",
    "Saziya",
    "Fêrkirin",
    "Zimanê Kurdî",
    "Kurdish Language",
    "Learning",
    "Education",
    "Kurmanji",
  ],

  other: {
    google: "notranslate",
  },

  openGraph: {
    locale: "ku_IQ",
    siteName: "SFPZK",
    url: "https://sfpzk.vercel.app",
    type: "website",
    title: "SFPZK",
    description: "SFPZK - Saziya Fêrkirin û Parastina Zimanê Kurdî",
    images: [
      {
        url: "/sfpzk-logo.png",
        width: 1200,
        height: 630,
        alt: "SFPZK",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SFPZK",
    description: "SFPZK - Saziya Fêrkirin û Parastina Zimanê Kurdî",
    images: ["/sfpzk-logo.png"],
  },

  alternates: {
    canonical: "https://sfpzk.vercel.app",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ku" className={`scrollbar-gutter-stable overflow-y-auto`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-gray-900 selection:bg-primary selection:text-primary-foreground`}
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
