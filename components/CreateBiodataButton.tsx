"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/LanguageContext"

export function CreateBiodataButton() {
  const { t, language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/biodata", { method: "POST" })
      if (res.ok) {
        toast.success(language === "bn" ? "বায়োডাটা সফলভাবে তৈরি হয়েছে" : "Biodata created successfully")
        router.push("/dashboard/edit")
      } else {
        const error = await res.json()
        toast.error(error.error || (language === "bn" ? "বায়োডাটা তৈরি করতে ব্যর্থ হয়েছে" : "Failed to create biodata"))
        setLoading(false)
      }
    } catch {
      toast.error(language === "bn" ? "সংযোগ ব্যর্থ হয়েছে" : "Failed to connect")
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
      {loading ? (language === "bn" ? "তৈরি হচ্ছে..." : "Creating...") : t.common.createBiodata}
    </Button>
  )
}
