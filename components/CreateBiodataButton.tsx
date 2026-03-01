"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateBiodataButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/biodata", { method: "POST" })
      if (res.ok) {
        router.push("/dashboard/edit")
      } else {
        const error = await res.json()
        alert(error.error || "Failed to create biodata")
        setLoading(false)
      }
    } catch {
      alert("Failed to connect")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
    >
      {loading ? "Creating..." : "Create My Biodata"}
    </button>
  )
}
