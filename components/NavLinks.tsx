"use client"

import Link from "next/link"
import { useLanguage } from "@/components/LanguageContext"

export function NavLinks({ hasUser }: { hasUser: boolean }) {
  const { t } = useLanguage()

  return (
    <>
      <Link
        href="/biodata"
        className="flex items-center gap-2 h-11 min-w-[44px] px-3 border border-border-muted hover:border-foreground transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 shrink-0"
        aria-label={t.nav.biodatas}
      >
        <div className="flex items-center justify-center w-4 h-4 relative">
          <svg aria-hidden="true" className="w-4 h-4 text-foreground transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-foreground hidden sm:block">
          {t.nav.biodatas}
        </span>
      </Link>

      {!hasUser ? (
        <Link
          href="/create"
          className="flex items-center gap-2 h-11 min-w-[44px] px-3 border border-border-muted hover:border-foreground transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 shrink-0"
          aria-label={t.nav.create}
        >
          <div className="flex items-center justify-center w-4 h-4 relative">
            <svg aria-hidden="true" className="w-4 h-4 text-foreground transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-foreground hidden lg:block">
            {t.nav.create}
          </span>
        </Link>
      ) : (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 h-11 min-w-[44px] px-3 border border-border-muted hover:border-foreground transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 shrink-0"
          aria-label={t.nav.dashboard}
        >
          <div className="flex items-center justify-center w-4 h-4 relative">
            <svg aria-hidden="true" className="w-4 h-4 text-foreground transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />
            </svg>
          </div>
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-foreground hidden lg:block">
            {t.nav.dashboard}
          </span>
        </Link>
      )}
    </>
  )
}

export function SignInLink() {
  const { t } = useLanguage()

  return (
    <Link
      href="/api/auth/signin"
      className="font-mono text-[11px] md:text-[12px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-foreground border border-foreground px-3 sm:px-6 h-11 min-w-[44px] flex items-center justify-center hover:bg-foreground hover:text-background transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 ml-1 shrink-0"
    >
      {t.nav.signIn}
    </Link>
  )
}
