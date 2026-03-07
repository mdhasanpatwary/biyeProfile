import * as React from "react"
import { cn } from "@/lib/utils"

export function BiodataSectionTitle({ label }: { label: string }) {
  return (
    <div className="sticky top-8">
      <h2 className="font-mono text-[11px] font-semibold tracking-[0.12em] text-foreground-muted uppercase">
        {label}
      </h2>
      <div className="w-8 h-[1px] bg-foreground/20 mt-2" />
    </div>
  )
}

export function BiodataSectionField({
  label,
  value,
  className = "",
  valueClassName = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="font-mono text-[8.5px] text-foreground-muted/70 uppercase tracking-[0.15em]">
        {label}
      </span>
      <span className={cn("text-[14.5px] font-medium text-foreground leading-snug", valueClassName)}>
        {value}
      </span>
    </div>
  )
}
