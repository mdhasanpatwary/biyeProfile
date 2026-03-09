"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useEffect, useCallback } from "react"

// Client-side session ID management
const GUEST_SESSION_KEY = "biye_guest_session"

export function useGuestTracking() {
  const { status } = useSession()

  const trackEvent = useCallback(async (type: string, metadata: Record<string, unknown> = {}) => {
    // Only track if we are SURE there's no session
    if (status !== "unauthenticated") return

    let sessionId = localStorage.getItem(GUEST_SESSION_KEY)
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem(GUEST_SESSION_KEY, sessionId)
    }

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
