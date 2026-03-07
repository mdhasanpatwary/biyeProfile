import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(({
  className,
  label,
  description,
  error,
  required,
  children,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
      {label && (
        <Label className={cn("text-xs font-bold uppercase tracking-widest text-foreground", error && "text-destructive")}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-[11px] text-foreground-muted font-medium mt-1 leading-relaxed">
          {description}
        </p>
      )}
      {error && (
        <p className="text-[11px] text-destructive font-medium mt-1 leading-relaxed">
          {error}
        </p>
      )}
    </div>
  )
})
FormField.displayName = "FormField"

export { FormField }
