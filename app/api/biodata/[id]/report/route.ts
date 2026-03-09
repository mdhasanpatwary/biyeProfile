import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = (await params).id

  if (!id) {
    return NextResponse.json({ error: "Missing biodata id" }, { status: 400 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { reason } = body

    // We transactionally create the report and mark the biodata as reported
    await prisma.$transaction([
      prisma.report.create({
        data: {
          reporterId: session.user.id,
          biodataId: id,
          reason: reason || "No reason provided",
        },
      }),
      prisma.biodata.update({
        where: { id },
        data: { isReported: true },
      }),
    ])

    return NextResponse.json({ success: true, message: "Biodata reported successfully" })
  } catch {
    return NextResponse.json({ error: "Report failed" }, { status: 500 })
  }
}
