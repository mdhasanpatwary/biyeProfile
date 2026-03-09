import { BiodataCardSkeleton } from "@/components/BiodataCardSkeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 md:py-16">

        {/* Loading Header matching the page layout */}
        <header className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 animate-pulse">
          <div className="md:max-w-xl text-center md:text-left">
            <div className="w-24 h-4 bg-border-muted/50 mb-8 mx-auto md:mx-0" />
            <div className="w-64 h-12 bg-border-muted/50 mb-8 mx-auto md:mx-0" />
            <div className="w-full h-20 bg-border-muted/50 md:max-w-md mx-auto md:mx-0" />
          </div>

          <div className="flex flex-col gap-6 md:min-w-[320px]">
            <div className="flex flex-col gap-4">
              <div className="w-32 h-4 bg-border-muted/50 mx-auto md:mx-0" />
              <div className="flex gap-2 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-16 h-8 bg-border-muted/50" />
                ))}
              </div>
            </div>
            <div className="w-full h-12 bg-border-muted/50" />
          </div>
        </header>

        <div className="mb-8 md:mb-12" />

        {/* The List Skeletons */}
        <div className="flex flex-col border-t border-border-muted">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <BiodataCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  )
}
