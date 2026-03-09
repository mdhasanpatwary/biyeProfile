"use client"

import { useState, useCallback } from "react"
import { BiodataForm } from "./BiodataForm"
import { BiodataPreview } from "./BiodataPreview"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "./LanguageSwitcher"
import Link from "next/link"

export function BiodataEditor({
  initialData,
  username,
}: {
  initialData: Partial<BiodataFormValues>
  username: string
  initialIsPublic: boolean
}) {
  const [formData, setFormData] = useState(initialData)
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit")
  const [language, setLanguage] = useState<"en" | "bn">((initialData.language as "en" | "bn") || "en")

  const handleDataChange = useCallback((data: BiodataFormValues) => {
    setFormData(data)
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative pb-12 lg:pb-0 w-full max-w-full overflow-hidden">
      {/* Mobile Preview Exit Button */}
      {mobileView === "preview" && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
          <Button
            variant="primary"
            onClick={() => setMobileView("edit")}
            className="px-8 py-4 shadow-2xl shadow-foreground/10 flex items-center gap-3 active:scale-95 transition-all outline-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Back to Edit
          </Button>
        </div>
      )}

      <div className={`flex-1 w-full bg-background rounded-none border border-border-muted p-6 md:p-8 min-w-0 ${mobileView === "preview" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-left-4 duration-500'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 md:gap-8 pb-10 border-b border-border-muted">
          <div>
            <h1 className="text-4xl font-serif text-foreground tracking-tight">
              Edit Your Biodata
            </h1>
            <p className="text-foreground-muted font-mono text-[10px] uppercase tracking-[0.2em] mt-3">Document Management</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href={`/biodata/${username}`}>
              <Button variant="outline" className="flex items-center gap-2 group text-[10px] h-[42px]">
                <svg className="w-4 h-4 text-foreground-muted group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline-block">View Biodata</span>
              </Button>
            </Link>
            <LanguageSwitcher
              language={language}
              setLanguage={setLanguage}
              className="h-[42px]"
            />
          </div>
        </div>

        <BiodataForm
          initialData={initialData}
          onDataChange={handleDataChange}
          language={language}
          mobileView={mobileView}
          onViewChange={setMobileView}
        />
      </div>

      <div className={`lg:w-[420px] w-full order-first lg:order-last min-w-0 ${mobileView === "edit" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-right-4 duration-500'}`}>
        <BiodataPreview data={formData} />
      </div>
    </div>
  )
}
