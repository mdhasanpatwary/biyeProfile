import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Only allow admin users
  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
