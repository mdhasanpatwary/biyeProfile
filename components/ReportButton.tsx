"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Modal } from "@/components/ui/modal"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const REPORT_REASONS = [
  "Fake profile",
  "Inappropriate information",
  "Misleading biodata",
  "Harassment or abuse",
  "Other",
]

export function ReportButton({ biodataId, initialHasReported = false }: { biodataId: string, initialHasReported?: boolean }) {
  const [isReporting, setIsReporting] = useState(false)
  const [hasReported, setHasReported] = useState(initialHasReported)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [otherReason, setOtherReason] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")

  const handleOpenModal = () => {
    if (hasReported) {
      toast.info("You have already reported this profile.")
      return
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Reset form states if not reported
    if (!hasReported) {
      setSelectedReason("")
      setOtherReason("")
      setAdditionalDetails("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedReason) {
      toast.error("Please select a reason.")
      return
    }

    if (selectedReason === "Other" && !otherReason.trim()) {
      toast.error("Please describe why you are reporting this profile.")
      return
    }

    const finalReason = selectedReason === "Other" ? otherReason : selectedReason

    setIsReporting(true)
    try {
      const res = await fetch(`/api/biodata/${biodataId}/report`, {
        method: "POST",
        body: JSON.stringify({
          reason: finalReason,
          details: additionalDetails
        }),
      })

      if (res.ok) {
        toast.success("Biodata reported. Admin will review it.")
        setHasReported(true)
        handleCloseModal()
      } else if (res.status === 409) {
        toast.info("You have already reported this profile.")
        setHasReported(true)
        handleCloseModal()
      } else {
        toast.error("Failed to report biodata.")
      }
    } catch {
      toast.error("An error occurred.")
    } finally {
      setIsReporting(false)
    }
  }

  const isSubmitDisabled = isReporting || !selectedReason || (selectedReason === "Other" && !otherReason.trim())

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        disabled={isReporting || hasReported}
        onClick={handleOpenModal}
        aria-busy={isReporting}
        aria-pressed={hasReported}
        className={`text-[10px] font-mono font-black uppercase tracking-widest ${hasReported
          ? 'text-green-600'
          : 'text-foreground-muted hover:text-red-500 hover:bg-red-50'
          }`}
      >
        <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {hasReported ? "Reported" : "Report Profile"}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Report Profile"
        description="Please tell us why you are reporting this biodata. Your report will be reviewed by our administrators."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground font-semibold mb-3 flex">Reason for reporting</Label>
            <RadioGroup>
              {REPORT_REASONS.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={reason}
                    id={`reason-${reason}`}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                  />
                  <Label htmlFor={`reason-${reason}`} className="text-foreground font-normal cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === "Other" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Label htmlFor="other-reason">Please describe (required)</Label>
              <Textarea
                id="other-reason"
                placeholder="Briefly describe the issue..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="additional-details">Additional details (optional)</Label>
            <Textarea
              id="additional-details"
              placeholder="Any other information that might help us..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={isReporting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
            >
              {isReporting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
