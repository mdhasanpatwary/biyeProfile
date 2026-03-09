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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2"
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
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
                },
                onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setIsOpen(false)
                    if (elementChild.props.onClick) elementChild.props.onClick(e as unknown as React.MouseEvent<HTMLElement>)
                  }
                  if (elementChild.props.onKeyDown) elementChild.props.onKeyDown(e)
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
    role="menuitem"
    tabIndex={-1}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-none px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"
