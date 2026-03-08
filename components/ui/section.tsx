import * as React from "react"
import { cn } from "@/lib/utils"

const Section = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-8 md:py-16", className)}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

export { Section }
