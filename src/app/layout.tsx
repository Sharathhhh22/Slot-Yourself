import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { FeaturesOverlay } from "@/components/layout/FeaturesOverlay";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "SlotUrSelf | Book Doctors Instantly",
  description: "Book verified specialists and real-time appointment slots in under 60 seconds with SlotUrSelf.",
  openGraph: {
    title: "SlotUrSelf | Book Doctors Instantly",
    description: "Book verified specialists and real-time appointment slots in under 60 seconds.",
    url: "https://slot-yourself-7afv.vercel.app",
    siteName: "SlotUrSelf",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SlotUrSelf",
    description: "Book verified specialists and real-time appointment slots in under 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`min-h-screen bg-slate-50 antialiased`}>
        {/* 12. skip to content ↓ */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-teal-600 text-white px-4 py-2 rounded-md font-medium outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
        >
          Skip to content
        </a>
        
        {children}
        
        <FeaturesOverlay />
      </body>
    </html>
  );
}
