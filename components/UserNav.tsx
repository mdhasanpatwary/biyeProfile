"use client"

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"

export function UserNav({ username }: { username: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end hidden sm:flex">
        <span className="text-xs font-black text-foreground uppercase tracking-widest">
          @{username}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-[10px] font-bold text-foreground-muted hover:text-foreground transition-all uppercase tracking-tight p-0 h-auto hover:bg-transparent"
        >
          Sign Out
        </Button>
      </div>
      <div className="w-10 h-10 rounded-none bg-accent border border-border-muted flex items-center justify-center overflow-hidden grayscale">
        <svg
          className="w-5 h-5 text-foreground/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="sm:hidden text-foreground-muted hover:text-foreground hover:bg-transparent"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </Button>
    </div>
  )
}
