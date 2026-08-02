"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useLanguage } from "@/components/LanguageContext"

export function VisibilityToggle({ initialIsPublic }: { initialIsPublic: boolean }) {
  const { t, language } = useLanguage()
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async () => {
    setIsUpdating(true)
    try {
      const res = await fetch("/api/biodata/visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !isPublic }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || (language === "bn" ? "প্রাইভেসি পরিবর্তন ব্যর্থ হয়েছে" : "Failed to update privacy"), {
          style: { background: "var(--foreground)", color: "var(--background)", borderRadius: "0" }
        })
        return
      }
      setIsPublic(data.isPublic)
      toast.success(
        data.isPublic
          ? (language === "bn" ? "প্রোফাইল এখন পাবলিক" : "Profile is now public")
          : (language === "bn" ? "প্রোফাইল এখন প্রাইভেট" : "Profile is now private"),
        { style: { background: "var(--foreground)", color: "var(--background)", borderRadius: "0" } }
      )
    } catch {
      toast.error(language === "bn" ? "প্রাইভেসি পরিবর্তন ব্যর্থ হয়েছে" : "Failed to update privacy", {
        style: { background: "var(--foreground)", color: "var(--background)", borderRadius: "0" }
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-6 bg-background rounded-none border border-border-muted shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] mb-1">
            {t.dashboard.profileStatus}
          </span>
          <span className={`text-sm font-bold ${isPublic ? 'text-foreground' : 'text-foreground-muted'}`}>
            {isPublic
              ? (language === "bn" ? "পাবলিক / সবার জন্য দৃশ্যমান" : "Visible to everyone")
              : (language === "bn" ? "প্রাইভেট / লুকানো" : "Private / Hidden")}
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          role="switch"
          aria-checked={isPublic}
          aria-busy={isUpdating}
          aria-label={isPublic ? "Profile is public" : "Profile is private"}
          className={`group relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-none border-4 border-transparent transition-all duration-300 ease-in-out focus:outline-none ${
            isPublic ? 'bg-foreground shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'bg-accent'
          } ${isUpdating ? 'opacity-40 grayscale cursor-wait' : 'active:scale-95'}`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-none bg-background shadow-xl ring-0 transition duration-300 ease-in-out ${
              isPublic ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {!isPublic && (
        <div className="px-6 py-4 bg-accent/50 rounded-none border border-border-muted">
          <p className="text-[10px] font-bold text-foreground-muted leading-relaxed uppercase tracking-tight">
            {t.dashboard.visibilityNotice}
          </p>
        </div>
      )}
    </div>
  )
}
