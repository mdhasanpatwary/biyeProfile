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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-none animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Sign In Banner */}
      {showSignInBanner && (
        <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded-none bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-primary-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-mono">
              <span className="opacity-60">Guest Mode</span> — Data is saved locally.{" "}
              <Link
                href="/api/auth/signin"
                className="underline underline-offset-4 text-primary-foreground hover:opacity-80 transition-all"
              >
                Sign in to save permanently →
              </Link>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSignInBanner(false)}
            className="shrink-0 opacity-40 hover:opacity-100 transition-all ml-2 hover:bg-transparent"
            aria-label="Dismiss banner"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 pb-8 border-b border-border-muted print:hidden">
          <div>
            <h1 className="text-4xl font-serif text-foreground tracking-tight">
              Create Your Biodata
            </h1>
            <p className="text-foreground-muted font-mono text-[10px] uppercase tracking-[0.2em] mt-2">
              Guest Mode / Temporary Session
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center bg-accent p-1 rounded-none border border-border-muted h-[42px]">
              <Button
                variant="ghost"
                onClick={() => setLanguage("en")}
                className={`px-4 h-full rounded-none tracking-wider transition-all ${language === 'en' ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground' : 'text-foreground/30 hover:text-foreground hover:bg-transparent'}`}
              >
                Eng
              </Button>
              <Button
                variant="ghost"
                onClick={() => setLanguage("bn")}
                className={`px-4 h-full rounded-none tracking-wider transition-all ${language === 'bn' ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground' : 'text-foreground/30 hover:text-foreground hover:bg-transparent'}`}
              >
                বাংলা
              </Button>
            </div>

            {/* Download Button */}
            <DownloadPDFButton
              filename={`${formData.basicInfo?.fullName || 'biodata'}_biyeprofile`}
              className="h-[42px] px-6 bg-primary text-primary-foreground rounded-none font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 active:scale-95 transition-all outline-none"
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
                className="px-6 py-3.5 bg-primary text-primary-foreground rounded-none shadow-2xl shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all"
              />
              <Button
                variant="outline"
                onClick={() => setMobileView("edit")}
                className="px-6 py-3.5 shadow-2xl flex items-center gap-2 active:scale-95 transition-all outline-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </div>
          )}

          {/* Form Panel */}
          <div className={`flex-1 w-full bg-background rounded-none border border-border-muted p-6 sm:p-10 min-h-screen min-w-0 ${mobileView === "preview" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-left-4 duration-500'}`}>
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
          <Button
            variant="ghost"
            onClick={handleClearData}
            className="text-xs text-foreground-muted/40 hover:bg-transparent hover:text-foreground-muted transition-colors underline underline-offset-2 tracking-widest"
          >
            Clear all session data
          </Button>
        </div>

        {/* Sign In CTA Card (bottom) */}
        <div className="mt-12 bg-background border border-border rounded-none p-10 flex flex-col sm:flex-row items-center justify-between gap-8 print:hidden">
          <div>
            <h3 className="text-3xl font-serif text-foreground mb-1.5">Preserve your context.</h3>
            <p className="text-foreground-muted font-mono text-[10px] uppercase tracking-widest">Sign in to save permanently & get a shareable link.</p>
          </div>
          <Link
            href="/api/auth/signin"
            className="shrink-0 px-10 py-4 bg-primary text-primary-foreground font-mono text-[11px] font-black uppercase tracking-[0.3em] rounded-none hover:bg-primary/90 transition-all active:scale-95"
          >
            Sign In Free →
          </Link>
        </div>
      </div>
    </div>
  )
}
