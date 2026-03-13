import { Logo } from "@/components/Logo"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="pt-16 pb-8 md:pt-20 md:pb-10 border-t border-border-muted/50 bg-background print:hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-12 mb-16 md:mb-20">
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col items-start gap-8">
            <Logo />
            <p className="text-[13px] font-medium text-foreground-muted leading-relaxed max-w-[300px]">
              <span className="text-foreground font-bold">BiyeProfile</span> is a secure, professional platform for creating and managing digital marriage biodata. We help individuals present their personal, educational, and family backgrounds with clarity and privacy for matrimonial introductions.
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">Platform</h3>
              <Link href="/create" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Create</Link>
              <Link href="/biodata" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Directory</Link>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">Resources</h3>
              <Link href="/#knowledge" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Biodata Guide</Link>
              <Link href="/biodata" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Public Examples</Link>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">Account</h3>
              <Link href="/dashboard" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">Dashboard</Link>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">Legal</h3>
              <span className="text-[12px] font-bold text-foreground/30 uppercase tracking-tight cursor-not-allowed select-none" title="Coming soon">Privacy Policy</span>
              <span className="text-[12px] font-bold text-foreground/30 uppercase tracking-tight cursor-not-allowed select-none" title="Coming soon">Terms of Use</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-10 border-t border-border-muted/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest text-center md:text-left">
            &copy; {new Date().getFullYear()} BiyeProfile. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest text-center md:text-right">
              Established 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
