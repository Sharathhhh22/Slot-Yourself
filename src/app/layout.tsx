import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

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
        {children}
      </body>
    </html>
  );
}
