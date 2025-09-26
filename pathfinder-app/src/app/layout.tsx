import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import FloatingAuthCard from '@/components/auth/FloatingAuthCard';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keel Stone Pathfinder | Find Your Path to Inner Steadiness",
  description: "Break free from digital overwhelm with a personalized 21-day practice plan. Choose your path—Christian or secular—and discover daily habits that bring calm, clarity, and purpose.",
  keywords: ["mindfulness", "spiritual growth", "digital wellness", "contemplative practice", "inner peace", "Christian meditation", "secular wisdom"],
  authors: [{ name: "The Keel Stone" }],
  creator: "The Keel Stone",
  publisher: "The Keel Stone",
  icons: {
    icon: [
      { url: "/keel-stone-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/keel-stone-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/keel-stone-logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/keel-stone-logo.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://keelstone.com",
    siteName: "Keel Stone Pathfinder",
    title: "Keel Stone Pathfinder | Find Your Path to Inner Steadiness",
    description: "Break free from digital overwhelm with a personalized 21-day practice plan. Choose your path—Christian or secular—and discover daily habits that bring calm, clarity, and purpose.",
    images: [
      {
        url: "/keel-stone-logo.png",
        width: 1200,
        height: 630,
        alt: "Keel Stone Pathfinder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keel Stone Pathfinder | Find Your Path to Inner Steadiness",
    description: "Break free from digital overwhelm with a personalized 21-day practice plan.",
    images: ["/keel-stone-logo.png"],
    creator: "@keelstone",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/keel-stone-logo.png" sizes="any" />
        <link rel="icon" href="/keel-stone-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/keel-stone-logo.png" />
        <meta name="theme-color" content="#1F3A56" />
        <meta name="msapplication-TileColor" content="#1F3A56" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <FloatingAuthCard />
        </AuthProvider>
      </body>
    </html>
  );
}
