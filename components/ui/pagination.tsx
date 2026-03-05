import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, ...props }, ref) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
      const delta = 1 // Number of pages to show before and after current
      const range = []
      const rangeWithDots = []
      let l

      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
          range.push(i)
        }
      }

      for (let i = 0; i < range.length; i++) {
        if (l) {
          if (range[i] - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (range[i] - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(range[i])
        l = range[i]
      }

      return rangeWithDots
    }

    if (totalPages <= 1) return null

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      >
        <ul className="flex flex-row items-center gap-1">
          <li>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", currentPage === 1 && "pointer-events-none opacity-50")}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </li>

          {getPageNumbers().map((pageNumber, i) => (
            <li key={i}>
              {pageNumber === '...' ? (
                <span className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                  ...
                </span>
              ) : (
                <Button
                  variant={pageNumber === currentPage ? "primary" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 text-xs font-mono font-bold",
                    pageNumber === currentPage ? "rounded-none" : "rounded-none"
                  )}
                  onClick={() => onPageChange(pageNumber as number)}
                  aria-label={pageNumber === currentPage ? `Page ${pageNumber}` : `Go to page ${pageNumber}`}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              )}
            </li>
          ))}

          <li>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", currentPage === totalPages && "pointer-events-none opacity-50")}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </li>
        </ul>
      </nav>
    )
  }
)
Pagination.displayName = "Pagination"

export { Pagination }
