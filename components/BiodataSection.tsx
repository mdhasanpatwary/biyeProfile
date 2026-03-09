import * as React from "react"
import { cn } from "@/lib/utils"

export function BiodataSectionTitle({ label }: { label: string }) {
  return (
    <div className="sticky top-8" style={{ marginBottom: '12px' }}>
      <h2
        className="font-mono uppercase"
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          color: 'var(--foreground-muted)',
          marginBottom: '10px',
        }}
      >
        {label}
      </h2>
      <div className="w-8 h-[1px] bg-foreground/20" />
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
      <span className={cn("text-[14.5px] font-medium text-foreground", valueClassName)} style={{ lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
        {value}
      </span>
    </div>
  )
}
