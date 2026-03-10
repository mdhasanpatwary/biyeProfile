"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "./AdminStats"
import { AdminTableux } from "./AdminTableux"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AdminUser {
  id: string
  email: string
  name: string | null
  username: string | null
  role: string
  isArchived: boolean
  archivedAt: Date | null
  createdAt: Date
  biodata: {
    id: string
    isPublic: boolean
    isReported: boolean
  } | null
}

interface AdminReport {
  id: string
  reason: string | null
  createdAt: Date
  reporter: {
    email: string
    username: string | null
  }
}

interface AdminBiodata {
  id: string
  isPublic: boolean
  isReported: boolean
  createdAt: Date
  user: {
    username: string | null
  }
  reports?: AdminReport[]
}

interface GuestAnalytics {
  eventBreakdown: Record<string, number>
  last7DaysSessions: { date: string; count: number }[]
  conversionRate: string
}

interface AdminDashboardClientProps {
  initialStats: {
    totalUsers: number
    totalBiodatas: number
    publicBiodatas: number
    privateBiodatas: number
    guestSessionsCount: number
  }
  users: AdminUser[]
  biodatas: AdminBiodata[]
  guestAnalytics: GuestAnalytics
}

type TabType = "overview" | "users" | "biodatas" | "reports" | "guests" | "archived"

