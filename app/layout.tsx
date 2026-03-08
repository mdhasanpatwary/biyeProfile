import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
  title: "BiyeProfile | Premium Marriage Biodata Builder",
  description: "Create, manage, and share secure marriage biodata profiles with privacy controls.",
};

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="max-w-full overflow-x-hidden scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased max-w-full overflow-x-hidden flex flex-col min-h-screen bg-background text-foreground pb-16`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
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
        </ThemeProvider>
      </body>
    </html>
  );
}
