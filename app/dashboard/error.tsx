"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error)
  }, [error])

  return (
    <Container className="max-w-2xl py-24 text-center">
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted block mb-6">
        System Error
      </span>
      <h1 className="text-4xl font-serif italic text-foreground tracking-tight mb-4">
        Something went wrong.
      </h1>
      <p className="text-sm text-foreground-muted font-medium leading-relaxed max-w-sm mx-auto mb-10">
        We couldn&apos;t load your dashboard. This may be a temporary issue.
        {error?.digest && (
          <span className="block font-mono text-[10px] mt-2 text-foreground/40">
            Ref: {error.digest}
          </span>
        )}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="primary" onClick={reset} className="px-8">
          Try Again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = "/"} className="px-8">
          Go Home
        </Button>
      </div>
    </Container>
  )
}
