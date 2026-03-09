import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { GuestBiodataEditor } from "@/components/GuestBiodataEditor"

export const metadata = {
  title: "Create Biodata | BiyeProfile",
  description: "Create your marriage biodata in minutes.",
}

export default async function CreatePage() {
  const session = await auth()

  // If logged in, redirect to dashboard as they should use the dashboard editor
  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="bg-background">
      <GuestBiodataEditor />
    </div>
  )
}
