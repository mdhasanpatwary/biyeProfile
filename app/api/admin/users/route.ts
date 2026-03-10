import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { adminRoleSchema } from "@/lib/validation/schemas"
import { sanitizeDeep } from "@/lib/security/sanitize"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    where: { isArchived: false },
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
        },
      },
    },
  })

  return NextResponse.json(users)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const sanitized = sanitizeDeep(body) as { userId: string; role?: string; action?: string }
    const { userId, role, action } = sanitized

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // ── Archive / Unarchive ──────────────────────────────────────────────────
    if (action === "archive" || action === "unarchive") {
      if (userId === session.user.id) {
        return NextResponse.json({ error: "Cannot archive yourself" }, { status: 400 })
      }
      const isArchiving = action === "archive"
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          isArchived: isArchiving,
          archivedAt: isArchiving ? new Date() : null,
        },
      })
      return NextResponse.json(updated)
    }

    // ── Role update ──────────────────────────────────────────────────────────
    if (!role) {
      return NextResponse.json({ error: "Missing role" }, { status: 400 })
    }

    const parsedRole = adminRoleSchema.safeParse(role)
    if (!parsedRole.success) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: parsedRole.data },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("id")

  if (!userId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  // Prevent admin from deleting themselves
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
