import * as React from "react"
import { cn } from "@/lib/utils"

// A simple accessible radio input matching the editorial styling.
export type RadioGroupItemProps = React.InputHTMLAttributes<HTMLInputElement>

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(({ className, ...props }, ref) => {
  return (
    <input
      type="radio"
      className={cn(
        "peer h-5 w-5 shrink-0 appearance-none rounded-full border border-border-muted bg-background ring-offset-background checked:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all grid place-content-center",
        "before:content-[''] before:w-2.5 before:h-2.5 before:rounded-full before:bg-foreground before:scale-0 before:transition-transform checked:before:scale-100",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

const RadioGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return (
    <div className={cn("flex flex-col gap-2", className)} ref={ref} role="radiogroup" {...props} />
  )
})
RadioGroup.displayName = "RadioGroup"

export { RadioGroup, RadioGroupItem }
