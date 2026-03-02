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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-indigo-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Biodatas</p>
          <p className="text-3xl font-bold text-indigo-600">{totalBiodatas}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Public Profiles</p>
          <p className="text-3xl font-bold text-green-600">{publicBiodatas}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Private Profiles</p>
          <p className="text-3xl font-bold text-gray-600">{privateBiodatas}</p>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Users</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biodata</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  {user.username ? (
                    <a href={`/biodata/${user.username}`} className="text-indigo-600 hover:underline">
                      @{user.username}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not set</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.biodata ? (
                    <span className={user.biodata.isPublic ? "text-green-600" : "text-gray-500"}>
                      {user.biodata.isPublic ? "Public" : "Private"}
                    </span>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
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
