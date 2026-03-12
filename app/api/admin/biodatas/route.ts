import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanitizeDeep } from "@/lib/security/sanitize"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const biodatas = await prisma.biodata.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          username: true,
        },
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
    },
  })

  return NextResponse.json(biodatas)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { id, isPublic, isReported, data } = sanitizeDeep(body) as { 
      id: string, 
      isPublic?: boolean, 
      isReported?: boolean,
      data?: any
    }

    if (!id) {
      return NextResponse.json({ error: "Missing biodata id" }, { status: 400 })
    }

    // When an admin clears a report (isReported = false), we delete the associated report records
    if (isReported === false) {
      await prisma.$transaction([
        prisma.report.deleteMany({
          where: { biodataId: id }
        }),
        prisma.biodata.update({
          where: { id },
          data: { isReported: false }
        })
      ])
      return NextResponse.json({ success: true })
    }

    const updated = await prisma.biodata.update({
      where: { id },
      data: {
        ...(typeof isPublic === "boolean" ? { isPublic } : {}),
        ...(typeof isReported === "boolean" ? { isReported } : {}),
        ...(data ? { data } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  try {
    await prisma.biodata.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
