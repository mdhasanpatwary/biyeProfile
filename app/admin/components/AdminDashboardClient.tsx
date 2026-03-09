"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "./AdminStats"
import { AdminTableux } from "./AdminTableux"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Prisma } from "@prisma/client"

interface AdminUser {
  id: string
  email: string
  name: string | null
  username: string | null
  role: string
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

interface AdminGuestActivity {
  id: string
  sessionId: string
  type: string
  path: string
  metadata: Prisma.JsonValue
  createdAt: Date
  session: {
    userAgent: string | null
    lastActive: Date
  }
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
  guestActivities: AdminGuestActivity[]
}

type TabType = "overview" | "users" | "biodatas" | "reports" | "guests"

export function AdminDashboardClient({ initialStats, users, biodatas, guestActivities }: AdminDashboardClientProps) {
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
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return
    setIsActionPending(true)
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("User deleted")
        router.refresh()
      } else {
        toast.error("Failed to delete user")
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
          {(["overview", "users", "biodatas", "reports", "guests"] as TabType[]).map((tab) => (
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
            data={users}
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
                <Button
                  variant="ghost"
                  disabled={isActionPending}
                  onClick={() => handleDeleteUser(u.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 h-8 text-[10px] font-mono font-black uppercase tracking-widest"
                >
                  Delete
                </Button>
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
                         <span className="text-[9px] font-mono text-foreground-muted uppercase tracking-tighter">
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
          <AdminTableux
            title="Recent Guest Activity"
            data={guestActivities}
            columns={[
              { header: "Path / URL", key: "path", render: (g) => (
                <div className="flex flex-col">
                  <span className="font-semibold text-xs">{g.path}</span>
                  <span className="text-[10px] font-mono text-foreground-muted">{g.type}</span>
                </div>
              )},
              { header: "Session ID", key: "sessionId", render: (g) => (
                <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{g.sessionId.substring(0, 8)}...</span>
              )},
              { header: "Device / Info", key: "session", render: (g) => (
                <div className="flex flex-col max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                   <span className="text-[10px] font-mono text-foreground-muted leading-tight" title={g.session.userAgent || ""}>
                     {g.session.userAgent || "Unknown Device"}
                   </span>
                </div>
              )},
              { header: "Timestamp", key: "createdAt", render: (g) => (
                <div className="flex flex-col">
                  <span className="text-xs">{new Date(g.createdAt).toLocaleDateString()}</span>
                  <span className="text-[9px] font-mono text-foreground-muted">{new Date(g.createdAt).toLocaleTimeString()}</span>
                </div>
              )},
            ]}
          />
        </TabsContent>
      </div>
    </div>
  )
}
