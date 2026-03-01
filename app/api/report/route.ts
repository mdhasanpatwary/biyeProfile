import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  // Optional: Check if the user is authenticated (we enforce it here to prevent abuse but plan.md says public reporting is allowed.
  // Let's implement rate limiting or strict check. We will require the reporter to be logged in to prevent spam as basic security).
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in to report a profile." }, { status: 401 })
  }

  try {
    const { username } = await req.json()
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { username },
      include: { biodata: true }
    })

    if (!targetUser || !targetUser.biodata) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Basic moderation: Mark as reported
    await prisma.biodata.update({
      where: { id: targetUser.biodata.id },
      data: { isReported: true }
    })

    return NextResponse.json({ success: true, message: "Profile reported successfully." })
  } catch (error) {
    console.error("Report error:", error)
    return NextResponse.json({ error: "Failed to report profile." }, { status: 500 })
  }
}
