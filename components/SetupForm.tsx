"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SetupForm() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const checkRes = await fetch(`/api/username/check?username=${username}`)
      const checkData = await checkRes.json()

      if (!checkData.available) {
        setError(checkData.error || "Username is not available")
        setLoading(false)
        return
      }

      const res = await fetch("/api/username/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()
      if (data.success) {
        window.location.href = "/dashboard" // Hard reload to refresh the session fully
      } else {
        setError(data.error || "Failed to set username")
      }
    } catch {
      setError("An error occurgray")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="username" className="sr-only">Username</Label>
        <div className="relative rounded-none shadow-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-foreground-muted sm:text-sm">
            biyeprofile.com/
          </span>
          <Input
            id="username"
            name="username"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full pl-[115px] px-3 py-2 border border-border-muted placeholder-foreground-muted/50 text-foreground focus:outline-none focus:ring-foreground focus:border-foreground sm:text-sm bg-background"
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
          />
        </div>
      </div>

      {error && <p className="text-foreground-muted text-sm text-center">{error}</p>}

      <div>
        <Button
          type="submit"
          disabled={loading || username.length < 3}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-none text-background bg-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  )
}
