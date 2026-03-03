"use client"

import { useState } from "react"
import { BiodataForm } from "./BiodataForm"
import { BiodataPreview } from "./BiodataPreview"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Button } from "@/components/ui/button"

export function BiodataEditor({
  initialData,
}: {
  initialData: Partial<BiodataFormValues>
  username: string
  initialIsPublic: boolean
}) {
  const [formData, setFormData] = useState(initialData)
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit")
  const [language, setLanguage] = useState<"en" | "bn">((initialData.language as "en" | "bn") || "en")

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start relative pb-24 lg:pb-0 w-full max-w-full overflow-hidden">
      {/* Mobile Preview Exit Button */}
      {mobileView === "preview" && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
          <Button
            onClick={() => setMobileView("edit")}
            className="px-8 py-3.5 bg-black text-white font-black rounded-2xl shadow-xl shadow-gray-200 flex items-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-widest border border-gray-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Back to Edit
          </Button>
        </div>
      )}

      <div className={`flex-1 w-full bg-white rounded-[0.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 p-4 sm:p-6 min-h-screen min-w-0 ${mobileView === "preview" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-left-4 duration-500'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black">
              Edit Your Biodata
            </h1>
            <p className="text-gray-500 font-medium text-[13px] mt-1">Update your professional and personal profile</p>
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-sm h-[42px]">
            <button
              onClick={() => setLanguage("en")}
              className={`px-4 h-full rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${language === 'en' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Eng
            </button>
            <button
              onClick={() => setLanguage("bn")}
              className={`px-4 h-full rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${language === 'bn' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              বাংলা
            </button>
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
