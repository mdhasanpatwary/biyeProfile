import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { usernameSchema } from "@/lib/validations/username"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = usernameSchema.safeParse(body.username)

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
    }

    const username = result.data

    const reserved = ["admin", "dashboard", "api", "edit", "login", "setup", "settings", "biodata"];
    if (reserved.includes(username)) {
      return NextResponse.json({ error: "Username is reserved" }, { status: 400 })
    }

    // Ensure user hasn't already set a username
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (currentUser?.username) {
      return NextResponse.json({ error: "Username is already set and cannot be changed" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { username }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
    }
    console.error("Error setting username:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
