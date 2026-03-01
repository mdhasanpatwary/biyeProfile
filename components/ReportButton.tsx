"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function ReportButton({ username }: { username: string }) {
  const [reporting, setReporting] = useState(false)
  const router = useRouter()

  const handleReport = async () => {
    if (!confirm("Are you sure you want to report this profile? It will be placed under review.")) return

    setReporting(true)
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      })

      if (res.ok) {
        alert("Profile has been reported successfully and is now under review.")
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to report profile.")
      }
    } catch {
      alert("An error occurred.")
    } finally {
      setReporting(false)
    }
  }

  return (
    <button
      onClick={handleReport}
      disabled={reporting}
      className="text-sm font-medium text-gray-500 hover:text-red-600 hover:underline disabled:opacity-50"
    >
      {reporting ? "Reporting..." : "Report Profile"}
    </button>
  )
}
