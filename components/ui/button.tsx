import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "outline" | "ghost" | "destructive"
type ButtonSize = "default" | "sm" | "lg" | "icon"

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-black text-white hover:bg-white hover:text-black border border-black",
  outline: "border border-black bg-white text-black hover:bg-black hover:text-white",
  ghost: "text-black hover:bg-gray-100",
  destructive: "bg-gray-100 text-black hover:bg-gray-200",
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
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-[11px] font-mono font-black uppercase tracking-[0.2em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
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
