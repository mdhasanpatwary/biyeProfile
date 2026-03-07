import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()

  // Only allow admin users
  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  const [totalUsers, totalBiodatas, publicBiodatas, privateBiodatas] = await Promise.all([
    prisma.user.count(),
    prisma.biodata.count(),
    prisma.biodata.count({ where: { isPublic: true } }),
    prisma.biodata.count({ where: { isPublic: false } }),
  ])

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      biodata: { select: { isPublic: true } }
    }
  })

  return (
    <div className="max-w-6xl mx-auto py-16 md:py-24 px-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-background p-6 rounded-none shadow-sm border border-border-muted">
          <p className="text-sm text-foreground-muted">Total Users</p>
          <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
        </div>
        <div className="bg-background p-6 rounded-none shadow-sm border border-border-muted">
          <p className="text-sm text-foreground-muted">Total Biodatas</p>
          <p className="text-3xl font-bold text-foreground">{totalBiodatas}</p>
        </div>
        <div className="bg-background p-6 rounded-none shadow-sm border border-border-muted">
          <p className="text-sm text-foreground-muted">Public Profiles</p>
          <p className="text-3xl font-bold text-green-600">{publicBiodatas}</p>
        </div>
        <div className="bg-background p-6 rounded-none shadow-sm border border-border-muted">
          <p className="text-sm text-foreground-muted">Private Profiles</p>
          <p className="text-3xl font-bold text-foreground">{privateBiodatas}</p>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-background rounded-none shadow-sm border border-border-muted overflow-hidden">
        <div className="px-6 py-4 border-b border-border-muted">
          <h2 className="text-lg font-semibold text-foreground">Recent Users</h2>
        </div>
        <table className="w-full">
          <thead className="bg-accent">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Biodata</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {recentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  {user.username ? (
                    <a href={`/biodata/${user.username}`} className="text-foreground hover:underline">
                      @{user.username}
                    </a>
                  ) : (
                    <span className="text-foreground-muted/50">Not set</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.biodata ? (
                    <span className={user.biodata.isPublic ? "text-green-600" : "text-foreground-muted"}>
                      {user.biodata.isPublic ? "Public" : "Private"}
                    </span>
                  ) : (
                    <span className="text-foreground-muted/50">None</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-foreground-muted">
                  {user.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
