import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <Container className="max-w-5xl py-6 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-muted pb-6 mb-6 animate-pulse">
        <div>
          <Skeleton className="h-10 w-64 mb-4 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-48 mx-auto md:mx-0" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details Card Skeleton */}
        <Card className="md:col-span-2 p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <Skeleton className="w-32 h-32 rounded-none" />
            <div className="flex-1 text-center sm:text-left w-full">
              <Skeleton className="h-8 w-48 mb-4 mx-auto sm:mx-0" />
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-8">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-accent/30 border border-border-muted rounded-none flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 sm:gap-8 flex-col sm:flex-row w-full sm:w-auto">
              <div className="flex flex-col text-center sm:text-left gap-2 w-full">
                <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
                <Skeleton className="h-6 w-full sm:w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-full sm:w-24 shrink-0" />
          </div>
        </Card>

        {/* Visibility & Insights Skeletons */}
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <Skeleton className="h-4 w-32 mb-8" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </Card>

          <Card className="bg-accent/40 border-border-muted p-6 flex flex-col justify-between group h-full">
            <div>
              <Skeleton className="w-12 h-12 mb-12 mx-auto md:mx-0" />
              <Skeleton className="h-12 w-32 mb-4 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-24 mx-auto md:mx-0" />
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
