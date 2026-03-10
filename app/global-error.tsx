"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

/**
 * global-error.tsx — Root error boundary for the Next.js App Router.
 * Sentry captures the error here before showing a fallback UI.
 * This replaces the root error.tsx when an error occurs in the root layout itself.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "monospace", gap: "16px", padding: "24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Something went wrong.</h2>
          <p style={{ fontSize: "0.75rem", color: "#666", maxWidth: "400px" }}>
            This error has been reported automatically. Try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{ padding: "8px 16px", border: "1px solid #000", background: "transparent", cursor: "pointer", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
