"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations, TranslationMap } from "@/lib/translations"

export type Language = "en" | "bn"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: TranslationMap
}

const STORAGE_KEY = "biyeprofile_language"

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with "en" on server & initial client render to avoid hydration mismatch
  const [language, setLanguageState] = useState<Language>("en")

  // Restore language preference asynchronously after initial mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null
      let targetLang: Language = "en"
      if (savedLang === "en" || savedLang === "bn") {
        targetLang = savedLang
      } else if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("bn")) {
        targetLang = "bn"
      }

      if (targetLang !== "en") {
        const handle = requestAnimationFrame(() => {
          setLanguageState(targetLang)
        })
        return () => cancelAnimationFrame(handle)
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, [])

  // Sync lang and data-lang attributes on html tag for font styling
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
      document.documentElement.setAttribute("data-lang", language)
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Ignore write errors
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en")
  }

  const t = translations[language] || translations.en

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations.en,
    }
  }
  return context
}