export function AdminDashboardClient({ initialStats, users, biodatas, guestAnalytics }: AdminDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [isActionPending, setIsActionPending] = useState(false)

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setIsActionPending(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) {
        toast.success("User role updated")
        router.refresh()
      } else {
        toast.error("Failed to update role")
      }
    } finally {
      setIsActionPending(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return
    setIsActionPending(true)
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("User permanently deleted")
        router.refresh()
      } else {
        toast.error("Failed to delete user")
      }
    } finally {
      setIsActionPending(false)
    }
  }

  const handleArchiveUser = async (userId: string) => {
    if (!confirm("Archive this user? Their data will be preserved and they can be restored later.")) return
    setIsActionPending(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ userId, action: "archive" }),
      })
      if (res.ok) {
        toast.success("User archived")
        router.refresh()
      } else {
        toast.error("Failed to archive user")
      }
    } finally {
      setIsActionPending(false)
    }
  }

  const handleUnarchiveUser = async (userId: string) => {
    setIsActionPending(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ userId, action: "unarchive" }),
      })
      if (res.ok) {
        toast.success("User restored")
        router.refresh()
      } else {
        toast.error("Failed to restore user")
      }
    } finally {
      setIsActionPending(false)
    }
  }

  const handleUpdateBiodataVisibility = async (id: string, isPublic: boolean) => {
    setIsActionPending(true)
    try {
      const res = await fetch("/api/admin/biodatas", {
        method: "PATCH",
        body: JSON.stringify({ id, isPublic }),
      })
      if (res.ok) {
        toast.success("Biodata visibility updated")
        router.refresh()
      }
    } finally {
      setIsActionPending(false)
    }
  }

  const reportedBiodatas = biodatas.filter(b => b.isReported)
  const archivedUsers = users.filter(u => u.isArchived)
  const activeUsers = users.filter(u => !u.isArchived)

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 lg:px-10">
      <header className="mb-12">
        <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground-muted mb-6">Management / Suite</div>
        <h1 className="text-5xl font-serif text-foreground tracking-tight leading-none mb-4">
          Admin Dashboard
        </h1>
      </header>

      <Tabs className="bg-transparent border-none p-0 mb-12">
        <TabsList className="bg-transparent border-b border-border-muted w-full justify-start h-auto p-0 space-x-8">
          {(["overview", "users", "biodatas", "reports", "guests", "archived"] as TabType[]).map((tab) => (
            <TabsTrigger
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className="px-0 py-4 bg-transparent border-b-2 border-transparent border-none rounded-none text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted transition-all active:bg-transparent"
              style={activeTab === tab ? { borderBottom: '2px solid currentColor', color: 'var(--foreground)' } : {}}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="w-full">
        <TabsContent active={activeTab === "overview"}>
          <AdminStats
            stats={[
              { label: "Total Users", value: initialStats.totalUsers },
              { label: "Total Biodatas", value: initialStats.totalBiodatas },
              { label: "Public Profiles", value: initialStats.publicBiodatas, color: "text-green-600" },
              { label: "Private Profiles", value: initialStats.privateBiodatas },
              { label: "Guest Sessions", value: initialStats.guestSessionsCount, color: "text-blue-500" },
            ]}
          />

          <AdminTableux
            title="Recent User Activity"
            data={users.slice(0, 5)}
            columns={[
              { header: "User", key: "email", render: (u) => (
                <div className="flex flex-col">
                  <span className="font-semibold">{u.email}</span>
                  <span className="text-[10px] font-mono text-foreground-muted">@{u.username || "unset"}</span>
                </div>
              )},
              { header: "Role", key: "role", render: (u) => (
                <span className={`px-2 py-1 text-[10px] font-mono font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-foreground text-background border-foreground' : 'text-foreground-muted border-border-muted'}`}>
                  {u.role}
                </span>
              )},
              { header: "Status", key: "biodata", render: (u) => (
                <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${u.biodata?.isPublic ? 'text-green-600' : 'text-foreground-muted'}`}>
                  {u.biodata ? (u.biodata.isPublic ? "Public" : "Private") : "No Biodata"}
                </span>
              )},
              { header: "Joined", key: "createdAt", render: (u) => u.createdAt.toLocaleDateString() },
            ]}
          />
        </TabsContent>

        <TabsContent active={activeTab === "users"}>
          <AdminTableux
            title="All Users"
            data={activeUsers}
            columns={[
              { header: "User Info", key: "email", render: (u) => (
                <div className="flex flex-col">
                   <span className="font-semibold">{u.email}</span>
                   <span className="text-[10px] font-mono text-foreground-muted">{u.id}</span>
                </div>
              )},
              { header: "Role", key: "role", render: (u) => (
                <select
                  disabled={isActionPending}
                  defaultValue={u.role}
                  onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                  className="bg-transparent border-none text-[10px] font-mono font-black uppercase cursor-pointer focus:ring-0 p-0"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )},
              { header: "Actions", key: "id", render: (u) => (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    disabled={isActionPending}
                    onClick={() => handleArchiveUser(u.id)}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2 h-8 text-[10px] font-mono font-black uppercase tracking-widest"
                  >
                    Archive
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={isActionPending}
                    onClick={() => handleDeleteUser(u.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 h-8 text-[10px] font-mono font-black uppercase tracking-widest"
                  >
                    Delete
                  </Button>
                </div>
              )},
            ]}
          />
        </TabsContent>

        <TabsContent active={activeTab === "biodatas"}>
          <AdminTableux
             title="All Biodata Content"
             data={biodatas}
             columns={[
               { header: "ID / Username", key: "id", render: (b) => (
                 <div className="flex flex-col">
                   <Link href={`/biodata/${b.user.username}`} className="font-semibold hover:underline">@{b.user.username}</Link>
                   <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{b.id.split('-')[0]}</span>
                 </div>
               )},
               { header: "Visibility", key: "isPublic", render: (b) => (
                 <Button
                   variant="ghost"
                   disabled={isActionPending}
                   onClick={() => handleUpdateBiodataVisibility(b.id, !b.isPublic)}
                   className={`px-3 h-8 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${b.isPublic ? 'border-green-600/50 text-green-600' : 'border-border-muted text-foreground-muted'}`}
                 >
                   {b.isPublic ? "Force Private" : "Set Public"}
                 </Button>
               )},
               { header: "Flags", key: "isReported", render: (b) => (
                 <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${b.isReported ? 'text-red-500' : 'text-foreground-muted/50'}`}>
                   {b.isReported ? "Reported" : "Clean"}
                 </span>
               )},
               { header: "Created", key: "createdAt", render: (b) => b.createdAt.toLocaleDateString() },
             ]}
          />
        </TabsContent>

        <TabsContent active={activeTab === "reports"}>
           <AdminTableux
             title="Flagged Content"
             data={reportedBiodatas}
             columns={[
               { header: "Reported Item", key: "id", render: (b) => (
                 <div className="flex flex-col">
                   <Link href={`/biodata/${b.user.username}`} className="font-semibold hover:underline text-red-500">@{b.user.username}</Link>
                   <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">ID: {b.id.split('-')[0]}</span>
                 </div>
               )},
               { header: "Reported By", key: "id", render: (b) => (
                 <div className="flex flex-col gap-1">
                   {b.reports && b.reports.length > 0 ? (
                     b.reports.map((report) => (
                       <div key={report.id} className="flex flex-col">
                         <span className="text-xs font-semibold">{report.reporter.email}</span>
                         <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-tighter">
                           {new Date(report.createdAt).toLocaleDateString()}
                         </span>
                       </div>
                     ))
                   ) : (
                     <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest text-[#999]">Unknown</span>
                   )}
                 </div>
               )},
               { header: "Cause", key: "id", render: (b) => (
                 <div className="flex flex-col gap-1">
                   {b.reports && b.reports.length > 0 ? (
                     b.reports.map((report) => (
                       <span key={report.id} className="text-[10px] text-foreground-muted italic leading-tight">
                         • {report.reason || "No cause stated"}
                       </span>
                     ))
                   ) : (
                     <span className="text-[10px] text-[#999] italic">N/A</span>
                   )}
                 </div>
               )},
               { header: "Management", key: "id", render: (b) => (
                 <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      disabled={isActionPending}
                      onClick={() => handleUpdateBiodataVisibility(b.id, false)}
                      className="px-3 h-8 text-[10px] font-mono font-black uppercase tracking-widest border border-border-muted text-foreground"
                    >
                      Hide
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={isActionPending}
                      onClick={async () => {
                        setIsActionPending(true)
                        try {
                           await fetch("/api/admin/biodatas", {
                             method: "PATCH",
                             body: JSON.stringify({ id: b.id, isReported: false }),
                           })
                           router.refresh()
                        } finally {
                          setIsActionPending(false)
                        }
                      }}
                      className="px-3 h-8 text-[10px] font-mono font-black uppercase tracking-widest border border-border-muted text-blue-500"
                    >
                      Dismiss
                    </Button>
                 </div>
               )},
             ]}
           />
        </TabsContent>

        <TabsContent active={activeTab === "guests"}>
          {/* Funnel Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Sessions", value: initialStats.guestSessionsCount, color: "text-blue-500" },
              { label: "Biodata Started", value: (guestAnalytics.eventBreakdown["GUEST_BIODATA_START"] ?? 0) + (guestAnalytics.eventBreakdown["GUEST_BIODATA_RESUME"] ?? 0), color: "text-violet-500" },
              { label: "PDF Downloads", value: guestAnalytics.eventBreakdown["GUEST_PDF_DOWNLOAD"] ?? 0, color: "text-amber-500" },
              { label: "Conversions", value: guestAnalytics.eventBreakdown["GUEST_CONVERTED"] ?? 0, color: "text-green-600" },
            ].map((stat) => (
              <div key={stat.label} className="border border-border-muted p-6">
                <p className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted mb-2">{stat.label}</p>
                <p className={`text-4xl font-serif ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Conversion Rate Banner */}
          <div className="border border-border-muted p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted mb-1">Guest → Registered Conversion Rate</p>
              <p className="text-5xl font-serif text-foreground">{guestAnalytics.conversionRate}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted mb-1">New Sessions (Last 7 Days)</p>
              <div className="flex items-end gap-1 justify-end">
                {guestAnalytics.last7DaysSessions.map(({ date, count }) => {
                  const max = Math.max(...guestAnalytics.last7DaysSessions.map(s => s.count), 1)
                  const height = Math.max((count / max) * 60, 4)
                  return (
                    <div key={date} className="flex flex-col items-center gap-1" title={`${date}: ${count} sessions`}>
                      <div
                         className="w-5 bg-blue-500/70 rounded-none"
                         style={{ height: `${height}px` }}
                       />
                       <span className="text-[8px] font-mono text-foreground-muted">{date.slice(5)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Funnel Drop-off */}
          <div className="border border-border-muted p-6 mb-10">
            <p className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted mb-6">Guest Funnel Drop-off</p>
            <div className="space-y-3">
              {[
                { label: "Visited Site", key: "PAGE_VIEW", color: "bg-blue-200" },
                { label: "Started Biodata", key: "GUEST_BIODATA_START", color: "bg-violet-300" },
                { label: "Edited Fields", key: "GUEST_FIELD_CHANGE", color: "bg-indigo-300" },
                { label: "Downloaded PDF", key: "GUEST_PDF_DOWNLOAD", color: "bg-amber-300" },
                { label: "Converted", key: "GUEST_CONVERTED", color: "bg-green-400" },
              ].map(({ label, key, color }) => {
                const val = guestAnalytics.eventBreakdown[key] ?? 0
                const max = guestAnalytics.eventBreakdown["PAGE_VIEW"] ?? 1
                const pct = max > 0 ? Math.round((val / max) * 100) : 0
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted">{label}</span>
                      <span className="text-[10px] font-mono text-foreground-muted">{val.toLocaleString()} · {pct}%</span>
                    </div>
                    <div className="h-2 bg-border-muted w-full">
                      <div className={`h-2 ${color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "archived"}>
          {archivedUsers.length === 0 ? (
            <div className="border border-border-muted p-12 text-center">
              <p className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted mb-2">No Archived Users</p>
              <p className="text-sm text-foreground-muted">Archived users will appear here. Use Archive to soft-delete users while preserving their data.</p>
            </div>
          ) : (
            <AdminTableux
              title={`Archived Users (${archivedUsers.length})`}
              data={archivedUsers}
              columns={[
                { header: "User Info", key: "email", render: (u) => (
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground-muted line-through">{u.email}</span>
                    <span className="text-[10px] font-mono text-foreground-muted">
                      Archived {u.archivedAt ? new Date(u.archivedAt).toLocaleDateString() : "—"}
                    </span>
                  </div>
                )},
                { header: "Role", key: "role", render: (u) => (
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted/50">
                    {u.role}
                  </span>
                )},
                { header: "Actions", key: "id", render: (u) => (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      disabled={isActionPending}
                      onClick={() => handleUnarchiveUser(u.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 px-2 h-8 text-[10px] font-mono font-black uppercase tracking-widest"
                    >
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={isActionPending}
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 h-8 text-[10px] font-mono font-black uppercase tracking-widest"
                    >
                      Delete
                    </Button>
                  </div>
                )},
              ]}
            />
          )}
        </TabsContent>
      </div>
    </div>
  )
}
