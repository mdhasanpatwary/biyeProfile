"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BiodataForm } from "./BiodataForm"
import { BiodataPreview } from "./BiodataPreview"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Button } from "@/components/ui/button"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"

const STORAGE_KEY = "guest_biodata_data"

const defaultData: Partial<BiodataFormValues> = {
  language: "en",
}

export function GuestBiodataEditor() {
  const [formData, setFormData] = useState<Partial<BiodataFormValues>>(defaultData)
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit")
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [showSignInBanner, setShowSignInBanner] = useState(true)
  const [isReadyToRender, setIsReadyToRender] = useState(false)

  // Use a separate state for initialData loaded from disk to avoid render-time ref access
  const [initialData, setInitialData] = useState<Partial<BiodataFormValues>>(defaultData)

  // Load from localStorage on mount
  useEffect(() => {
    let initialDataToSet = defaultData;
    let languageToSet: "en" | "bn" = "en";

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<BiodataFormValues>;
        initialDataToSet = parsed;
        if (parsed.language === "bn") {
          languageToSet = "bn";
        }
      }
    } catch {
      // ignore parse errors
    }

    // Set all initial states at once - this is a standard pattern for hydration from localStorage
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialData(initialDataToSet);
    setFormData(initialDataToSet);
    setLanguage(languageToSet);
    setIsReadyToRender(true);
  }, []);

  // Persist to localStorage whenever formData changes
  useEffect(() => {
    if (!isReadyToRender) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch {
      // ignore storage errors
    }
  }, [formData, isReadyToRender])

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your data? This cannot be undone.")) {
      window.localStorage.removeItem(STORAGE_KEY)
      window.location.reload()
    }
  }

  if (!isReadyToRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Sign In Banner */}
      {showSignInBanner && (
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded-sm bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-mono">
              <span className="text-white/40">Guest Mode</span> — Data is saved locally.{" "}
              <Link
                href="/api/auth/signin"
                className="underline underline-offset-4 text-white hover:text-white/80 transition-colors"
              >
                Sign in to save permanently →
              </Link>
            </p>
          </div>
          <button
            onClick={() => setShowSignInBanner(false)}
            className="shrink-0 text-white/40 hover:text-white transition-colors ml-2"
            aria-label="Dismiss banner"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 pb-8 border-b border-black/5 print:hidden">
          <div>
            <h1 className="text-4xl font-serif text-black tracking-tight">
              Create Your Biodata
            </h1>
            <p className="text-black/40 font-mono text-[10px] uppercase tracking-[0.2em] mt-2">
              Guest Mode / Temporary Session
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-50 p-1 rounded-md border border-black/5 h-[42px]">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 h-full rounded-sm text-[10px] font-mono font-black uppercase tracking-wider transition-all ${language === 'en' ? 'bg-black text-white shadow-sm' : 'text-black/30 hover:text-black'}`}
              >
                Eng
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={`px-4 h-full rounded-sm text-[10px] font-mono font-black uppercase tracking-wider transition-all ${language === 'bn' ? 'bg-black text-white shadow-sm' : 'text-black/30 hover:text-black'}`}
              >
                বাংলা
              </button>
            </div>

            {/* Download Button */}
            <DownloadPDFButton
              filename={`${formData.basicInfo?.fullName || 'biodata'}_biyeprofile`}
              className="h-[42px] px-6 bg-black text-white rounded-md font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black/90 active:scale-95 transition-all outline-none"
            />
          </div>
        </div>

        {/* Editor Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start relative pb-24 lg:pb-0 w-full max-w-full overflow-hidden">
          {/* Mobile Preview Exit Button */}
          {mobileView === "preview" && (
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex gap-3 print:hidden">
              <DownloadPDFButton
                filename={`${formData.basicInfo?.fullName || 'biodata'}_biyeprofile`}
                className="px-6 py-3.5 bg-black text-white rounded-md shadow-2xl shadow-black/20 flex items-center gap-2 active:scale-95 transition-all"
              />
              <Button
                onClick={() => setMobileView("edit")}
                className="px-6 py-3.5 bg-white text-black rounded-md shadow-2xl shadow-black/10 flex items-center gap-2 active:scale-95 transition-all outline-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </div>
          )}

          {/* Form Panel */}
          <div className={`flex-1 w-full bg-white rounded-md border border-black/5 p-6 sm:p-10 min-h-screen min-w-0 ${mobileView === "preview" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-left-4 duration-500'}`}>
            <BiodataForm
              initialData={initialData}
              onDataChange={(data) => setFormData(data)}
              language={language}
              mobileView={mobileView}
              onViewChange={(view) => setMobileView(view)}
              isGuest={true}
            />
          </div>

          {/* Preview Panel */}
          <div className={`lg:w-[420px] w-full lg:sticky lg:top-8 order-first lg:order-last min-w-0 ${mobileView === "edit" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-right-4 duration-500'}`}>
            <BiodataPreview data={formData} />
          </div>
        </div>

        {/* Clear Data Link */}
        <div className="mt-6 text-center print:hidden">
          <button
            onClick={handleClearData}
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors underline underline-offset-2"
          >
            Clear all data
          </button>
        </div>

        {/* Sign In CTA Card (bottom) */}
        <div className="mt-12 bg-white border border-black/10 rounded-lg p-10 flex flex-col sm:flex-row items-center justify-between gap-8 print:hidden">
          <div>
            <h3 className="text-3xl font-serif text-black mb-1.5">Preserve your context.</h3>
            <p className="text-black/40 font-mono text-[10px] uppercase tracking-widest">Sign in to save permanently & get a shareable link.</p>
          </div>
          <Link
            href="/api/auth/signin"
            className="shrink-0 px-10 py-4 bg-black text-white font-mono text-[11px] font-black uppercase tracking-[0.3em] rounded-md hover:bg-black/90 transition-all active:scale-95"
          >
            Sign In Free →
          </Link>
        </div>
      </div>
    </div>
  )
}
