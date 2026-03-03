import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { UserNav } from "@/components/UserNav"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  if (!session.user.username) {
    redirect("/setup")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-full overflow-x-hidden">
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
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
                  href="/dashboard"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
                >
                  My Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Mobile Explore Link - Visible on mobile but compact */}
              <Link
                href="/biodata"
                className="md:hidden text-[9px] font-black uppercase tracking-widest text-black bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
              >
                Browse
              </Link>
              <UserNav username={session.user.username} />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
