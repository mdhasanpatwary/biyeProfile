import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminDashboardClient } from "./components/AdminDashboardClient"

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  const [totalUsers, totalBiodatas, publicBiodatas, privateBiodatas] = await Promise.all([
    prisma.user.count(),
    prisma.biodata.count(),
    prisma.biodata.count({ where: { isPublic: true } }),
    prisma.biodata.count({ where: { isPublic: false } }),
  ])

  const [users, biodatas] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        biodata: {
          select: {
            id: true,
            isPublic: true,
            isReported: true,
          }
        }
      }
    }),
    prisma.biodata.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
          }
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
      }
    })
  ])

  return (
    <AdminDashboardClient
      initialStats={{
        totalUsers,
        totalBiodatas,
        publicBiodatas,
        privateBiodatas
      }}
      users={users}
      biodatas={biodatas}
    />
  )
}
