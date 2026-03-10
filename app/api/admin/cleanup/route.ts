import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * DELETE /api/admin/cleanup
 * Deletes GuestActivity and GuestSession records older than 30 days.
 * Requires admin authentication.
 */
export async function DELETE() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Delete activities first (CASCADE usually handles this, but being explicit is safer)
    const activitiesDeleted = await prisma.guestActivity.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    })

    // Delete sessions where lastActive is older than 30 days
    const sessionsDeleted = await prisma.guestSession.deleteMany({
      where: {
        lastActive: {
          lt: thirtyDaysAgo,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Cleaned up records older than ${thirtyDaysAgo.toLocaleDateString()}`,
      count: {
        activities: activitiesDeleted.count,
        sessions: sessionsDeleted.count,
      },
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Cleanup error:", err)
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 })
  }
}
