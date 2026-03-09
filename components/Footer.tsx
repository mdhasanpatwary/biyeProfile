import { Logo } from "@/components/Logo"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 md:py-16 border-t border-border-muted/50 bg-background print:hidden">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col items-start gap-8">
          <Logo />
          <p className="text-[12px] font-medium text-foreground-muted leading-relaxed max-w-[280px]">
            Create, manage, and securely share your marriage biodata online with a professional digital profile and downloadable PDF.
          </p>
          <div className="mt-12 text-[11px] font-mono text-foreground/50 uppercase tracking-widest">
            Established 2026. <br /> All Rights Reserved.
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">Platform</span>
            <Link href="/create" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Create Biodata</Link>
            <Link href="/biodata" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Search Biodatas</Link>
            <Link href="/pricing" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Pricing</Link>
          </div>

          <div className="flex flex-col gap-6">
            <span className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">Institutional</span>
            <Link href="/dashboard" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Dashboard</Link>
            <Link href="/about" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">About Us</Link>
            <Link href="/contact" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Contact Us</Link>
          </div>

          <div className="flex flex-col gap-6">
            <span className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">Registry</span>
            <Link href="#" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Private Links</Link>
            <Link href="#" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">PDF Export</Link>
            <Link href="#" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Verification</Link>
          </div>

          <div className="flex flex-col gap-6">
            <span className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">Legal</span>
            <Link href="#" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Privacy Policy</Link>
            <Link href="#" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Terms of Use</Link>
            <Link href="#" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
