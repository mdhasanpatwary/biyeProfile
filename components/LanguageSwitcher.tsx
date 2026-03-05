"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  language: "en" | "bn"
  setLanguage: (lang: "en" | "bn") => void
  disabled?: boolean
  className?: string
}

export function LanguageSwitcher({ language, setLanguage, disabled, className }: LanguageSwitcherProps) {
  return (
    <div className={cn("inline-flex p-1 border border-border-muted bg-accent/30", className)}>
      <Button
        type="button"
        variant="ghost"
        disabled={disabled}
        onClick={() => setLanguage('en')}
        className={cn(
          "h-8 px-4 text-[10px] font-bold tracking-widest uppercase transition-all",
          language === 'en'
            ? "bg-foreground text-background hover:bg-foreground hover:text-background"
            : "text-foreground-muted hover:text-foreground"
        )}
      >
        EN
      </Button>
      <div className="w-[1px] bg-border-muted my-1" />
      <Button
        type="button"
        variant="ghost"
        disabled={disabled}
        onClick={() => setLanguage('bn')}
        className={cn(
          "h-8 px-4 text-[10px] font-bold tracking-widest uppercase transition-all",
          language === 'bn'
            ? "bg-foreground text-background hover:bg-foreground hover:text-background"
            : "text-foreground-muted hover:text-foreground"
        )}
      >
        BN
      </Button>
    </div>
  )
}
