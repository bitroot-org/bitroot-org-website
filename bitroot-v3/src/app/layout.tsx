import type { Metadata } from "next";
import {
  Funnel_Display,
  Geist,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { PageFadeReset } from "@/components/ui/FadeLink";
import SignupGatePopup from "@/components/gate/SignupGatePopup";
import { siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const funnelDisplay = Funnel_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Tools, Kits & Guides for Startup Founders — Bitroot",
    template: "%s · Bitroot",
  },
  description:
    "Free tools, kits, guides and AI resources for founders shipping their first product. No paywall, no email gate. Built by founders, for founders.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Free Tools, Kits & Guides for Startup Founders — Bitroot",
    description:
      "Free tools, kits, guides and AI resources for founders shipping their first product. No paywall, no email gate. Built by founders, for founders.",
    url: "./",
    siteName,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Free tools kits and guides for startup founders — Bitroot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@BitrootIndia",
    images: [
      {
        url: "/og.png",
        alt: "Free tools kits and guides for startup founders — Bitroot",
      },
    ],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/bitroot-logo.svg`,
  sameAs: [
    "https://github.com/bitroot-org",
    "https://x.com/BitrootIndia",
    "https://www.bitroot.club",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${funnelDisplay.variable} ${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-screen text-ink antialiased font-sans flex flex-col">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={webSiteJsonLd} />
        <PageFadeReset />
        <div className="page-bg" aria-hidden />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <SignupGatePopup />
      </body>
    </html>
  );
}
