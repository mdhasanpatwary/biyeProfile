"use client"

import { useState } from "react"
import { BiodataForm } from "./BiodataForm"
import { BiodataPreview } from "./BiodataPreview"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

export function BiodataEditor({
  initialData,
  username,
  initialIsPublic,
}: {
  initialData: Partial<BiodataFormValues>
  username: string
  initialIsPublic: boolean
}) {
  const [formData, setFormData] = useState(initialData)
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit")
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)
  const [language, setLanguage] = useState<"en" | "bn">((initialData.language as "en" | "bn") || "en")

  const handleVisibilityToggle = async () => {
    setIsUpdatingVisibility(true)
    try {
      const res = await fetch("/api/biodata/visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !isPublic }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to update privacy")
        return
      }
      setIsPublic(data.isPublic)
      toast.success(data.isPublic ? "Profile is now public" : "Profile is now private")
    } catch {
      toast.error("Failed to update privacy")
    } finally {
      setIsUpdatingVisibility(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start relative pb-24 lg:pb-0 w-full max-w-full overflow-hidden">
      {/* Mobile Preview Exit Button - Only shows when in preview mode */}
      {mobileView === "preview" && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
          <Button
            onClick={() => setMobileView("edit")}
            className="px-8 py-3.5 bg-black text-white font-black rounded-2xl shadow-xl shadow-gray-200 flex items-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-widest border border-gray-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Back to Edit
          </Button>
        </div>
      )}

      <div className={`flex-1 w-full bg-white rounded-[0.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 p-4 sm:p-10 min-h-screen min-w-0 ${mobileView === "preview" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-left-4 duration-500'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-50 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black">
              Edit Your Biodata
            </h1>
            <p className="text-gray-500 font-medium text-[13px] mt-1">Update your professional and personal profile</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-200 transition-all hover:border-gray-300">
              <span className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.1em] pointer-events-none">Public</span>
              <button
                onClick={handleVisibilityToggle}
                disabled={isUpdatingVisibility}
                aria-label="Toggle Public Profile"
                className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-black/10 ${isPublic ? 'bg-black shadow-[0_0_12px_rgba(0,0,0,0.15)]' : 'bg-gray-300'} ${isUpdatingVisibility ? 'opacity-40 grayscale cursor-wait' : 'active:scale-95'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${isPublic ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
            <a
              href={`/biodata/${username}`}
              target="_blank"
              className="text-xs sm:text-sm font-bold text-indigo-600 bg-indigo-50/50 px-5 py-2.5 rounded-2xl hover:bg-indigo-100 transition-all border border-indigo-100/50 flex items-center gap-2 group whitespace-nowrap h-[42px]"
            >
              View
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <div className="flex items-center bg-gray-50/50 px-2 rounded-2xl border border-gray-100/50 h-[42px] hover:border-gray-200 transition-all">
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "bn")}
                className="h-full w-20 text-[11px] font-black text-gray-600 bg-transparent border-none focus:ring-0 shadow-none cursor-pointer uppercase tracking-wider"
              >
                <option value="en">Eng</option>
                <option value="bn">বাংলা</option>
              </Select>
            </div>
          </div>
        </div>

        <BiodataForm
            initialData={initialData}
            onDataChange={(data) => setFormData(data)}
            language={language}
            mobileView={mobileView}
            onViewChange={(view) => setMobileView(view)}
        />
      </div>

      <div className={`lg:w-[420px] w-full lg:sticky lg:top-8 order-first lg:order-last min-w-0 ${mobileView === "edit" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-right-4 duration-500'}`}>
        <BiodataPreview data={formData} />
      </div>
    </div>
  )
}
