import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Only allow admin users
  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-xl font-bold">BiyeProfile Admin</span>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-gray-200">Home</Link>
              <Link href="/dashboard" className="hover:text-gray-200">Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
