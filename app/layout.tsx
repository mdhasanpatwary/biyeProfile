import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biye-profile.vercel.app"),
  title: "BiyeProfile | Free Marriage Biodata Maker Online",
  description: "The best free marriage biodata maker online. Create, manage, and securely share your marriage biodata with complete privacy controls and professional PDF export.",
  keywords: ["marriage biodata", "free marriage biodata maker", "free marriage biodata maker online", "marriage biodata online", "biodata for marriage", "marriage biodata builder"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "BiyeProfile | Free Marriage Biodata Maker Online",
    description: "The best free marriage biodata maker online. Create, manage, and securely share your marriage biodata with complete privacy controls and professional PDF export.",
    url: "https://biye-profile.vercel.app",
    siteName: "BiyeProfile",
  },
  twitter: {
    card: "summary_large_image",
    title: "BiyeProfile | Free Marriage Biodata Maker Online",
    description: "The best free marriage biodata maker online. Create and download your marriage biodata as a professional PDF with complete privacy controls.",
  },
};

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GuestTracker } from "../components/GuestTracker";

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BiyeProfile",
    "url": "https://biye-profile.vercel.app",
    "logo": "https://biye-profile.vercel.app/icon.svg",
    "description": "Premium Marriage Biodata Builder offering secure, professional digital profiles and PDF exports.",
  };

  return (
    <html lang="en" className="max-w-full overflow-x-hidden scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased max-w-full overflow-x-hidden flex flex-col min-h-screen bg-background text-foreground pb-16 lg:pb-0`}
      >
        <Providers>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <GuestTracker />
            <Navbar />
            <main className="flex-1 bg-background">
              {children}
            </main>
            <Footer />
            <Toaster position="top-center" toastOptions={{
              style: {
                background: 'var(--foreground)',
                color: 'var(--background)',
                border: '1px solid var(--border-muted)',
                borderRadius: '0',
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }
            }} />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>

        </Providers>

      </body>
    </html>
  );
}
