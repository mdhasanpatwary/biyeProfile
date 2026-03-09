import { Container } from "@/components/ui/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditDashboardLoading() {
  return (
    <div className="pt-12 pb-32 md:py-16 bg-background min-h-screen">
      <Container className="max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12 w-full animate-pulse">

          {/* Left Side: Form Skeleton */}
          <div className="w-full md:w-3/5 lg:w-2/3 max-w-2xl mx-auto md:mx-0 shrink-0">
            {/* Header */}
            <header className="mb-12 print:hidden pb-8 border-b border-border-muted text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="max-w-md w-full">
                  <Skeleton className="h-4 w-32 mb-6 mx-auto md:mx-0" />
                  <Skeleton className="h-8 w-64 md:w-96 mb-6 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-48 mx-auto md:mx-0" />
                </div>
                <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                  <Skeleton className="h-12 w-full sm:w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </header>

            {/* Stepper Skeleton */}
            <div className="mb-10 w-full overflow-hidden">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-1 w-16" />
                ))}
              </div>
            </div>

            {/* Form Fields Skeletons */}
            <div className="space-y-12">
              <Skeleton className="h-8 w-48 mb-6" />

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              <div className="w-full pt-8 pb-4">
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>

          {/* Right Side: Preview Skeleton */}
          <div className="hidden md:block w-full md:w-2/5 lg:w-1/3 min-w-[320px] max-w-sm sticky top-12 self-start mx-auto mt-12 md:mt-0">
            <div className="border border-border-muted bg-surface/30 rounded-none shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500 overflow-hidden">
              <div className="p-3 border-b border-border-muted bg-foreground/5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-border-muted" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border-muted" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border-muted" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-8">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
