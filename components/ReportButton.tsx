"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ReportButton({ biodataId }: { biodataId: string }) {
  const [isReporting, setIsReporting] = useState(false)
  const [hasReported, setHasReported] = useState(false)

  const handleReport = async () => {
    if (hasReported) return

    const reason = prompt("Please provide a reason for reporting (e.g., spam, offensive content, fake profile):")
    if (reason === null) return // User cancelled
    if (reason.trim() === "") {
      toast.error("Reason is required to report.")
      return
    }

    setIsReporting(true)
    try {
      const res = await fetch(`/api/biodata/${biodataId}/report`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      })

      if (res.ok) {
        toast.success("Biodata reported. Admin will review it.")
        setHasReported(true)
      } else {
        toast.error("Failed to report biodata.")
      }
    } catch {
      toast.error("An error occurred.")
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isReporting || hasReported}
      onClick={handleReport}
      aria-busy={isReporting}
      aria-pressed={hasReported}
      className={`text-[10px] font-mono font-black uppercase tracking-widest gap-2 ${hasReported ? 'text-green-600' : 'text-foreground-muted hover:text-red-500 hover:bg-red-50'}`}
    >
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {hasReported ? "Reported" : "Report Profile"}
    </Button>
  )
}
