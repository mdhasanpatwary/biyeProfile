"use client"

import { Logo } from "@/components/Logo"
import Link from "next/link"
import { useLanguage } from "@/components/LanguageContext"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="pt-16 pb-8 md:pt-20 md:pb-10 border-t border-border-muted/50 bg-background print:hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-12 mb-16 md:mb-20">
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col items-start gap-8">
            <Logo />
            <p className="text-[13px] font-medium text-foreground-muted leading-relaxed max-w-[300px]">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">
                {t.nav.biodatas}
              </h3>
              <Link href="/create" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">
                {t.nav.create}
              </Link>
              <Link href="/biodata" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">
                {t.footer.allBiodatas}
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">
                {t.footer.quickLinks}
              </h3>
              <Link href="/" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">
                {t.footer.home}
              </Link>
              <Link href="/biodata" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">
                {t.footer.allBiodatas}
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">
                {t.nav.dashboard}
              </h3>
              <Link href="/dashboard" className="text-[12px] font-bold text-foreground-muted hover:text-foreground transition-colors uppercase tracking-tight focus-visible:outline-none focus-visible:underline">
                {t.nav.dashboard}
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-[11px] md:text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-4">
                {t.footer.legal}
              </h3>
              <span className="text-[12px] font-bold text-foreground/40 uppercase tracking-tight select-none">
                {t.footer.privacy}
              </span>
              <span className="text-[12px] font-bold text-foreground/40 uppercase tracking-tight select-none">
                {t.footer.terms}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-10 border-t border-border-muted/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest text-center md:text-left">
            &copy; {new Date().getFullYear()} BiyeProfile. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
