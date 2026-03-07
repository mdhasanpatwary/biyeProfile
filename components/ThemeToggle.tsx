"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-20 h-8 border border-border-muted bg-transparent animate-pulse" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-3 h-10 px-3 border border-border-muted hover:border-foreground transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <div className="flex items-center justify-center w-4 h-4 relative">
        {/* Sun Icon (Visible in Light Mode) */}
        <div className={`absolute inset-0 transition-all duration-500 transform ${theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}>
          <div className="w-full h-full border-[1.5px] border-foreground rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-4 bg-foreground" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-foreground" />
        </div>
        {/* Moon Icon (Visible in Dark Mode) */}
        <div className={`absolute inset-0 transition-all duration-500 transform ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}>
          <div className="w-full h-full border-[1.5px] border-foreground rounded-full bg-foreground" />
          <div className="absolute top-[-2px] right-[-2px] w-3 h-3 bg-background rounded-full" />
        </div>
      </div>
      <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-foreground hidden sm:block">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}
