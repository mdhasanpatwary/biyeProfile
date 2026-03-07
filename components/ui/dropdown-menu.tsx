"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  align?: "left" | "right" | "center"
}

export function DropdownMenu({
  trigger,
  children,
  className,
  align = "right"
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2"
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-none border border-border-muted bg-background p-1 shadow-md animate-in fade-in slide-in-from-top-2 duration-200",
            alignmentClasses[align],
            className
          )}
        >
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              const elementChild = child as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
              return React.cloneElement(elementChild, {
                onClick: (e: React.MouseEvent<HTMLElement>) => {
                  setIsOpen(false)
                  if (elementChild.props.onClick) elementChild.props.onClick(e)
                }
              })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none hidden items-center rounded-none px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"
