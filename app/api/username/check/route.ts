import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { usernameSchema } from "@/lib/validation/schemas"
import { RESERVED_USERNAMES } from "@/lib/constants"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  const result = usernameSchema.safeParse(username)
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
  }

  // Check reserved words
  if (RESERVED_USERNAMES.includes(result.data)) {
    return NextResponse.json({ available: false, error: "Username is reserved" })
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { username }
    });

    return NextResponse.json({ available: !existing })
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
