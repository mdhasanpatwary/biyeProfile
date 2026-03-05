import Link from "next/link"
import { auth } from "@/lib/auth"
import { UserNav } from "@/components/UserNav"
import { ThemeToggle } from "@/components/ThemeToggle"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50 print:hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-4 sm:gap-12 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center shrink-0">
              <span className="text-background font-serif text-xl italic mt-0.5">B</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg leading-none tracking-tight text-foreground">BiyeProfile</span>
              <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-foreground-muted mt-1 hidden min-[400px]:block">Registry Platform</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            <Link
              href="/biodata"
              className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted hover:text-foreground transition-all"
            >
              The Directory
            </Link>
            <Link
              href="/create"
              className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted hover:text-foreground transition-all"
            >
              Public Entry
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
                Archive Access
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
