import { Skeleton } from "@/components/ui/skeleton"

export default function PublicBiodataLoading() {
  return (
    <div className="bg-background py-12 md:py-16 px-0 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-background p-6 sm:rounded-none border border-border-muted relative animate-pulse">

        {/* Top Actions Row Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-4">
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-8 w-40" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-12">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-border-muted pb-12">
            <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-none shrink-0" />
            <div className="flex-1 text-center md:text-left w-full">
              <Skeleton className="h-4 w-24 mb-4 mx-auto md:mx-0" />
              <Skeleton className="h-10 w-64 mb-4 mx-auto md:mx-0" />
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>

          {/* Data Sections */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-8">
              <Skeleton className="h-8 w-48" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="grid grid-cols-2 gap-4 border-b border-border-muted/50 pb-4">
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions Skeleton */}
        <div className="mt-8 md:mt-12 pt-6 border-t border-border-muted flex flex-wrap justify-center items-center gap-6 px-4">
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  )
}
