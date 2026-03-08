"use client"

import { toast } from "sonner"

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        toast.success("Link copied to clipboard")
      }}
      className="px-5 py-3 bg-foreground text-background text-[12px] font-mono font-black uppercase tracking-[0.2em] rounded-none hover:bg-foreground/90 transition-all flex items-center gap-3 active:scale-95"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        />
      </svg>
      Copy
    </button>
  )
}
