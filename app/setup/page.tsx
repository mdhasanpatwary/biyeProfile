import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SetupForm } from "@/components/SetupForm"

export default async function SetupPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  if (session.user.username) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow rounded-lg border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Choose your username
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This will be your public profile link and cannot be changed later.
          </p>
        </div>
        <SetupForm />
      </div>
    </div>
  )
}
