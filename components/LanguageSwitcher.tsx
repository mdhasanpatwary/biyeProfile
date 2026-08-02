"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage, Language } from "@/components/LanguageContext"

interface LanguageSwitcherProps {
  language?: Language
  setLanguage?: (lang: Language) => void
  disabled?: boolean
  className?: string
  fullLabels?: boolean
}

export function LanguageSwitcher({
  language: propLanguage,
  setLanguage: propSetLanguage,
  disabled,
  className,
  fullLabels = false,
}: LanguageSwitcherProps) {
  const context = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Use props if provided (controlled mode), otherwise fallback to context
  const currentLanguage = propLanguage ?? context.language
  const handleSelectLanguage = (lang: Language) => {
    if (propSetLanguage) {
      propSetLanguage(lang)
    } else {
      context.setLanguage(lang)
    }
  }

  if (!mounted && !propLanguage) {
    return (
      <div className={cn("inline-flex items-center p-1 border border-border-muted bg-accent/30 h-11 w-[88px] animate-pulse", className)} />
    )
  }

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 border border-border-muted bg-accent/30 shrink-0",
        className
      )}
      role="group"
      aria-label="Language selection (Bangla or English)"
    >
      <Button
        type="button"
        variant={currentLanguage === "en" ? "primary" : "ghost"}
        disabled={disabled}
        onClick={() => handleSelectLanguage("en")}
        aria-pressed={currentLanguage === "en"}
        aria-label="Switch to English"
        title="Switch to English"
        className={cn(
          "h-8 px-3 text-[11px] font-mono font-bold tracking-widest uppercase transition-all",
          currentLanguage === "en"
            ? ""
            : "text-foreground-muted hover:text-foreground"
        )}
      >
        {fullLabels ? "English" : "EN"}
      </Button>

      <div className="w-[1px] bg-border-muted my-1 h-4 shrink-0" aria-hidden="true" />

      <Button
        type="button"
        variant={currentLanguage === "bn" ? "primary" : "ghost"}
        disabled={disabled}
        onClick={() => handleSelectLanguage("bn")}
        aria-pressed={currentLanguage === "bn"}
        aria-label="Switch to Bangla"
        title="Switch to Bangla"
        className={cn(
          "h-8 px-3 text-[11px] font-mono font-bold tracking-widest uppercase transition-all",
          currentLanguage === "bn"
            ? ""
            : "text-foreground-muted hover:text-foreground"
        )}
      >
        {fullLabels ? "বাংলা" : "BN"}
      </Button>
    </div>
  )
}
