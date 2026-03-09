import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
  label: string
  value: number
  color?: string
}

export function AdminStats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-none border-border-muted bg-background/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-foreground-muted mb-2">
              {stat.label}
            </p>
            <p className={`text-4xl font-serif tracking-tighter ${stat.color || "text-foreground"}`}>
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
