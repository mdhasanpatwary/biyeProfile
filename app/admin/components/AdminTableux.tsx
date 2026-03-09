interface Column<T> {
  header: string
  key: string
  render?: (item: T) => React.ReactNode
}

interface AdminTableuxProps<T> {
  data: T[]
  columns: Column<T>[]
  title: string
}

export function AdminTableux<T extends { id: string }>({ data, columns, title }: AdminTableuxProps<T>) {
  return (
    <div className="bg-background border border-border-muted overflow-hidden">
      <div className="px-8 py-6 border-b border-border-muted flex items-center justify-between">
        <h2 className="text-xl font-serif text-foreground">{title}</h2>
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted">
          {data.length} Total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-accent/30 border-b border-border-muted/50">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="px-8 py-4 text-[10px] font-mono font-black uppercase tracking-[0.2em] text-foreground-muted">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted/30">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-12 text-center font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="group hover:bg-accent/20 transition-all duration-300">
                  {columns.map((col) => (
                    <td key={col.header} className="px-8 py-5 text-sm">
                      {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
