import * as React from "react"
import { cn } from "@/lib/utils"

export function BiodataSectionTitle({ label }: { label: string }) {
  return (
    <div className="sticky top-8">
      <h2 className="font-mono text-[11px] font-semibold tracking-[0.35em] text-foreground-muted uppercase">
        {label}
      </h2>
      <div className="w-6 h-px bg-border-muted mt-2" />
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
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="font-mono text-[9px] font-bold text-foreground-muted uppercase tracking-[0.22em]">
        {label}
      </span>
      <span className={cn("text-base font-medium text-foreground leading-snug", valueClassName)}>
        {value}
      </span>
    </div>
  )
}
