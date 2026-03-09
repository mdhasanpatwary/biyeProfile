import { Skeleton } from "@/components/ui/skeleton"

export default function SetupLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 md:py-16 px-6">
      <div className="max-w-md w-full space-y-12 bg-background p-12 md:p-12 shadow-2xl rounded-none border border-border-muted relative overflow-hidden animate-pulse">

        {/* Subtle accent corner skeleton representation */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-accent opacity-50 -mr-8 -mt-8 rotate-45" />

        <div className="relative z-10 space-y-4">
          <Skeleton className="h-10 w-48 mx-auto mt-6" /> {/* The Registry title */}
          <Skeleton className="h-4 w-40 mx-auto" /> {/* Choose your identification */}
        </div>

        {/* Form Skeleton */}
        <div className="mt-10 space-y-8">
          <div>
            <Skeleton className="h-10 w-full" /> {/* Input field */}
          </div>
          <div>
            <Skeleton className="h-10 w-full" /> {/* Submit button */}
          </div>
        </div>

      </div>
    </div>
  )
}
