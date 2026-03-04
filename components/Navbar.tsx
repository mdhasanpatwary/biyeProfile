import Link from "next/link"
import { auth } from "@/lib/auth"
import { Logo } from "@/components/Logo"
import { UserNav } from "@/components/UserNav"
import { DevLoginButton } from "@/components/DevLoginButton"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50 print:hidden h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
             <Link
                href="/biodata"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
              >
                Explore Profiles
              </Link>
              <Link
                href="/create"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
              >
                Create Biodata
              </Link>
              {session?.user && (
                <Link
                  href="/dashboard"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
                >
                  My Dashboard
                </Link>
              )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <UserNav username={session.user.username || session.user.name || "user"} />
          ) : (
            <div className="flex items-center gap-4">
              {process.env.NODE_ENV === "development" && <DevLoginButton variant="compact" />}
              <Link
                href="/api/auth/signin"
                className="text-xs font-black uppercase tracking-widest text-black border border-black/10 px-6 py-2.5 rounded-full hover:bg-gray-50 transition-all"
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
