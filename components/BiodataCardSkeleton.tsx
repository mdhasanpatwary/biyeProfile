import { Skeleton } from "@/components/ui/skeleton"

export function BiodataCardSkeleton() {
  return (
    <div className="border-b border-border-muted bg-background">
      <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 py-10 md:py-12 px-6 sm:px-0">

        {/* Thumbnail Skeleton */}
        <Skeleton className="w-24 h-24 rounded-full border-2 border-background shadow-md grayscale contrast-[1.1]" />

        {/* Info Grid Skeleton */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-12 items-center w-full text-center sm:text-left">
          <div className="md:col-span-2">
            <Skeleton className="h-4 w-24 mb-4 mx-auto sm:mx-0" /> {/* Identification label */}
            <Skeleton className="h-8 w-48 mb-3 mx-auto sm:mx-0" /> {/* Name */}
            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" /> {/* Occupation */}

            {/* Mobile Metrics Skeleton */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 md:hidden">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>

          <div className="hidden md:block">
            <Skeleton className="h-4 w-20 mb-4" /> {/* Metrics label */}
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="hidden md:block">
            <Skeleton className="h-4 w-20 mb-4" /> {/* Origin label */}
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Arrow Skeleton */}
        <div className="hidden sm:flex shrink-0 w-12 h-12 items-center justify-center border border-border-muted rounded-none">
          <Skeleton className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}
