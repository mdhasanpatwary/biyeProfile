"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CreateBiodataButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/biodata", { method: "POST" })
      if (res.ok) {
        toast.success("Biodata created successfully")
        router.push("/dashboard/edit")
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to create biodata")
        setLoading(false)
      }
    } catch {
      toast.error("Failed to connect")
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCreate}
      disabled={loading}
      className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
    >
      {loading ? "Creating..." : "Create My Biodata"}
    </Button>
  )
}
