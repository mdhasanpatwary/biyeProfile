import * as React from "react"
import { cn } from "@/lib/utils"

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "peer h-5 w-5 shrink-0 appearance-none rounded-none border border-border-muted bg-background ring-offset-background checked:bg-foreground checked:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all grid place-content-center",
        "before:content-[''] before:w-2.5 before:h-2.5 before:scale-0 before:transition-transform before:shadow-[inset_1em_1em_var(--background)] checked:before:scale-100 before:clip-path-polygon-[14%_44%,_0_65%,_50%_100%,_100%_16%,_80%_0%,_43%_62%]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
