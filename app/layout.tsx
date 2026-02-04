import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
// import SoftBackdrop from "@/components/SoftBackdrop";
import "../styles/globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hirrd-jobportal.vercel.app"),
  title: {
    default: "Hirrd - Job Portal | Find Your Dream Job & Hire Top Talent",
    template: "%s | Hirrd - Job Portal",
  },
  description:
    "Hirrd is the ultimate job portal connecting job seekers with top recruiters. Find full-time, part-time, and remote jobs. Hire the best talent efficiently.",
  keywords: [
    "Hirrd",
    "job portal",
    "hiring",
    "jobs",
    "recruitment",
    "career",
    "employment",
    "work from home",
    "remote jobs",
    "tech jobs",
  ],
  authors: [{ name: "Hirrd Team" }],
  creator: "Hirrd",
  publisher: "Hirrd",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hirrd-jobportal.vercel.app",
    title: "Hirrd - Job Portal | Find Your Dream Job",
    description:
      "Join Hirrd to discover thousands of job opportunities or hire the best professionals. Your next career move starts here.",
    siteName: "Hirrd",
    images: [
      {
        url: "/og-image.png", // We should ensure this exists or use a default
        width: 1200,
        height: 630,
        alt: "Hirrd Job Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hirrd - Job Portal",
    description: "Find your dream job or hire top talent on Hirrd.",
    creator: "@hirrd", // Placeholder
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/logo-white.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo-white.png",
        type: "image/svg+xml",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        {/* <SoftBackdrop /> */}
        <Analytics />
      </body>
    </html>
  );
}
