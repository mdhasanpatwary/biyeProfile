import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { adminPromoteSchema } from "@/lib/validation/schemas"
import { sanitizeDeep } from "@/lib/security/sanitize"

export async function POST(req: NextRequest) {
  const session = await auth()

  // Only allow existing admins to promote others
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const sanitizedBody = sanitizeDeep(body)
    const parsed = adminPromoteSchema.safeParse(sanitizedBody)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request payload" }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { email: parsed.data.email },
      data: { role: parsed.data.role }
    })

    return NextResponse.json({ success: true, user: updated })
  } catch {    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
}
