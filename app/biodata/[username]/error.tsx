"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import Link from "next/link"

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Profile Error]", error)
  }, [error])

  return (
    <Container className="max-w-2xl py-24 text-center">
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted block mb-6">
        Profile Unavailable
      </span>
      <h1 className="text-4xl font-serif italic text-foreground tracking-tight mb-4">
        This profile couldn&apos;t load.
      </h1>
      <p className="text-sm text-foreground-muted font-medium leading-relaxed max-w-sm mx-auto mb-10">
        There was an unexpected error loading this biodata profile.
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
        <Link href="/biodata">
          <Button variant="outline" className="px-8">
            Browse Profiles
          </Button>
        </Link>
      </div>
    </Container>
  )
}
