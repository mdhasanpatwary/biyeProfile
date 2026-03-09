import { Container } from "@/components/ui/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Container className="max-w-7xl py-12 md:py-16 space-y-12 animate-pulse">

        {/* Header */}
        <div>
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border border-border-muted bg-surface/50">
              <Skeleton className="h-4 w-24 mb-6" />
              <div className="flex items-end justify-between">
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs and Data Table Area */}
        <div className="border border-border-muted">
          {/* Tabs header */}
          <div className="flex border-b border-border-muted">
            {[1, 2].map((i) => (
              <div key={i} className="px-8 py-4 w-32">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>

          {/* Table Content */}
          <div className="p-6 md:p-8">
            <div className="border border-border-muted">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-border-muted bg-foreground/5">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-4 w-24" />
                ))}
              </div>

              {/* Table Rows */}
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="grid grid-cols-4 gap-4 p-4 border-b border-border-muted/50 items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </Container>
    </div>
  )
}
