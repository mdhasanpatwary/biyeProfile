import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()

  // Only allow existing admins to promote others
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role required" }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { role }
    })

    return NextResponse.json({ success: true, user: updated })
  } catch {    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
}
