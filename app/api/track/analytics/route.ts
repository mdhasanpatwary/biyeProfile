import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Total unique guest sessions
    const totalSessions = await prisma.guestSession.count()

    // All-time event breakdown
    const rawEvents = await prisma.guestActivity.groupBy({
      by: ["type"],
      _count: { type: true },
    })
    const eventBreakdown: Record<string, number> = {}
    for (const row of rawEvents) {
      eventBreakdown[row.type] = row._count.type
    }

    // New sessions created in each of the last 7 days
    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recentSessions = await prisma.guestSession.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    })

    // Bucket into date strings
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

    // Conversion rate  = converted sessions / total sessions
    const conversions = eventBreakdown["GUEST_CONVERTED"] ?? 0
    const conversionRate = totalSessions > 0
      ? `${((conversions / totalSessions) * 100).toFixed(1)}%`
      : "0.0%"

    return NextResponse.json({
      totalSessions,
      eventBreakdown,
      last7DaysSessions,
      conversionRate,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
