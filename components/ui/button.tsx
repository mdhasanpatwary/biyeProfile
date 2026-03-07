import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost"
type ButtonSize = "default" | "sm" | "lg" | "icon"

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground",
  secondary: "bg-accent text-foreground border border-accent hover:bg-border-muted",
  outline: "border border-border-muted bg-background text-foreground hover:bg-accent hover:border-foreground-muted",
  ghost: "text-foreground-muted hover:text-foreground hover:bg-accent",
}

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-12 px-8",
  sm: "h-9 px-4 text-[10px]",
  lg: "h-14 px-10 text-[12px]",
  icon: "h-10 w-10",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-none text-[11px] font-mono font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
