import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { BiodataEditor } from "@/components/BiodataEditor"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { migrateBiodataData } from "@/lib/utils/biodata-migration"

export const dynamic = "force-dynamic"

export default async function EditBiodataPage() {
  const session = await auth()
  if (!session?.user?.email) return redirect("/api/auth/signin")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { biodata: true }
  })

  if (!user || !user.biodata) {
    redirect("/dashboard")
  }

  const biodataData = user.biodata.data as unknown as Partial<BiodataFormValues>

  // Migrate old data structure to new structure
  const migratedData = migrateBiodataData(biodataData as unknown as Record<string, unknown>)

  return (
    <div className="py-12 md:py-16">
      <BiodataEditor
        initialData={migratedData}
        username={user.username!}
        initialIsPublic={user.biodata.isPublic}
      />
    </div>
  )
}
