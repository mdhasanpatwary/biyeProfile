import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * proxy.ts — Centralized route protection for BiyeProfile.
 *
 * Runs on the Node.js runtime (default in Next.js 16+), so Prisma/crypto work fine.
 *
 * Rules:
 *  - /admin/*         → admin users only (redirect non-admins to /)
 *  - /api/admin/*     → admin users only (return 401 for non-admins)
 *  - /dashboard/*     → authenticated users only (redirect to /auth/signin)
 */
export async function proxy(request: NextRequest) {
  const session = await auth()

  const isLoggedIn = !!session?.user
  const isAdmin = session?.user?.role === "admin"
  const path = request.nextUrl.pathname

  // ── Admin protection ──────────────────────────────────────────────────────
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (!isAdmin) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // ── Dashboard protection ──────────────────────────────────────────────────
  if (path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
