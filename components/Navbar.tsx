import Link from "next/link"
import { auth } from "@/lib/auth"
import { Logo } from "@/components/Logo"
import { UserNav } from "@/components/UserNav"
import { DevLoginButton } from "@/components/DevLoginButton"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50 print:hidden h-24 flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/biodata"
              className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-black/50 hover:text-black transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/create"
              className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-black/50 hover:text-black transition-colors"
            >
              Create
            </Link>
            {session?.user && (
              <Link
                href="/dashboard"
                className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-black border-b border-black hover:pb-1 transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {session?.user ? (
            <UserNav username={session.user.username || session.user.name || "user"} />
          ) : (
            <div className="flex items-center gap-8">
              {process.env.NODE_ENV === "development" && <DevLoginButton variant="compact" />}
              <Link
                href="/api/auth/signin"
                className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-black border-b border-black hover:pb-1 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
