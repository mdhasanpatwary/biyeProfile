"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DevLoginButton() {
  const [loading, setLoading] = useState(false)

  const handleDevLogin = async () => {
    setLoading(true)
    try {
      await signIn("credentials", { callbackUrl: "/dashboard", redirect: true })
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDevLogin}
      disabled={loading}
      className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50"
    >
      {loading ? "Logging in..." : "Dev Login"}
    </Button>
  )
}
