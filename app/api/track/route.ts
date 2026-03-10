import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { RateLimiter } from "@/lib/rateLimiter"

// 20 requests per minute
const limiter = new RateLimiter(20, 60 * 1000)

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(",")[0] : ((req as unknown as { ip?: string }).ip || "unknown")

    const limitCheck = limiter.check(ip)
    if (!limitCheck.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const { sessionId, type, path, metadata } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    const userAgent = req.headers.get("user-agent") || undefined
    // IP is already extracted above for rate limiting
    const ipHash = createHash("sha256").update(ip).digest("hex").substring(0, 16)

    // Update or create session
    await prisma.guestSession.upsert({
      where: { sessionId },
      update: {
        lastActive: new Date(),
        userAgent,
        ipHash,
      },
      create: {
        sessionId,
        userAgent,
        ipHash,
      },
    })

    // Log activity
    await prisma.guestActivity.create({
      data: {
        sessionId,
        type,
        path,
        metadata: metadata || {},
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.error("Tracking error detail:", {
      message: err.message,
      stack: err.stack,
      code: err.code
    })
    return NextResponse.json({
      error: "Internal Server Error",
      message: err.message,
      code: err.code
    }, { status: 500 })
  }
}
