"use client"

import { cn } from "@/lib/utils"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

interface SavingIndicatorProps {
  status: SaveStatus
  className?: string
}

export function SavingIndicator({ status, className }: SavingIndicatorProps) {
  const isIdle = status === "idle"

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-none border border-border-muted bg-accent/30 transition-all duration-500 min-w-[130px] justify-center",
      isIdle ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100 shadow-sm",
      className
    )}>
      <div className="flex items-center justify-center w-3 h-3 relative shrink-0">
        {status === "saving" && (
          <div className="w-full h-full border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        )}
        {status === "saved" && (
          <svg className="w-3.5 h-3.5 text-green-600 animate-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === "error" && (
          <svg className="w-3.5 h-3.5 text-red-500 animate-in shake duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <span className="text-[9px] font-mono font-black uppercase tracking-widest text-foreground truncate">
        {status === "saving" && "Saving..."}
        {status === "saved" && "Changes saved"}
        {status === "error" && "Error saving"}
        {status === "idle" && "Saved"}
      </span>
    </div>
  )
}
