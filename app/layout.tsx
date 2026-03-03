import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "BiyeProfile | Premium Marriage Biodata Builder",
  description: "Create, manage, and share secure marriage biodata profiles with privacy controls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="max-w-full overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-full overflow-x-hidden`}
      >
        {children}
        <Toaster position="top-center" toastOptions={{
          style: {
            background: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '1rem',
            fontFamily: 'inherit'
          }
        }} />
      </body>
    </html>
  );
}
