import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  metadataBase: new URL("https://sfpzk.com"),
  
  verification: {
    google: "v3eH3ARM0nDCQRb5qwmMQ2m4BZ56Kv0NdWOvgEOuqyQ",
  },

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
    "Saziya Fêrkirin û Parastina Zimanê Kurdî",
    "Kurdish Language Learning",
    "Kurdish Language Education",
    "kurdish online learning",
    "kurdish online course",
    "Kurdish Language Teaching and Preservation Institution",
    "تعلم اللغة الكردية",
    "تعليم اللغة الكردية",
    "مؤسسة تعليم وحماية اللغة الكردية",
    "kurdisch lernen",
    "kurdisch lernen online",
    "kurdisch online kurs",
    "Institut für den Unterricht und die Bewahrung der kurdischen Sprache"

  ],

  other: {
    google: "notranslate",
  },

  openGraph: {
    locale: "ku_IQ",
    siteName: "SFPZK",
    url: "https://sfpzk.com",
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

  // alternates: {
  //   canonical: "https://sfpzk.com",
  // },
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
