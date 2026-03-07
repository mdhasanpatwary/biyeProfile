import { Logo } from "@/components/Logo"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-10 md:py-10 border-t border-border bg-background print:hidden">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-10">
        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col items-start gap-6 md:gap-8">
          <Logo />
          <p className="font-mono text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] leading-relaxed max-w-[240px]">
            The definitive platform for marriage biodata documentation.
          </p>
          <div className="mt-8 md:mt-10 text-[10px] font-mono text-foreground/25 uppercase tracking-widest">
            Established 2026. <br /> All Rights Reserved.
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="flex flex-col gap-4 md:gap-6">
            <span className="font-mono text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-2">Platform</span>
            <Link href="/create" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Create Biodata</Link>
            <Link href="/biodata" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Search Biodatas</Link>
            <Link href="/pricing" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Pricing</Link>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <span className="font-mono text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-2">Institutional</span>
            <Link href="/dashboard" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Dashboard</Link>
            <Link href="/about" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">About Us</Link>
            <Link href="/contact" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Contact Us</Link>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <span className="font-mono text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-2">Registry</span>
            <Link href="#" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Private Links</Link>
            <Link href="#" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">PDF Export</Link>
            <Link href="#" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Verification</Link>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <span className="font-mono text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-2">Legal</span>
            <Link href="#" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Privacy Policy</Link>
            <Link href="#" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Terms of Use</Link>
            <Link href="#" className="text-[11px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
