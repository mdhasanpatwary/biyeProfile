"use client"

import { signOut } from "next-auth/react"
import { DropdownMenu, DropdownMenuItem } from "./ui/dropdown-menu"

export function UserNav({ username }: { username: string }) {
  return (
    <DropdownMenu
      align="right"
      trigger={
        <button
          className="flex items-center gap-2 h-10 px-3 border border-border-muted hover:border-foreground transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
          aria-label="User Menu"
        >
          <div className="flex items-center justify-center w-4 h-4 relative">
            <svg
              className="w-4 h-4 text-foreground transition-transform group-hover:scale-110 duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-foreground hidden sm:block truncate max-w-[100px]">
            {username}
          </span>
        </button>
      }
    >
      <div className="px-4 py-3 border-b border-border-muted mb-1 min-w-[12rem]">
        <p className="font-mono text-[10px] text-foreground-muted uppercase tracking-[0.2em] mb-1">Signed in as</p>
        <p className="font-medium text-sm truncate">@{username}</p>
      </div>
      <DropdownMenuItem
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-foreground hover:bg-foreground hover:text-background font-mono text-[11px] font-bold uppercase tracking-[0.15em] mx-1 mb-1 justify-center border border-transparent transition-all flex items-center"
      >
        <svg
          className="w-4 min-w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </DropdownMenuItem>
    </DropdownMenu>
  )
}
