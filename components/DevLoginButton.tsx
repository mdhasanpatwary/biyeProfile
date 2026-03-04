"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DevLoginButton({
  variant = "full"
}: {
  variant?: "full" | "compact"
}) {
  const [loading, setLoading] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== "development") return null;

  const handleDevLogin = async () => {
    setLoading(true)
    try {
      await signIn("credentials", { callbackUrl: "/dashboard", redirect: true })
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  if (variant === "compact") {
    return (
      <Button
        onClick={handleDevLogin}
        disabled={loading}
        className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-5 py-2.5 rounded-full hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-2 group cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <div className="w-3 h-3 border-2 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        )}
        {loading ? "..." : "Dev Login"}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleDevLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-4 bg-white border border-black/10 text-black px-8 py-4 rounded-2xl font-black hover:bg-gray-50 transition-all active:scale-95 group cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5 text-black/40 group-hover:rotate-12 group-hover:text-emerald-500 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )}
      {loading ? "Logging in..." : "Code-Access Dev Login"}
    </Button>
  )
}
