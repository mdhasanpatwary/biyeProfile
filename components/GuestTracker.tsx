"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useEffect, useCallback } from "react"

// Client-side session ID management
const GUEST_SESSION_KEY = "biye_guest_session"
const GUEST_SESSION_COOKIE = "biye_guest_sid"

/** Returns (and creates if missing) the guest session ID from localStorage + cookie. */
export function getGuestSessionId(): string | null {
  if (typeof window === "undefined") return null
  let sessionId = localStorage.getItem(GUEST_SESSION_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(GUEST_SESSION_KEY, sessionId)
  }
  // Also persist in a cookie so the server-side auth callback can read it
  document.cookie = `${GUEST_SESSION_COOKIE}=${sessionId}; SameSite=Lax; Path=/; Max-Age=604800`
  return sessionId
}

export function useGuestTracking() {
  const { status } = useSession()

  const trackEvent = useCallback(async (type: string, metadata: Record<string, unknown> = {}) => {
    // Only track if we are SURE there's no session
    if (status !== "unauthenticated") return

    const sessionId = getGuestSessionId()
    if (!sessionId) return

    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          type,
          path: window.location.pathname,
          metadata
        }),
      })
    } catch (error) {
      // Silent fail for tracking
      console.error("Failed to track guest event:", error)
    }
  }, [status])

  return { trackEvent }
}

export function GuestTracker() {
  const { trackEvent } = useGuestTracking()
  const pathname = usePathname()

  useEffect(() => {
    trackEvent("PAGE_VIEW")
  }, [pathname, trackEvent])

  return null
}
