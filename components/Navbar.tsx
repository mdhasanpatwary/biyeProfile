import Link from "next/link"
import { auth } from "@/lib/auth"
import { UserNav } from "@/components/UserNav"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Logo } from "@/components/Logo"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50 print:hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-4 sm:gap-12 shrink-0">
          <Logo />

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            <Link
              href="/biodata"
              className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted hover:text-foreground transition-all"
            >
              Search Biodatas
            </Link>
            <Link
              href="/create"
              className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted hover:text-foreground transition-all"
            >
              Create Biodata
            </Link>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 sm:gap-6 ml-auto">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="hidden sm:block h-4 w-[1px] bg-border-muted" />
          <div className="flex items-center gap-3 sm:gap-8">
          {session?.user ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/dashboard"
                className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-foreground border-b border-foreground whitespace-nowrap"
              >
                Dashboard
              </Link>
              <UserNav username={(session?.user as { username?: string })?.username || session?.user?.name || "user"} />
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-8">
              <Link
                href="/api/auth/signin"
                className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-foreground border border-foreground px-3 sm:px-6 py-2 sm:py-2.5 hover:bg-foreground hover:text-background transition-all whitespace-nowrap"
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
