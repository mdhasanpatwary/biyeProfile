"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-accent opacity-50 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-md w-full bg-background rounded-none border border-border-muted p-10 sm:p-12 flex flex-col items-center relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-5xl font-serif text-foreground mb-4 tracking-tight">The Registry.</h1>
          <p className="text-foreground-muted font-mono text-[10px] uppercase tracking-[0.2em] max-w-[240px] mx-auto">
            Secure access to your professional marriage documentation
          </p>
        </div>

        <div className="w-full space-y-6">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-4 px-8 active:scale-95 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-all" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="currentColor"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="currentColor"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="currentColor"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border-muted w-full text-center">
          <p className="text-[10px] text-foreground-muted font-mono uppercase tracking-widest leading-relaxed">
            By accessing the Registry, you agree to our <br /> Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
