import { auth } from "@/lib/auth"
import { UserNav } from "@/components/UserNav"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Logo } from "@/components/Logo"
import { NavLinks, SignInLink } from "@/components/NavLinks"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b border-border-muted/50 bg-background/95 backdrop-blur-md sticky top-0 z-50 print:hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo Section */}
        <div className="flex items-center shrink-0">
          <Logo hideTextOnMobile />
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
          <NavLinks hasUser={!!session?.user} />

          <div className="hidden sm:block h-4 w-[1px] bg-border-muted mx-1" />

          <div className="shrink-0 flex items-center gap-2">
            <LanguageSwitcher className="h-11" />
            <ThemeToggle />
          </div>

          {session?.user ? (
            <div className="shrink-0">
              <UserNav username={(session?.user as { username?: string })?.username || session?.user?.name || "user"} />
            </div>
          ) : (
            <SignInLink />
          )}
        </div>
      </div>
    </nav>
  )
}
