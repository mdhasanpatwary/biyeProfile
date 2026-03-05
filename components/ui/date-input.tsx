"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export type DateInputProps = React.InputHTMLAttributes<HTMLInputElement>

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <Input
        type="date"
        className={cn(
          "relative z-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer bg-transparent",
          className
        )}
        ref={ref}
        {...props}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-0 text-foreground-muted">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  )
})
DateInput.displayName = "DateInput"

export { DateInput }
