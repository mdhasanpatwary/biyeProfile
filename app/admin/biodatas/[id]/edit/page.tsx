import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { BiodataEditor } from "@/components/BiodataEditor"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { migrateBiodataData } from "@/lib/utils/biodata-migration"

export const dynamic = "force-dynamic"

export default async function AdminEditBiodataPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  const biodata = await prisma.biodata.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
        }
      }
    }
  })

  if (!biodata || !biodata.user) {
    notFound()
  }

  const biodataData = biodata.data as unknown as Record<string, unknown>
  const migratedData = migrateBiodataData(biodataData)

  return (
    <div className="py-16 px-6 lg:px-10 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground-muted mb-6">Management / Admin Edit</div>
        <h1 className="text-5xl font-serif text-foreground tracking-tight leading-none mb-4">
          Moderating @{biodata.user.username}
        </h1>
        <p className="text-foreground-muted font-mono text-[10px] uppercase tracking-widest">Manual correction mode enabled.</p>
      </header>

      <BiodataEditor
        initialData={migratedData}
        username={biodata.user.username!}
        initialIsPublic={biodata.isPublic}
        isAdminEdit={true}
        biodataId={biodata.id}
      />
    </div>
  )
}
