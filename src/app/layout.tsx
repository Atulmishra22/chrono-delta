import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chrono-delta-atul.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ChronoDelta - Visual Time Management & Schedule Intelligence",
    template: "%s | ChronoDelta",
  },
  description:
    "An authoritative, precision time management platform comparing elapsed time against actual work progress.",
  keywords: [
    "ChronoDelta",
    "schedule delta",
    "time variance",
    "visual time tracking",
    "countdown intelligence",
    "project management",
  ],
  authors: [{ name: "Atul Mishra" }],
  creator: "Atul Mishra",
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
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23182442'/%3E%3Cpath d='M32 14 L50 48 L14 48 Z' fill='none' stroke='%2300E599' stroke-width='5' stroke-linejoin='round'/%3E%3Ccircle cx='32' cy='35' r='4' fill='%23FFFFFF'/%3E%3C/svg%3E",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "ChronoDelta - Visual Time Management & Schedule Intelligence",
    description:
      "Precision time management platform comparing elapsed time against actual work progress.",
    siteName: "ChronoDelta",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChronoDelta - Schedule Intelligence",
    description:
      "Visual time management platform comparing elapsed time against actual work progress.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23182442'/%3E%3Cpath d='M32 14 L50 48 L14 48 Z' fill='none' stroke='%2300E599' stroke-width='5' stroke-linejoin='round'/%3E%3Ccircle cx='32' cy='35' r='4' fill='%23FFFFFF'/%3E%3C/svg%3E"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

