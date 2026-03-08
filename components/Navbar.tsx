import Link from "next/link"
import { auth } from "@/lib/auth"
import { UserNav } from "@/components/UserNav"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Logo } from "@/components/Logo"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50 print:hidden">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-6 md:gap-12 shrink-0">
          <Logo hideTextOnMobile />

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-12">
            <Link
              href="/biodata"
              className="font-mono text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-foreground-muted hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
            >
              Search Biodatas
            </Link>
            <Link
              href="/create"
              className="font-mono text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-foreground-muted hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
            >
              Create Biodata
            </Link>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4 md:gap-8 ml-auto">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="hidden sm:block h-4 w-[1px] bg-border-muted" />
          <div className="flex items-center gap-6 md:gap-12">
          {session?.user ? (
            <div className="flex items-center gap-6 md:gap-8">
              <Link
                href="/dashboard"
                className="font-mono text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-foreground border-b border-foreground whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
              >
                Dashboard
              </Link>
              <UserNav username={(session?.user as { username?: string })?.username || session?.user?.name || "user"} />
            </div>
          ) : (
            <div className="flex items-center gap-6 md:gap-12">
              <Link
                href="/api/auth/signin"
                className="font-mono text-[11px] md:text-[12px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-foreground border border-foreground px-3 sm:px-6 py-2 sm:py-3 hover:bg-foreground hover:text-background transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
              >
                Sign In
              </Link>
            </div>
          )}
          </div>
          {/* Mobile Theme Toggle (only icon/compact) */}
          <div className="sm:hidden scale-90">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
