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
      variant="primary"
      onClick={handleCreate}
      disabled={loading}
      className="px-8 py-6 font-bold text-xs"
    >
      {loading ? "Creating..." : "Create My Biodata"}
    </Button>
  )
}
