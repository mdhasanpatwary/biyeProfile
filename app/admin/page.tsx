import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminDashboardClient } from "./components/AdminDashboardClient"

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [totalUsers, totalBiodatas, publicBiodatas, privateBiodatas, guestSessionsCount, rawEvents, recentSessions] = await Promise.all([
    prisma.user.count(),
    prisma.biodata.count(),
    prisma.biodata.count({ where: { isPublic: true } }),
    prisma.biodata.count({ where: { isPublic: false } }),
    prisma.guestSession.count(),
    prisma.guestActivity.groupBy({
      by: ["type"],
      _count: { type: true },
    }),
    prisma.guestSession.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
  ])

  // Build event breakdown map
  const eventBreakdown: Record<string, number> = {}
  for (const row of rawEvents) {
    eventBreakdown[row.type] = row._count.type
  }

  // Build 7-day buckets
  const dayCounts: Record<string, number> = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    dayCounts[d.toISOString().slice(0, 10)] = 0
  }
  for (const s of recentSessions) {
    const key = s.createdAt.toISOString().slice(0, 10)
    if (key in dayCounts) dayCounts[key]++
  }
  const last7DaysSessions = Object.entries(dayCounts).map(([date, count]) => ({ date, count }))

  const conversions = eventBreakdown["GUEST_CONVERTED"] ?? 0
  const conversionRate = guestSessionsCount > 0
    ? `${((conversions / guestSessionsCount) * 100).toFixed(1)}%`
    : "0.0%"

  const [users, biodatas] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        isArchived: true,
        archivedAt: true,
        createdAt: true,
        biodata: {
          select: {
            id: true,
            isPublic: true,
            isReported: true,
          }
        }
      }
    }),
    prisma.biodata.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
          }
        },
        reports: {
          include: {
            reporter: {
              select: {
                email: true,
                username: true,
              }
            }
          }
        }
      }
    })
  ])

  return (
    <AdminDashboardClient
      initialStats={{
        totalUsers,
        totalBiodatas,
        publicBiodatas,
        privateBiodatas,
        guestSessionsCount
      }}
      users={users}
      biodatas={biodatas}
      guestAnalytics={{
        eventBreakdown,
        last7DaysSessions,
        conversionRate,
      }}
    />
  )
}

