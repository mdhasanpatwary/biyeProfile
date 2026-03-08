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
    <div className="min-h-screen bg-background flex items-center justify-center py-10 md:py-16 px-4">
      <div className="max-w-md w-full space-y-12 bg-background p-10 md:p-12 shadow-2xl rounded-none border border-border-muted relative overflow-hidden">
        {/* Subtle accent corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-accent opacity-50 -mr-8 -mt-8 rotate-45" />

        <div className="relative z-10">
          <h2 className="mt-6 text-center text-4xl font-serif italic text-foreground tracking-tight">
            The Registry.
          </h2>
          <p className="mt-4 text-center text-[10px] font-mono font-black text-foreground-muted uppercase tracking-[0.3em]">
            Choose your identification
          </p>
        </div>
        <SetupForm />
      </div>
    </div>
  )
}
