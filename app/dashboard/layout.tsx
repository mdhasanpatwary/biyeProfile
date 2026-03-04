import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

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
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
