import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
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
            <Logo />
            <UserNav username={session.user.username} />
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
